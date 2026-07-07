package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.security.JwtUtil;
import com.arraybots.formbackend.user.dto.LoginRequest;
import com.arraybots.formbackend.user.dto.LoginResponse;
import com.arraybots.formbackend.user.exception.InvalidCredentialsException;
import com.arraybots.formbackend.user.exception.UserAlreadyExistsException;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.arraybots.formbackend.token.model.UserToken;
import com.arraybots.formbackend.token.repository.UserTokenRepository;
import java.time.LocalDateTime;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private final UserTokenRepository userTokenRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserServiceImpl(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            UserTokenRepository userTokenRepository) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userTokenRepository = userTokenRepository;
    }

    @Override
    public User registerUser(User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {

        Optional<User> user =
                userRepository.findByEmail(loginRequest.getEmail());

        if (user.isEmpty()) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.get().getPassword())) {

            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        String token =
                jwtUtil.generateToken(user.get().getEmail());

        System.out.println("================================");
        System.out.println("Logged in User ID: " + user.get().getId());

        Optional<UserToken> existingToken =
                userTokenRepository.findByUser_Id(user.get().getId());

        System.out.println("Existing token found: " + existingToken.isPresent());

        if (existingToken.isPresent()) {
            System.out.println("Token row ID: " + existingToken.get().getId());
            System.out.println("User ID in token: " + existingToken.get().getUser().getId());
        }

        System.out.println("================================");

        UserToken userToken;

        if (existingToken.isPresent()) {

            userToken = existingToken.get();

        } else {

            userToken = new UserToken();

            userToken.setUser(user.get());

            userToken.setCreatedAt(LocalDateTime.now());

        }

        userToken.setToken(token);

        userToken.setExpiresAt(jwtUtil.getExpiryDateTime());

        userToken.setRevoked(false);

        userToken.setExpired(false);

        userTokenRepository.save(userToken);

        return new LoginResponse(
                token,
                "Login Successful"
                );
    }

    @Override
    public void logout(String token) {

        Optional<UserToken> userToken =
                userTokenRepository.findByToken(token);

        if (userToken.isEmpty()) {
            return;
        }

        UserToken storedToken = userToken.get();

        storedToken.setRevoked(true);

        storedToken.setExpired(true);

        userTokenRepository.save(storedToken);

    }
}