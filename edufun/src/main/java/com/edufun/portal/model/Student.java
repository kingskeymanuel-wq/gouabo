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

    public Student() {
    }

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
