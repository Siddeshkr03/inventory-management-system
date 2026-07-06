package com.arraybots.formbackend.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import java.time.LocalDateTime;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    private static final String SECRET =
            "myVerySecretKeyForJwtAuthentication123456789";

    private static final long JWT_EXPIRATION =
            1000 * 60 * 60;

    private final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email) {

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + JWT_EXPIRATION
                        )
                )

                .signWith(SECRET_KEY)

                .compact();
    }

    public String extractEmail(String token) {

        Jws<Claims> claims = Jwts.parser()

                .verifyWith(SECRET_KEY)

                .build()

                .parseSignedClaims(token);

        return claims.getPayload().getSubject();

    }

    public boolean validateToken(String token) {

        try {

            Jwts.parser()

                    .verifyWith(SECRET_KEY)

                    .build()

                    .parseSignedClaims(token);

            return true;

        } catch (JwtException | IllegalArgumentException e) {

            return false;

        }

    }
    
    public LocalDateTime getExpiryDateTime() {

        return LocalDateTime.now()
                .plusSeconds(JWT_EXPIRATION / 1000);

    }

}