package com.edufun.portal.repository;

import com.edufun.portal.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Payment> findAllByOrderByCreatedAtDesc();
    boolean existsByReferenceIgnoreCaseAndStatusNot(String reference, String status);
    long countByStudentIdAndStatus(Long studentId, String status);
}
