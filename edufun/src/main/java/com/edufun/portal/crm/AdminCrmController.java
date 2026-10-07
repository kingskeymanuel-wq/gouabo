package com.edufun.portal.crm;

import com.edufun.portal.billing.BillingService;
import com.edufun.portal.model.*;
import com.edufun.portal.notify.NotificationService;
import com.edufun.portal.notify.ReportService;
import com.edufun.portal.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/** CRM de l'administration : clients (élèves, parents, répétiteurs), paiements, activations, engagement, notifications et notes. */
@RestController
@RequestMapping("/api/admin/crm")
public class AdminCrmController {
    private final StudentRepository students;
    private final UserAccountRepository accounts;
    private final TutorRepository tutors;
    private final PaymentRepository payments;
    private final ProfileVisitRepository visits;
    private final MessageRepository messages;
    private final NotificationRepository notifications;
    private final CrmNoteRepository notes;
    private final LessonProgressRepository progress;
    private final LessonRepository lessons;
    private final BillingService billing;
    private final NotificationService notify;
    private final ReportService reports;

    public AdminCrmController(StudentRepository students, UserAccountRepository accounts, TutorRepository tutors, PaymentRepository payments,
                              ProfileVisitRepository visits, MessageRepository messages, NotificationRepository notifications, CrmNoteRepository notes,
                              LessonProgressRepository progress, LessonRepository lessons, BillingService billing, NotificationService notify, ReportService reports) {
        this.students = students; this.accounts = accounts; this.tutors = tutors; this.payments = payments; this.visits = visits; this.messages = messages;
        this.notifications = notifications; this.notes = notes; this.progress = progress; this.lessons = lessons; this.billing = billing;
        this.notify = notify; this.reports = reports;
    }

    // =================================================================== Vue d'ensemble

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        List<Payment> all = payments.findAllByOrderByCreatedAtDesc();
        List<Payment> ok = all.stream().filter(p -> "VALIDATED".equals(p.getStatus())).toList();
        List<Student> st = students.findAll();
        List<Tutor> tu = tutors.findAll();
        List<UserAccount> acc = accounts.findAll();
        YearMonth now = YearMonth.now();
        LocalDateTime d30 = LocalDateTime.now().minusDays(30);

        Map<String, Long> studentStatus = st.stream().collect(Collectors.groupingBy(billing::status, Collectors.counting()));
        long paidStudents = st.stream().filter(s -> s.getPaidUntil() != null).count();
        // Revenu mensuel récurrent estimé : tarif mensuel des élèves actuellement abonnés + visibilités répétiteurs ramenées au mois.
        int mrr = st.stream().filter(s -> "ACTIVE".equals(billing.status(s))).mapToInt(s -> billing.monthlyPrice(s.getLevel())).sum()
                + (int) Math.round(tu.stream().filter(Tutor::isListed).count() * billing.tutorPrice() / 3.0);

