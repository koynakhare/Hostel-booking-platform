package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

public class PaymentConfigResponse {

  private boolean razorpayEnabled;
  private boolean stripeEnabled;
  private String razorpayKeyId;
  private String stripePublishableKey;
  private String currency;

  public PaymentConfigResponse() {
  }

  public boolean isRazorpayEnabled() {
    return razorpayEnabled;
  }

  public void setRazorpayEnabled(boolean razorpayEnabled) {
    this.razorpayEnabled = razorpayEnabled;
  }

  public boolean isStripeEnabled() {
    return stripeEnabled;
  }

  public void setStripeEnabled(boolean stripeEnabled) {
    this.stripeEnabled = stripeEnabled;
  }

  public String getRazorpayKeyId() {
    return razorpayKeyId;
  }

  public void setRazorpayKeyId(String razorpayKeyId) {
    this.razorpayKeyId = razorpayKeyId;
  }

  public String getStripePublishableKey() {
    return stripePublishableKey;
  }

  public void setStripePublishableKey(String stripePublishableKey) {
    this.stripePublishableKey = stripePublishableKey;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }
}
