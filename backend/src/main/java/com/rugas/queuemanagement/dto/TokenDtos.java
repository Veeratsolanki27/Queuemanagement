package com.rugas.queuemanagement.dto;

import com.rugas.queuemanagement.entity.TokenStatus;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class TokenDtos {

    public static class CreateTokenRequest {
        @NotBlank(message = "Customer name is required")
        private String customerName;

        private String customerPhone;
        private String customerEmail;
        private String serviceNotes;

        public CreateTokenRequest() {
        }

        public CreateTokenRequest(String customerName, String customerPhone, String customerEmail, String serviceNotes) {
            this.customerName = customerName;
            this.customerPhone = customerPhone;
            this.customerEmail = customerEmail;
            this.serviceNotes = serviceNotes;
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
    }

    public static class TokenResponse {
        private Long id;
        private String tokenNumber;
        private String customerName;
        private String customerPhone;
        private String customerEmail;
        private String serviceNotes;
        private Long queueId;
        private String queueName;
        private TokenStatus status;
        private Integer position;
        private LocalDateTime createdAt;
        private LocalDateTime servedAt;
        private LocalDateTime completedAt;
        private LocalDateTime cancelledAt;
        private Long waitTimeSeconds;
        private Long serviceDurationSeconds;

        public TokenResponse() {
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

        public Long getQueueId() {
            return queueId;
        }

        public void setQueueId(Long queueId) {
            this.queueId = queueId;
        }

        public String getQueueName() {
            return queueName;
        }

        public void setQueueName(String queueName) {
            this.queueName = queueName;
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
}
