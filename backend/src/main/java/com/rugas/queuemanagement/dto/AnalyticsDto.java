package com.rugas.queuemanagement.dto;

import java.util.List;
import java.util.Map;

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

    public AnalyticsDto() {
    }

    public AnalyticsDto(long totalTokens, long totalWaiting, long totalServing, long totalCompleted, long totalCancelled, double averageWaitMinutes, double averageServiceMinutes, List<QueueMetric> queueMetrics, List<HourlyTrend> hourlyTrends, List<DailyTrend> dailyTrends, Map<String, Long> statusDistribution) {
        this.totalTokens = totalTokens;
        this.totalWaiting = totalWaiting;
        this.totalServing = totalServing;
        this.totalCompleted = totalCompleted;
        this.totalCancelled = totalCancelled;
        this.averageWaitMinutes = averageWaitMinutes;
        this.averageServiceMinutes = averageServiceMinutes;
        this.queueMetrics = queueMetrics;
        this.hourlyTrends = hourlyTrends;
        this.dailyTrends = dailyTrends;
        this.statusDistribution = statusDistribution;
    }

    public static AnalyticsDtoBuilder builder() {
        return new AnalyticsDtoBuilder();
    }

    public static class AnalyticsDtoBuilder {
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

        public AnalyticsDtoBuilder totalTokens(long totalTokens) {
            this.totalTokens = totalTokens;
            return this;
        }

        public AnalyticsDtoBuilder totalWaiting(long totalWaiting) {
            this.totalWaiting = totalWaiting;
            return this;
        }

        public AnalyticsDtoBuilder totalServing(long totalServing) {
            this.totalServing = totalServing;
            return this;
        }

        public AnalyticsDtoBuilder totalCompleted(long totalCompleted) {
            this.totalCompleted = totalCompleted;
            return this;
        }

        public AnalyticsDtoBuilder totalCancelled(long totalCancelled) {
            this.totalCancelled = totalCancelled;
            return this;
        }

        public AnalyticsDtoBuilder averageWaitMinutes(double averageWaitMinutes) {
            this.averageWaitMinutes = averageWaitMinutes;
            return this;
        }

        public AnalyticsDtoBuilder averageServiceMinutes(double averageServiceMinutes) {
            this.averageServiceMinutes = averageServiceMinutes;
            return this;
        }

        public AnalyticsDtoBuilder queueMetrics(List<QueueMetric> queueMetrics) {
            this.queueMetrics = queueMetrics;
            return this;
        }

        public AnalyticsDtoBuilder hourlyTrends(List<HourlyTrend> hourlyTrends) {
            this.hourlyTrends = hourlyTrends;
            return this;
        }

        public AnalyticsDtoBuilder dailyTrends(List<DailyTrend> dailyTrends) {
            this.dailyTrends = dailyTrends;
            return this;
        }

        public AnalyticsDtoBuilder statusDistribution(Map<String, Long> statusDistribution) {
            this.statusDistribution = statusDistribution;
            return this;
        }

        public AnalyticsDto build() {
            return new AnalyticsDto(totalTokens, totalWaiting, totalServing, totalCompleted, totalCancelled, averageWaitMinutes, averageServiceMinutes, queueMetrics, hourlyTrends, dailyTrends, statusDistribution);
        }
    }

    public static class QueueMetric {
        private Long queueId;
        private String queueName;
        private long waitingCount;
        private long servingCount;
        private long completedCount;
        private long cancelledCount;
        private double averageWaitMinutes;
        private double averageServiceMinutes;

        public QueueMetric() {
        }

        public QueueMetric(Long queueId, String queueName, long waitingCount, long servingCount, long completedCount, long cancelledCount, double averageWaitMinutes, double averageServiceMinutes) {
            this.queueId = queueId;
            this.queueName = queueName;
            this.waitingCount = waitingCount;
            this.servingCount = servingCount;
            this.completedCount = completedCount;
            this.cancelledCount = cancelledCount;
            this.averageWaitMinutes = averageWaitMinutes;
            this.averageServiceMinutes = averageServiceMinutes;
        }

        public static QueueMetricBuilder builder() {
            return new QueueMetricBuilder();
        }

        public static class QueueMetricBuilder {
            private Long queueId;
            private String queueName;
            private long waitingCount;
            private long servingCount;
            private long completedCount;
            private long cancelledCount;
            private double averageWaitMinutes;
            private double averageServiceMinutes;

            public QueueMetricBuilder queueId(Long queueId) {
                this.queueId = queueId;
                return this;
            }

            public QueueMetricBuilder queueName(String queueName) {
                this.queueName = queueName;
                return this;
            }

            public QueueMetricBuilder waitingCount(long waitingCount) {
                this.waitingCount = waitingCount;
                return this;
            }

            public QueueMetricBuilder servingCount(long servingCount) {
                this.servingCount = servingCount;
                return this;
            }

            public QueueMetricBuilder completedCount(long completedCount) {
                this.completedCount = completedCount;
                return this;
            }

            public QueueMetricBuilder cancelledCount(long cancelledCount) {
                this.cancelledCount = cancelledCount;
                return this;
            }

            public QueueMetricBuilder averageWaitMinutes(double averageWaitMinutes) {
                this.averageWaitMinutes = averageWaitMinutes;
                return this;
            }

            public QueueMetricBuilder averageServiceMinutes(double averageServiceMinutes) {
                this.averageServiceMinutes = averageServiceMinutes;
                return this;
            }

            public QueueMetric build() {
                return new QueueMetric(queueId, queueName, waitingCount, servingCount, completedCount, cancelledCount, averageWaitMinutes, averageServiceMinutes);
            }
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

        public long getCancelledCount() {
            return cancelledCount;
        }

        public void setCancelledCount(long cancelledCount) {
            this.cancelledCount = cancelledCount;
        }

        public double getAverageWaitMinutes() {
            return averageWaitMinutes;
        }

        public void setAverageWaitMinutes(double averageWaitMinutes) {
            this.averageWaitMinutes = averageWaitMinutes;
        }

        public double getAverageServiceMinutes() {
            return averageServiceMinutes;
        }

        public void setAverageServiceMinutes(double averageServiceMinutes) {
            this.averageServiceMinutes = averageServiceMinutes;
        }
    }

    public static class HourlyTrend {
        private String hourLabel;
        private long tokenCount;
        private double averageWaitMinutes;

        public HourlyTrend() {
        }

        public HourlyTrend(String hourLabel, long tokenCount, double averageWaitMinutes) {
            this.hourLabel = hourLabel;
            this.tokenCount = tokenCount;
            this.averageWaitMinutes = averageWaitMinutes;
        }

        public static HourlyTrendBuilder builder() {
            return new HourlyTrendBuilder();
        }

        public static class HourlyTrendBuilder {
            private String hourLabel;
            private long tokenCount;
            private double averageWaitMinutes;

            public HourlyTrendBuilder hourLabel(String hourLabel) {
                this.hourLabel = hourLabel;
                return this;
            }

            public HourlyTrendBuilder tokenCount(long tokenCount) {
                this.tokenCount = tokenCount;
                return this;
            }

            public HourlyTrendBuilder averageWaitMinutes(double averageWaitMinutes) {
                this.averageWaitMinutes = averageWaitMinutes;
                return this;
            }

            public HourlyTrend build() {
                return new HourlyTrend(hourLabel, tokenCount, averageWaitMinutes);
            }
        }

        public String getHourLabel() {
            return hourLabel;
        }

        public void setHourLabel(String hourLabel) {
            this.hourLabel = hourLabel;
        }

        public long getTokenCount() {
            return tokenCount;
        }

        public void setTokenCount(long tokenCount) {
            this.tokenCount = tokenCount;
        }

        public double getAverageWaitMinutes() {
            return averageWaitMinutes;
        }

        public void setAverageWaitMinutes(double averageWaitMinutes) {
            this.averageWaitMinutes = averageWaitMinutes;
        }
    }

    public static class DailyTrend {
        private String date;
        private long totalTokens;
        private long completedTokens;
        private double averageWaitMinutes;

        public DailyTrend() {
        }

        public DailyTrend(String date, long totalTokens, long completedTokens, double averageWaitMinutes) {
            this.date = date;
            this.totalTokens = totalTokens;
            this.completedTokens = completedTokens;
            this.averageWaitMinutes = averageWaitMinutes;
        }

        public static DailyTrendBuilder builder() {
            return new DailyTrendBuilder();
        }

        public static class DailyTrendBuilder {
            private String date;
            private long totalTokens;
            private long completedTokens;
            private double averageWaitMinutes;

            public DailyTrendBuilder date(String date) {
                this.date = date;
                return this;
            }

            public DailyTrendBuilder totalTokens(long totalTokens) {
                this.totalTokens = totalTokens;
                return this;
            }

            public DailyTrendBuilder completedTokens(long completedTokens) {
                this.completedTokens = completedTokens;
                return this;
            }

            public DailyTrendBuilder averageWaitMinutes(double averageWaitMinutes) {
                this.averageWaitMinutes = averageWaitMinutes;
                return this;
            }

            public DailyTrend build() {
                return new DailyTrend(date, totalTokens, completedTokens, averageWaitMinutes);
            }
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public long getTotalTokens() {
            return totalTokens;
        }

        public void setTotalTokens(long totalTokens) {
            this.totalTokens = totalTokens;
        }

        public long getCompletedTokens() {
            return completedTokens;
        }

        public void setCompletedTokens(long completedTokens) {
            this.completedTokens = completedTokens;
        }

        public double getAverageWaitMinutes() {
            return averageWaitMinutes;
        }

        public void setAverageWaitMinutes(double averageWaitMinutes) {
            this.averageWaitMinutes = averageWaitMinutes;
        }
    }

    public long getTotalTokens() {
        return totalTokens;
    }

    public void setTotalTokens(long totalTokens) {
        this.totalTokens = totalTokens;
    }

    public long getTotalWaiting() {
        return totalWaiting;
    }

    public void setTotalWaiting(long totalWaiting) {
        this.totalWaiting = totalWaiting;
    }

    public long getTotalServing() {
        return totalServing;
    }

    public void setTotalServing(long totalServing) {
        this.totalServing = totalServing;
    }

    public long getTotalCompleted() {
        return totalCompleted;
    }

    public void setTotalCompleted(long totalCompleted) {
        this.totalCompleted = totalCompleted;
    }

    public long getTotalCancelled() {
        return totalCancelled;
    }

    public void setTotalCancelled(long totalCancelled) {
        this.totalCancelled = totalCancelled;
    }

    public double getAverageWaitMinutes() {
        return averageWaitMinutes;
    }

    public void setAverageWaitMinutes(double averageWaitMinutes) {
        this.averageWaitMinutes = averageWaitMinutes;
    }

    public double getAverageServiceMinutes() {
        return averageServiceMinutes;
    }

    public void setAverageServiceMinutes(double averageServiceMinutes) {
        this.averageServiceMinutes = averageServiceMinutes;
    }

    public List<QueueMetric> getQueueMetrics() {
        return queueMetrics;
    }

    public void setQueueMetrics(List<QueueMetric> queueMetrics) {
        this.queueMetrics = queueMetrics;
    }

    public List<HourlyTrend> getHourlyTrends() {
        return hourlyTrends;
    }

    public void setHourlyTrends(List<HourlyTrend> hourlyTrends) {
        this.hourlyTrends = hourlyTrends;
    }

    public List<DailyTrend> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<DailyTrend> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }
}
