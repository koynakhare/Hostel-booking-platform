package com.hostel_booking_platform.hostel_booking_platform.booking.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.PaymentConfigResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.RazorpayOrderResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.StripeCheckoutResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyRazorpayRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyStripeRequest;

public interface PaymentService {

  PaymentConfigResponse getPaymentConfig();

  RazorpayOrderResponse createRazorpayOrder(Long bookingId, String userEmail);

  BookingResponse verifyRazorpayPayment(VerifyRazorpayRequest request, String userEmail);

  StripeCheckoutResponse createStripeCheckout(Long bookingId, String userEmail);

  BookingResponse verifyStripePayment(VerifyStripeRequest request, String userEmail);
}
