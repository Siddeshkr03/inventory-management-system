package com.arraybots.formbackend.token.repository;

import com.arraybots.formbackend.token.model.UserToken;
import com.arraybots.formbackend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTokenRepository
        extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    Optional<UserToken> findByUser_Id(Long userId);

}