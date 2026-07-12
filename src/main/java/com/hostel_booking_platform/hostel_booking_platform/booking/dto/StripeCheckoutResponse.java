package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

public class StripeCheckoutResponse {

  private Long bookingId;
  private String sessionId;
  private String checkoutUrl;
  private String publishableKey;

  public StripeCheckoutResponse() {
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

  public String getCheckoutUrl() {
    return checkoutUrl;
  }

  public void setCheckoutUrl(String checkoutUrl) {
    this.checkoutUrl = checkoutUrl;
  }

  public String getPublishableKey() {
    return publishableKey;
  }

  public void setPublishableKey(String publishableKey) {
    this.publishableKey = publishableKey;
  }
}
