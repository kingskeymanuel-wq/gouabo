package com.edufun.portal.model;
import jakarta.persistence.*;
@Entity @Table(name="quizzes") public class Quiz {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String title; private String level; private String subject; private String lessonId; private Integer passingScore=50; private boolean published=true;
 public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getLevel(){return level;} public void setLevel(String v){level=v;} public String getSubject(){return subject;} public void setSubject(String v){subject=v;} public String getLessonId(){return lessonId;} public void setLessonId(String v){lessonId=v;} public Integer getPassingScore(){return passingScore;} public void setPassingScore(Integer v){passingScore=v;} public boolean isPublished(){return published;} public void setPublished(boolean v){published=v;}
}
