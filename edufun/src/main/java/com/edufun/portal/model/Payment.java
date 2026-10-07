package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Paiement d'abonnement (Mobile Money déclaré par l'élève, ou espèces saisies par l'administration). */
@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long studentId;
    private Long tutorId;
    /** STUDENT (abonnement aux cours) ou TUTOR (visibilité dans l'annuaire des répétiteurs) */
    private String kind = "STUDENT";
    /** Mois offerts ajoutés à la validation (mois de bienvenue). */
    @Column(columnDefinition = "integer default 0") private int bonusMonths;
    private String level;
    private int months;
    private int amount;
    /** ORANGE_MONEY, MTN_MOMO, MOOV_MONEY, WAVE, ESPECES */
    private String method;
    private String phone;
    @Column(length = 80) private String reference;
    /** PENDING, VALIDATED, REJECTED */
    private String status = "PENDING";
    private LocalDate periodStart;
    private LocalDate periodEnd;
    @Column(length = 300) private String note;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime processedAt;
    private String processedBy;

    public Long getId() { return id; }
    public Long getTutorId() { return tutorId; } public void setTutorId(Long v) { tutorId = v; }
    public String getKind() { return kind == null ? "STUDENT" : kind; } public void setKind(String v) { kind = v; }
    public int getBonusMonths() { return bonusMonths; } public void setBonusMonths(int v) { bonusMonths = v; }
    public Long getStudentId() { return studentId; } public void setStudentId(Long v) { studentId = v; }
    public String getLevel() { return level; } public void setLevel(String v) { level = v; }
    public int getMonths() { return months; } public void setMonths(int v) { months = v; }
    public int getAmount() { return amount; } public void setAmount(int v) { amount = v; }
    public String getMethod() { return method; } public void setMethod(String v) { method = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getReference() { return reference; } public void setReference(String v) { reference = v; }
    public String getStatus() { return status; } public void setStatus(String v) { status = v; }
    public LocalDate getPeriodStart() { return periodStart; } public void setPeriodStart(LocalDate v) { periodStart = v; }
    public LocalDate getPeriodEnd() { return periodEnd; } public void setPeriodEnd(LocalDate v) { periodEnd = v; }
    public String getNote() { return note; } public void setNote(String v) { note = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public LocalDateTime getProcessedAt() { return processedAt; } public void setProcessedAt(LocalDateTime v) { processedAt = v; }
    public String getProcessedBy() { return processedBy; } public void setProcessedBy(String v) { processedBy = v; }
}
