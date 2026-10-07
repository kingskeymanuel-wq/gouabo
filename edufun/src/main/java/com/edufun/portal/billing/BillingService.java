package com.edufun.portal.billing;

import com.edufun.portal.curriculum.Levels;
import com.edufun.portal.model.Payment;
import com.edufun.portal.model.Student;
import com.edufun.portal.model.Tutor;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.notify.NotificationService;
import com.edufun.portal.repository.PaymentRepository;
import com.edufun.portal.repository.StudentRepository;
import com.edufun.portal.repository.TutorRepository;
import com.edufun.portal.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Abonnements EduFun.
 * <ul>
 *   <li>Élèves : 5 000 F CFA par mois (primaire), 7 000 F (collège), 10 000 F (lycée général et technique).
 *   Le premier paiement validé donne droit à un mois offert, consommé en premier ; pendant la vérification
 *   du premier paiement, l'élève dispose d'un accès provisoire.</li>
 *   <li>Répétiteurs : 5 000 F CFA par trimestre pour être visible et contactable dans l'annuaire.</li>
 * </ul>
 */
@Service
public class BillingService {
    public static final List<Integer> DURATIONS = List.of(1, 3, 9);
    public static final int TUTOR_MONTHS = 3;
    public static final Map<String, String> METHODS = new LinkedHashMap<>();
    static {
        METHODS.put("ORANGE_MONEY", "Orange Money");
        METHODS.put("MTN_MOMO", "MTN Mobile Money");
        METHODS.put("MOOV_MONEY", "Moov Money");
        METHODS.put("WAVE", "Wave");
        METHODS.put("ESPECES", "Espèces");
    }

    private final StudentRepository students;
    private final TutorRepository tutors;
    private final PaymentRepository payments;
    private final UserAccountRepository accounts;
    private final NotificationService notify;
    private final int pricePrimaire, priceCollege, priceLycee, priceTutor, trialDays, provisionalDays, welcomeMonths;
    private final String merchantNumber, merchantName;
    private final boolean paywall;

    public BillingService(StudentRepository students, TutorRepository tutors, PaymentRepository payments, UserAccountRepository accounts,
                          NotificationService notify,
                          @Value("${edufun.billing.price.primaire:5000}") int pricePrimaire,
                          @Value("${edufun.billing.price.college:7000}") int priceCollege,
                          @Value("${edufun.billing.price.lycee:10000}") int priceLycee,
                          @Value("${edufun.billing.price.tutor-quarter:5000}") int priceTutor,
                          @Value("${edufun.billing.trial-days:0}") int trialDays,
                          @Value("${edufun.billing.provisional-days:3}") int provisionalDays,
                          @Value("${edufun.billing.welcome-months:1}") int welcomeMonths,
                          @Value("${edufun.billing.merchant-number:}") String merchantNumber,
                          @Value("${edufun.billing.merchant-name:EduFun}") String merchantName,
                          @Value("${edufun.billing.paywall:false}") boolean paywall) {
        this.students = students; this.tutors = tutors; this.payments = payments; this.accounts = accounts; this.notify = notify;
        this.pricePrimaire = pricePrimaire; this.priceCollege = priceCollege; this.priceLycee = priceLycee; this.priceTutor = priceTutor;
        this.trialDays = trialDays; this.provisionalDays = provisionalDays; this.welcomeMonths = welcomeMonths;
        this.merchantNumber = merchantNumber; this.merchantName = merchantName;
        this.paywall = paywall;
        Tutor.setFreeListing(!paywall);
    }

    /** false : abonnements désactivés, tout le contenu et l'annuaire sont en accès libre. */
    public boolean paywall() { return paywall; }

    /** Essai gratuit facultatif à l'inscription (désactivé par défaut : l'accès s'ouvre avec le premier paiement). */
    public void startTrial(Student s) { if (trialDays > 0 && s.getTrialUntil() == null) s.setTrialUntil(LocalDate.now().plusDays(trialDays - 1L)); }

    public int monthlyPrice(String level) {
        String cycle = Levels.find(level).map(Levels.Level::cycle).orElse(Levels.LYCEE);
        if (Levels.PRIMAIRE.equals(cycle)) return pricePrimaire;
        if (Levels.COLLEGE.equals(cycle)) return priceCollege;
        return priceLycee;
    }
    public int tutorPrice() { return priceTutor; }
    public int welcomeMonths() { return welcomeMonths; }

