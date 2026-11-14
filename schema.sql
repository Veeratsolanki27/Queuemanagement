-- ==========================================================
-- Queue Management System - Full Database Schema & Seed Data
-- Compatible with: MySQL 8+ / PostgreSQL / Cloud MySQL / PlanetScale / Aiven
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `queue_management_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `queue_management_db`;

-- 1. Table: users
DROP TABLE IF EXISTS `tokens`;
DROP TABLE IF EXISTS `queues`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `role` VARCHAR(30) NOT NULL DEFAULT 'ROLE_MANAGER',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: queues
CREATE TABLE `queues` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `prefix` VARCHAR(20) NOT NULL DEFAULT 'Q',
  `current_token_sequence` INT NOT NULL DEFAULT 0,
  `manager_id` BIGINT NOT NULL,
  `active` BIT(1) NOT NULL DEFAULT b'1',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_queues_manager` (`manager_id`),
  CONSTRAINT `fk_queues_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: tokens
CREATE TABLE `tokens` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `token_number` VARCHAR(30) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(20) DEFAULT NULL,
  `customer_email` VARCHAR(255) DEFAULT NULL,
  `service_notes` VARCHAR(500) DEFAULT NULL,
  `queue_id` BIGINT NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'WAITING',
  `queue_position` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `served_at` DATETIME DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `cancelled_at` DATETIME DEFAULT NULL,
  `wait_time_seconds` BIGINT DEFAULT NULL,
  `service_duration_seconds` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tokens_queue` (`queue_id`),
  KEY `idx_tokens_status` (`status`),
  KEY `idx_tokens_position` (`queue_position`),
  CONSTRAINT `fk_tokens_queue` FOREIGN KEY (`queue_id`) REFERENCES `queues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Initial Sample Seed Data (For testing & interview demo)
-- Passwords are encrypted with BCrypt (password: manager123)
-- ==========================================================

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `created_at`) VALUES
(1, 'manager', '$2a$10$SlvQ5fI20vVf92b7o6Hk9evUqG5m.2vBv0rY9o9oZ3eO7Ccm20eT2', 'Operations Lead', 'ROLE_MANAGER', NOW());

INSERT INTO `queues` (`id`, `name`, `description`, `prefix`, `current_token_sequence`, `manager_id`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Customer Support Desk', 'Priority customer service and inquiries counter', 'CS', 3, 1, b'1', NOW(), NOW()),
(2, 'VIP FastTrack Counter', 'Dedicated express service for priority accounts', 'VIP', 2, 1, b'1', NOW(), NOW());

INSERT INTO `tokens` (`id`, `token_number`, `customer_name`, `customer_phone`, `customer_email`, `service_notes`, `queue_id`, `status`, `queue_position`, `created_at`, `served_at`, `completed_at`, `cancelled_at`, `wait_time_seconds`, `service_duration_seconds`) VALUES
(1, 'CS-001', 'Rahul Sharma', '+91 9876543210', 'rahul@example.com', 'Account verification', 1, 'SERVING', NULL, DATE_SUB(NOW(), INTERVAL 15 MINUTE), DATE_SUB(NOW(), INTERVAL 3 MINUTE), NULL, NULL, 720, NULL),
(2, 'CS-002', 'Priya Patel', '+91 9876543211', 'priya@example.com', 'Service update', 1, 'WAITING', 1, DATE_SUB(NOW(), INTERVAL 10 MINUTE), NULL, NULL, NULL, NULL, NULL),
(3, 'CS-003', 'Amit Kumar', '+91 9876543212', 'amit@example.com', 'General inquiry', 1, 'WAITING', 2, DATE_SUB(NOW(), INTERVAL 5 MINUTE), NULL, NULL, NULL, NULL, NULL),
(4, 'VIP-001', 'Ananya Roy', '+91 9876543213', 'ananya@example.com', 'Card upgrade', 2, 'COMPLETED', NULL, DATE_SUB(NOW(), INTERVAL 45 MINUTE), DATE_SUB(NOW(), INTERVAL 30 MINUTE), DATE_SUB(NOW(), INTERVAL 20 MINUTE), NULL, 900, 600),
(5, 'VIP-002', 'Vikram Singh', '+91 9876543214', 'vikram@example.com', 'Loan consultation', 2, 'WAITING', 1, DATE_SUB(NOW(), INTERVAL 8 MINUTE), NULL, NULL, NULL, NULL, NULL);

