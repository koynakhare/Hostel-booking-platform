package com.hostel_booking_platform.hostel_booking_platform.booking.repository;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  List<Payment> findByBookingIdOrderByCreatedAtDesc(Long bookingId);

  void deleteByBookingId(Long bookingId);

  Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
}