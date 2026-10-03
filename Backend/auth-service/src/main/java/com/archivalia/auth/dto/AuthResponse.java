package com.archivalia.auth.dto;

public class AuthResponse {

    private String token;
    private UserSession session;

    public AuthResponse() {
    }

    public AuthResponse(String token, UserSession session) {
        this.token = token;
        this.session = session;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserSession getSession() {
        return session;
    }

    public void setSession(UserSession session) {
        this.session = session;
    }

    public static class UserSession {
        private String userId;
        private String name;
        private String email;
        private String role;
        private String phone;

        public UserSession() {
        }

        public UserSession(String userId, String name, String email, String role, String phone) {
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
            this.phone = phone;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
