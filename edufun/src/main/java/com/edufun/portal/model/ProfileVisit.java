package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Visite d'une fiche de répétiteur par un parent ou un élève connecté. */
@Entity
@Table(name = "profile_visits", indexes = @Index(columnList = "tutorId,visitedAt"))
public class ProfileVisit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long tutorId;
    private Long visitorAccountId;
    private LocalDateTime visitedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Long getTutorId() { return tutorId; } public void setTutorId(Long v) { tutorId = v; }
    public Long getVisitorAccountId() { return visitorAccountId; } public void setVisitorAccountId(Long v) { visitorAccountId = v; }
    public LocalDateTime getVisitedAt() { return visitedAt; } public void setVisitedAt(LocalDateTime v) { visitedAt = v; }
}
