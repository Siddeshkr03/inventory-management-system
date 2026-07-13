package com.arraybots.formbackend.user.controller;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arraybots.formbackend.user.dto.ProfileUpdateRequest;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/photo")
    public ResponseEntity<ProfileResponse> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        ProfileResponse profileResponse =
                profileService.uploadProfilePhoto(file, request);

        return ResponseEntity.ok(profileResponse);
    }

    @DeleteMapping("/photo")
    public ResponseEntity<ProfileResponse> removeProfilePhoto(
            HttpServletRequest request) {

        ProfileResponse profileResponse =
                profileService.removeProfilePhoto(request);

        return ResponseEntity.ok(profileResponse);
    }
}