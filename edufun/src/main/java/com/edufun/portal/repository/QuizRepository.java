package com.edufun.portal.repository;
import com.edufun.portal.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface QuizRepository extends JpaRepository<Quiz,Long> {
}
