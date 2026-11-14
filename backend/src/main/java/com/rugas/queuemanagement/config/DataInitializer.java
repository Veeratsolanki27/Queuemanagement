package com.rugas.queuemanagement.config;

import com.rugas.queuemanagement.entity.Role;
import com.rugas.queuemanagement.entity.User;
import com.rugas.queuemanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (!userRepository.existsByUsername("manager")) {
                User defaultManager = User.builder()
                        .username("manager")
                        .password(passwordEncoder.encode("manager123"))
                        .fullName("Operations Manager")
                        .role(Role.ROLE_MANAGER)
                        .build();
                userRepository.save(defaultManager);
                log.info("Default Manager Account created: username=manager, password=manager123");
            }

            if (!userRepository.existsByUsername("admin")) {
                User defaultAdmin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Administrator")
                        .role(Role.ROLE_ADMIN)
                        .build();
                userRepository.save(defaultAdmin);
                log.info("Default Admin Account created: username=admin, password=admin123");
            }
        };
    }
}
