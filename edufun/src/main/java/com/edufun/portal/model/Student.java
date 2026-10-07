package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String level;
    private int xp;
    private int streak;
    private String status = "ACTIVE";
    /** Fin de la période d'essai gratuite. */
    private java.time.LocalDate trialUntil;
    /** Dernier jour couvert par un abonnement payé. */
    private java.time.LocalDate paidUntil;
    /** Accès provisoire accordé pendant la vérification du premier paiement. */
    private java.time.LocalDate provisionalUntil;
    /** Le mois offert est accordé une seule fois, au premier paiement validé. */
    @Column(columnDefinition = "boolean default false") private boolean welcomeMonthGranted;
    private String phone;
    private String parentName;
    private String parentEmail;
    private String parentPhone;
    @Column(columnDefinition = "boolean default true") private boolean parentNotifications = true;
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Student() {
    }

    public java.time.LocalDate getProvisionalUntil() { return provisionalUntil; }
    public void setProvisionalUntil(java.time.LocalDate v) { provisionalUntil = v; }
    public boolean isWelcomeMonthGranted() { return welcomeMonthGranted; }
    public void setWelcomeMonthGranted(boolean v) { welcomeMonthGranted = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getParentName() { return parentName; } public void setParentName(String v) { parentName = v; }
    public String getParentEmail() { return parentEmail; } public void setParentEmail(String v) { parentEmail = v; }
    public String getParentPhone() { return parentPhone; } public void setParentPhone(String v) { parentPhone = v; }
    public boolean isParentNotifications() { return parentNotifications; } public void setParentNotifications(boolean v) { parentNotifications = v; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(java.time.LocalDateTime v) { createdAt = v; }

    public java.time.LocalDate getTrialUntil() { return trialUntil; }
    public void setTrialUntil(java.time.LocalDate v) { trialUntil = v; }
    public java.time.LocalDate getPaidUntil() { return paidUntil; }
    public void setPaidUntil(java.time.LocalDate v) { paidUntil = v; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
