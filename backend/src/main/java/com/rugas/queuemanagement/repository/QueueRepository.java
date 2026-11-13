package com.rugas.queuemanagement.repository;

import com.rugas.queuemanagement.entity.Queue;
import com.rugas.queuemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Long> {
    List<Queue> findByManagerOrderByCreatedAtDesc(User manager);
    List<Queue> findByActiveTrueOrderByCreatedAtDesc();
}

