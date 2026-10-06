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

    public Student() {
    }

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
