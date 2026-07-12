package com.hostel_booking_platform.hostel_booking_platform.auth.controller;

import com.hostel_booking_platform.hostel_booking_platform.auth.dto.AuthResponse;
import com.hostel_booking_platform.hostel_booking_platform.auth.dto.LoginRequest;
import com.hostel_booking_platform.hostel_booking_platform.auth.dto.RegisterRequest;
import com.hostel_booking_platform.hostel_booking_platform.auth.dto.UpdateProfileRequest;
import com.hostel_booking_platform.hostel_booking_platform.auth.service.AuthService;
import com.hostel_booking_platform.hostel_booking_platform.security.JwtService;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hostel_booking_platform.hostel_booking_platform.user.dto.UserResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User savedUser = authService.register(request);

        AuthResponse response = new AuthResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                jwtService.generateToken(savedUser.getEmail())
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.login(request);

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                jwtService.generateToken(user.getEmail())
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
public ResponseEntity<UserResponse> getLoggedInUser(@AuthenticationPrincipal UserDetails userDetails) {
    UserResponse response = authService.getLoggedInUser(userDetails.getUsername());
    return ResponseEntity.ok(response);
}

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}