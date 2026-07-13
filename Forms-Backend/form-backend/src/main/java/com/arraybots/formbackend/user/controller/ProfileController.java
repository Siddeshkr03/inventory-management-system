package com.arraybots.formbackend.user.controller;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arraybots.formbackend.user.dto.ProfileUpdateRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@RequestMapping("/api/users/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(HttpServletRequest request) {

        ProfileResponse profileResponse = profileService.getProfile(request);

        return ResponseEntity.ok(profileResponse);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody ProfileUpdateRequest profileUpdateRequest,
            HttpServletRequest request) {

        ProfileResponse profileResponse =
                profileService.updateProfile(profileUpdateRequest, request);

        return ResponseEntity.ok(profileResponse);
    }
}