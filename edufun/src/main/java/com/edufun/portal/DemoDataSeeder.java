package com.edufun.portal;

import com.edufun.portal.model.*;
import com.edufun.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Comptes de démonstration pour les tests (désactivé par défaut).
 * Activer avec EDUFUN_DEMO_DATA=true : un compte par profil (élèves dans chaque situation d'abonnement, parent,
 * répétiteurs visibles dans plusieurs communes, répétiteur non payé), tous avec le mot de passe EDUFUN_DEMO_PASSWORD.
 * Les comptes ne sont créés qu'une fois ; ils ne sont jamais modifiés ensuite.
 */
@Component
@Order(100)
public class DemoDataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserAccountRepository accounts;
    private final StudentRepository students;
    private final TutorRepository tutors;
    private final PaymentRepository payments;
    private final PasswordEncoder encoder;
    private final boolean enabled;
    private final String password;

    public DemoDataSeeder(UserAccountRepository accounts, StudentRepository students, TutorRepository tutors, PaymentRepository payments,
                          PasswordEncoder encoder, @Value("${edufun.demo.enabled:false}") boolean enabled,
                          @Value("${edufun.demo.password:Demo@2026}") String password) {
        this.accounts = accounts; this.students = students; this.tutors = tutors; this.payments = payments;
        this.encoder = encoder; this.enabled = enabled; this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) return;
        LocalDate today = LocalDate.now();
        // Élèves : abonné (collège), abonné (primaire), abonné (Terminale D), compte à activer, paiement en vérification.
        student("eleve.college@demo.edufun.ci", "Awa Koné", "6e", today.plusMonths(2), null, true, "Mme Koné Fatoumata", "parent.demo@demo.edufun.ci", "0707000001");
        student("eleve.primaire@demo.edufun.ci", "Yao Kouadio", "CM2", today.plusMonths(1), null, true, "M. Kouadio Jean", "parent.demo@demo.edufun.ci", "0707000001");
        student("eleve.lycee@demo.edufun.ci", "Mariam Traoré", "Terminale D", today.plusMonths(3), null, true, "Mme Traoré Awa", "traore.parent@demo.edufun.ci", "0505000002");
        student("eleve.technique@demo.edufun.ci", "Konan Serge", "Terminale F3", today.plusMonths(1), null, true, "M. Konan Paul", "konan.parent@demo.edufun.ci", "0101000003");
        student("eleve.nouveau@demo.edufun.ci", "Bintou Cissé", "5e", null, null, false, "Mme Cissé Aminata", "cisse.parent@demo.edufun.ci", "0707000004");
        Student pending = student("eleve.verification@demo.edufun.ci", "Ange Kouassi", "3e", null, today.plusDays(2), false, "M. Kouassi Didier", "kouassi.parent@demo.edufun.ci", "0505000005");
        if (pending != null) pendingPayment(pending);

        // Parent (annuaire des répétiteurs).
        if (!accounts.existsByEmailIgnoreCase("parent.demo@demo.edufun.ci")) {
            UserAccount p = account("parent.demo@demo.edufun.ci", "PARENT");
            p.setFullName("Mme Koné Fatoumata"); p.setPhone("0707000001"); p.setCity("Abidjan"); p.setDistrict("Yopougon");
            accounts.save(p);
        }

        // Répétiteurs visibles dans plusieurs communes, et un répétiteur inscrit mais pas encore payé.
        tutor("repetiteur.demo@demo.edufun.ci", "Serge Kouadio", "0708091011", "Abidjan", "Cocody", "Mathématiques, Physique-Chimie", "Collège, Lycée, Prépa BAC",
                "Master", 8, "Professeur de mathématiques et de physique, j'accompagne les élèves du collège au BAC avec une méthode pas à pas et des sujets corrigés.", 5000, "À domicile et en ligne", true);
        tutor("fatou.diabate@demo.edufun.ci", "Fatou Diabaté", "0709080706", "Abidjan", "Yopougon", "Français, Anglais", "Primaire, Collège, Prépa BEPC",
                "Licence", 5, "Licenciée en lettres modernes, j'aide les élèves à progresser en lecture, en rédaction et en anglais, avec des exercices adaptés au BEPC.", 3000, "À domicile", true);
        tutor("ibrahim.ouattara@demo.edufun.ci", "Ibrahim Ouattara", "0501020304", "Abidjan", "Abobo", "Mathématiques, SVT", "Primaire, Collège, Prépa CEPE",
                "Enseignant certifié", 12, "Instituteur depuis 12 ans, je prépare les enfants au CEPE et consolide les bases en calcul et en sciences.", 2500, "À domicile", true);
        tutor("aya.yao@demo.edufun.ci", "Aya Yao", "0102030405", "Bouaké", "Commerce", "Comptabilité, Économie, Mathématiques", "Lycée, Prépa BAC",
                "Master", 6, "Diplômée en finance-comptabilité, j'accompagne les élèves des séries G1 et G2 dans la préparation du BAC technique.", 4000, "À domicile et en ligne", true);
        tutor("repetiteur.nonpaye@demo.edufun.ci", "Didier Gnagne", "0506070809", "Abidjan", "Marcory", "Anglais, Espagnol", "Collège, Lycée",
                "Licence", 3, "Professeur de langues, cours de conversation et de grammaire pour le collège et le lycée.", 3000, "En ligne", false);

        log.info("Comptes de démonstration prêts (mot de passe commun défini par EDUFUN_DEMO_PASSWORD)");
    }

    private UserAccount account(String email, String role) {
        UserAccount a = new UserAccount();
        a.setEmail(email); a.setPasswordHash(encoder.encode(password)); a.setRole(role); a.setEnabled(true);
        return a;
    }

    private Student student(String email, String name, String level, LocalDate paidUntil, LocalDate provisional, boolean welcomeUsed,
                            String parentName, String parentEmail, String parentPhone) {
        if (accounts.existsByEmailIgnoreCase(email)) return null;
        Student s = new Student();
        s.setName(name); s.setEmail(email); s.setLevel(level); s.setStatus("ACTIVE");
        s.setPaidUntil(paidUntil); s.setProvisionalUntil(provisional); s.setWelcomeMonthGranted(welcomeUsed);
        s.setParentName(parentName); s.setParentEmail(parentEmail); s.setParentPhone(parentPhone); s.setPhone("0700000000");
        s = students.save(s);
        UserAccount a = account(email, "STUDENT");
        a.setStudentId(s.getId());
        accounts.save(a);
        if (paidUntil != null) {
            Payment p = new Payment();
            p.setKind("STUDENT"); p.setStudentId(s.getId()); p.setLevel(level); p.setMonths(1); p.setBonusMonths(welcomeUsed ? 1 : 0);
            p.setAmount(level.startsWith("C") ? 5000 : List.of("6e", "5e", "4e", "3e").contains(level) ? 7000 : 10000);
            p.setMethod("ORANGE_MONEY"); p.setPhone(parentPhone); p.setReference("DEMO-" + s.getId()); p.setStatus("VALIDATED");
            p.setPeriodStart(LocalDate.now()); p.setPeriodEnd(paidUntil); p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy("démonstration");
            payments.save(p);
        }
        return s;
    }

    private void pendingPayment(Student s) {
        Payment p = new Payment();
        p.setKind("STUDENT"); p.setStudentId(s.getId()); p.setLevel(s.getLevel()); p.setMonths(1); p.setAmount(7000);
        p.setMethod("WAVE"); p.setPhone("0505000005"); p.setReference("DEMO-WV-" + s.getId()); p.setStatus("PENDING");
        payments.save(p);
    }

    private void tutor(String email, String name, String phone, String city, String district, String subjects, String levels,
                       String education, int years, String bio, int rate, String mode, boolean listed) {
        if (accounts.existsByEmailIgnoreCase(email)) return;
        Tutor t = new Tutor();
        t.setName(name); t.setEmail(email); t.setPhone(phone); t.setWhatsapp(phone); t.setCity(city); t.setDistrict(district);
        t.setSpecialties(subjects); t.setLevels(levels); t.setEducationLevel(education); t.setExperienceYears(years); t.setBio(bio);
        t.setHourlyRate(rate); t.setTeachingMode(mode);
        t.setStatus(listed ? "APPROVED" : "PENDING");
        if (listed) { t.setListedUntil(LocalDate.now().plusMonths(3).minusDays(1)); t.setBoostedAt(LocalDateTime.now()); }
        t = tutors.save(t);
        UserAccount a = account(email, "TUTOR");
        a.setFullName(name); a.setPhone(phone); a.setCity(city); a.setDistrict(district); a.setTutorId(t.getId());
        a = accounts.save(a);
        t.setAccountId(a.getId());
        tutors.save(t);
        if (listed) {
            Payment p = new Payment();
            p.setKind("TUTOR"); p.setTutorId(t.getId()); p.setLevel("Répétiteur"); p.setMonths(3); p.setAmount(5000);
            p.setMethod("MTN_MOMO"); p.setPhone(phone); p.setReference("DEMO-T-" + t.getId()); p.setStatus("VALIDATED");
            p.setPeriodStart(LocalDate.now()); p.setPeriodEnd(t.getListedUntil()); p.setProcessedAt(LocalDateTime.now()); p.setProcessedBy("démonstration");
            payments.save(p);
        }
    }
}
