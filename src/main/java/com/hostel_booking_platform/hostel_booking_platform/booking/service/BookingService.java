package com.hostel_booking_platform.hostel_booking_platform.booking.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.CreateBookingRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomResponse;

import java.util.List;

public interface BookingService {

  LockRoomResponse lockRoom(LockRoomRequest request, String userEmail);

  BookingResponse createBooking(CreateBookingRequest request, String userEmail);

  BookingResponse getBooking(Long bookingId, String userEmail);

  List<BookingResponse> getMyBookings(String userEmail);

  void cancelBooking(Long bookingId, String userEmail);
}