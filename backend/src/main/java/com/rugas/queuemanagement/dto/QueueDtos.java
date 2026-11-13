package com.rugas.queuemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class QueueDtos {

    @Data
    public static class CreateQueueRequest {
        @NotBlank(message = "Queue name is required")
        private String name;

        private String description;

        private String prefix; // Defaults to first letter or "Q"
    }

    @Data
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
    }
}

