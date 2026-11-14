package com.rugas.queuemanagement.controller;

import com.rugas.queuemanagement.dto.AnalyticsDto;
import com.rugas.queuemanagement.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDto> getDashboard() {
        return ResponseEntity.ok(analyticsService.getAnalyticsDashboard());
    }
}

