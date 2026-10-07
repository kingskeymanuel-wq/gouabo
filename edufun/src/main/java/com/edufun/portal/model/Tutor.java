package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Profil public d'un répétiteur (annuaire des parents). */
@Entity
public class Tutor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long accountId;
    private String name;
    private String email;
    private String phone;
    private String whatsapp;
    private String city;
    /** Commune ou quartier (communes d'Abidjan notamment). */
    private String district;
    /** Matières enseignées, séparées par des virgules. */
    @Column(length = 400) private String specialties;
    /** Classes ou cycles accompagnés. */
    @Column(length = 300) private String levels;
    /** Diplôme le plus élevé ou niveau d'études. */
    private String educationLevel;
    @Column(columnDefinition = "integer default 0") private int experienceYears;
    @Column(length = 1500) private String bio;
    /** Tarif indicatif par séance, en F CFA (0 = à discuter). */
    @Column(columnDefinition = "integer default 0") private int hourlyRate;
    /** Cours à domicile, en ligne, ou les deux. */
    private String teachingMode;
    /** PENDING (en attente), APPROVED, REJECTED, SUSPENDED */
    private String status = "PENDING";
    /** Dernier jour de visibilité dans l'annuaire (abonnement trimestriel payé). */
    private LocalDate listedUntil;
    /** Date du dernier paiement validé, utilisée pour mettre en avant les profils récemment boostés. */
    private LocalDateTime boostedAt;
    @Column(columnDefinition = "bigint default 0") private long views;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; } public void setId(Long v) { id = v; }
    public Long getAccountId() { return accountId; } public void setAccountId(Long v) { accountId = v; }
    public String getName() { return name; } public void setName(String v) { name = v; }
    public String getEmail() { return email; } public void setEmail(String v) { email = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getWhatsapp() { return whatsapp; } public void setWhatsapp(String v) { whatsapp = v; }
    public String getCity() { return city; } public void setCity(String v) { city = v; }
    public String getDistrict() { return district; } public void setDistrict(String v) { district = v; }
    public String getSpecialties() { return specialties; } public void setSpecialties(String v) { specialties = v; }
    public String getLevels() { return levels; } public void setLevels(String v) { levels = v; }
    public String getEducationLevel() { return educationLevel; } public void setEducationLevel(String v) { educationLevel = v; }
    public int getExperienceYears() { return experienceYears; } public void setExperienceYears(int v) { experienceYears = v; }
    public String getBio() { return bio; } public void setBio(String v) { bio = v; }
    public int getHourlyRate() { return hourlyRate; } public void setHourlyRate(int v) { hourlyRate = v; }
    public String getTeachingMode() { return teachingMode; } public void setTeachingMode(String v) { teachingMode = v; }
    public String getStatus() { return status; } public void setStatus(String v) { status = v; }
    public LocalDate getListedUntil() { return listedUntil; } public void setListedUntil(LocalDate v) { listedUntil = v; }
    public LocalDateTime getBoostedAt() { return boostedAt; } public void setBoostedAt(LocalDateTime v) { boostedAt = v; }
    public long getViews() { return views; } public void setViews(long v) { views = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }

    /** Visible dans l'annuaire : profil validé et trimestre payé en cours. */
    public boolean isListed() { return "APPROVED".equals(status) && listedUntil != null && !listedUntil.isBefore(LocalDate.now()); }
}
