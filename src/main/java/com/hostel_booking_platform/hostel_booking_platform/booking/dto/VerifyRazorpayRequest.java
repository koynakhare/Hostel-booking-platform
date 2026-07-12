package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VerifyRazorpayRequest {

  @NotNull
  private Long bookingId;

  @NotBlank
  private String razorpayOrderId;

  @NotBlank
  private String razorpayPaymentId;

  @NotBlank
  private String razorpaySignature;

  public VerifyRazorpayRequest() {
  }

  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
  }

  public String getRazorpayOrderId() {
    return razorpayOrderId;
  }

  public void setRazorpayOrderId(String razorpayOrderId) {
    this.razorpayOrderId = razorpayOrderId;
  }

  public String getRazorpayPaymentId() {
    return razorpayPaymentId;
  }

  public void setRazorpayPaymentId(String razorpayPaymentId) {
    this.razorpayPaymentId = razorpayPaymentId;
  }

  public String getRazorpaySignature() {
    return razorpaySignature;
  }

  public void setRazorpaySignature(String razorpaySignature) {
    this.razorpaySignature = razorpaySignature;
  }
}
