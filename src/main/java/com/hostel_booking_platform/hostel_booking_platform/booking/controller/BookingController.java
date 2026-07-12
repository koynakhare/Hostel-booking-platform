package com.hostel_booking_platform.hostel_booking_platform.booking.controller;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.CreateBookingRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping("/lock")
  public ResponseEntity<LockRoomResponse> lockRoom(
      @Valid @RequestBody LockRoomRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {

    LockRoomResponse response = bookingService.lockRoom(request, userDetails.getUsername());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping
  public ResponseEntity<BookingResponse> createBooking(
      @Valid @RequestBody CreateBookingRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {

    BookingResponse response = bookingService.createBooking(request, userDetails.getUsername());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/my")
  public ResponseEntity<List<BookingResponse>> getMyBookings(
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername()));
  }

  @GetMapping("/{bookingId}")
  public ResponseEntity<BookingResponse> getBooking(
      @PathVariable Long bookingId,
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(bookingService.getBooking(bookingId, userDetails.getUsername()));
  }

  @DeleteMapping("/{bookingId}")
  public ResponseEntity<Void> cancelBooking(
      @PathVariable Long bookingId,
      @AuthenticationPrincipal UserDetails userDetails) {

    bookingService.cancelBooking(bookingId, userDetails.getUsername());
    return ResponseEntity.noContent().build();
  }
}