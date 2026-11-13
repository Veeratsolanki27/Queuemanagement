package com.rugas.queuemanagement.repository;

import com.rugas.queuemanagement.entity.Queue;
import com.rugas.queuemanagement.entity.Token;
import com.rugas.queuemanagement.entity.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findByQueueAndStatusOrderByPositionAsc(Queue queue, TokenStatus status);

    List<Token> findByQueueOrderByCreatedAtDesc(Queue queue);

    Optional<Token> findFirstByQueueAndStatusOrderByPositionAsc(Queue queue, TokenStatus status);

    long countByQueueAndStatus(Queue queue, TokenStatus status);

    long countByStatus(TokenStatus status);

    @Query("SELECT AVG(t.waitTimeSeconds) FROM Token t WHERE t.status = 'COMPLETED' OR t.status = 'SERVING'")
    Double getAverageWaitTimeSecondsGlobal();

    @Query("SELECT AVG(t.waitTimeSeconds) FROM Token t WHERE t.queue = :queue AND (t.status = 'COMPLETED' OR t.status = 'SERVING')")
    Double getAverageWaitTimeSecondsByQueue(@Param("queue") Queue queue);

    @Query("SELECT AVG(t.serviceDurationSeconds) FROM Token t WHERE t.status = 'COMPLETED'")
    Double getAverageServiceDurationSecondsGlobal();

    @Query("SELECT AVG(t.serviceDurationSeconds) FROM Token t WHERE t.queue = :queue AND t.status = 'COMPLETED'")
    Double getAverageServiceDurationSecondsByQueue(@Param("queue") Queue queue);

    @Query("SELECT t FROM Token t WHERE t.createdAt >= :startDate ORDER BY t.createdAt ASC")
    List<Token> findTokensSince(@Param("startDate") LocalDateTime startDate);
}

