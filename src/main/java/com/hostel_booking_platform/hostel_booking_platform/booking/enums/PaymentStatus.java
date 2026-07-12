package com.hostel_booking_platform.hostel_booking_platform.booking.enums;

public enum PaymentStatus {
  PENDING,    // payment initiated, waiting for gateway
  SUCCESS,    // payment completed
  FAILED,     // payment failed
  REFUNDED    // money returned after cancellation
}