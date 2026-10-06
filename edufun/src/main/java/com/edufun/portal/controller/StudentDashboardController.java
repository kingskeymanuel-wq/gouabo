package com.edufun.portal.controller;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Données du tableau de bord personnel de l'élève connecté.
 * Toutes les valeurs sont calculées côté serveur à partir de la progression réelle.
 */
@RestController
@RequestMapping("/api")
public class StudentDashboardController {
    private final StudentRepository students;
    private final LessonRepository lessons;
    private final LessonProgressRepository progress;
    private final QuizRepository quizzes;
    private final QuizAttemptRepository quizAttempts;
    private final ExamAttemptRepository exams;
    private final BadgeRepository badges;
    private final StudentBadgeRepository studentBadges;
    private final UserAccountRepository accounts;

    public StudentDashboardController(StudentRepository students, LessonRepository lessons, LessonProgressRepository progress,
                                      QuizRepository quizzes, QuizAttemptRepository quizAttempts, ExamAttemptRepository exams,
                                      BadgeRepository badges, StudentBadgeRepository studentBadges, UserAccountRepository accounts) {
        this.students = students; this.lessons = lessons; this.progress = progress;
        this.quizzes = quizzes; this.quizAttempts = quizAttempts; this.exams = exams;
        this.badges = badges; this.studentBadges = studentBadges; this.accounts = accounts;
    }

    @GetMapping("/student-dashboard/{id}")
    public Map<String, Object> dashboard(@PathVariable Long id, Authentication auth) {
        assertStudentAccess(id, auth);
        Student student = students.findById(id).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
        String level = student.getLevel() == null ? "" : student.getLevel();

        List<LessonProgress> records = progress.findByStudentId(id);
        Map<Long, LessonProgress> doneByLesson = records.stream().filter(LessonProgress::isCompleted)
                .collect(Collectors.toMap(LessonProgress::getLessonId, Function.identity(), (a, b) -> a));
        List<Lesson> levelLessons = lessons.findByLevelOrderByOrderIndexAsc(level);
        long levelDone = levelLessons.stream().filter(l -> doneByLesson.containsKey(l.getId())).count();

        Map<String, Object> out = new LinkedHashMap<>();
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("id", student.getId()); s.put("name", student.getName()); s.put("level", level); s.put("xp", student.getXp());
        out.put("student", s);

        out.put("completedLessons", doneByLesson.size());
        out.put("lessonXp", records.stream().mapToInt(LessonProgress::getXpEarned).sum());
        out.put("levelProgress", Map.of("total", levelLessons.size(), "completed", levelDone,
                "percent", percent(levelDone, levelLessons.size())));
        out.put("subjects", subjects(levelLessons, doneByLesson));
        out.put("continueLesson", continueLesson(levelLessons, doneByLesson, records));

        List<QuizAttempt> attempts = quizAttempts.findByStudentIdOrderByAttemptedAtDesc(id);
        out.put("quiz", Map.of("attempts", attempts.size(), "passed", attempts.stream().filter(QuizAttempt::isPassed).count()));

        List<ExamAttempt> examList = exams.findByStudentIdOrderByCreatedAtDesc(id);
        out.put("exams", Map.of(
                "submitted", examList.size(),
                "pending", examList.stream().filter(e -> "PENDING_REVIEW".equals(e.getStatus())).count(),
                "passed", examList.stream().filter(e -> "PASSED".equals(e.getStatus())).count()));

        out.put("badges", badges(student));
        out.put("streak", streak(records, attempts));
        out.put("week", week(records));
        out.put("recentActivity", recentActivity(records, attempts, examList));
        return out;
    }

    private List<Map<String, Object>> subjects(List<Lesson> levelLessons, Map<Long, LessonProgress> done) {
        Map<String, List<Lesson>> bySubject = levelLessons.stream()
                .collect(Collectors.groupingBy(Lesson::getSubject, LinkedHashMap::new, Collectors.toList()));
        List<Map<String, Object>> out = new ArrayList<>();
        bySubject.forEach((subject, list) -> {
            long completed = list.stream().filter(l -> done.containsKey(l.getId())).count();
            Lesson next = list.stream().filter(l -> !done.containsKey(l.getId())).findFirst().orElse(null);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("subject", subject); row.put("total", list.size()); row.put("completed", completed);
            row.put("percent", percent(completed, list.size()));
            row.put("nextLessonId", next == null ? null : next.getId());
            row.put("nextLessonTitle", next == null ? null : next.getTitle());
            out.add(row);
        });
        return out;
    }

    /** Leçon à reprendre : la suivante dans la matière travaillée le plus récemment, sinon la première du niveau. */
    private Map<String, Object> continueLesson(List<Lesson> levelLessons, Map<Long, LessonProgress> done, List<LessonProgress> records) {
        Map<Long, Lesson> byId = levelLessons.stream().collect(Collectors.toMap(Lesson::getId, Function.identity()));
        String lastSubject = records.stream().filter(LessonProgress::isCompleted).filter(p -> byId.containsKey(p.getLessonId()))
                .max(Comparator.comparing(LessonProgress::getUpdatedAt, Comparator.nullsFirst(Comparator.naturalOrder())))
                .map(p -> byId.get(p.getLessonId()).getSubject()).orElse(null);
        Lesson next = levelLessons.stream()
                .filter(l -> !done.containsKey(l.getId()))
                .filter(l -> lastSubject == null || lastSubject.equals(l.getSubject()))
                .findFirst()
                .orElseGet(() -> levelLessons.stream().filter(l -> !done.containsKey(l.getId())).findFirst().orElse(null));
        if (next == null) return null;
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", next.getId()); out.put("title", next.getTitle()); out.put("subject", next.getSubject());
        out.put("chapter", next.getChapter()); out.put("duration", next.getDuration()); out.put("objective", next.getObjective());
        out.put("resumed", lastSubject != null);
        return out;
    }

