package com.edufun.portal.model;

import jakarta.persistence.*;

@Entity
public class VideoResource {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long lessonId; private String title; private String url; private String type="YOUTUBE"; private String thumbnail; private boolean published=true;
 public VideoResource(){}
 public Long getId(){return id;} public void setId(Long v){id=v;} public Long getLessonId(){return lessonId;} public void setLessonId(Long v){lessonId=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getUrl(){return url;} public void setUrl(String v){url=v;}
 public String getType(){return type;} public void setType(String v){type=v;} public String getThumbnail(){return thumbnail;} public void setThumbnail(String v){thumbnail=v;}
 public boolean isPublished(){return published;} public void setPublished(boolean v){published=v;}
}
