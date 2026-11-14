package com.rugas.queuemanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queues")
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 20)
    private String prefix; // e.g., "A", "REG", "DOC"

    @Column(nullable = false)
    private Integer currentTokenSequence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    public Queue() {
    }

    public Queue(Long id, String name, String description, String prefix, Integer currentTokenSequence, User manager, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.prefix = prefix;
        this.currentTokenSequence = currentTokenSequence;
        this.manager = manager;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static QueueBuilder builder() {
        return new QueueBuilder();
    }

    public static class QueueBuilder {
        private Long id;
        private String name;
        private String description;
        private String prefix;
        private Integer currentTokenSequence;
        private User manager;
        private Boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public QueueBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public QueueBuilder name(String name) {
            this.name = name;
            return this;
        }

        public QueueBuilder description(String description) {
            this.description = description;
            return this;
        }

        public QueueBuilder prefix(String prefix) {
            this.prefix = prefix;
            return this;
        }

        public QueueBuilder currentTokenSequence(Integer currentTokenSequence) {
            this.currentTokenSequence = currentTokenSequence;
            return this;
        }

        public QueueBuilder manager(User manager) {
            this.manager = manager;
            return this;
        }

        public QueueBuilder active(Boolean active) {
            this.active = active;
            return this;
        }

        public QueueBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public QueueBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Queue build() {
            return new Queue(id, name, description, prefix, currentTokenSequence, manager, active, createdAt, updatedAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.currentTokenSequence == null) {
            this.currentTokenSequence = 0;
        }
        if (this.active == null) {
            this.active = true;
        }
        if (this.prefix == null || this.prefix.isBlank()) {
            this.prefix = "Q";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public Integer getCurrentTokenSequence() {
        return currentTokenSequence;
    }

    public void setCurrentTokenSequence(Integer currentTokenSequence) {
        this.currentTokenSequence = currentTokenSequence;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
