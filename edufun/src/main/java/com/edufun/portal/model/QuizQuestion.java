package com.edufun.portal.model;
import jakarta.persistence.*;
@Entity @Table(name="quiz_questions") public class QuizQuestion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long quizId; private String type; private String question; @Column(length=3000) private String options; private String correctAnswer; private Integer points=1; private Integer orderIndex=1;
 public Long getId(){return id;} public Long getQuizId(){return quizId;} public void setQuizId(Long v){quizId=v;} public String getType(){return type;} public void setType(String v){type=v;} public String getQuestion(){return question;} public void setQuestion(String v){question=v;} public String getOptions(){return options;} public void setOptions(String v){options=v;} public String getCorrectAnswer(){return correctAnswer;} public void setCorrectAnswer(String v){correctAnswer=v;} public Integer getPoints(){return points;} public void setPoints(Integer v){points=v;} public Integer getOrderIndex(){return orderIndex;} public void setOrderIndex(Integer v){orderIndex=v;}
}
