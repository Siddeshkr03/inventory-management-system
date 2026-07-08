package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.email.service.EmailService;
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
import com.arraybots.formbackend.user.dto.LoginUserResponse;
import java.time.LocalDateTime;

import java.util.Optional;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private final UserTokenRepository userTokenRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private final EmailService emailService;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            UserTokenRepository userTokenRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userTokenRepository = userTokenRepository;
        this.emailService = emailService;
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
        System.out.println("Logged in User ID: " + user.get().getId());

        Optional<UserToken> existingToken =
                userTokenRepository.findByUser_Id(user.get().getId());

        System.out.println("Existing token found: " + existingToken.isPresent());

        if (existingToken.isPresent()) {
            System.out.println("Token row ID: " + existingToken.get().getId());
            System.out.println("User ID in token: " + existingToken.get().getUser().getId());
        }


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

        LoginUserResponse loginUser = new LoginUserResponse(
                user.get().getId(),
                user.get().getName(),
                user.get().getEmail()
        );

        return new LoginResponse(
                token,
                "Login Successful",
                loginUser
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

    private String generateOtp() {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);
    }

    @Override
    public void forgotPassword(String email) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        String otp = generateOtp();

        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(10);

        user.get().setOtp(otp);

        user.get().setOtpExpiry(expiryTime);

        userRepository.save(user.get());

        emailService.sendEmail(
                email,
                "Password Reset OTP",
                "Your OTP is: " + otp +
                        "\n\nThis OTP is valid for 10 minutes."
        );
    }

    @Override
    public void verifyOtp(
            String email,
            String otp
    ) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        if (!otp.equals(user.get().getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (LocalDateTime.now().isAfter(user.get().getOtpExpiry())) {
            throw new RuntimeException("OTP has expired.");
        }

    }
}