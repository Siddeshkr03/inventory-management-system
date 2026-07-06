package com.arraybots.formbackend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import com.arraybots.formbackend.token.model.UserToken;
import com.arraybots.formbackend.token.repository.UserTokenRepository;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;

import java.util.Optional;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    private final UserTokenRepository userTokenRepository;

    private final UserRepository userRepository;

    public JwtInterceptor(
            JwtUtil jwtUtil,
            UserTokenRepository userTokenRepository, UserRepository userRepository) {

        this.jwtUtil = jwtUtil;
        this.userTokenRepository = userTokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler)
            throws Exception {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }

        String token =
                authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }

        Optional<UserToken> userToken =
                userTokenRepository.findByToken(token);

        if (userToken.isEmpty()) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }

        if (userToken.get().isRevoked()) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }

        if (userToken.get().isExpired()) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }


        String email =
                jwtUtil.extractEmail(token);

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return false;
        }

        request.setAttribute(
                "loggedInUser",
                user.get()
        );
        
        return true;
    }
}