package com.arraybots.formbackend.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.service.UserService;
import com.arraybots.formbackend.user.dto.LoginRequest;

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
    public ResponseEntity<String> loginUser(
            @RequestBody LoginRequest loginRequest,
            HttpSession session) {

        String response = userService.loginUser(loginRequest, session);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {

        userService.logoutUser(session);

        return ResponseEntity.ok("Logout Successful");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getLoggedInUser(
            HttpSession session) {

        User user = userService.getLoggedInUser(session);

        return ResponseEntity.ok(user);
    }

}