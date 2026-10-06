package com.edufun.portal.repository;
import com.edufun.portal.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BadgeRepository extends JpaRepository<Badge,Long> {
}