    public List<Map<String, Object>> plans() {
        return List.of(
                Map.of("cycle", Levels.PRIMAIRE, "classes", "CP1 → CM2", "price", pricePrimaire),
                Map.of("cycle", Levels.COLLEGE, "classes", "6e → 3e", "price", priceCollege),
                Map.of("cycle", "Lycée", "classes", "Seconde → Terminale (général et technique)", "price", priceLycee));
    }

    // ------------------------------------------------------------------ Élèves

    /** ACTIVE (payé), TRIAL (essai), PENDING (premier paiement en vérification), NEW (jamais payé) ou EXPIRED. */
    public String status(Student s) {
        LocalDate today = LocalDate.now();
        if (s.getPaidUntil() != null && !today.isAfter(s.getPaidUntil())) return "ACTIVE";
        if (s.getTrialUntil() != null && !today.isAfter(s.getTrialUntil())) return "TRIAL";
        if (s.getProvisionalUntil() != null && !today.isAfter(s.getProvisionalUntil())) return "PENDING";
        if (s.getPaidUntil() == null && s.getTrialUntil() == null) return "NEW";
        return "EXPIRED";
    }

    public boolean hasAccess(Student s) { if (!paywall) return true; String st = status(s); return "ACTIVE".equals(st) || "TRIAL".equals(st) || "PENDING".equals(st); }

    public static boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    /** Lève {@link SubscriptionRequiredException} si l'utilisateur connecté n'a pas accès aux cours. */
    public void assertAccess(Authentication auth) {
        if (isAdmin(auth) || !paywall) return;
        UserAccount a = auth == null ? null : accounts.findByEmailIgnoreCase(auth.getName()).orElse(null);
        if (a == null || a.getStudentId() == null) throw new SubscriptionRequiredException();
        Student s = students.findById(a.getStudentId()).orElseThrow(SubscriptionRequiredException::new);
        if (!hasAccess(s)) throw new SubscriptionRequiredException();
    }

    public LocalDate accessUntil(Student s) {
        return switch (status(s)) {
            case "ACTIVE" -> s.getPaidUntil();
            case "TRIAL" -> s.getTrialUntil();
            case "PENDING" -> s.getProvisionalUntil();
            default -> null;
        };
    }

    public Map<String, Object> summary(Student s) {
        Map<String, Object> m = new LinkedHashMap<>();
        LocalDate end = accessUntil(s);
        m.put("status", paywall ? status(s) : "FREE");
        m.put("paywall", paywall);
        m.put("level", s.getLevel());
        m.put("cycle", Levels.find(s.getLevel()).map(Levels.Level::cycle).orElse(""));
        m.put("monthlyPrice", monthlyPrice(s.getLevel()));
        m.put("trialUntil", s.getTrialUntil());
        m.put("paidUntil", s.getPaidUntil());
        m.put("provisionalUntil", s.getProvisionalUntil());
        m.put("accessUntil", end);
        m.put("daysLeft", end == null ? 0 : ChronoUnit.DAYS.between(LocalDate.now(), end) + 1);
        m.put("welcomeOffer", !s.isWelcomeMonthGranted() && welcomeMonths > 0);
        m.put("welcomeMonths", welcomeMonths);
        return m;
    }

    @Transactional
    public Payment declare(Student s, int months, String method, String phone, String reference) {
        if (!DURATIONS.contains(months)) throw new IllegalArgumentException("Durée invalide : choisis 1, 3 ou 9 mois.");
        Payment p = basePayment(method, phone, reference, s.getId(), null);
        p.setKind("STUDENT"); p.setLevel(s.getLevel()); p.setMonths(months); p.setAmount(months * monthlyPrice(s.getLevel()));
        p = payments.save(p);
        // Premier paiement : l'élève commence tout de suite, le temps que l'équipe vérifie la transaction.
        if (s.getPaidUntil() == null && !hasAccess(s) && provisionalDays > 0) {
            s.setProvisionalUntil(LocalDate.now().plusDays(provisionalDays - 1L));
            students.save(s);
        }
        return p;
    }

    // ------------------------------------------------------------------ Répétiteurs

