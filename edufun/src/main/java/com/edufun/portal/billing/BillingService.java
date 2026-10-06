package com.edufun.portal.billing;

import com.edufun.portal.curriculum.Levels;
import com.edufun.portal.model.Payment;
import com.edufun.portal.model.Student;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.PaymentRepository;
import com.edufun.portal.repository.StudentRepository;
import com.edufun.portal.repository.UserAccountRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Abonnements EduFun : tarif mensuel par cycle, période d'essai, droits d'accès et validation des paiements.
 * Primaire 5 000 F CFA, collège 7 000 F CFA, lycée (général et technique) 10 000 F CFA par mois.
 */
@Service
public class BillingService {
    private static final Logger log = LoggerFactory.getLogger(BillingService.class);

    public static final List<Integer> DURATIONS = List.of(1, 3, 9);
    public static final Map<String, String> METHODS = new LinkedHashMap<>();
    static {
        METHODS.put("ORANGE_MONEY", "Orange Money");
        METHODS.put("MTN_MOMO", "MTN Mobile Money");
        METHODS.put("MOOV_MONEY", "Moov Money");
        METHODS.put("WAVE", "Wave");
        METHODS.put("ESPECES", "Espèces");
    }

    private final StudentRepository students;
    private final PaymentRepository payments;
    private final UserAccountRepository accounts;
    private final int pricePrimaire, priceCollege, priceLycee, trialDays;
    private final String merchantNumber, merchantName;

    public BillingService(StudentRepository students, PaymentRepository payments, UserAccountRepository accounts,
                          @Value("${edufun.billing.price.primaire:5000}") int pricePrimaire,
                          @Value("${edufun.billing.price.college:7000}") int priceCollege,
                          @Value("${edufun.billing.price.lycee:10000}") int priceLycee,
                          @Value("${edufun.billing.trial-days:7}") int trialDays,
                          @Value("${edufun.billing.merchant-number:}") String merchantNumber,
                          @Value("${edufun.billing.merchant-name:EduFun}") String merchantName) {
        this.students = students; this.payments = payments; this.accounts = accounts;
        this.pricePrimaire = pricePrimaire; this.priceCollege = priceCollege; this.priceLycee = priceLycee;
        this.trialDays = trialDays; this.merchantNumber = merchantNumber; this.merchantName = merchantName;
    }

    /** Les élèves inscrits avant la mise en place de l'abonnement reçoivent eux aussi une période d'essai. */
    @PostConstruct
    @Transactional
    public void grantTrialToExistingStudents() {
        List<Student> without = students.findAll().stream().filter(s -> s.getTrialUntil() == null).toList();
        without.forEach(s -> s.setTrialUntil(LocalDate.now().plusDays(trialDays - 1L)));
        students.saveAll(without);
        if (!without.isEmpty()) log.info("Période d'essai de {} jours accordée à {} élève(s) existant(s)", trialDays, without.size());
    }

    /** Essai de {@code trialDays} jours, aujourd'hui compris. */
    public void startTrial(Student s) { if (s.getTrialUntil() == null) s.setTrialUntil(LocalDate.now().plusDays(trialDays - 1L)); }

    public int monthlyPrice(String level) {
        String cycle = Levels.find(level).map(Levels.Level::cycle).orElse(Levels.LYCEE);
        if (Levels.PRIMAIRE.equals(cycle)) return pricePrimaire;
        if (Levels.COLLEGE.equals(cycle)) return priceCollege;
        return priceLycee;
    }

    public List<Map<String, Object>> plans() {
        return List.of(
                Map.of("cycle", Levels.PRIMAIRE, "classes", "CP1 → CM2", "price", pricePrimaire),
                Map.of("cycle", Levels.COLLEGE, "classes", "6e → 3e", "price", priceCollege),
                Map.of("cycle", "Lycée", "classes", "Seconde → Terminale (général et technique)", "price", priceLycee));
    }

    /** ACTIVE (payé), TRIAL (essai en cours) ou EXPIRED. */
    public String status(Student s) {
        LocalDate today = LocalDate.now();
        if (s.getPaidUntil() != null && !today.isAfter(s.getPaidUntil())) return "ACTIVE";
        if (s.getTrialUntil() != null && !today.isAfter(s.getTrialUntil())) return "TRIAL";
        return "EXPIRED";
    }

    public boolean hasAccess(Student s) { return !"EXPIRED".equals(status(s)); }

    public static boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    /** Lève {@link SubscriptionRequiredException} si l'utilisateur connecté n'a pas accès au contenu payant. */
    public void assertAccess(Authentication auth) {
        if (isAdmin(auth)) return;
        UserAccount a = auth == null ? null : accounts.findByEmailIgnoreCase(auth.getName()).orElse(null);
        if (a == null || a.getStudentId() == null) throw new SubscriptionRequiredException();
        Student s = students.findById(a.getStudentId()).orElseThrow(SubscriptionRequiredException::new);
        if (!hasAccess(s)) throw new SubscriptionRequiredException();
    }

