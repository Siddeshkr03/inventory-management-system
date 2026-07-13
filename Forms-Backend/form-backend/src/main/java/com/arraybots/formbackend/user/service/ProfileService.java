package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.dto.ProfileUpdateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    ProfileResponse getProfile(HttpServletRequest request);

    ProfileResponse updateProfile(
            ProfileUpdateRequest profileUpdateRequest,
            HttpServletRequest request);

    ProfileResponse uploadProfilePhoto(
            MultipartFile file,
            HttpServletRequest request
    );

}