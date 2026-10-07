package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Message entre un répétiteur et un parent (ou un élève). */
@Entity
@Table(name = "messages", indexes = {@Index(columnList = "toAccountId,readAt"), @Index(columnList = "fromAccountId")})
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    /** Répétiteur concerné par la conversation. */
    private Long tutorId;
    @Column(length = 2000) private String body;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime readAt;

    public Long getId() { return id; }
    public Long getFromAccountId() { return fromAccountId; } public void setFromAccountId(Long v) { fromAccountId = v; }
    public Long getToAccountId() { return toAccountId; } public void setToAccountId(Long v) { toAccountId = v; }
    public Long getTutorId() { return tutorId; } public void setTutorId(Long v) { tutorId = v; }
    public String getBody() { return body; } public void setBody(String v) { body = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public LocalDateTime getReadAt() { return readAt; } public void setReadAt(LocalDateTime v) { readAt = v; }
}
