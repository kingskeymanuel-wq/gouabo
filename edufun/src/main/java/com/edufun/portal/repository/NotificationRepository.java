package com.edufun.portal.repository;

import com.edufun.portal.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop50ByAccountIdOrderByCreatedAtDesc(Long accountId);
    long countByAccountIdAndReadAtIsNull(Long accountId);
    List<Notification> findTop200ByOrderByCreatedAtDesc();
}
