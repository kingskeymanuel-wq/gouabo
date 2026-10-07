package com.edufun.portal.notify;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Bilans de progression tous les deux mois (au lieu d'attendre la fin du trimestre) et résumé hebdomadaire aux parents.
 * Année scolaire découpée en bimestres : septembre-octobre, novembre-décembre, janvier-février, mars-avril, mai-juin
 * (juillet-août : vacances).
 */
@Service
public class ReportService {
    private static final Logger log = LoggerFactory.getLogger(ReportService.class);
    private static final String[] MONTHS = {"janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"};

    private final StudentRepository students;
    private final LessonProgressRepository progress;
    private final LessonRepository lessons;
    private final QuizAttemptRepository quizzes;
    private final ExamAttemptRepository exams;
    private final NotificationService notify;

    public ReportService(StudentRepository students, LessonProgressRepository progress, LessonRepository lessons,
                         QuizAttemptRepository quizzes, ExamAttemptRepository exams, NotificationService notify) {
        this.students = students; this.progress = progress; this.lessons = lessons; this.quizzes = quizzes; this.exams = exams; this.notify = notify;
    }

    public record Period(LocalDate start, LocalDate end, String label) {}

    /** Bimestre contenant une date. */
    public static Period periodOf(LocalDate d) {
        int m = d.getMonthValue();
        int startMonth = m % 2 == 1 ? m : m - 1; // jan, mars, mai, juil, sept, nov
        LocalDate start = LocalDate.of(d.getYear(), startMonth, 1);
        LocalDate end = start.plusMonths(2).minusDays(1);
        String label = startMonth == 7 ? "Vacances (juillet-août " + start.getYear() + ")"
                : cap(MONTHS[startMonth - 1]) + "-" + MONTHS[startMonth] + " " + start.getYear();
        return new Period(start, end, label);
    }

    /** Bimestres de l'année scolaire en cours, du plus récent au plus ancien, jusqu'à aujourd'hui. */
    public static List<Period> schoolYearPeriods(LocalDate today) {
        LocalDate yearStart = LocalDate.of(today.getMonthValue() >= 9 ? today.getYear() : today.getYear() - 1, 9, 1);
        List<Period> out = new ArrayList<>();
        for (LocalDate d = yearStart; !d.isAfter(today); d = d.plusMonths(2)) out.add(0, periodOf(d));
        return out;
    }

    /** Bilan d'un élève sur une période. */
    public Map<String, Object> report(Student s, LocalDate from, LocalDate to, String label) {
        LocalDateTime a = from.atStartOfDay(), b = to.plusDays(1).atStartOfDay();
        List<LessonProgress> done = progress.findByStudentId(s.getId()).stream()
                .filter(p -> p.isCompleted() && p.getUpdatedAt() != null && !p.getUpdatedAt().isBefore(a) && p.getUpdatedAt().isBefore(b)).toList();
        Map<Long, Lesson> byId = lessons.findAllById(done.stream().map(LessonProgress::getLessonId).toList()).stream()
                .collect(Collectors.toMap(Lesson::getId, Function.identity()));
        Map<String, List<LessonProgress>> bySubject = done.stream().filter(p -> byId.containsKey(p.getLessonId()))
                .collect(Collectors.groupingBy(p -> byId.get(p.getLessonId()).getSubject(), TreeMap::new, Collectors.toList()));
        List<Map<String, Object>> subjects = new ArrayList<>();
        bySubject.forEach((subject, list) -> subjects.add(Map.of("subject", subject, "lessons", list.size(),
                "average", (int) Math.round(list.stream().mapToInt(LessonProgress::getPercent).average().orElse(0)))));
        int avg = (int) Math.round(done.stream().mapToInt(LessonProgress::getPercent).average().orElse(0));

        List<QuizAttempt> qa = quizzes.findByStudentIdOrderByAttemptedAtDesc(s.getId()).stream()
                .filter(q -> q.getAttemptedAt() != null && !q.getAttemptedAt().isBefore(a) && q.getAttemptedAt().isBefore(b)).toList();
        List<ExamAttempt> ea = exams.findByStudentIdOrderByCreatedAtDesc(s.getId()).stream()
                .filter(e -> e.getCreatedAt() != null && !e.getCreatedAt().isBefore(a) && e.getCreatedAt().isBefore(b) && e.getTotal() > 0).toList();
        int prepAvg = (int) Math.round(ea.stream().mapToDouble(e -> e.getScore() * 100.0 / e.getTotal()).average().orElse(0));
        long activeDays = done.stream().map(p -> p.getUpdatedAt().toLocalDate()).distinct().count();

        List<String> strengths = subjects.stream().filter(x -> (int) x.get("average") >= 80)
                .sorted(Comparator.comparingInt((Map<String, Object> x) -> (int) x.get("average")).reversed()).limit(3).map(x -> (String) x.get("subject")).toList();
        List<String> toImprove = subjects.stream().filter(x -> (int) x.get("average") < 60)
                .sorted(Comparator.comparingInt(x -> (int) x.get("average"))).limit(3).map(x -> (String) x.get("subject")).toList();

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("label", label); m.put("start", from); m.put("end", to);
        m.put("lessonsCompleted", done.size()); m.put("average", avg); m.put("activeDays", activeDays);
        m.put("subjects", subjects);
        m.put("quizzes", Map.of("attempts", qa.size(), "passed", qa.stream().filter(QuizAttempt::isPassed).count()));
        m.put("prep", Map.of("attempts", ea.size(), "average", prepAvg));
        m.put("strengths", strengths); m.put("toImprove", toImprove);
        m.put("appreciation", appreciation(done.size(), avg));
        return m;
    }

    public List<Map<String, Object>> reports(Student s) {
        return schoolYearPeriods(LocalDate.now()).stream().map(p -> report(s, p.start(), p.end(), p.label())).toList();
    }

    static String appreciation(int lessons, int avg) {
        if (lessons == 0) return "Aucune leçon terminée sur la période : c'est le moment de reprendre un rythme régulier.";
        if (avg >= 85) return "Excellent travail : compréhension solide et régulière. Continue ainsi !";
        if (avg >= 70) return "Très bon travail. Quelques notions à consolider pour viser l'excellence.";
        if (avg >= 55) return "Travail correct. Revois les leçons où les évaluations ont été difficiles avant les devoirs.";
        return "Des difficultés à surmonter : refais les évaluations « Je vérifie » et demande de l'aide si besoin.";
    }

    /** Texte du bilan envoyé aux parents. */
    public String reportText(Student s, Map<String, Object> r) {
        StringBuilder t = new StringBuilder();
        t.append("Bonjour").append(s.getParentName() != null ? " " + s.getParentName() : "").append(",\n\n")
                .append("Voici le bilan de ").append(s.getName()).append(" (").append(s.getLevel()).append(") pour la période ").append(r.get("label")).append(".\n\n")
                .append("• Leçons terminées : ").append(r.get("lessonsCompleted")).append("\n")
                .append("• Réussite moyenne aux évaluations : ").append(r.get("average")).append(" %\n")
                .append("• Jours d'activité : ").append(r.get("activeDays")).append("\n");
        @SuppressWarnings("unchecked") List<Map<String, Object>> subjects = (List<Map<String, Object>>) r.get("subjects");
        if (!subjects.isEmpty()) {
            t.append("\nPar matière :\n");
            subjects.forEach(x -> t.append("   – ").append(x.get("subject")).append(" : ").append(x.get("lessons")).append(" leçon(s), ").append(x.get("average")).append(" %\n"));
        }
        @SuppressWarnings("unchecked") List<String> strengths = (List<String>) r.get("strengths");
        @SuppressWarnings("unchecked") List<String> toImprove = (List<String>) r.get("toImprove");
        if (!strengths.isEmpty()) t.append("\nPoints forts : ").append(String.join(", ", strengths)).append("\n");
        if (!toImprove.isEmpty()) t.append("À renforcer : ").append(String.join(", ", toImprove)).append("\n");
        t.append("\nAppréciation : ").append(r.get("appreciation"));
        return t.toString();
    }

    public Notification sendReport(Student s, Map<String, Object> r) {
        if (s.getParentEmail() == null || s.getParentEmail().isBlank()) throw new IllegalStateException("Aucun e-mail de parent n'est renseigné dans le profil.");
        return notify.email(s.getParentEmail(), "REPORT", "Bilan EduFun de " + s.getName() + " — " + r.get("label"), reportText(s, r), null);
    }

    /** Chaque dimanche à 18 h (heure d'Abidjan) : résumé de la semaine aux parents des élèves actifs. */
    @Scheduled(cron = "0 0 18 * * SUN", zone = "Africa/Abidjan")
    public void weeklyDigest() {
        LocalDate to = LocalDate.now(), from = to.minusDays(6);
        int sent = 0;
        for (Student s : students.findAll()) {
            if (!s.isParentNotifications() || s.getParentEmail() == null || s.getParentEmail().isBlank()) continue;
            Map<String, Object> r = report(s, from, to, "semaine du " + from.format(DateTimeFormatter.ofPattern("d/MM")) + " au " + to.format(DateTimeFormatter.ofPattern("d/MM")));
            notify.email(s.getParentEmail(), "PROGRESS", "Semaine EduFun de " + s.getName(), reportText(s, r), null);
            sent++;
        }
        log.info("Résumé hebdomadaire envoyé à {} parent(s)", sent);
    }

    /** Le 1er de novembre, janvier, mars, mai et juillet à 8 h : bilan du bimestre écoulé. */
    @Scheduled(cron = "0 0 8 1 1,3,5,7,11 *", zone = "Africa/Abidjan")
    public void bimonthlyReports() {
        Period p = periodOf(LocalDate.now().minusDays(1));
        for (Student s : students.findAll()) {
            if (!s.isParentNotifications() || s.getParentEmail() == null || s.getParentEmail().isBlank()) continue;
            sendReport(s, report(s, p.start(), p.end(), p.label()));
        }
    }

    private static String cap(String s) { return s.substring(0, 1).toUpperCase() + s.substring(1); }
}
