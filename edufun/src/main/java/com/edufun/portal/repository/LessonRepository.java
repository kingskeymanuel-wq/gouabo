package com.edufun.portal.repository;
import com.edufun.portal.model.Lesson; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface LessonRepository extends JpaRepository<Lesson,Long>{ List<Lesson> findByLevelOrderByOrderIndexAsc(String level); List<Lesson> findByLevelAndSubjectOrderByOrderIndexAsc(String level,String subject); long countByLevel(String level); }