    public Map<String, Object> summary(Student s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("status", status(s));
        m.put("level", s.getLevel());
        m.put("cycle", Levels.find(s.getLevel()).map(Levels.Level::cycle).orElse(""));
        m.put("monthlyPrice", monthlyPrice(s.getLevel()));
        m.put("trialUntil", s.getTrialUntil());
        m.put("paidUntil", s.getPaidUntil());
        LocalDate end = "ACTIVE".equals(status(s)) ? s.getPaidUntil() : "TRIAL".equals(status(s)) ? s.getTrialUntil() : null;
        m.put("accessUntil", end);
        m.put("daysLeft", end == null ? 0 : java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), end) + 1);
        return m;
    }

    @Transactional
    public Payment declare(Student s, int months, String method, String phone, String reference) {
        if (!DURATIONS.contains(months)) throw new IllegalArgumentException("Durée invalide : choisis 1, 3 ou 9 mois.");
        if (!METHODS.containsKey(method) || "ESPECES".equals(method)) throw new IllegalArgumentException("Choisis un moyen de paiement Mobile Money.");
        String ref = reference == null ? "" : reference.trim();
        String tel = phone == null ? "" : phone.replaceAll("[^0-9+]", "");
        if (ref.length() < 4) throw new IllegalArgumentException("Indique la référence de la transaction reçue par SMS.");
        if (tel.length() < 8) throw new IllegalArgumentException("Indique le numéro qui a effectué le paiement.");
        if (payments.existsByReferenceIgnoreCaseAndStatusNot(ref, "REJECTED")) throw new IllegalStateException("Cette référence de transaction a déjà été déclarée.");
        if (payments.countByStudentIdAndStatus(s.getId(), "PENDING") >= 3) throw new IllegalStateException("Tu as déjà des paiements en attente de vérification.");
        Payment p = new Payment();
        p.setStudentId(s.getId()); p.setLevel(s.getLevel()); p.setMonths(months); p.setAmount(months * monthlyPrice(s.getLevel()));
        p.setMethod(method); p.setPhone(tel); p.setReference(ref); p.setStatus("PENDING");
        return payments.save(p);
    }

    /** Valide un paiement : l'abonnement est prolongé à partir de la fin de la période en cours. */
    @Transactional
    public Payment validate(Long paymentId, String admin) {
        Payment p = payments.findById(paymentId).orElseThrow(() -> new NoSuchElementException("Paiement introuvable"));
        if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("Ce paiement a déjà été traité.");
        Student s = students.findById(p.getStudentId()).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
        LocalDate today = LocalDate.now();
        LocalDate start = s.getPaidUntil() != null && !s.getPaidUntil().isBefore(today) ? s.getPaidUntil().plusDays(1) : today;
        LocalDate end = start.plusMonths(p.getMonths()).minusDays(1);
        s.setPaidUntil(end);
        students.save(s);
        p.setPeriodStart(start); p.setPeriodEnd(end); p.setStatus("VALIDATED");
        p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy(admin);
        return payments.save(p);
    }

    @Transactional
    public Payment reject(Long paymentId, String admin, String note) {
        Payment p = payments.findById(paymentId).orElseThrow(() -> new NoSuchElementException("Paiement introuvable"));
        if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("Ce paiement a déjà été traité.");
        p.setStatus("REJECTED"); p.setNote(note == null || note.isBlank() ? "Transaction introuvable" : note.trim());
        p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy(admin);
        return payments.save(p);
    }

    /** Paiement reçu directement (espèces ou Mobile Money vérifié) saisi par l'administration. */
    @Transactional
    public Payment record(Long studentId, int months, String method, String reference, String admin) {
        if (!DURATIONS.contains(months)) throw new IllegalArgumentException("Durée invalide : 1, 3 ou 9 mois.");
        if (!METHODS.containsKey(method)) throw new IllegalArgumentException("Moyen de paiement inconnu.");
        Student s = students.findById(studentId).orElseThrow(() -> new NoSuchElementException("Élève introuvable"));
        Payment p = new Payment();
        p.setStudentId(s.getId()); p.setLevel(s.getLevel()); p.setMonths(months); p.setAmount(months * monthlyPrice(s.getLevel()));
        p.setMethod(method); p.setReference(reference == null || reference.isBlank() ? "ADMIN-" + System.currentTimeMillis() : reference.trim());
        p = payments.save(p);
        return validate(p.getId(), admin);
    }

    public String merchantNumber() { return merchantNumber; }
    public String merchantName() { return merchantName; }
    public int trialDays() { return trialDays; }
}
