package com.arraybots.formbackend.user.service;

import com.arraybots.formbackend.user.dto.LoginRequest;
import com.arraybots.formbackend.user.exception.InvalidCredentialsException;
import com.arraybots.formbackend.user.exception.UserAlreadyExistsException;
import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public String loginUser(LoginRequest loginRequest,
                            HttpSession session) {

        Optional<User> user =
                userRepository.findByEmail(loginRequest.getEmail());

        if (!user.isPresent()) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.get().getPassword())) {

            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        // Store the logged-in user in the HTTP Session
        session.setAttribute("loggedInUser", user.get());

        return "Login Successful";
    }

    @Override
    public User getLoggedInUser(HttpSession session) {

        User user = (User) session.getAttribute("loggedInUser");

        if (user == null) {
            throw new InvalidCredentialsException("User is not logged in");
        }

        return user;
    }

    @Override
    public void logoutUser(HttpSession session) {

        session.invalidate();
    }
}