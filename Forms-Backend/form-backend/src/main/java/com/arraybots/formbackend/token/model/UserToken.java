package com.arraybots.formbackend.token.model;

import com.arraybots.formbackend.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_token")
public class UserToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(nullable = false)
    private boolean expired = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public UserToken() {
    }

    public UserToken(Long id, String token, boolean revoked, boolean expired,
                     LocalDateTime createdAt, LocalDateTime expiresAt, User user) {
        this.id = id;
        this.token = token;
        this.revoked = revoked;
        this.expired = expired;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    // Generate getters and setters using IntelliJ
}