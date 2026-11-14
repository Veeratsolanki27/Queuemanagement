package com.rugas.queuemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class QueueDtos {

    public static class CreateQueueRequest {
        @NotBlank(message = "Queue name is required")
        private String name;

        private String description;

        private String prefix;

        public CreateQueueRequest() {
        }

        public CreateQueueRequest(String name, String description, String prefix) {
            this.name = name;
            this.description = description;
            this.prefix = prefix;
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
    }

    public static class QueueResponse {
        private Long id;
        private String name;
        private String description;
        private String prefix;
        private Integer currentTokenSequence;
        private Long managerId;
        private String managerName;
        private Boolean active;
        private LocalDateTime createdAt;
        private long waitingCount;
        private long servingCount;
        private long completedCount;
        private Double avgWaitMinutes;

        public QueueResponse() {
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

        public Long getManagerId() {
            return managerId;
        }

        public void setManagerId(Long managerId) {
            this.managerId = managerId;
        }

        public String getManagerName() {
            return managerName;
        }

        public void setManagerName(String managerName) {
            this.managerName = managerName;
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

        public long getWaitingCount() {
            return waitingCount;
        }

        public void setWaitingCount(long waitingCount) {
            this.waitingCount = waitingCount;
        }

        public long getServingCount() {
            return servingCount;
        }

        public void setServingCount(long servingCount) {
            this.servingCount = servingCount;
        }

        public long getCompletedCount() {
            return completedCount;
        }

        public void setCompletedCount(long completedCount) {
            this.completedCount = completedCount;
        }

        public Double getAvgWaitMinutes() {
            return avgWaitMinutes;
        }

        public void setAvgWaitMinutes(Double avgWaitMinutes) {
            this.avgWaitMinutes = avgWaitMinutes;
        }
    }
}