    public Map<String, Object> tutorSummary(Tutor t) {
        Map<String, Object> m = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        String st = t.isPaidListing() ? "LISTED" : t.isListed() ? "FREE" : "APPROVED".equals(t.getStatus()) || "PENDING".equals(t.getStatus())
                ? (t.getListedUntil() != null && t.getListedUntil().isBefore(today) ? "EXPIRED" : "UNPAID") : t.getStatus();
        m.put("listingStatus", st);
        m.put("profileStatus", t.getStatus());
        m.put("listedUntil", t.getListedUntil());
        m.put("daysLeft", t.isPaidListing() ? ChronoUnit.DAYS.between(today, t.getListedUntil()) + 1 : 0);
        m.put("price", priceTutor);
        m.put("months", TUTOR_MONTHS);
        m.put("paywall", paywall);
        return m;
    }

    @Transactional
    public Payment declareTutor(Tutor t, String method, String phone, String reference) {
        Payment p = basePayment(method, phone, reference, null, t.getId());
        p.setKind("TUTOR"); p.setLevel("Répétiteur"); p.setMonths(TUTOR_MONTHS); p.setAmount(priceTutor);
        return payments.save(p);
    }

    private Payment basePayment(String method, String phone, String reference, Long studentId, Long tutorId) {
        if (!METHODS.containsKey(method) || "ESPECES".equals(method)) throw new IllegalArgumentException("Choisis un moyen de paiement Mobile Money.");
        String ref = reference == null ? "" : reference.trim();
        String tel = phone == null ? "" : phone.replaceAll("[^0-9+]", "");
        if (ref.length() < 4) throw new IllegalArgumentException("Indique la référence de la transaction reçue par SMS.");
        if (tel.length() < 8) throw new IllegalArgumentException("Indique le numéro qui a effectué le paiement.");
        if (payments.existsByReferenceIgnoreCaseAndStatusNot(ref, "REJECTED")) throw new IllegalStateException("Cette référence de transaction a déjà été déclarée.");
        long pending = payments.findAllByOrderByCreatedAtDesc().stream().filter(x -> "PENDING".equals(x.getStatus())
                && (studentId != null ? studentId.equals(x.getStudentId()) : tutorId.equals(x.getTutorId()))).count();
        if (pending >= 3) throw new IllegalStateException("Des paiements sont déjà en attente de vérification.");
        Payment p = new Payment();
        p.setStudentId(studentId); p.setTutorId(tutorId); p.setMethod(method); p.setPhone(tel); p.setReference(ref); p.setStatus("PENDING");
        return p;
    }

    // ------------------------------------------------------------------ Validation (administration)

    /** Valide un paiement : prolonge l'abonnement de l'élève ou la visibilité du répétiteur. */
    @Transactional
    public Payment validate(Long paymentId, String admin) {
        Payment p = payments.findById(paymentId).orElseThrow(() -> new NoSuchElementException("Paiement introuvable"));
        if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("Ce paiement a déjà été traité.");
        LocalDate today = LocalDate.now();
        if ("TUTOR".equals(p.getKind())) {
            Tutor t = tutors.findById(p.getTutorId()).orElseThrow(() -> new NoSuchElementException("Répétiteur introuvable"));
            LocalDate start = t.getListedUntil() != null && !t.getListedUntil().isBefore(today) ? t.getListedUntil().plusDays(1) : today;
            LocalDate end = start.plusMonths(p.getMonths()).minusDays(1);
            t.setListedUntil(end); t.setBoostedAt(LocalDateTime.now());
            if ("PENDING".equals(t.getStatus())) t.setStatus("APPROVED");
            tutors.save(t);
            p.setPeriodStart(start); p.setPeriodEnd(end);
            notifyTutor(t, "Ton profil est visible dans l'annuaire 🎉",
                    "Ton paiement de " + fmt(p.getAmount()) + " F CFA a été validé. Ton profil est mis en avant auprès des parents jusqu'au " + fr(end) + ".");
        } else {
            Student s = students.findById(p.getStudentId()).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
            LocalDate start = s.getPaidUntil() != null && !s.getPaidUntil().isBefore(today) ? s.getPaidUntil().plusDays(1) : today;
            int bonus = 0;
            if (!s.isWelcomeMonthGranted() && welcomeMonths > 0) { bonus = welcomeMonths; s.setWelcomeMonthGranted(true); }
            LocalDate end = start.plusMonths(p.getMonths() + bonus).minusDays(1);
            s.setPaidUntil(end); s.setProvisionalUntil(null);
            students.save(s);
            p.setBonusMonths(bonus); p.setPeriodStart(start); p.setPeriodEnd(end);
            String msg = "Ton paiement de " + fmt(p.getAmount()) + " F CFA a été validé" + (bonus > 0 ? ", et ton mois offert a été ajouté" : "")
                    + ". Tu as accès à tous tes cours jusqu'au " + fr(end) + ".";
            accounts.findAll().stream().filter(a -> s.getId().equals(a.getStudentId())).findFirst()
                    .ifPresent(a -> notify.notify(a.getId(), "PAYMENT", "Abonnement activé ✅", msg, "/abonnement", null));
            if (s.getParentEmail() != null && !s.getParentEmail().isBlank())
                notify.email(s.getParentEmail(), "PAYMENT", "Abonnement EduFun de " + s.getName() + " activé",
                        "Bonjour,\n\nLe paiement de l'abonnement EduFun de " + s.getName() + " (" + s.getLevel() + ") a été validé"
                                + (bonus > 0 ? " et un mois offert a été ajouté" : "") + ". Accès ouvert jusqu'au " + fr(end) + ".\n\nVous recevrez régulièrement le résumé de sa progression.", null);
        }
        p.setStatus("VALIDATED"); p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy(admin);
        return payments.save(p);
    }

