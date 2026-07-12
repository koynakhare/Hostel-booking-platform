package com.hostel_booking_platform.hostel_booking_platform.booking.controller;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.PaymentConfigResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.RazorpayOrderResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.StripeCheckoutResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyRazorpayRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyStripeRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @GetMapping("/config")
  public ResponseEntity<PaymentConfigResponse> getPaymentConfig() {
    return ResponseEntity.ok(paymentService.getPaymentConfig());
  }

  @PostMapping("/razorpay/order/{bookingId}")
  public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(
      @PathVariable Long bookingId,
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(paymentService.createRazorpayOrder(bookingId, userDetails.getUsername()));
  }

  @PostMapping("/razorpay/verify")
  public ResponseEntity<BookingResponse> verifyRazorpayPayment(
      @Valid @RequestBody VerifyRazorpayRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(paymentService.verifyRazorpayPayment(request, userDetails.getUsername()));
  }

  @PostMapping("/stripe/checkout/{bookingId}")
  public ResponseEntity<StripeCheckoutResponse> createStripeCheckout(
      @PathVariable Long bookingId,
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(paymentService.createStripeCheckout(bookingId, userDetails.getUsername()));
  }

  @PostMapping("/stripe/verify")
  public ResponseEntity<BookingResponse> verifyStripePayment(
      @Valid @RequestBody VerifyStripeRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {

    return ResponseEntity.ok(paymentService.verifyStripePayment(request, userDetails.getUsername()));
  }
}
