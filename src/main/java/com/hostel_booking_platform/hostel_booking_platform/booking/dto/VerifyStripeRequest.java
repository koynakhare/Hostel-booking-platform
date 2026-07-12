package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VerifyStripeRequest {

  @NotNull
  private Long bookingId;

  @NotBlank
  private String sessionId;

  public VerifyStripeRequest() {
  }

  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }
}
