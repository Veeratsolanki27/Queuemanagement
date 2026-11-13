package com.rugas.queuemanagement.dto;

import com.rugas.queuemanagement.entity.TokenStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class TokenDtos {

    @Data
    public static class CreateTokenRequest {
        @NotBlank(message = "Customer name is required")
        private String customerName;

        private String customerPhone;
        private String customerEmail;
        private String serviceNotes;
    }

    @Data
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
    }
}

