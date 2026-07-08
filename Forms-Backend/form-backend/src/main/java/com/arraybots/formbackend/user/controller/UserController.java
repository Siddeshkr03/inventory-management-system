package com.arraybots.formbackend.user.controller;

import com.arraybots.formbackend.email.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.arraybots.formbackend.user.dto.LoginResponse;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.service.UserService;
import com.arraybots.formbackend.user.dto.LoginRequest;
import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletRequest;
import com.arraybots.formbackend.user.dto.ForgotPasswordRequest;
import com.arraybots.formbackend.user.dto.VerifyOtpRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    private final EmailService emailService;

    public UserController(
            UserService userService,
            EmailService emailService) {

        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        System.out.println("Name: " + user.getName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password: " + user.getPassword());
        userService.registerUser(user);

        return new ResponseEntity<>(
                "User Registered Successfully",
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @RequestBody LoginRequest loginRequest) {

        LoginResponse response =
                userService.loginUser(loginRequest);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String authHeader) {

        String token = authHeader.substring(7);

        userService.logout(token);

        return ResponseEntity.ok("Logout Successful");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getLoggedInUser(
            HttpServletRequest request) {

        User user = (User) request.getAttribute("loggedInUser");

        return ResponseEntity.ok(user);

    }

    @GetMapping("/test-email")
    public ResponseEntity<String> sendTestEmail() {

        emailService.sendEmail(
                "siddeshkr03@gmail.com",
                "Spring Boot Email Test",
                "Congratulations! Your email configuration is working."
        );

        return ResponseEntity.ok("Test email sent successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(
                "OTP sent successfully."
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        userService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                "OTP verified successfully."
        );
    }

}