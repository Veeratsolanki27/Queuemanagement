package com.rugas.queuemanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
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

    @Column
    private Long waitTimeSeconds;

    @Column
    private Long serviceDurationSeconds;

    public Token() {
    }

    public Token(Long id, String tokenNumber, String customerName, String customerPhone, String customerEmail, String serviceNotes, Queue queue, TokenStatus status, Integer position, LocalDateTime createdAt, LocalDateTime servedAt, LocalDateTime completedAt, LocalDateTime cancelledAt, Long waitTimeSeconds, Long serviceDurationSeconds) {
        this.id = id;
        this.tokenNumber = tokenNumber;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.serviceNotes = serviceNotes;
        this.queue = queue;
        this.status = status;
        this.position = position;
        this.createdAt = createdAt;
        this.servedAt = servedAt;
        this.completedAt = completedAt;
        this.cancelledAt = cancelledAt;
        this.waitTimeSeconds = waitTimeSeconds;
        this.serviceDurationSeconds = serviceDurationSeconds;
    }

    public static TokenBuilder builder() {
        return new TokenBuilder();
    }

    public static class TokenBuilder {
        private Long id;
        private String tokenNumber;
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private String serviceNotes;
        private Queue queue;
        private TokenStatus status;
        private Integer position;
        private LocalDateTime createdAt;
        private LocalDateTime servedAt;
        private LocalDateTime completedAt;
        private LocalDateTime cancelledAt;
        private Long waitTimeSeconds;
        private Long serviceDurationSeconds;

        public TokenBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TokenBuilder tokenNumber(String tokenNumber) {
            this.tokenNumber = tokenNumber;
            return this;
        }

        public TokenBuilder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public TokenBuilder customerPhone(String customerPhone) {
            this.customerPhone = customerPhone;
            return this;
        }

        public TokenBuilder customerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
            return this;
        }

        public TokenBuilder serviceNotes(String serviceNotes) {
            this.serviceNotes = serviceNotes;
            return this;
        }

        public TokenBuilder queue(Queue queue) {
            this.queue = queue;
            return this;
        }

        public TokenBuilder status(TokenStatus status) {
            this.status = status;
            return this;
        }

        public TokenBuilder position(Integer position) {
            this.position = position;
            return this;
        }

        public TokenBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TokenBuilder servedAt(LocalDateTime servedAt) {
            this.servedAt = servedAt;
            return this;
        }

        public TokenBuilder completedAt(LocalDateTime completedAt) {
            this.completedAt = completedAt;
            return this;
        }

        public TokenBuilder cancelledAt(LocalDateTime cancelledAt) {
            this.cancelledAt = cancelledAt;
            return this;
        }

        public TokenBuilder waitTimeSeconds(Long waitTimeSeconds) {
            this.waitTimeSeconds = waitTimeSeconds;
            return this;
        }

        public TokenBuilder serviceDurationSeconds(Long serviceDurationSeconds) {
            this.serviceDurationSeconds = serviceDurationSeconds;
            return this;
        }

        public Token build() {
            return new Token(id, tokenNumber, customerName, customerPhone, customerEmail, serviceNotes, queue, status, position, createdAt, servedAt, completedAt, cancelledAt, waitTimeSeconds, serviceDurationSeconds);
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TokenStatus.WAITING;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getServiceNotes() {
        return serviceNotes;
    }

    public void setServiceNotes(String serviceNotes) {
        this.serviceNotes = serviceNotes;
    }

    public Queue getQueue() {
        return queue;
    }

    public void setQueue(Queue queue) {
        this.queue = queue;
    }

    public TokenStatus getStatus() {
        return status;
    }

    public void setStatus(TokenStatus status) {
        this.status = status;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getServedAt() {
        return servedAt;
    }

    public void setServedAt(LocalDateTime servedAt) {
        this.servedAt = servedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public Long getWaitTimeSeconds() {
        return waitTimeSeconds;
    }

    public void setWaitTimeSeconds(Long waitTimeSeconds) {
        this.waitTimeSeconds = waitTimeSeconds;
    }

    public Long getServiceDurationSeconds() {
        return serviceDurationSeconds;
    }

    public void setServiceDurationSeconds(Long serviceDurationSeconds) {
        this.serviceDurationSeconds = serviceDurationSeconds;
    }
}
