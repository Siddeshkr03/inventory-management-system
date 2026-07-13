package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface ProfileService {

    ProfileResponse getProfile(HttpServletRequest request);

}