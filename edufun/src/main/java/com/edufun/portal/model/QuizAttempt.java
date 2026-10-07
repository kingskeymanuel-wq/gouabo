package com.edufun.portal.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="quiz_attempts") public class QuizAttempt {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; private Long quizId; private Long studentId; private Integer score=0; private Integer total=0; private boolean passed; private LocalDateTime attemptedAt=LocalDateTime.now();
 public Long getId(){return id;} public Long getQuizId(){return quizId;} public void setQuizId(Long v){quizId=v;} public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;} public Integer getScore(){return score;} public void setScore(Integer v){score=v;} public Integer getTotal(){return total;} public void setTotal(Integer v){total=v;} public boolean isPassed(){return passed;} public void setPassed(boolean v){passed=v;} public LocalDateTime getAttemptedAt(){return attemptedAt;} public void setAttemptedAt(LocalDateTime v){attemptedAt=v;}
}
