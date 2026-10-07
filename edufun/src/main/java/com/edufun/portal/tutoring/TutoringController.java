package com.edufun.portal.tutoring;

import com.edufun.portal.billing.BillingService;
import com.edufun.portal.model.*;
import com.edufun.portal.notify.NotificationService;
import com.edufun.portal.repository.*;
import com.edufun.portal.security.AccountSessions;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/** Annuaire des répétiteurs (parents), espace répétiteur et comptes parents. */
@RestController
@RequestMapping("/api")
public class TutoringController {
    private final TutorRepository tutors;
    private final UserAccountRepository accounts;
    private final StudentRepository students;
    private final ProfileVisitRepository visits;
    private final MessageRepository messages;
    private final PaymentRepository payments;
    private final BillingService billing;
    private final NotificationService notify;
    private final AccountSessions sessions;
    private final PasswordEncoder encoder;

    public TutoringController(TutorRepository tutors, UserAccountRepository accounts, StudentRepository students, ProfileVisitRepository visits,
                              MessageRepository messages, PaymentRepository payments, BillingService billing, NotificationService notify,
                              AccountSessions sessions, PasswordEncoder encoder) {
        this.tutors = tutors; this.accounts = accounts; this.students = students; this.visits = visits; this.messages = messages;
        this.payments = payments; this.billing = billing; this.notify = notify; this.sessions = sessions; this.encoder = encoder;
    }

    // =================================================================== Lieux

    @GetMapping("/places")
    public Map<String, Object> places() {
        return Map.of("cities", Places.CITIES, "abidjanCommunes", Places.ABIDJAN_COMMUNES, "abidjan", Places.ABIDJAN);
    }

    // =================================================================== Inscriptions

    public record TutorForm(String name, String email, String password, String phone, String whatsapp, String city, String district,
                            String specialties, String levels, String educationLevel, Integer experienceYears, String bio,
                            Integer hourlyRate, String teachingMode) {}

    @PostMapping("/tutor/register")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registerTutor(@RequestBody TutorForm f, HttpServletRequest req, HttpServletResponse res) {
        String email = required(f.email(), "Ton e-mail est requis.").toLowerCase();
        if (!email.contains("@")) throw new IllegalArgumentException("Ton e-mail n'est pas valide.");
        if (f.password() == null || f.password().length() < 8) throw new IllegalArgumentException("Choisis un mot de passe d'au moins 8 caractères.");
        if (accounts.existsByEmailIgnoreCase(email)) throw new IllegalStateException("Un compte existe déjà avec cet e-mail. Connecte-toi.");
        Tutor t = new Tutor();
        apply(t, f, true);
        t.setEmail(email); t.setStatus("PENDING");
        t = tutors.save(t);
        UserAccount a = new UserAccount();
        a.setEmail(email); a.setPasswordHash(encoder.encode(f.password())); a.setRole("TUTOR"); a.setEnabled(true);
        a.setFullName(t.getName()); a.setPhone(t.getPhone()); a.setCity(t.getCity()); a.setDistrict(t.getDistrict()); a.setTutorId(t.getId());
        a = accounts.save(a);
        t.setAccountId(a.getId());
        tutors.save(t);
        notify.notify(a.getId(), "ACCOUNT", "Bienvenue sur EduFun Répétiteurs 👋",
                "Ton espace est prêt. Complète ton profil puis active ta visibilité (" + billing.tutorPrice() + " F CFA par trimestre) pour apparaître dans l'annuaire des parents.",
                "/repetiteur/espace", email);
        sessions.login(email, f.password(), req, res);
        return Map.of("tutorId", t.getId(), "redirect", "/repetiteur/espace");
    }

    public record ParentForm(String fullName, String email, String password, String phone, String city, String district) {}

