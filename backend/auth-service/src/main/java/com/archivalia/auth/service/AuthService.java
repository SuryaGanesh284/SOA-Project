package com.archivalia.auth.service;

import com.archivalia.auth.dto.*;
import com.archivalia.auth.entity.Role;
import com.archivalia.auth.entity.User;
import com.archivalia.auth.exception.DuplicateResourceException;
import com.archivalia.auth.repository.UserRepository;
import com.archivalia.auth.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling user registration and authentication logic.
 *
 * <p>Implementation decisions:</p>
 * <ul>
 *   <li><strong>Registration:</strong> New users always receive {@link Role#USER}.
 *       There is no self-service admin registration. Admin accounts must be
 *       created by updating the role in the database directly, or via a
 *       future admin-only endpoint.</li>
 *   <li><strong>Login:</strong> Delegates authentication to Spring Security's
 *       {@link AuthenticationManager}, which uses the {@code CustomUserDetailsService}
 *       and {@code BCryptPasswordEncoder} internally. This ensures consistent
 *       credential validation and account status checking.</li>
 *   <li><strong>No plaintext passwords:</strong> Passwords are hashed with BCrypt
 *       before persistence. The password field is never returned in any response.</li>
 * </ul>
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Registers a new user with the USER role.
     *
     * @throws DuplicateResourceException if the username or email already exists
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException(
                    "Username '" + request.getUsername() + "' is already taken");
        }

        // Check for duplicate email (only if email was provided)
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email '" + request.getEmail() + "' is already registered");
        }

        // Build and persist user entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(Role.USER); // Always USER — no self-service admin registration

        User saved = userRepository.save(user);

        return toUserResponse(saved);
    }

    /**
     * Authenticates a user and returns a JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        String token = jwtTokenProvider.generateToken(authentication);

        // Retrieve user to get the role for the response
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(); // Should never happen after successful auth

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    /**
     * Returns the profile of the currently authenticated user.
     */
    @Transactional(readOnly = true)
    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    // ── Mapper ───────────────────────────────────────────────────────────────

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.isEnabled()
        );
    }
}
