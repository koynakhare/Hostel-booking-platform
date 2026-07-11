package com.hostel_booking_platform.hostel_booking_platform.user.repository;

import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Login ke time email se user dhoondne ke liye
    Optional<User> findByEmail(String email);

    // Register ke time check karne ke liye ki email already exist karta hai ya nahi
    boolean existsByEmail(String email);
}