package com.edufun.portal.billing;

import com.edufun.portal.model.Payment;
import com.edufun.portal.model.Student;
import com.edufun.portal.model.UserAccount;
import com.edufun.portal.repository.PaymentRepository;
import com.edufun.portal.repository.StudentRepository;
import com.edufun.portal.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class BillingController {
    private final BillingService billing;
    private final StudentRepository students;
    private final PaymentRepository payments;
    private final UserAccountRepository accounts;

    public BillingController(BillingService billing, StudentRepository students, PaymentRepository payments, UserAccountRepository accounts) {
        this.billing = billing; this.students = students; this.payments = payments; this.accounts = accounts;
    }

    // ---------- Espace élève ----------

    @GetMapping("/billing/me")
    public Map<String, Object> me(Authentication auth) {
        Student s = currentStudent(auth);
        Map<String, Object> out = new LinkedHashMap<>(billing.summary(s));
        out.put("plans", billing.plans());
        out.put("durations", BillingService.DURATIONS);
        out.put("methods", BillingService.METHODS.entrySet().stream().filter(e -> !"ESPECES".equals(e.getKey()))
                .map(e -> Map.of("code", e.getKey(), "label", e.getValue())).toList());
        out.put("merchantNumber", billing.merchantNumber());
        out.put("merchantName", billing.merchantName());
        out.put("payments", payments.findByStudentIdOrderByCreatedAtDesc(s.getId()));
        return out;
    }

    public record DeclareRequest(int months, String method, String phone, String reference) {}

    @PostMapping("/billing/payments")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment declare(@RequestBody DeclareRequest r, Authentication auth) {
        return billing.declare(currentStudent(auth), r.months(), r.method(), r.phone(), r.reference());
    }

    // ---------- Console d'administration ----------

    @GetMapping("/admin/billing")
    public Map<String, Object> overview() {
        List<Student> all = students.findAll();
        List<Payment> list = payments.findAllByOrderByCreatedAtDesc();
        Map<Long, Student> byId = all.stream().collect(Collectors.toMap(Student::getId, Function.identity()));
        YearMonth now = YearMonth.now();
        int monthRevenue = list.stream().filter(p -> "VALIDATED".equals(p.getStatus()) && p.getProcessedAt() != null
                && YearMonth.from(p.getProcessedAt()).equals(now)).mapToInt(Payment::getAmount).sum();
        int totalRevenue = list.stream().filter(p -> "VALIDATED".equals(p.getStatus())).mapToInt(Payment::getAmount).sum();
        Map<String, Long> byStatus = all.stream().collect(Collectors.groupingBy(billing::status, Collectors.counting()));

        // Recettes des 6 derniers mois (paiements validés).
        List<Map<String, Object>> months = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            int sum = list.stream().filter(p -> "VALIDATED".equals(p.getStatus()) && p.getProcessedAt() != null
                    && YearMonth.from(p.getProcessedAt()).equals(ym)).mapToInt(Payment::getAmount).sum();
            months.add(Map.of("month", ym.toString(), "amount", sum));
        }

        List<Map<String, Object>> studentRows = all.stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>(billing.summary(s));
            m.put("id", s.getId()); m.put("name", s.getName()); m.put("email", s.getEmail()); m.put("xp", s.getXp());
            return m;
        }).sorted(Comparator.comparing((Map<String, Object> m) -> String.valueOf(m.get("status"))).thenComparing(m -> String.valueOf(m.get("name")))).toList();

        List<Map<String, Object>> paymentRows = list.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            Student s = byId.get(p.getStudentId());
            m.put("id", p.getId()); m.put("student", s == null ? "—" : s.getName()); m.put("email", s == null ? "" : s.getEmail());
            m.put("level", p.getLevel()); m.put("months", p.getMonths()); m.put("amount", p.getAmount());
            m.put("method", BillingService.METHODS.getOrDefault(p.getMethod(), p.getMethod())); m.put("phone", p.getPhone());
            m.put("reference", p.getReference()); m.put("status", p.getStatus()); m.put("createdAt", p.getCreatedAt());
            m.put("periodEnd", p.getPeriodEnd()); m.put("note", p.getNote());
            return m;
        }).toList();

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("monthRevenue", monthRevenue);
        out.put("totalRevenue", totalRevenue);
        out.put("active", byStatus.getOrDefault("ACTIVE", 0L));
        out.put("trial", byStatus.getOrDefault("TRIAL", 0L));
        out.put("expired", byStatus.getOrDefault("EXPIRED", 0L));
        out.put("pending", list.stream().filter(p -> "PENDING".equals(p.getStatus())).count());
        out.put("expiringSoon", all.stream().filter(s -> "ACTIVE".equals(billing.status(s)) && !s.getPaidUntil().isAfter(LocalDate.now().plusDays(7))).count());
        out.put("revenueByMonth", months);
        out.put("plans", billing.plans());
        out.put("students", studentRows);
        out.put("payments", paymentRows);
        return out;
    }

    @PostMapping("/admin/payments/{id}/validate")
    public Payment validate(@PathVariable Long id, Authentication auth) { return billing.validate(id, auth.getName()); }

    @PostMapping("/admin/payments/{id}/reject")
    public Payment reject(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body, Authentication auth) {
        return billing.reject(id, auth.getName(), body == null ? null : body.get("note"));
    }

    public record RecordRequest(Long studentId, Long tutorId, int months, String method, String reference) {}

    @PostMapping("/admin/payments")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment record(@RequestBody RecordRequest r, Authentication auth) {
        return billing.record(r.studentId(), r.tutorId(), r.months(), r.method(), r.reference(), auth.getName());
    }

    private Student currentStudent(Authentication auth) {
        UserAccount a = auth == null ? null : accounts.findByEmailIgnoreCase(auth.getName()).orElse(null);
        if (a == null || a.getStudentId() == null) throw new AccessDeniedException("Espace réservé aux élèves");
        return students.findById(a.getStudentId()).orElseThrow(() -> new AccessDeniedException("Élève introuvable"));
    }
}
