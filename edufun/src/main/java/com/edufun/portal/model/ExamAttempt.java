package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ExamAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long examSessionId;
    private LocalDateTime resultPublishedAt;
    private String examType;
    private String level;
    private String subject;
    private int score;
    private int total;
    private int minutes;
    private String status = "PENDING_REVIEW";
    private LocalDateTime createdAt = LocalDateTime.now();

    public ExamAttempt() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public Long getExamSessionId() { return examSessionId; }
    public void setExamSessionId(Long examSessionId) { this.examSessionId = examSessionId; }
    public LocalDateTime getResultPublishedAt() { return resultPublishedAt; }
    public void setResultPublishedAt(LocalDateTime resultPublishedAt) { this.resultPublishedAt = resultPublishedAt; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getMinutes() { return minutes; }
    public void setMinutes(int minutes) { this.minutes = minutes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
