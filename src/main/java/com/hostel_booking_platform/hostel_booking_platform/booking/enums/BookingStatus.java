package com.hostel_booking_platform.hostel_booking_platform.booking.enums;

public enum BookingStatus {
  LOCKED,           // room temporarily held (10 min)
  PENDING,          // booking created, payment not done yet
  CONFIRMED,        // payment success / cash on arrival accepted
  CANCELLED,        // user or owner cancelled
  EXPIRED           // lock expired without payment
}