    private Map<String, Object> badges(Student student) {
        Map<Long, StudentBadge> earned = studentBadges.findByStudentId(student.getId()).stream()
                .collect(Collectors.toMap(StudentBadge::getBadgeId, Function.identity(), (a, b) -> a));
        List<Badge> all = badges.findAll().stream()
                .sorted(Comparator.comparing(Badge::getXpRequired, Comparator.nullsFirst(Comparator.naturalOrder()))).toList();
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> next = null;
        for (Badge b : all) {
            int required = b.getXpRequired() == null ? 0 : b.getXpRequired();
            StudentBadge sb = earned.get(b.getId());
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", b.getName()); item.put("icon", b.getIcon()); item.put("description", b.getDescription());
            item.put("xpRequired", required); item.put("earned", sb != null);
            item.put("awardedAt", sb == null ? null : sb.getAwardedAt());
            items.add(item);
            if (sb == null && next == null) {
                next = new LinkedHashMap<>(item);
                next.put("remaining", Math.max(0, required - student.getXp()));
                next.put("percent", required == 0 ? 100 : Math.min(100, student.getXp() * 100 / required));
            }
        }
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("earned", earned.size()); out.put("total", all.size()); out.put("items", items); out.put("next", next);
        return out;
    }

    /** Nombre de jours consécutifs d'activité (leçon terminée ou quiz), jusqu'à aujourd'hui ou hier. */
    private int streak(List<LessonProgress> records, List<QuizAttempt> attempts) {
        Set<LocalDate> days = new HashSet<>();
        records.stream().filter(LessonProgress::isCompleted).map(LessonProgress::getUpdatedAt).filter(Objects::nonNull)
                .forEach(d -> days.add(d.toLocalDate()));
        attempts.stream().map(QuizAttempt::getAttemptedAt).filter(Objects::nonNull).forEach(d -> days.add(d.toLocalDate()));
        LocalDate day = LocalDate.now();
        if (!days.contains(day)) day = day.minusDays(1);
        int count = 0;
        while (days.contains(day)) { count++; day = day.minusDays(1); }
        return count;
    }

    /** Leçons terminées par jour sur les 7 derniers jours (le plus ancien en premier). */
    private List<Map<String, Object>> week(List<LessonProgress> records) {
        Map<LocalDate, Long> perDay = records.stream().filter(LessonProgress::isCompleted).map(LessonProgress::getUpdatedAt)
                .filter(Objects::nonNull).collect(Collectors.groupingBy(LocalDateTime::toLocalDate, Collectors.counting()));
        List<Map<String, Object>> out = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            out.add(Map.of("date", d.toString(), "lessons", perDay.getOrDefault(d, 0L)));
        }
        return out;
    }

    private List<Map<String, Object>> recentActivity(List<LessonProgress> records, List<QuizAttempt> attempts, List<ExamAttempt> examList) {
        List<Map<String, Object>> out = new ArrayList<>();
        List<LessonProgress> done = records.stream().filter(LessonProgress::isCompleted).filter(p -> p.getUpdatedAt() != null).toList();
        Map<Long, Lesson> titles = lessons.findAllById(done.stream().map(LessonProgress::getLessonId).toList()).stream()
                .collect(Collectors.toMap(Lesson::getId, Function.identity()));
        for (LessonProgress p : done) {
            Lesson l = titles.get(p.getLessonId());
            if (l == null) continue;
            out.add(activity("LESSON", l.getTitle(), l.getSubject() + " · +" + p.getXpEarned() + " XP", p.getUpdatedAt(), "/lecon/" + l.getId()));
        }
        Map<Long, Quiz> quizById = quizzes.findAllById(attempts.stream().map(QuizAttempt::getQuizId).filter(Objects::nonNull).distinct().toList())
                .stream().collect(Collectors.toMap(Quiz::getId, Function.identity()));
        for (QuizAttempt a : attempts) {
            Quiz q = quizById.get(a.getQuizId());
            out.add(activity("QUIZ", q == null ? "Quiz" : q.getTitle(),
                    "Score " + a.getScore() + "/" + a.getTotal() + (a.isPassed() ? " · réussi" : " · à retravailler"), a.getAttemptedAt(), "/quiz"));
        }
        for (ExamAttempt e : examList) {
            String status = switch (e.getStatus() == null ? "" : e.getStatus()) {
                case "PASSED" -> "réussi"; case "FAILED" -> "non validé"; case "PENDING_REVIEW" -> "en correction"; default -> "résultat publié";
            };
            out.add(activity("EXAM", e.getExamType() + " · " + e.getSubject(), e.getLevel() + " · " + status, e.getCreatedAt(), "/examens"));
        }
        out.sort(Comparator.comparing((Map<String, Object> m) -> (LocalDateTime) m.get("at"), Comparator.nullsLast(Comparator.reverseOrder())));
        return out.size() > 6 ? out.subList(0, 6) : out;
    }

    private Map<String, Object> activity(String type, String title, String detail, LocalDateTime at, String href) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("type", type); m.put("title", title); m.put("detail", detail); m.put("at", at); m.put("href", href);
        return m;
    }

    private static int percent(long part, long total) { return total == 0 ? 0 : (int) Math.round(part * 100.0 / total); }

    private void assertStudentAccess(Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new AccessDeniedException("Connexion requise");
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return;
        UserAccount account = accounts.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new AccessDeniedException("Compte introuvable"));
        if (!"STUDENT".equals(account.getRole()) || !id.equals(account.getStudentId())) throw new AccessDeniedException("Accès à cet espace refusé");
    }
}
