package com.edufun.portal.repository;
import com.edufun.portal.model.LessonProgress; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface LessonProgressRepository extends JpaRepository<LessonProgress,Long>{ Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId,Long lessonId); List<LessonProgress> findByStudentId(Long studentId); long countByStudentIdAndCompletedTrue(Long studentId); }