    @Transactional
    public Payment reject(Long paymentId, String admin, String note) {
        Payment p = payments.findById(paymentId).orElseThrow(() -> new NoSuchElementException("Paiement introuvable"));
        if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("Ce paiement a déjà été traité.");
        p.setStatus("REJECTED"); p.setNote(note == null || note.isBlank() ? "Transaction introuvable" : note.trim());
        p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy(admin);
        payments.save(p);
        String text = "Ton paiement (réf. " + p.getReference() + ") n'a pas pu être validé : " + p.getNote() + ". Vérifie la référence ou contacte EduFun.";
        if ("TUTOR".equals(p.getKind())) tutors.findById(p.getTutorId()).ifPresent(t -> notifyTutor(t, "Paiement non validé", text));
        else students.findById(p.getStudentId()).ifPresent(s -> {
            // Sans autre paiement en attente, l'accès provisoire prend fin.
            boolean otherPending = payments.findByStudentIdOrderByCreatedAtDesc(s.getId()).stream().anyMatch(x -> "PENDING".equals(x.getStatus()));
            if (!otherPending && s.getProvisionalUntil() != null) { s.setProvisionalUntil(null); students.save(s); }
            accounts.findAll().stream().filter(a -> s.getId().equals(a.getStudentId())).findFirst()
                    .ifPresent(a -> notify.notify(a.getId(), "PAYMENT", "Paiement non validé", text, "/abonnement", null));
        });
        return p;
    }

    /** Paiement reçu directement (espèces ou Mobile Money vérifié), saisi par l'administration. */
    @Transactional
    public Payment record(Long studentId, Long tutorId, int months, String method, String reference, String admin) {
        if (!METHODS.containsKey(method)) throw new IllegalArgumentException("Moyen de paiement inconnu.");
        Payment p = new Payment();
        if (tutorId != null) {
            Tutor t = tutors.findById(tutorId).orElseThrow(() -> new NoSuchElementException("Répétiteur introuvable"));
            p.setKind("TUTOR"); p.setTutorId(t.getId()); p.setLevel("Répétiteur"); p.setMonths(TUTOR_MONTHS); p.setAmount(priceTutor);
        } else {
            if (!DURATIONS.contains(months)) throw new IllegalArgumentException("Durée invalide : 1, 3 ou 9 mois.");
            Student s = students.findById(studentId).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
            p.setKind("STUDENT"); p.setStudentId(s.getId()); p.setLevel(s.getLevel()); p.setMonths(months); p.setAmount(months * monthlyPrice(s.getLevel()));
        }
        p.setMethod(method);
        p.setReference(reference == null || reference.isBlank() ? "ADMIN-" + System.currentTimeMillis() : reference.trim());
        p = payments.save(p);
        return validate(p.getId(), admin);
    }

    private void notifyTutor(Tutor t, String title, String body) {
        notify.notify(t.getAccountId(), "PAYMENT", title, body, "/repetiteur/espace", t.getEmail());
    }

    private static String fmt(int n) { return String.format(Locale.FRANCE, "%,d", n).replace(' ', ' ').replace(' ', ' '); }
    private static String fr(LocalDate d) { return d.format(java.time.format.DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.FRENCH)); }

    public String merchantNumber() { return merchantNumber; }
    public String merchantName() { return merchantName; }
}
