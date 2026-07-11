package com.hostel_booking_platform.hostel_booking_platform.auth.service;

import com.hostel_booking_platform.hostel_booking_platform.auth.dto.LoginRequest;
import com.hostel_booking_platform.hostel_booking_platform.auth.dto.RegisterRequest;
import com.hostel_booking_platform.hostel_booking_platform.user.dto.UserResponse;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.Role;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }

    @Override
public UserResponse getLoggedInUser(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    return UserResponse.fromEntity(user);
}
}