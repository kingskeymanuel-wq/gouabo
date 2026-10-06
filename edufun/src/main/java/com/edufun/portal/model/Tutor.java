package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String specialties;
    private String levels;
    private String status = "PENDING";

    public Tutor() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialties() { return specialties; }
    public void setSpecialties(String specialties) { this.specialties = specialties; }

    public String getLevels() { return levels; }
    public void setLevels(String levels) { this.levels = levels; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
