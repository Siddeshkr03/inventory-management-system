package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.LoginRequest;
import com.arraybots.formbackend.user.model.User;
import jakarta.servlet.http.HttpSession;

public interface UserService {

    User registerUser(User user);

    String loginUser(LoginRequest loginRequest, HttpSession session);

    User getLoggedInUser(HttpSession session);

    void logoutUser(HttpSession session);

}