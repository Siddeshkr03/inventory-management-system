package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.LoginRequest;
import com.arraybots.formbackend.user.dto.LoginResponse;
import com.arraybots.formbackend.user.model.User;

public interface UserService {

    User registerUser(User user);

    LoginResponse loginUser(LoginRequest loginRequest);

    void logout(String token);

    void forgotPassword(String email);

    void verifyOtp(String email, String otp);

    void resetPassword(String email, String newPassword);
}