package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import java.math.BigDecimal;

public class RazorpayOrderResponse {

  private Long bookingId;
  private String orderId;
  private String keyId;
  private BigDecimal amount;
  private String currency;
  private String hostelName;

  public RazorpayOrderResponse() {
  }

  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
  }

  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  public String getKeyId() {
    return keyId;
  }

  public void setKeyId(String keyId) {
    this.keyId = keyId;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public String getHostelName() {
    return hostelName;
  }

  public void setHostelName(String hostelName) {
    this.hostelName = hostelName;
  }
}
