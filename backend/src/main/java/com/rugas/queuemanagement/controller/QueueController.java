package com.rugas.queuemanagement.controller;

import com.rugas.queuemanagement.dto.QueueDtos;
import com.rugas.queuemanagement.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/queues")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @PostMapping
    public ResponseEntity<QueueDtos.QueueResponse> createQueue(
            @Valid @RequestBody QueueDtos.CreateQueueRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(queueService.createQueue(request, username));
    }

    @GetMapping
    public ResponseEntity<List<QueueDtos.QueueResponse>> getAllQueues() {
        return ResponseEntity.ok(queueService.getAllQueues());
    }

    @GetMapping("/my")
    public ResponseEntity<List<QueueDtos.QueueResponse>> getMyQueues(Authentication authentication) {
        return ResponseEntity.ok(queueService.getQueuesByManager(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QueueDtos.QueueResponse> getQueueById(@PathVariable Long id) {
        return ResponseEntity.ok(queueService.getQueueById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQueue(@PathVariable Long id) {
        queueService.deleteQueue(id);
        return ResponseEntity.noContent().build();
    }
}

