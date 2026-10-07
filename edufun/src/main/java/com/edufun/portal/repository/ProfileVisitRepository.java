package com.edufun.portal.repository;

import com.edufun.portal.model.ProfileVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ProfileVisitRepository extends JpaRepository<ProfileVisit, Long> {
    List<ProfileVisit> findByTutorIdOrderByVisitedAtDesc(Long tutorId);
    boolean existsByTutorIdAndVisitorAccountIdAndVisitedAtAfter(Long tutorId, Long visitorAccountId, LocalDateTime after);
    boolean existsByTutorIdAndVisitorAccountId(Long tutorId, Long visitorAccountId);
    long countByTutorIdAndVisitedAtAfter(Long tutorId, LocalDateTime after);
    List<ProfileVisit> findByVisitorAccountIdOrderByVisitedAtDesc(Long visitorAccountId);
}
