package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
@Table(indexes={@Index(name="idx_lesson_level_subject", columnList="level,subject")})
public class Lesson {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String level; private String subject; private String chapter; private String title;
 private int orderIndex; private String status="PUBLISHED"; private String duration="20 min";
 @Column(length=500) private String objective;
 @Lob @Column(columnDefinition="CLOB") private String content;
 public Lesson(){}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getLevel(){return level;} public void setLevel(String v){level=v;}
 public String getSubject(){return subject;} public void setSubject(String v){subject=v;}
 public String getChapter(){return chapter;} public void setChapter(String v){chapter=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public int getOrderIndex(){return orderIndex;} public void setOrderIndex(int v){orderIndex=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getDuration(){return duration;} public void setDuration(String v){duration=v;}
 public String getObjective(){return objective;} public void setObjective(String v){objective=v;}
 public String getContent(){return content;} public void setContent(String v){content=v;}
}
