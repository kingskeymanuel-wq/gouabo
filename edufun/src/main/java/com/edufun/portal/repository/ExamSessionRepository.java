package com.edufun.portal.repository;
import com.edufun.portal.model.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ExamSessionRepository extends JpaRepository<ExamSession,Long> {
}
