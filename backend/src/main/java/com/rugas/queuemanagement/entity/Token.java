package com.rugas.queuemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String tokenNumber; // e.g. "A-001"

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(length = 20)
    private String customerPhone;

    @Column(length = 255)
    private String customerEmail;

    @Column(length = 500)
    private String serviceNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_id", nullable = false)
    private Queue queue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TokenStatus status;

    /**
     * Position priority among WAITING tokens in this queue.
     * Lowest number is top of queue (e.g. 1 is next in line).
     * Set to null when no longer WAITING.
     */
    @Column(name = "queue_position")
    private Integer position;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime servedAt;

    @Column
    private LocalDateTime completedAt;

    @Column
    private LocalDateTime cancelledAt;

    /**
     * Wait time in seconds from creation to start of service.
     */
    @Column
    private Long waitTimeSeconds;

    /**
     * Service time in seconds from serving to completion.
     */
    @Column
    private Long serviceDurationSeconds;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TokenStatus.WAITING;
        }
    }
}

