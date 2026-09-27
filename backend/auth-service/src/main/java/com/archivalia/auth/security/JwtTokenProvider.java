package com.archivalia.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * Utility for generating and validating JWT tokens.
 *
 * <p>Implementation decisions:</p>
 * <ul>
 *   <li><strong>Token expiration:</strong> 24 hours. The specification does not define
 *       a token lifetime; 24h balances convenience and security for an academic
 *       library system. Refresh tokens are not implemented in Phase 2 but can
 *       be added later.</li>
 *   <li><strong>Claims:</strong> The token carries {@code sub} (username) and
 *       {@code role}. The role is server-authoritative — the backend validates
 *       it from the token, never trusting a frontend-provided role.</li>
 *   <li><strong>Signing algorithm:</strong> HMAC-SHA256 using a secret key from
 *       the environment variable {@code JWT_SECRET}.</li>
 * </ul>
 */
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    /**
     * Generates a JWT token from a successful authentication.
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("role", roles)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * Extracts the username (subject) from a JWT token.
     */
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Validates a JWT token. Returns {@code true} if the token is well-formed,
     * correctly signed, and not expired.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token is invalid — malformed, expired, wrong signature, etc.
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
