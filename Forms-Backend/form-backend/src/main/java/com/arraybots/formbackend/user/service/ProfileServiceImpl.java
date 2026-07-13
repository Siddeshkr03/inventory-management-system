package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.dto.ProfileUpdateRequest;
import com.arraybots.formbackend.user.exception.EmailAlreadyExistsException;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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

    @Override
    public ProfileResponse updateProfile(
            ProfileUpdateRequest profileUpdateRequest,
            HttpServletRequest request) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        User existingUser = userRepository.findByEmail(
                profileUpdateRequest.getEmail()
        ).orElse(null);

        if (existingUser != null &&
                !existingUser.getId().equals(loggedInUser.getId())) {

            throw new EmailAlreadyExistsException("Email already exists.");
        }

        loggedInUser.setName(profileUpdateRequest.getFullName());
        loggedInUser.setEmail(profileUpdateRequest.getEmail());

        User updatedUser = userRepository.save(loggedInUser);

        ProfileResponse profileResponse = new ProfileResponse();

        profileResponse.setId(updatedUser.getId());
        profileResponse.setFullName(updatedUser.getName());
        profileResponse.setEmail(updatedUser.getEmail());
        profileResponse.setProfileImage(updatedUser.getProfileImage());

        return profileResponse;
    }
}