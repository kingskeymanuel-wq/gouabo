package com.edufun.portal.repository;

import com.edufun.portal.model.CrmNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrmNoteRepository extends JpaRepository<CrmNote, Long> {
    List<CrmNote> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, Long targetId);
}
