package com.edufun.portal.repository;
import com.edufun.portal.model.VideoResource; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface VideoResourceRepository extends JpaRepository<VideoResource,Long>{ List<VideoResource> findByLessonIdAndPublishedTrue(Long lessonId); List<VideoResource> findByLessonId(Long lessonId); void deleteByLessonIdIn(java.util.Collection<Long> lessonIds); }
