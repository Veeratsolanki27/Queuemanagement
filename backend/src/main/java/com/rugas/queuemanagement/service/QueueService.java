package com.rugas.queuemanagement.service;

import com.rugas.queuemanagement.dto.QueueDtos;
import com.rugas.queuemanagement.entity.Queue;
import com.rugas.queuemanagement.entity.TokenStatus;
import com.rugas.queuemanagement.entity.User;
import com.rugas.queuemanagement.repository.QueueRepository;
import com.rugas.queuemanagement.repository.TokenRepository;
import com.rugas.queuemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueRepository queueRepository;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Transactional
    public QueueDtos.QueueResponse createQueue(QueueDtos.CreateQueueRequest request, String username) {
        User manager = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String prefix = (request.getPrefix() != null && !request.getPrefix().isBlank())
                ? request.getPrefix().trim().toUpperCase()
                : (request.getName().trim().substring(0, Math.min(3, request.getName().trim().length())).toUpperCase());

        Queue queue = Queue.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .prefix(prefix)
                .currentTokenSequence(0)
                .manager(manager)
                .active(true)
                .build();

        Queue saved = queueRepository.save(queue);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<QueueDtos.QueueResponse> getAllQueues() {
        return queueRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QueueDtos.QueueResponse> getQueuesByManager(String username) {
        User manager = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return queueRepository.findByManagerOrderByCreatedAtDesc(manager).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QueueDtos.QueueResponse getQueueById(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new IllegalArgumentException("Queue not found with id: " + queueId));
        return mapToDto(queue);
    }

    @Transactional
    public void deleteQueue(Long queueId) {
        queueRepository.deleteById(queueId);
    }

    public QueueDtos.QueueResponse mapToDto(Queue queue) {
        QueueDtos.QueueResponse dto = new QueueDtos.QueueResponse();
        dto.setId(queue.getId());
        dto.setName(queue.getName());
        dto.setDescription(queue.getDescription());
        dto.setPrefix(queue.getPrefix());
        dto.setCurrentTokenSequence(queue.getCurrentTokenSequence());
        dto.setManagerId(queue.getManager().getId());
        dto.setManagerName(queue.getManager().getFullName());
        dto.setActive(queue.getActive());
        dto.setCreatedAt(queue.getCreatedAt());

        long waiting = tokenRepository.countByQueueAndStatus(queue, TokenStatus.WAITING);
        long serving = tokenRepository.countByQueueAndStatus(queue, TokenStatus.SERVING);
        long completed = tokenRepository.countByQueueAndStatus(queue, TokenStatus.COMPLETED);
        Double avgSeconds = tokenRepository.getAverageWaitTimeSecondsByQueue(queue);

        dto.setWaitingCount(waiting);
        dto.setServingCount(serving);
        dto.setCompletedCount(completed);
        dto.setAvgWaitMinutes(avgSeconds != null ? Math.round((avgSeconds / 60.0) * 10.0) / 10.0 : 0.0);

        return dto;
    }
}

