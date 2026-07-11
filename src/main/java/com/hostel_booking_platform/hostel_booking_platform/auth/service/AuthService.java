package com.hostel_booking_platform.hostel_booking_platform.auth.service;

import com.hostel_booking_platform.hostel_booking_platform.auth.dto.LoginRequest;
import com.hostel_booking_platform.hostel_booking_platform.auth.dto.RegisterRequest;
import com.hostel_booking_platform.hostel_booking_platform.user.dto.UserResponse;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;

public interface AuthService {

    User register(RegisterRequest request);

    User login(LoginRequest request);

    UserResponse getLoggedInUser(String email);
}