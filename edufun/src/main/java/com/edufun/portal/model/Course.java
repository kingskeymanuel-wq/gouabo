package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String level;
    private String subject;
    private String type;
    private String status = "DRAFT";
    private String coverImage;

    @Column(length = 500)
    private String description;

    private String duration;
    private String difficulty;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String content;

    public Course() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
