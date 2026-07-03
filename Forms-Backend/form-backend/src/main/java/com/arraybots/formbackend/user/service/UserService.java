package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.dto.LoginRequest;

public interface UserService {

    User registerUser(User user);

    String loginUser(LoginRequest loginRequest);

}