package com.edufun.portal.repository;

import com.edufun.portal.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TutorRepository extends JpaRepository<Tutor, Long> {
    Optional<Tutor> findByAccountId(Long accountId);
}
