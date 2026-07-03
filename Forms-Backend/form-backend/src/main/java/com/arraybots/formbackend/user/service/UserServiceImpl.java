package com.arraybots.formbackend.user.service;

import org.springframework.stereotype.Service;

import com.arraybots.formbackend.user.model.User;
import com.arraybots.formbackend.user.repository.UserRepository;
import java.util.Optional;
import com.arraybots.formbackend.user.exception.UserAlreadyExistsException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        return userRepository.save(user);
    }
}