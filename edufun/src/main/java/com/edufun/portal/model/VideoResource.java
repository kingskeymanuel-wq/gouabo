package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
public class VideoResource {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long lessonId; private String title; private String url; private String type="YOUTUBE"; private String thumbnail; private boolean published=true;
 /** PRESENTER : professeur filmé + motion design ; KIDS : vidéo ludique pour le primaire. */
 private String style="PRESENTER";
 /** Professeur ou personnage qui présente la vidéo (sa propre voix). */
 private String presenter;
 /** Instants (en secondes, séparés par des virgules) où la vidéo s'arrête pour poser la question « Je vérifie » suivante. */
 @Column(length=300) private String checkpoints;
 public VideoResource(){}
 public Long getId(){return id;} public void setId(Long v){id=v;} public Long getLessonId(){return lessonId;} public void setLessonId(Long v){lessonId=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getUrl(){return url;} public void setUrl(String v){url=v;}
 public String getType(){return type;} public void setType(String v){type=v;} public String getThumbnail(){return thumbnail;} public void setThumbnail(String v){thumbnail=v;}
 public boolean isPublished(){return published;} public void setPublished(boolean v){published=v;}
 public String getStyle(){return style;} public void setStyle(String v){style=v;}
 public String getPresenter(){return presenter;} public void setPresenter(String v){presenter=v;}
 public String getCheckpoints(){return checkpoints;} public void setCheckpoints(String v){checkpoints=v;}
}
