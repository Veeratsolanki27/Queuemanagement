package com.rugas.queuemanagement.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsDto {
    private long totalTokens;
    private long totalWaiting;
    private long totalServing;
    private long totalCompleted;
    private long totalCancelled;

    private double averageWaitMinutes;
    private double averageServiceMinutes;

    private List<QueueMetric> queueMetrics;
    private List<HourlyTrend> hourlyTrends;
    private List<DailyTrend> dailyTrends;
    private Map<String, Long> statusDistribution;

    @Data
    @Builder
    public static class QueueMetric {
        private Long queueId;
        private String queueName;
        private long waitingCount;
        private long servingCount;
        private long completedCount;
        private long cancelledCount;
        private double averageWaitMinutes;
        private double averageServiceMinutes;
    }

    @Data
    @Builder
    public static class HourlyTrend {
        private String hourLabel;
        private long tokenCount;
        private double averageWaitMinutes;
    }

    @Data
    @Builder
    public static class DailyTrend {
        private String date;
        private long totalTokens;
        private long completedTokens;
        private double averageWaitMinutes;
    }
}