    @PostMapping("/parent/register")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registerParent(@RequestBody ParentForm f, HttpServletRequest req, HttpServletResponse res) {
        String name = required(f.fullName(), "Votre nom est requis.");
        String email = required(f.email(), "Votre e-mail est requis.").toLowerCase();
        if (!email.contains("@")) throw new IllegalArgumentException("Votre e-mail n'est pas valide.");
        if (f.password() == null || f.password().length() < 8) throw new IllegalArgumentException("Choisissez un mot de passe d'au moins 8 caractères.");
        if (accounts.existsByEmailIgnoreCase(email)) throw new IllegalStateException("Un compte existe déjà avec cet e-mail. Connectez-vous.");
        UserAccount a = new UserAccount();
        a.setEmail(email); a.setPasswordHash(encoder.encode(f.password())); a.setRole("PARENT"); a.setEnabled(true);
        a.setFullName(name); a.setPhone(trim(f.phone())); a.setCity(trim(f.city())); a.setDistrict(trim(f.district()));
        accounts.save(a);
        sessions.login(email, f.password(), req, res);
        return Map.of("redirect", "/repetiteurs");
    }

    // =================================================================== Annuaire (parents)

    @GetMapping("/tutors/search")
    public List<Map<String, Object>> search(@RequestParam(required = false) String city, @RequestParam(required = false) String district,
                                            @RequestParam(required = false) String subject, @RequestParam(required = false) String level,
                                            @RequestParam(required = false) String q) {
        return tutors.findAll().stream().filter(Tutor::isListed)
                .filter(t -> blank(city) || norm(t.getCity()).equals(norm(city)))
                .filter(t -> blank(district) || norm(t.getDistrict()).contains(norm(district)))
                .filter(t -> blank(subject) || norm(t.getSpecialties()).contains(norm(subject)))
                .filter(t -> blank(level) || norm(t.getLevels()).contains(norm(level)))
                .filter(t -> blank(q) || norm(t.getName() + " " + t.getSpecialties() + " " + t.getBio() + " " + t.getEducationLevel()).contains(norm(q)))
                // Mis en avant : les profils dont la visibilité a été payée le plus récemment passent en premier.
                .sorted(Comparator.comparing((Tutor t) -> t.getBoostedAt() == null ? LocalDateTime.MIN : t.getBoostedAt()).reversed())
                .map(this::card).toList();
    }

