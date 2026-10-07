package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_accounts")
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    private String role = "STUDENT";

    private Long studentId;

    private boolean enabled = true;

    /** Nom affiché (parents et répétiteurs ; les élèves utilisent leur fiche Student). */
    private String fullName;
    private String phone;
    private String city;
    private String district;
    private Long tutorId;
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    private java.time.LocalDateTime lastLoginAt;

    public String getFullName() { return fullName; } public void setFullName(String v) { fullName = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getCity() { return city; } public void setCity(String v) { city = v; }
    public String getDistrict() { return district; } public void setDistrict(String v) { district = v; }
    public Long getTutorId() { return tutorId; } public void setTutorId(Long v) { tutorId = v; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(java.time.LocalDateTime v) { createdAt = v; }
    public java.time.LocalDateTime getLastLoginAt() { return lastLoginAt; } public void setLastLoginAt(java.time.LocalDateTime v) { lastLoginAt = v; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
