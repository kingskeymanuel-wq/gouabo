package com.edufun.portal.repository;

import com.edufun.portal.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("select m from Message m where m.fromAccountId = ?1 or m.toAccountId = ?1 order by m.createdAt desc")
    List<Message> findAllFor(Long accountId);
    @Query("select m from Message m where (m.fromAccountId = ?1 and m.toAccountId = ?2) or (m.fromAccountId = ?2 and m.toAccountId = ?1) order by m.createdAt asc")
    List<Message> findThread(Long a, Long b);
    long countByToAccountIdAndReadAtIsNull(Long accountId);
    boolean existsByFromAccountIdAndToAccountId(Long from, Long to);
}
