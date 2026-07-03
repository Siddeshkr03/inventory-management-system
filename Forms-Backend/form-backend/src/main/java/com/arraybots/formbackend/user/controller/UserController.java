package com.arraybots.formbackend.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.service.UserService;
import com.arraybots.formbackend.user.dto.LoginRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
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
            @RequestBody LoginRequest loginRequest) {

        String response = userService.loginUser(loginRequest);

        return ResponseEntity.ok(response);
    }

}