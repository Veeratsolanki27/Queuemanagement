package com.rugas.queuemanagement.service;

import com.rugas.queuemanagement.dto.AnalyticsDto;
import com.rugas.queuemanagement.entity.Queue;
import com.rugas.queuemanagement.entity.Token;
import com.rugas.queuemanagement.entity.TokenStatus;
import com.rugas.queuemanagement.repository.QueueRepository;
import com.rugas.queuemanagement.repository.TokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TokenRepository tokenRepository;
    private final QueueRepository queueRepository;

    public AnalyticsService(TokenRepository tokenRepository, QueueRepository queueRepository) {
        this.tokenRepository = tokenRepository;
        this.queueRepository = queueRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsDto getAnalyticsDashboard() {
        long totalTokens = tokenRepository.count();
        long totalWaiting = tokenRepository.countByStatus(TokenStatus.WAITING);
        long totalServing = tokenRepository.countByStatus(TokenStatus.SERVING);
        long totalCompleted = tokenRepository.countByStatus(TokenStatus.COMPLETED);
        long totalCancelled = tokenRepository.countByStatus(TokenStatus.CANCELLED);

        Double avgWaitSec = tokenRepository.getAverageWaitTimeSecondsGlobal();
        Double avgServSec = tokenRepository.getAverageServiceDurationSecondsGlobal();

        double avgWaitMin = avgWaitSec != null ? Math.round((avgWaitSec / 60.0) * 10.0) / 10.0 : 0.0;
        double avgServMin = avgServSec != null ? Math.round((avgServSec / 60.0) * 10.0) / 10.0 : 0.0;

        List<Queue> queues = queueRepository.findAll();
        List<AnalyticsDto.QueueMetric> queueMetrics = new ArrayList<>();

        for (Queue q : queues) {
            long waiting = tokenRepository.countByQueueAndStatus(q, TokenStatus.WAITING);
            long serving = tokenRepository.countByQueueAndStatus(q, TokenStatus.SERVING);
            long completed = tokenRepository.countByQueueAndStatus(q, TokenStatus.COMPLETED);
            long cancelled = tokenRepository.countByQueueAndStatus(q, TokenStatus.CANCELLED);

            Double qWaitSec = tokenRepository.getAverageWaitTimeSecondsByQueue(q);
            Double qServSec = tokenRepository.getAverageServiceDurationSecondsByQueue(q);

            queueMetrics.add(AnalyticsDto.QueueMetric.builder()
                    .queueId(q.getId())
                    .queueName(q.getName())
                    .waitingCount(waiting)
                    .servingCount(serving)
                    .completedCount(completed)
                    .cancelledCount(cancelled)
                    .averageWaitMinutes(qWaitSec != null ? Math.round((qWaitSec / 60.0) * 10.0) / 10.0 : 0.0)
                    .averageServiceMinutes(qServSec != null ? Math.round((qServSec / 60.0) * 10.0) / 10.0 : 0.0)
                    .build());
        }

        // Hourly trends (last 24 hours)
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);
        List<Token> recentTokens = tokenRepository.findTokensSince(last24h);

        Map<Integer, List<Token>> byHour = recentTokens.stream()
                .collect(Collectors.groupingBy(t -> t.getCreatedAt().getHour()));

        List<AnalyticsDto.HourlyTrend> hourlyTrends = new ArrayList<>();
        int currentHour = LocalDateTime.now().getHour();
        for (int i = 11; i >= 0; i--) {
            int h = (currentHour - i + 24) % 24;
            String hourLabel = String.format("%02d:00", h);
            List<Token> tokensInHour = byHour.getOrDefault(h, Collections.emptyList());
            long count = tokensInHour.size();

            double waitMin = tokensInHour.stream()
                    .filter(t -> t.getWaitTimeSeconds() != null)
                    .mapToLong(Token::getWaitTimeSeconds)
                    .average()
                    .orElse(0.0) / 60.0;

            hourlyTrends.add(AnalyticsDto.HourlyTrend.builder()
                    .hourLabel(hourLabel)
                    .tokenCount(count)
                    .averageWaitMinutes(Math.round(waitMin * 10.0) / 10.0)
                    .build());
        }

        // Daily trends (last 7 days)
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        List<Token> tokensLast7 = tokenRepository.findTokensSince(last7Days);

        DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMM dd");
        Map<String, List<Token>> byDate = tokensLast7.stream()
                .collect(Collectors.groupingBy(t -> t.getCreatedAt().format(dateFmt)));

        List<AnalyticsDto.DailyTrend> dailyTrends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            String dateLabel = d.format(dateFmt);
            List<Token> tokensOnDay = byDate.getOrDefault(dateLabel, Collections.emptyList());

            long totalDay = tokensOnDay.size();
            long completedDay = tokensOnDay.stream().filter(t -> t.getStatus() == TokenStatus.COMPLETED).count();

            double dayWaitMin = tokensOnDay.stream()
                    .filter(t -> t.getWaitTimeSeconds() != null)
                    .mapToLong(Token::getWaitTimeSeconds)
                    .average()
                    .orElse(0.0) / 60.0;

            dailyTrends.add(AnalyticsDto.DailyTrend.builder()
                    .date(dateLabel)
                    .totalTokens(totalDay)
                    .completedTokens(completedDay)
                    .averageWaitMinutes(Math.round(dayWaitMin * 10.0) / 10.0)
                    .build());
        }

        Map<String, Long> statusDist = new LinkedHashMap<>();
        statusDist.put("WAITING", totalWaiting);
        statusDist.put("SERVING", totalServing);
        statusDist.put("COMPLETED", totalCompleted);
        statusDist.put("CANCELLED", totalCancelled);

        return AnalyticsDto.builder()
                .totalTokens(totalTokens)
                .totalWaiting(totalWaiting)
                .totalServing(totalServing)
                .totalCompleted(totalCompleted)
                .totalCancelled(totalCancelled)
                .averageWaitMinutes(avgWaitMin)
                .averageServiceMinutes(avgServMin)
                .queueMetrics(queueMetrics)
                .hourlyTrends(hourlyTrends)
                .dailyTrends(dailyTrends)
                .statusDistribution(statusDist)
                .build();
    }
}
