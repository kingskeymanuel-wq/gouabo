package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Note interne de l'administration sur un client (élève, parent ou répétiteur). */
@Entity
@Table(name = "crm_notes", indexes = @Index(columnList = "targetType,targetId"))
public class CrmNote {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    /** STUDENT, PARENT, TUTOR */
    private String targetType;
    private Long targetId;
    @Column(length = 2000) private String body;
    private String author;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getTargetType() { return targetType; } public void setTargetType(String v) { targetType = v; }
    public Long getTargetId() { return targetId; } public void setTargetId(Long v) { targetId = v; }
    public String getBody() { return body; } public void setBody(String v) { body = v; }
    public String getAuthor() { return author; } public void setAuthor(String v) { author = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }
}
