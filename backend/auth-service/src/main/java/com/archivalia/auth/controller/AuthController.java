package com.archivalia.auth.controller;

import com.archivalia.auth.dto.*;
import com.archivalia.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication and user management endpoints.
 *
 * <p>All endpoints use the canonical {@code /api/v1} prefix.</p>
 *
 * <p>Endpoint summary:</p>
 * <ul>
 *   <li>{@code POST /api/v1/auth/register} — Public. Creates a new user.</li>
 *   <li>{@code POST /api/v1/auth/login} — Public. Authenticates and returns JWT.</li>
 *   <li>{@code GET /api/v1/auth/profile} — Protected. Returns the authenticated
 *       user's profile.</li>
 *   <li>{@code GET /api/v1/auth/admin/test} — Protected (ADMIN only). Verifies
 *       RBAC is working.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Registers a new user account.
     *
     * @param request registration details (username, password, optional email/fullName)
     * @return the created user profile (without password)
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request login credentials (username, password)
     * @return JWT token, token type, username, and role
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns the profile of the currently authenticated user.
     * Requires a valid JWT in the Authorization header.
     */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        UserResponse profile = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    /**
     * Admin-only test endpoint to verify role-based access control.
     * Returns 200 if the caller has the ADMIN role, 403 otherwise.
     */
    @GetMapping("/admin/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminTest() {
        return ResponseEntity.ok("Admin access verified");
    }
}
