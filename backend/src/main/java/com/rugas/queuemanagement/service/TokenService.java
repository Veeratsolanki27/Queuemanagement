package com.rugas.queuemanagement.service;

import com.rugas.queuemanagement.dto.TokenDtos;
import com.rugas.queuemanagement.entity.Queue;
import com.rugas.queuemanagement.entity.Token;
import com.rugas.queuemanagement.entity.TokenStatus;
import com.rugas.queuemanagement.repository.QueueRepository;
import com.rugas.queuemanagement.repository.TokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;
    private final QueueRepository queueRepository;

    public TokenService(TokenRepository tokenRepository, QueueRepository queueRepository) {
        this.tokenRepository = tokenRepository;
        this.queueRepository = queueRepository;
    }

    @Transactional
    public TokenDtos.TokenResponse createToken(Long queueId, TokenDtos.CreateTokenRequest request) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new IllegalArgumentException("Queue not found"));

        int nextSeq = queue.getCurrentTokenSequence() + 1;
        queue.setCurrentTokenSequence(nextSeq);
        queueRepository.save(queue);

        String tokenNumber = String.format("%s-%03d", queue.getPrefix(), nextSeq);

        List<Token> waitingTokens = tokenRepository.findByQueueAndStatusOrderByPositionAsc(queue, TokenStatus.WAITING);
        int newPosition = waitingTokens.isEmpty() ? 1 : waitingTokens.size() + 1;

        Token token = Token.builder()
                .tokenNumber(tokenNumber)
                .customerName(request.getCustomerName().trim())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .serviceNotes(request.getServiceNotes())
                .queue(queue)
                .status(TokenStatus.WAITING)
                .position(newPosition)
                .build();

        Token saved = tokenRepository.save(token);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TokenDtos.TokenResponse> getTokensByQueue(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new IllegalArgumentException("Queue not found"));

        return tokenRepository.findByQueueOrderByCreatedAtDesc(queue).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TokenDtos.TokenResponse> getWaitingTokens(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new IllegalArgumentException("Queue not found"));

        return tokenRepository.findByQueueAndStatusOrderByPositionAsc(queue, TokenStatus.WAITING).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TokenDtos.TokenResponse assignTopTokenForService(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new IllegalArgumentException("Queue not found"));

        List<Token> waitingTokens = tokenRepository.findByQueueAndStatusOrderByPositionAsc(queue, TokenStatus.WAITING);
        if (waitingTokens.isEmpty()) {
            throw new IllegalStateException("No waiting tokens in queue to assign");
        }

        Token topToken = waitingTokens.get(0);
        topToken.setStatus(TokenStatus.SERVING);
        topToken.setPosition(null);
        LocalDateTime now = LocalDateTime.now();
        topToken.setServedAt(now);

        long waitSeconds = Math.max(0, Duration.between(topToken.getCreatedAt(), now).getSeconds());
        topToken.setWaitTimeSeconds(waitSeconds);

        tokenRepository.save(topToken);

        // Re-index remaining waiting tokens
        for (int i = 1; i < waitingTokens.size(); i++) {
            Token t = waitingTokens.get(i);
            t.setPosition(i);
            tokenRepository.save(t);
        }

        return mapToDto(topToken);
    }

    @Transactional
    public TokenDtos.TokenResponse completeService(Long tokenId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));

        if (token.getStatus() != TokenStatus.SERVING) {
            throw new IllegalStateException("Only serving tokens can be marked completed");
        }

        LocalDateTime now = LocalDateTime.now();
        token.setStatus(TokenStatus.COMPLETED);
        token.setCompletedAt(now);

        if (token.getServedAt() != null) {
            long serviceSecs = Math.max(0, Duration.between(token.getServedAt(), now).getSeconds());
            token.setServiceDurationSeconds(serviceSecs);
        }

        return mapToDto(tokenRepository.save(token));
    }

    @Transactional
    public TokenDtos.TokenResponse cancelToken(Long tokenId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));

        Queue queue = token.getQueue();
        boolean wasWaiting = (token.getStatus() == TokenStatus.WAITING);

        token.setStatus(TokenStatus.CANCELLED);
        token.setPosition(null);
        token.setCancelledAt(LocalDateTime.now());
        tokenRepository.save(token);

        if (wasWaiting) {
            rebalanceQueuePositions(queue);
        }

        return mapToDto(token);
    }

    @Transactional
    public List<TokenDtos.TokenResponse> moveToken(Long tokenId, String direction) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));

        if (token.getStatus() != TokenStatus.WAITING) {
            throw new IllegalStateException("Only waiting tokens can be moved");
        }

        Queue queue = token.getQueue();
        List<Token> waiting = tokenRepository.findByQueueAndStatusOrderByPositionAsc(queue, TokenStatus.WAITING);

        int currentIndex = -1;
        for (int i = 0; i < waiting.size(); i++) {
            if (waiting.get(i).getId().equals(tokenId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex == -1) {
            throw new IllegalStateException("Token not found in waiting queue");
        }

        int targetIndex = currentIndex;
        if ("UP".equalsIgnoreCase(direction)) {
            targetIndex = currentIndex - 1;
        } else if ("DOWN".equalsIgnoreCase(direction)) {
            targetIndex = currentIndex + 1;
        } else {
            throw new IllegalArgumentException("Invalid direction: " + direction + ". Use UP or DOWN.");
        }

        if (targetIndex >= 0 && targetIndex < waiting.size()) {
            Token swapped = waiting.get(targetIndex);
            int tempPos = token.getPosition();
            token.setPosition(swapped.getPosition());
            swapped.setPosition(tempPos);

            tokenRepository.save(token);
            tokenRepository.save(swapped);
        }

        return getWaitingTokens(queue.getId());
    }

    private void rebalanceQueuePositions(Queue queue) {
        List<Token> waiting = tokenRepository.findByQueueAndStatusOrderByPositionAsc(queue, TokenStatus.WAITING);
        int pos = 1;
        for (Token t : waiting) {
            t.setPosition(pos++);
            tokenRepository.save(t);
        }
    }

    public TokenDtos.TokenResponse mapToDto(Token token) {
        TokenDtos.TokenResponse dto = new TokenDtos.TokenResponse();
        dto.setId(token.getId());
        dto.setTokenNumber(token.getTokenNumber());
        dto.setCustomerName(token.getCustomerName());
        dto.setCustomerPhone(token.getCustomerPhone());
        dto.setCustomerEmail(token.getCustomerEmail());
        dto.setServiceNotes(token.getServiceNotes());
        dto.setQueueId(token.getQueue().getId());
        dto.setQueueName(token.getQueue().getName());
        dto.setStatus(token.getStatus());
        dto.setPosition(token.getPosition());
        dto.setCreatedAt(token.getCreatedAt());
        dto.setServedAt(token.getServedAt());
        dto.setCompletedAt(token.getCompletedAt());
        dto.setCancelledAt(token.getCancelledAt());
        dto.setWaitTimeSeconds(token.getWaitTimeSeconds());
        dto.setServiceDurationSeconds(token.getServiceDurationSeconds());
        return dto;
    }
}
