package com.arraybots.formbackend.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.arraybots.formbackend.user.dto.LoginResponse;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.service.UserService;
import com.arraybots.formbackend.user.dto.LoginRequest;
import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

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

}