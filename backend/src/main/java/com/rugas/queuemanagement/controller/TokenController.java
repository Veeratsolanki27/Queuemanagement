package com.rugas.queuemanagement.controller;

import com.rugas.queuemanagement.dto.TokenDtos;
import com.rugas.queuemanagement.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/queues/{queueId}/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<TokenDtos.TokenResponse> createToken(
            @PathVariable Long queueId,
            @Valid @RequestBody TokenDtos.CreateTokenRequest request
    ) {
        return ResponseEntity.ok(tokenService.createToken(queueId, request));
    }

    @GetMapping
    public ResponseEntity<List<TokenDtos.TokenResponse>> getTokens(@PathVariable Long queueId) {
        return ResponseEntity.ok(tokenService.getTokensByQueue(queueId));
    }

    @GetMapping("/waiting")
    public ResponseEntity<List<TokenDtos.TokenResponse>> getWaitingTokens(@PathVariable Long queueId) {
        return ResponseEntity.ok(tokenService.getWaitingTokens(queueId));
    }

    @PostMapping("/assign-top")
    public ResponseEntity<TokenDtos.TokenResponse> assignTopToken(@PathVariable Long queueId) {
        return ResponseEntity.ok(tokenService.assignTopTokenForService(queueId));
    }

    @PatchMapping("/tokens/{tokenId}/move")
    public ResponseEntity<List<TokenDtos.TokenResponse>> moveToken(
            @PathVariable Long queueId,
            @PathVariable Long tokenId,
            @RequestParam String direction
    ) {
        return ResponseEntity.ok(tokenService.moveToken(tokenId, direction));
    }

    @PatchMapping("/tokens/{tokenId}/cancel")
    public ResponseEntity<TokenDtos.TokenResponse> cancelToken(
            @PathVariable Long queueId,
            @PathVariable Long tokenId
    ) {
        return ResponseEntity.ok(tokenService.cancelToken(tokenId));
    }

    @PatchMapping("/tokens/{tokenId}/complete")
    public ResponseEntity<TokenDtos.TokenResponse> completeToken(
            @PathVariable Long queueId,
            @PathVariable Long tokenId
    ) {
        return ResponseEntity.ok(tokenService.completeService(tokenId));
    }
}

