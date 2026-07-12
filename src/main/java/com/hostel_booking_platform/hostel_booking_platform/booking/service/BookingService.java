package com.hostel_booking_platform.hostel_booking_platform.booking.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.CreateBookingRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.UpdatePaymentMethodRequest;

import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.PagedResponse;

import java.util.List;

public interface BookingService {

  LockRoomResponse lockRoom(LockRoomRequest request, String userEmail);

  BookingResponse createBooking(CreateBookingRequest request, String userEmail);

  BookingResponse getBooking(Long bookingId, String userEmail);

  List<BookingResponse> getMyBookings(String userEmail);

  PagedResponse<BookingResponse> getMyBookings(String userEmail, Integer page, Integer limit);

  PagedResponse<BookingResponse> getOwnerBookings(String ownerEmail, Integer page, Integer limit);

  BookingResponse updatePaymentMethod(Long bookingId, UpdatePaymentMethodRequest request, String userEmail);

  void cancelBooking(Long bookingId, String userEmail);
}