        List<Map<String, Object>> months = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", ym.toString());
            m.put("students", sum(ok, ym, "STUDENT")); m.put("tutors", sum(ok, ym, "TUTOR"));
            m.put("signups", st.stream().filter(s -> s.getCreatedAt() != null && YearMonth.from(s.getCreatedAt()).equals(ym)).count());
            months.add(m);
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("revenue", Map.of(
                "month", ok.stream().filter(p -> p.getProcessedAt() != null && YearMonth.from(p.getProcessedAt()).equals(now)).mapToInt(Payment::getAmount).sum(),
                "total", ok.stream().mapToInt(Payment::getAmount).sum(),
                "students", ok.stream().filter(p -> "STUDENT".equals(p.getKind())).mapToInt(Payment::getAmount).sum(),
                "tutors", ok.stream().filter(p -> "TUTOR".equals(p.getKind())).mapToInt(Payment::getAmount).sum(),
                "mrr", mrr));
        out.put("students", Map.of("total", st.size(), "active", studentStatus.getOrDefault("ACTIVE", 0L), "pending", studentStatus.getOrDefault("PENDING", 0L),
                "trial", studentStatus.getOrDefault("TRIAL", 0L), "new", studentStatus.getOrDefault("NEW", 0L), "expired", studentStatus.getOrDefault("EXPIRED", 0L),
                "conversion", st.isEmpty() ? 0 : Math.round(paidStudents * 100.0 / st.size()),
                "new30", st.stream().filter(s -> s.getCreatedAt() != null && s.getCreatedAt().isAfter(d30)).count()));
        out.put("tutors", Map.of("total", tu.size(), "listed", tu.stream().filter(Tutor::isListed).count(),
                "pending", tu.stream().filter(t -> "PENDING".equals(t.getStatus())).count(),
                "unpaid", tu.stream().filter(t -> !t.isListed() && !"REJECTED".equals(t.getStatus()) && !"SUSPENDED".equals(t.getStatus())).count()));
        out.put("parents", acc.stream().filter(a -> "PARENT".equals(a.getRole())).count());
        out.put("pendingPayments", all.stream().filter(p -> "PENDING".equals(p.getStatus())).count());
        out.put("expiringSoon", st.stream().filter(s -> "ACTIVE".equals(billing.status(s)) && !s.getPaidUntil().isAfter(LocalDate.now().plusDays(7))).count()
                + tu.stream().filter(t -> t.isListed() && !t.getListedUntil().isAfter(LocalDate.now().plusDays(7))).count());
        out.put("engagement", Map.of("visits30", visits.findAll().stream().filter(v -> v.getVisitedAt().isAfter(d30)).count(),
                "messages30", messages.findAll().stream().filter(m -> m.getCreatedAt().isAfter(d30)).count()));
        out.put("byMonth", months);
        out.put("activity", activity(all, st, tu, acc));
        out.put("plans", billing.plans());
        out.put("tutorPrice", billing.tutorPrice());
        out.put("mailConfigured", notify.mailConfigured());
        return out;
    }

    private static int sum(List<Payment> ok, YearMonth ym, String kind) {
        return ok.stream().filter(p -> kind.equals(p.getKind()) && p.getProcessedAt() != null && YearMonth.from(p.getProcessedAt()).equals(ym)).mapToInt(Payment::getAmount).sum();
    }

    /** Fil d'activité récent : inscriptions, paiements, nouveaux répétiteurs. */
    private List<Map<String, Object>> activity(List<Payment> all, List<Student> st, List<Tutor> tu, List<UserAccount> acc) {
        Map<Long, Student> sById = st.stream().collect(Collectors.toMap(Student::getId, Function.identity()));
        Map<Long, Tutor> tById = tu.stream().collect(Collectors.toMap(Tutor::getId, Function.identity()));
        List<Map<String, Object>> ev = new ArrayList<>();
        all.stream().limit(30).forEach(p -> ev.add(event(p.getCreatedAt(), "PAYMENT",
                payerName(p, sById, tById) + " a déclaré " + fmt(p.getAmount()) + " F (" + ("TUTOR".equals(p.getKind()) ? "visibilité répétiteur" : p.getMonths() + " mois") + ")",
                p.getStatus())));
        st.stream().filter(s -> s.getCreatedAt() != null).forEach(s -> ev.add(event(s.getCreatedAt(), "SIGNUP", s.getName() + " s'est inscrit(e) en " + s.getLevel(), "STUDENT")));
        tu.stream().filter(t -> t.getCreatedAt() != null).forEach(t -> ev.add(event(t.getCreatedAt(), "TUTOR", t.getName() + " a créé son espace répétiteur (" + t.getCity() + ")", t.getStatus())));
        acc.stream().filter(a -> "PARENT".equals(a.getRole()) && a.getCreatedAt() != null).forEach(a -> ev.add(event(a.getCreatedAt(), "PARENT", a.getFullName() + " a créé un compte parent", "PARENT")));
        ev.sort(Comparator.comparing((Map<String, Object> e) -> (LocalDateTime) e.get("at")).reversed());
        return ev.stream().limit(25).toList();
    }

    private static Map<String, Object> event(LocalDateTime at, String type, String text, String tag) {
        return Map.of("at", at, "type", type, "text", text, "tag", tag == null ? "" : tag);
    }

    // =================================================================== Élèves

    @GetMapping("/students")
    public List<Map<String, Object>> studentList() {
        Map<Long, List<Payment>> pay = payments.findAll().stream().filter(p -> p.getStudentId() != null).collect(Collectors.groupingBy(Payment::getStudentId));
        Map<Long, List<LessonProgress>> prog = progress.findAll().stream().filter(LessonProgress::isCompleted).collect(Collectors.groupingBy(LessonProgress::getStudentId));
        Map<Long, UserAccount> accByStudent = accounts.findAll().stream().filter(a -> a.getStudentId() != null).collect(Collectors.toMap(UserAccount::getStudentId, Function.identity(), (a, b) -> a));
        return students.findAll().stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>(billing.summary(s));
            List<LessonProgress> done = prog.getOrDefault(s.getId(), List.of());
            UserAccount a = accByStudent.get(s.getId());
            m.put("id", s.getId()); m.put("name", s.getName()); m.put("email", s.getEmail()); m.put("phone", s.getPhone());
            m.put("parentName", s.getParentName()); m.put("parentEmail", s.getParentEmail()); m.put("parentPhone", s.getParentPhone());
            m.put("xp", s.getXp()); m.put("lessons", done.size());
            m.put("average", (int) Math.round(done.stream().mapToInt(LessonProgress::getPercent).average().orElse(0)));
            m.put("paidTotal", pay.getOrDefault(s.getId(), List.of()).stream().filter(p -> "VALIDATED".equals(p.getStatus())).mapToInt(Payment::getAmount).sum());
            m.put("createdAt", s.getCreatedAt());
            m.put("lastActivity", done.stream().map(LessonProgress::getUpdatedAt).filter(Objects::nonNull).max(Comparator.naturalOrder()).orElse(a == null ? null : a.getLastLoginAt()));
            return m;
        }).sorted(Comparator.comparing((Map<String, Object> m) -> String.valueOf(m.get("name")))).toList();
    }

    @GetMapping("/students/{id}")
    public Map<String, Object> studentDetail(@PathVariable Long id) {
        Student s = students.findById(id).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("student", s);
        m.put("subscription", billing.summary(s));
        m.put("account", accounts.findAll().stream().filter(a -> id.equals(a.getStudentId())).findFirst().map(a -> Map.of("email", a.getEmail(),
                "createdAt", String.valueOf(a.getCreatedAt()), "lastLoginAt", String.valueOf(a.getLastLoginAt()))).orElse(Map.of()));
        m.put("payments", payments.findByStudentIdOrderByCreatedAtDesc(id));
        m.put("report", reports.reports(s).stream().findFirst().orElse(Map.of()));
        m.put("notes", notes.findByTargetTypeAndTargetIdOrderByCreatedAtDesc("STUDENT", id));
        return m;
    }

    @PostMapping("/students/{id}/report")
    public Map<String, Object> sendReport(@PathVariable Long id) {
        Student s = students.findById(id).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
        Notification n = reports.sendReport(s, reports.reports(s).get(0));
        return Map.of("sentTo", n.getEmailTo(), "emailStatus", n.getEmailStatus());
    }

    // =================================================================== Parents

    @GetMapping("/parents")
    public List<Map<String, Object>> parents() {
        List<ProfileVisit> allVisits = visits.findAll();
        List<Message> allMessages = messages.findAll();
        List<Map<String, Object>> out = new ArrayList<>();
        // Comptes parents de l'annuaire…
        accounts.findAll().stream().filter(a -> "PARENT".equals(a.getRole())).forEach(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("type", "ACCOUNT"); m.put("accountId", a.getId()); m.put("name", a.getFullName()); m.put("email", a.getEmail()); m.put("phone", a.getPhone());
            m.put("city", a.getCity()); m.put("district", a.getDistrict()); m.put("createdAt", a.getCreatedAt()); m.put("lastLoginAt", a.getLastLoginAt());
            m.put("visits", allVisits.stream().filter(v -> a.getId().equals(v.getVisitorAccountId())).count());
            m.put("messages", allMessages.stream().filter(x -> a.getId().equals(x.getFromAccountId()) || a.getId().equals(x.getToAccountId())).count());
            m.put("children", List.of());
            out.add(m);
        });
        // … et parents renseignés par les élèves à l'inscription.
        Map<String, List<Student>> byEmail = students.findAll().stream().filter(s -> s.getParentEmail() != null && !s.getParentEmail().isBlank())
                .collect(Collectors.groupingBy(s -> s.getParentEmail().toLowerCase()));
        byEmail.forEach((email, kids) -> {
            Map<String, Object> existing = out.stream().filter(x -> email.equalsIgnoreCase(String.valueOf(x.get("email")))).findFirst().orElse(null);
            List<Map<String, Object>> children = kids.stream().map(k -> Map.<String, Object>of("id", k.getId(), "name", k.getName(), "level", k.getLevel(), "status", billing.status(k))).toList();
            if (existing != null) { existing.put("children", children); return; }
            Student first = kids.get(0);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("type", "CONTACT"); m.put("accountId", null); m.put("name", first.getParentName() == null ? "Parent de " + first.getName() : first.getParentName());
            m.put("email", email); m.put("phone", first.getParentPhone()); m.put("city", null); m.put("district", null);
            m.put("createdAt", first.getCreatedAt()); m.put("lastLoginAt", null); m.put("visits", 0L); m.put("messages", 0L); m.put("children", children);
            out.add(m);
        });
        out.sort(Comparator.comparing((Map<String, Object> m) -> String.valueOf(m.get("name"))));
        return out;
    }

    // =================================================================== Répétiteurs

    @GetMapping("/tutors")
    public List<Map<String, Object>> tutorList() {
        LocalDateTime d30 = LocalDateTime.now().minusDays(30);
        List<ProfileVisit> allVisits = visits.findAll();
        List<Payment> all = payments.findAll();
        List<Message> allMessages = messages.findAll();
        return tutors.findAll().stream().map(t -> {
            Map<String, Object> m = new LinkedHashMap<>(billing.tutorSummary(t));
            m.put("id", t.getId()); m.put("accountId", t.getAccountId()); m.put("name", t.getName()); m.put("email", t.getEmail()); m.put("phone", t.getPhone());
            m.put("city", t.getCity()); m.put("district", t.getDistrict()); m.put("specialties", t.getSpecialties()); m.put("levels", t.getLevels());
            m.put("educationLevel", t.getEducationLevel()); m.put("experienceYears", t.getExperienceYears()); m.put("views", t.getViews());
            m.put("views30", allVisits.stream().filter(v -> t.getId().equals(v.getTutorId()) && v.getVisitedAt().isAfter(d30)).count());
            m.put("messages", allMessages.stream().filter(x -> t.getAccountId() != null && (t.getAccountId().equals(x.getFromAccountId()) || t.getAccountId().equals(x.getToAccountId()))).count());
            m.put("paidTotal", all.stream().filter(p -> t.getId().equals(p.getTutorId()) && "VALIDATED".equals(p.getStatus())).mapToInt(Payment::getAmount).sum());
            m.put("createdAt", t.getCreatedAt());
            return m;
        }).sorted(Comparator.comparing((Map<String, Object> m) -> String.valueOf(m.get("name")))).toList();
    }

    @GetMapping("/tutors/{id}")
    public Map<String, Object> tutorDetail(@PathVariable Long id) {
        Tutor t = tutors.findById(id).orElseThrow(() -> new NoSuchElementException("Répétiteur introuvable"));
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("tutor", t);
        m.put("listing", billing.tutorSummary(t));
        m.put("payments", payments.findAllByOrderByCreatedAtDesc().stream().filter(p -> id.equals(p.getTutorId())).toList());
        m.put("visits", visits.findByTutorIdOrderByVisitedAtDesc(id).stream().limit(50).map(v -> {
            UserAccount a = accounts.findById(v.getVisitorAccountId()).orElse(null);
            return Map.of("at", v.getVisitedAt(), "name", a == null ? "—" : a.getFullName() != null ? a.getFullName() : a.getEmail(), "role", a == null ? "" : a.getRole());
        }).toList());
        m.put("notes", notes.findByTargetTypeAndTargetIdOrderByCreatedAtDesc("TUTOR", id));
        return m;
    }

    public record StatusForm(String status) {}

    @PostMapping("/tutors/{id}/status")
    public Tutor tutorStatus(@PathVariable Long id, @RequestBody StatusForm f) {
        if (!Set.of("PENDING", "APPROVED", "REJECTED", "SUSPENDED").contains(f.status())) throw new IllegalArgumentException("Statut inconnu");
        Tutor t = tutors.findById(id).orElseThrow(() -> new NoSuchElementException("Répétiteur introuvable"));
        t.setStatus(f.status());
        tutors.save(t);
        String msg = switch (f.status()) {
            case "APPROVED" -> "Ton profil a été validé par l'équipe EduFun.";
            case "SUSPENDED" -> "Ton profil a été suspendu de l'annuaire. Contacte EduFun pour plus d'informations.";
            case "REJECTED" -> "Ton profil n'a pas été retenu. Contacte EduFun pour plus d'informations.";
            default -> "Ton profil est en cours de vérification.";
        };
        notify.notify(t.getAccountId(), "ACCOUNT", "Statut de ton profil répétiteur", msg, "/repetiteur/espace", t.getEmail());
        return t;
    }

    // =================================================================== Paiements et activations

    @GetMapping("/payments")
    public List<Map<String, Object>> paymentList() {
        Map<Long, Student> sById = students.findAll().stream().collect(Collectors.toMap(Student::getId, Function.identity()));
        Map<Long, Tutor> tById = tutors.findAll().stream().collect(Collectors.toMap(Tutor::getId, Function.identity()));
        return payments.findAllByOrderByCreatedAtDesc().stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("kind", p.getKind()); m.put("payer", payerName(p, sById, tById));
            m.put("payerId", "TUTOR".equals(p.getKind()) ? p.getTutorId() : p.getStudentId());
            m.put("detail", "TUTOR".equals(p.getKind()) ? "Visibilité répétiteur · 3 mois" : p.getLevel() + " · " + p.getMonths() + " mois" + (p.getBonusMonths() > 0 ? " + " + p.getBonusMonths() + " offert" : ""));
            m.put("amount", p.getAmount()); m.put("method", BillingService.METHODS.getOrDefault(p.getMethod(), p.getMethod())); m.put("phone", p.getPhone());
            m.put("reference", p.getReference()); m.put("status", p.getStatus()); m.put("createdAt", p.getCreatedAt()); m.put("processedAt", p.getProcessedAt());
            m.put("processedBy", p.getProcessedBy()); m.put("periodEnd", p.getPeriodEnd()); m.put("note", p.getNote());
            return m;
        }).toList();
    }

    @GetMapping("/activations")
    public Map<String, Object> activations() {
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> upcoming = new ArrayList<>(), expired = new ArrayList<>();
        for (Student s : students.findAll()) {
            LocalDate end = billing.accessUntil(s);
            String st = billing.status(s);
            if (end != null && !end.isAfter(today.plusDays(14))) upcoming.add(row("STUDENT", s.getId(), s.getName(), s.getLevel(), end, st, s.getParentPhone() != null ? s.getParentPhone() : s.getPhone()));
            LocalDate last = s.getPaidUntil() != null ? s.getPaidUntil() : s.getTrialUntil();
            if ("EXPIRED".equals(st) && last != null && last.isAfter(today.minusDays(60))) expired.add(row("STUDENT", s.getId(), s.getName(), s.getLevel(), last, st, s.getParentPhone() != null ? s.getParentPhone() : s.getPhone()));
        }
        for (Tutor t : tutors.findAll()) {
            if (t.isListed() && !t.getListedUntil().isAfter(today.plusDays(14))) upcoming.add(row("TUTOR", t.getId(), t.getName(), "Répétiteur", t.getListedUntil(), "LISTED", t.getPhone()));
            if (t.getListedUntil() != null && t.getListedUntil().isBefore(today) && t.getListedUntil().isAfter(today.minusDays(60)))
                expired.add(row("TUTOR", t.getId(), t.getName(), "Répétiteur", t.getListedUntil(), "EXPIRED", t.getPhone()));
        }
        upcoming.sort(Comparator.comparing(m -> (LocalDate) m.get("date")));
        expired.sort(Comparator.comparing((Map<String, Object> m) -> (LocalDate) m.get("date")).reversed());
        List<Map<String, Object>> recent = paymentList().stream().filter(p -> "VALIDATED".equals(p.get("status"))).limit(30).toList();
        return Map.of("upcoming", upcoming, "expired", expired, "recent", recent);
    }

    private static Map<String, Object> row(String kind, Long id, String name, String detail, LocalDate date, String status, String phone) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("kind", kind); m.put("id", id); m.put("name", name); m.put("detail", detail); m.put("date", date); m.put("status", status); m.put("phone", phone);
        return m;
    }

    // =================================================================== Engagement, notifications, notes

    @GetMapping("/engagement")
    public Map<String, Object> engagement() {
        LocalDateTime d30 = LocalDateTime.now().minusDays(30);
        Map<Long, Tutor> tById = tutors.findAll().stream().collect(Collectors.toMap(Tutor::getId, Function.identity()));
        Map<Long, Long> views = visits.findAll().stream().filter(v -> v.getVisitedAt().isAfter(d30)).collect(Collectors.groupingBy(ProfileVisit::getTutorId, Collectors.counting()));
        List<Map<String, Object>> top = views.entrySet().stream().sorted(Map.Entry.<Long, Long>comparingByValue().reversed()).limit(10)
                .map(e -> Map.<String, Object>of("tutorId", e.getKey(), "name", tById.containsKey(e.getKey()) ? tById.get(e.getKey()).getName() : "—", "views", e.getValue())).toList();
        Map<String, Long> byDistrict = tutors.findAll().stream().filter(Tutor::isListed)
                .collect(Collectors.groupingBy(t -> t.getDistrict() != null ? t.getDistrict() + " (" + t.getCity() + ")" : String.valueOf(t.getCity()), TreeMap::new, Collectors.counting()));
        return Map.of("topTutors", top, "listedByPlace", byDistrict,
                "messages30", messages.findAll().stream().filter(m -> m.getCreatedAt().isAfter(d30)).count(),
                "visits30", views.values().stream().mapToLong(Long::longValue).sum());
    }

    @GetMapping("/notifications")
    public Map<String, Object> notificationLog() {
        return Map.of("mailConfigured", notify.mailConfigured(), "items", notifications.findTop200ByOrderByCreatedAtDesc().stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("at", n.getCreatedAt()); m.put("kind", n.getKind()); m.put("title", n.getTitle()); m.put("emailTo", n.getEmailTo());
            m.put("emailStatus", n.getEmailStatus());
            m.put("to", n.getAccountId() == null ? n.getEmailTo() : accounts.findById(n.getAccountId()).map(UserAccount::getEmail).orElse("—"));
            return m;
        }).toList());
    }

    @GetMapping("/notes")
    public List<CrmNote> notesFor(@RequestParam String type, @RequestParam Long id) { return notes.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(type, id); }

    public record NoteForm(String type, Long id, String body) {}

    @PostMapping("/notes")
    @ResponseStatus(HttpStatus.CREATED)
    public CrmNote addNote(@RequestBody NoteForm f, Authentication auth) {
        if (f.body() == null || f.body().isBlank()) throw new IllegalArgumentException("La note est vide.");
        if (!Set.of("STUDENT", "PARENT", "TUTOR").contains(f.type())) throw new IllegalArgumentException("Type de client inconnu");
        CrmNote n = new CrmNote(); n.setTargetType(f.type()); n.setTargetId(f.id()); n.setBody(f.body().trim()); n.setAuthor(auth.getName());
        return notes.save(n);
    }

    // =================================================================== Outils

    private static String payerName(Payment p, Map<Long, Student> sById, Map<Long, Tutor> tById) {
        if ("TUTOR".equals(p.getKind())) { Tutor t = tById.get(p.getTutorId()); return t == null ? "Répétiteur" : t.getName(); }
        Student s = sById.get(p.getStudentId()); return s == null ? "Élève" : s.getName();
    }

    private static String fmt(int n) { return String.format(Locale.FRANCE, "%,d", n).replace(' ', ' ').replace(' ', ' '); }
}
