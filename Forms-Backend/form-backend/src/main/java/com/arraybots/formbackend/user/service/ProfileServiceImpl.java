package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Override
    public ProfileResponse getProfile(HttpServletRequest request) {

        User loggedInUser = (User) request.getAttribute("loggedInUser");

        ProfileResponse profileResponse = new ProfileResponse();

        profileResponse.setId(loggedInUser.getId());
        profileResponse.setFullName(loggedInUser.getName());
        profileResponse.setEmail(loggedInUser.getEmail());
        profileResponse.setProfileImage(loggedInUser.getProfileImage());

        return profileResponse;
    }
}