package com.edufun.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"studentId","lessonId"}))
public class LessonProgress {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long studentId; private Long lessonId; private int percent; private int xpEarned; private boolean completed; private LocalDateTime updatedAt=LocalDateTime.now();
 public LessonProgress(){}
 public Long getId(){return id;} public void setId(Long v){id=v;} public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
 public Long getLessonId(){return lessonId;} public void setLessonId(Long v){lessonId=v;} public int getPercent(){return percent;} public void setPercent(int v){percent=v;}
 public int getXpEarned(){return xpEarned;} public void setXpEarned(int v){xpEarned=v;} public boolean isCompleted(){return completed;} public void setCompleted(boolean v){completed=v;}
 public LocalDateTime getUpdatedAt(){return updatedAt;} public void setUpdatedAt(LocalDateTime v){updatedAt=v;}
}
