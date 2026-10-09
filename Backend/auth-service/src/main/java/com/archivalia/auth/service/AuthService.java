package com.archivalia.auth.service;

import com.archivalia.auth.dto.*;
import com.archivalia.auth.entity.Role;
import com.archivalia.auth.entity.Status;
import com.archivalia.auth.entity.User;
import com.archivalia.auth.repository.UserRepository;
import com.archivalia.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new RuntimeException("Email or password is incorrect."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email or password is incorrect.");
        }

        if (user.getStatus() != Status.ACTIVE) {
            throw new RuntimeException("Account is inactive. Contact the library administrator.");
        }

        String token = jwtService.generateToken(user);
        AuthResponse.UserSession session = new AuthResponse.UserSession(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone()
        );

        return new AuthResponse(token, session);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("An account with that email already exists.");
        }

        long count = userRepository.count();
        String generatedUserId = "USR-" + (100 + count + 1);

        User user = new User(
                generatedUserId,
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone() != null ? request.getPhone().trim() : "9876543210",
                Role.USER,
                Status.ACTIVE
        );

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        AuthResponse.UserSession session = new AuthResponse.UserSession(
                saved.getUserId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().name(),
                saved.getPhone()
        );

        return new AuthResponse(token, session);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmailIgnoreCase(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private UserProfileDto toDto(User user) {
        return new UserProfileDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }
}
