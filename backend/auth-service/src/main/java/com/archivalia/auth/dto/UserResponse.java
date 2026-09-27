package com.archivalia.auth.dto;

/**
 * Response DTO for user profile information.
 *
 * <p>Used to return user data without exposing the password hash
 * or other sensitive internal fields.</p>
 */
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private boolean enabled;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String email, String fullName,
                        String role, boolean enabled) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
    }

    // ── Getters and Setters ──────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