    private Map<String, Object> card(Tutor t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId()); m.put("name", t.getName()); m.put("city", t.getCity()); m.put("district", t.getDistrict());
        m.put("specialties", t.getSpecialties()); m.put("levels", t.getLevels()); m.put("educationLevel", t.getEducationLevel());
        m.put("experienceYears", t.getExperienceYears()); m.put("hourlyRate", t.getHourlyRate()); m.put("teachingMode", t.getTeachingMode());
        m.put("bio", t.getBio() == null ? "" : t.getBio().length() > 180 ? t.getBio().substring(0, 177) + "…" : t.getBio());
        m.put("boosted", t.getBoostedAt() != null && t.getBoostedAt().isAfter(LocalDateTime.now().minusDays(14)));
        return m;
    }

    /** Fiche complète avec coordonnées, réservée aux parents et élèves connectés ; la visite est signalée au répétiteur. */
    @GetMapping("/tutors/{id}/profile")
    @Transactional
    public Map<String, Object> profile(@PathVariable Long id, Authentication auth) {
        UserAccount viewer = sessions.require(auth, "PARENT", "STUDENT", "ADMIN", "TUTOR");
        Tutor t = tutors.findById(id).orElseThrow(() -> new NoSuchElementException("Répétiteur introuvable"));
        boolean own = viewer.getId().equals(t.getAccountId());
        if (!t.isListed() && !own && !"ADMIN".equals(viewer.getRole())) throw new NoSuchElementException("Ce profil n'est pas disponible.");
        if (!own && ("PARENT".equals(viewer.getRole()) || "STUDENT".equals(viewer.getRole()))) recordVisit(t, viewer);
        Map<String, Object> m = new LinkedHashMap<>(card(t));
        m.put("bio", t.getBio()); m.put("phone", t.getPhone()); m.put("whatsapp", t.getWhatsapp()); m.put("email", t.getEmail());
        m.put("accountId", t.getAccountId()); m.put("memberSince", t.getCreatedAt());
        return m;
    }

    private void recordVisit(Tutor t, UserAccount viewer) {
        // Une visite comptée (et notifiée) par visiteur et par tranche de 12 heures.
        if (visits.existsByTutorIdAndVisitorAccountIdAndVisitedAtAfter(t.getId(), viewer.getId(), LocalDateTime.now().minusHours(12))) return;
        ProfileVisit v = new ProfileVisit(); v.setTutorId(t.getId()); v.setVisitorAccountId(viewer.getId());
        visits.save(v);
        t.setViews(t.getViews() + 1); tutors.save(t);
        Map<String, Object> who = visitor(viewer);
        notify.notify(t.getAccountId(), "VISIT", "👀 " + who.get("name") + " a consulté ta fiche",
                who.get("name") + " (" + who.get("label") + (who.get("place") == null ? "" : ", " + who.get("place")) + ") vient de voir ton profil. "
                        + "Tu peux lui envoyer un message depuis ton espace répétiteur.", "/repetiteur/espace#visiteurs", t.getEmail());
    }

    /** Nom et description d'un visiteur, sans ses coordonnées. */
    Map<String, Object> visitor(UserAccount a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("accountId", a.getId());
        if (a.getStudentId() != null) {
            Student s = students.findById(a.getStudentId()).orElse(null);
            m.put("name", s == null ? a.getEmail() : s.getName());
            m.put("label", s == null ? "Élève" : "Élève de " + s.getLevel() + (s.getParentName() != null ? " · parent : " + s.getParentName() : ""));
            m.put("place", null);
        } else {
            m.put("name", a.getFullName() == null ? a.getEmail() : a.getFullName());
            m.put("label", "PARENT".equals(a.getRole()) ? "Parent" : "TUTOR".equals(a.getRole()) ? "Répétiteur" : "Utilisateur");
            m.put("place", a.getDistrict() != null ? a.getDistrict() + (a.getCity() != null ? ", " + a.getCity() : "") : a.getCity());
        }
        return m;
    }

    // =================================================================== Espace répétiteur

    @GetMapping("/tutor/me")
    public Map<String, Object> tutorMe(Authentication auth) {
        Tutor t = myTutor(auth);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("profile", t);
        out.put("listing", billing.tutorSummary(t));
        List<ProfileVisit> all = visits.findByTutorIdOrderByVisitedAtDesc(t.getId());
        LocalDateTime d30 = LocalDateTime.now().minusDays(30), d7 = LocalDateTime.now().minusDays(7);
        out.put("stats", Map.of(
                "views", t.getViews(),
                "views30", all.stream().filter(v -> v.getVisitedAt().isAfter(d30)).count(),
                "views7", all.stream().filter(v -> v.getVisitedAt().isAfter(d7)).count(),
                "visitors", all.stream().map(ProfileVisit::getVisitorAccountId).distinct().count(),
                "unreadMessages", messages.countByToAccountIdAndReadAtIsNull(t.getAccountId()),
                "completeness", completeness(t)));
        // Vues par jour sur 14 jours, pour le graphique de l'espace répétiteur.
        List<Map<String, Object>> days = new ArrayList<>();
        for (int i = 13; i >= 0; i--) {
            java.time.LocalDate day = java.time.LocalDate.now().minusDays(i);
            days.add(Map.of("day", day.toString(), "views", all.stream().filter(v -> v.getVisitedAt().toLocalDate().equals(day)).count()));
        }
        out.put("viewsByDay", days);
        out.put("payments", payments.findAllByOrderByCreatedAtDesc().stream().filter(p -> t.getId().equals(p.getTutorId())).toList());
        out.put("methods", BillingService.METHODS.entrySet().stream().filter(e -> !"ESPECES".equals(e.getKey()))
                .map(e -> Map.of("code", e.getKey(), "label", e.getValue())).toList());
        out.put("merchantNumber", billing.merchantNumber());
        out.put("merchantName", billing.merchantName());
        return out;
    }

    @PutMapping("/tutor/me")
    @Transactional
    public Tutor updateTutor(@RequestBody TutorForm f, Authentication auth) {
        Tutor t = myTutor(auth);
        apply(t, f, false);
        tutors.save(t);
        accounts.findById(t.getAccountId()).ifPresent(a -> {
            a.setFullName(t.getName()); a.setPhone(t.getPhone()); a.setCity(t.getCity()); a.setDistrict(t.getDistrict()); accounts.save(a);
        });
        return t;
    }

    public record TutorPaymentForm(String method, String phone, String reference) {}

    @PostMapping("/tutor/payments")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment declareTutorPayment(@RequestBody TutorPaymentForm f, Authentication auth) {
        return billing.declareTutor(myTutor(auth), f.method(), f.phone(), f.reference());
    }

    @GetMapping("/tutor/visitors")
    public List<Map<String, Object>> visitors(Authentication auth) {
        Tutor t = myTutor(auth);
        Map<Long, List<ProfileVisit>> byVisitor = visits.findByTutorIdOrderByVisitedAtDesc(t.getId()).stream()
                .collect(Collectors.groupingBy(ProfileVisit::getVisitorAccountId, LinkedHashMap::new, Collectors.toList()));
        List<Map<String, Object>> out = new ArrayList<>();
        byVisitor.forEach((accountId, list) -> accounts.findById(accountId).ifPresent(a -> {
            Map<String, Object> m = visitor(a);
            m.put("lastVisit", list.get(0).getVisitedAt()); m.put("visits", list.size());
            m.put("conversation", messages.existsByFromAccountIdAndToAccountId(t.getAccountId(), accountId) || messages.existsByFromAccountIdAndToAccountId(accountId, t.getAccountId()));
            out.add(m);
        }));
        return out;
    }

    // =================================================================== Outils

    private Tutor myTutor(Authentication auth) {
        UserAccount a = sessions.require(auth, "TUTOR");
        return tutors.findByAccountId(a.getId()).orElseThrow(() -> new NoSuchElementException("Profil répétiteur introuvable"));
    }

    private void apply(Tutor t, TutorForm f, boolean creating) {
        if (creating || f.name() != null) t.setName(required(f.name(), "Ton nom complet est requis."));
        if (creating || f.phone() != null) t.setPhone(required(f.phone(), "Ton numéro de téléphone est requis."));
        if (f.whatsapp() != null) t.setWhatsapp(trim(f.whatsapp()));
        if (creating || f.city() != null) t.setCity(required(f.city(), "Ta ville est requise."));
        if (f.district() != null) t.setDistrict(trim(f.district()));
        if (Places.ABIDJAN.equals(t.getCity()) && blank(t.getDistrict())) throw new IllegalArgumentException("À Abidjan, indique ta commune ou ton quartier.");
        if (creating || f.specialties() != null) t.setSpecialties(required(f.specialties(), "Indique au moins une matière."));
        if (creating || f.levels() != null) t.setLevels(required(f.levels(), "Indique les classes que tu accompagnes."));
        if (creating || f.educationLevel() != null) t.setEducationLevel(required(f.educationLevel(), "Indique ton niveau d'études ou ton diplôme."));
        if (f.experienceYears() != null) t.setExperienceYears(Math.max(0, Math.min(50, f.experienceYears())));
        if (f.bio() != null) t.setBio(trim(f.bio()) == null ? null : f.bio().trim().substring(0, Math.min(1500, f.bio().trim().length())));
        if (f.hourlyRate() != null) t.setHourlyRate(Math.max(0, f.hourlyRate()));
        if (f.teachingMode() != null) t.setTeachingMode(trim(f.teachingMode()));
    }

    static int completeness(Tutor t) {
        int n = 0, total = 9;
        for (Object o : new Object[]{t.getName(), t.getPhone(), t.getCity(), t.getSpecialties(), t.getLevels(), t.getEducationLevel(), t.getBio(), t.getTeachingMode()})
            if (o != null && !String.valueOf(o).isBlank()) n++;
        if (t.getExperienceYears() > 0) n++;
        return Math.round(n * 100f / total);
    }

    private static String required(String v, String message) { if (v == null || v.isBlank()) throw new IllegalArgumentException(message); return v.trim(); }
    private static String trim(String v) { return v == null || v.isBlank() ? null : v.trim(); }
    private static boolean blank(String v) { return v == null || v.isBlank(); }
    static String norm(String v) {
        return v == null ? "" : Normalizer.normalize(v, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).replaceAll("\\s+", " ").trim();
    }
}
