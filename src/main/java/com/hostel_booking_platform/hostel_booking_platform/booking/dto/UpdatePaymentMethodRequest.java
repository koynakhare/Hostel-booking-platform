package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class UpdatePaymentMethodRequest {

  @NotNull
  private PaymentMethod paymentMethod;

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }
}
