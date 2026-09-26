package com.archivalia.auth.config;

import com.archivalia.auth.entity.Role;
import com.archivalia.auth.entity.Status;
import com.archivalia.auth.entity.User;
import com.archivalia.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmailIgnoreCase("user@archivalia.test")) {
                userRepository.save(new User(
                        "USR-101",
                        "Ben Bradle",
                        "user@archivalia.test",
                        passwordEncoder.encode("user123"),
                        "9876543210",
                        Role.USER,
                        Status.ACTIVE
                ));
            }

            if (!userRepository.existsByEmailIgnoreCase("admin@archivalia.test")) {
                userRepository.save(new User(
                        "ADM-001",
                        "Library Admin",
                        "admin@archivalia.test",
                        passwordEncoder.encode("admin123"),
                        "9876543211",
                        Role.ADMIN,
                        Status.ACTIVE
                ));
            }
        };
    }
}
