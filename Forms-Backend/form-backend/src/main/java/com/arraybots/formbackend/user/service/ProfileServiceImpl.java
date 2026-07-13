package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.storage.FileStorageService;
import com.arraybots.formbackend.user.dto.ProfileResponse;
import com.arraybots.formbackend.user.dto.ProfileUpdateRequest;
import com.arraybots.formbackend.user.exception.EmailAlreadyExistsException;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    private final FileStorageService fileStorageService;

    public ProfileServiceImpl(
            UserRepository userRepository,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
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

    @Override
    public ProfileResponse uploadProfilePhoto(
            MultipartFile file,
            HttpServletRequest request
    ) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        String fileName =
                fileStorageService.saveProfilePhoto(file);

        loggedInUser.setProfileImage(fileName);

        userRepository.save(loggedInUser);

        ProfileResponse profileResponse = new ProfileResponse();

        profileResponse.setId(loggedInUser.getId());
        profileResponse.setFullName(loggedInUser.getName());
        profileResponse.setEmail(loggedInUser.getEmail());
        profileResponse.setProfileImage(loggedInUser.getProfileImage());

        return profileResponse;
    }

    @Override
    public ProfileResponse removeProfilePhoto(
            HttpServletRequest request
    ) {

        User loggedInUser =
                (User) request.getAttribute("loggedInUser");

        if (loggedInUser.getProfileImage() != null) {

            try {

                Path filePath = Paths.get("uploads/profile")
                        .resolve(loggedInUser.getProfileImage())
                        .normalize();

                Files.deleteIfExists(filePath);

            } catch (Exception e) {

                throw new RuntimeException(
                        "Unable to delete profile photo.",
                        e
                );

            }

            loggedInUser.setProfileImage(null);

            userRepository.save(loggedInUser);
        }

        ProfileResponse profileResponse = new ProfileResponse();

        profileResponse.setId(loggedInUser.getId());
        profileResponse.setFullName(loggedInUser.getName());
        profileResponse.setEmail(loggedInUser.getEmail());
        profileResponse.setProfileImage(loggedInUser.getProfileImage());

        return profileResponse;
    }
}