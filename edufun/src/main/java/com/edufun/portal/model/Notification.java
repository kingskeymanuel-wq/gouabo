package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Notification affichée dans l'espace de l'utilisateur et, si possible, envoyée par e-mail. */
@Entity
@Table(name = "notifications", indexes = @Index(columnList = "accountId,readAt"))
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    /** Compte destinataire (null pour un e-mail adressé seulement à un parent sans compte). */
    private Long accountId;
    /** VISIT, MESSAGE, PAYMENT, PROGRESS, REPORT, ACCOUNT */
    private String kind;
    private String title;
    @Column(length = 4000) private String body;
    private String link;
    private String emailTo;
    /** NONE (pas d'e-mail), SENT, FAILED, SKIPPED (SMTP non configuré) */
    private String emailStatus = "NONE";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime readAt;

    public Long getId() { return id; }
    public Long getAccountId() { return accountId; } public void setAccountId(Long v) { accountId = v; }
    public String getKind() { return kind; } public void setKind(String v) { kind = v; }
    public String getTitle() { return title; } public void setTitle(String v) { title = v; }
    public String getBody() { return body; } public void setBody(String v) { body = v; }
    public String getLink() { return link; } public void setLink(String v) { link = v; }
    public String getEmailTo() { return emailTo; } public void setEmailTo(String v) { emailTo = v; }
    public String getEmailStatus() { return emailStatus; } public void setEmailStatus(String v) { emailStatus = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public LocalDateTime getReadAt() { return readAt; } public void setReadAt(LocalDateTime v) { readAt = v; }
}
