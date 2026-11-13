package com.rugas.queuemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        @NotBlank(message = "Full name is required")
        private String fullName;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long id;
        private String username;
        private String fullName;
        private String role;

        public AuthResponse(String token, Long id, String username, String fullName, String role) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.fullName = fullName;
            this.role = role;
        }
    }
}

