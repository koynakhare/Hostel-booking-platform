package com.hostel_booking_platform.hostel_booking_platform.booking.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.PaymentConfigResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.RazorpayOrderResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.StripeCheckoutResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyRazorpayRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.VerifyStripeRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Booking;
import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Payment;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.BookingStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentMethod;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.BookingRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.PaymentRepository;
import com.hostel_booking_platform.hostel_booking_platform.config.AppProperties;
import com.hostel_booking_platform.hostel_booking_platform.config.PaymentProperties;
import com.hostel_booking_platform.hostel_booking_platform.config.RazorpayProperties;
import com.hostel_booking_platform.hostel_booking_platform.config.StripeProperties;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

  private final PaymentRepository paymentRepository;
  private final BookingRepository bookingRepository;
  private final UserRepository userRepository;
  private final RazorpayProperties razorpayProperties;
  private final StripeProperties stripeProperties;
  private final PaymentProperties paymentProperties;
  private final AppProperties appProperties;

  public PaymentServiceImpl(
      PaymentRepository paymentRepository,
      BookingRepository bookingRepository,
      UserRepository userRepository,
      RazorpayProperties razorpayProperties,
      StripeProperties stripeProperties,
      PaymentProperties paymentProperties,
      AppProperties appProperties) {
    this.paymentRepository = paymentRepository;
    this.bookingRepository = bookingRepository;
    this.userRepository = userRepository;
    this.razorpayProperties = razorpayProperties;
    this.stripeProperties = stripeProperties;
    this.paymentProperties = paymentProperties;
    this.appProperties = appProperties;
  }

  @Override
  @Transactional(readOnly = true)
  public PaymentConfigResponse getPaymentConfig() {
    PaymentConfigResponse response = new PaymentConfigResponse();
    response.setRazorpayEnabled(razorpayProperties.isConfigured());
    response.setStripeEnabled(stripeProperties.isConfigured());
    response.setRazorpayKeyId(razorpayProperties.getKeyId());
    response.setStripePublishableKey(stripeProperties.getPublishableKey());
    response.setCurrency(paymentProperties.getCurrency());
    return response;
  }

  @Override
  @Transactional
  public RazorpayOrderResponse createRazorpayOrder(Long bookingId, String userEmail) {
    if (!razorpayProperties.isConfigured()) {
      throw new IllegalArgumentException("Razorpay is not configured on the server");
    }

    Booking booking = getPendingOnlineBooking(bookingId, userEmail, PaymentMethod.RAZORPAY);
    Payment payment = getLatestPendingPayment(booking);

    try {
      RazorpayClient client = new RazorpayClient(
          razorpayProperties.getKeyId(), razorpayProperties.getKeySecret());

      JSONObject orderRequest = new JSONObject();
      orderRequest.put("amount", toSmallestUnit(payment.getAmount()));
      orderRequest.put("currency", paymentProperties.getCurrency());
      orderRequest.put("receipt", "booking_" + booking.getId());
      orderRequest.put("payment_capture", 1);

      Order order = client.orders.create(orderRequest);
      String orderId = order.get("id");

      payment.setGatewayOrderId(orderId);
      paymentRepository.save(payment);

      RazorpayOrderResponse response = new RazorpayOrderResponse();
      response.setBookingId(booking.getId());
      response.setOrderId(orderId);
      response.setKeyId(razorpayProperties.getKeyId());
      response.setAmount(payment.getAmount());
      response.setCurrency(paymentProperties.getCurrency());
      response.setHostelName(booking.getRoom().getHostel().getName());
      return response;
    } catch (RazorpayException ex) {
      throw new IllegalArgumentException("Failed to create Razorpay order: " + ex.getMessage());
    }
  }

  @Override
  @Transactional
  public BookingResponse verifyRazorpayPayment(VerifyRazorpayRequest request, String userEmail) {
    if (!razorpayProperties.isConfigured()) {
      throw new IllegalArgumentException("Razorpay is not configured on the server");
    }

    Booking booking = getPendingOnlineBooking(request.getBookingId(), userEmail, PaymentMethod.RAZORPAY);
    Payment payment = getLatestPayment(booking);

    if (payment.getStatus() == PaymentStatus.SUCCESS) {
      return BookingResponse.fromEntity(booking);
    }

    if (!request.getRazorpayOrderId().equals(payment.getGatewayOrderId())) {
      throw new IllegalArgumentException("Order ID does not match this booking");
    }

    try {
      String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
      boolean valid = Utils.verifySignature(
          payload, request.getRazorpaySignature(), razorpayProperties.getKeySecret());

      if (!valid) {
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
        throw new IllegalArgumentException("Invalid Razorpay payment signature");
      }
    } catch (RazorpayException ex) {
      throw new IllegalArgumentException("Payment verification failed: " + ex.getMessage());
    }

    return confirmPayment(booking, payment, request.getRazorpayPaymentId());
  }

  @Override
  @Transactional
  public StripeCheckoutResponse createStripeCheckout(Long bookingId, String userEmail) {
    if (!stripeProperties.isConfigured()) {
      throw new IllegalArgumentException("Stripe is not configured on the server");
    }

    Booking booking = getPendingOnlineBooking(bookingId, userEmail, PaymentMethod.STRIPE);
    Payment payment = getLatestPendingPayment(booking);

    Stripe.apiKey = stripeProperties.getSecretKey();

    String successUrl = appProperties.getFrontendUrl()
        + "/student/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=" + booking.getId();
    String cancelUrl = appProperties.getFrontendUrl()
        + "/student/bookings?payment=cancelled";

    try {
      SessionCreateParams params = SessionCreateParams.builder()
          .setMode(SessionCreateParams.Mode.PAYMENT)
          .setSuccessUrl(successUrl)
          .setCancelUrl(cancelUrl)
          .putMetadata("bookingId", booking.getId().toString())
          .addLineItem(
              SessionCreateParams.LineItem.builder()
                  .setQuantity(1L)
                  .setPriceData(
                      SessionCreateParams.LineItem.PriceData.builder()
                          .setCurrency(paymentProperties.getCurrency().toLowerCase())
                          .setUnitAmount(toSmallestUnit(payment.getAmount()))
                          .setProductData(
                              SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                  .setName("Hostel booking — " + booking.getRoom().getHostel().getName())
                                  .setDescription("Room " + booking.getRoom().getRoomNumber())
                                  .build())
                          .build())
                  .build())
          .build();

      Session session = Session.create(params);

      payment.setGatewayOrderId(session.getId());
      paymentRepository.save(payment);

      StripeCheckoutResponse response = new StripeCheckoutResponse();
      response.setBookingId(booking.getId());
      response.setSessionId(session.getId());
      response.setCheckoutUrl(session.getUrl());
      response.setPublishableKey(stripeProperties.getPublishableKey());
      return response;
    } catch (Exception ex) {
      throw new IllegalArgumentException("Failed to create Stripe checkout: " + ex.getMessage());
    }
  }

  @Override
  @Transactional
  public BookingResponse verifyStripePayment(VerifyStripeRequest request, String userEmail) {
    if (!stripeProperties.isConfigured()) {
      throw new IllegalArgumentException("Stripe is not configured on the server");
    }

    Booking booking = getPendingOnlineBooking(request.getBookingId(), userEmail, PaymentMethod.STRIPE);
    Payment payment = getLatestPayment(booking);

    if (payment.getStatus() == PaymentStatus.SUCCESS) {
      return BookingResponse.fromEntity(booking);
    }

    if (!request.getSessionId().equals(payment.getGatewayOrderId())) {
      throw new IllegalArgumentException("Session ID does not match this booking");
    }

    Stripe.apiKey = stripeProperties.getSecretKey();

    try {
      Session session = Session.retrieve(request.getSessionId());

      if (!"paid".equals(session.getPaymentStatus())) {
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
        throw new IllegalArgumentException("Stripe payment is not completed");
      }

      String paymentIntentId = session.getPaymentIntent();
      return confirmPayment(booking, payment, paymentIntentId);
    } catch (Exception ex) {
      throw new IllegalArgumentException("Stripe verification failed: " + ex.getMessage());
    }
  }

  private BookingResponse confirmPayment(Booking booking, Payment payment, String gatewayPaymentId) {
    payment.setGatewayPaymentId(gatewayPaymentId);
    payment.setStatus(PaymentStatus.SUCCESS);
    payment.setPaidAt(LocalDateTime.now());
    paymentRepository.save(payment);

    booking.setStatus(BookingStatus.CONFIRMED);
    bookingRepository.save(booking);

    return BookingResponse.fromEntity(booking);
  }

  private Booking getPendingOnlineBooking(Long bookingId, String userEmail, PaymentMethod method) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    if (!booking.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("You are not allowed to pay for this booking");
    }

    if (booking.getPaymentMethod() != method) {
      throw new IllegalArgumentException("Booking payment method mismatch");
    }

    if (booking.getStatus() == BookingStatus.CONFIRMED) {
      return booking;
    }

    if (booking.getStatus() != BookingStatus.PENDING) {
      throw new IllegalArgumentException("Booking is not awaiting payment");
    }

    return booking;
  }

  private Payment getLatestPayment(Booking booking) {
    List<Payment> payments = paymentRepository.findByBookingIdOrderByCreatedAtDesc(booking.getId());
    if (payments.isEmpty()) {
      throw new IllegalArgumentException("No payment record found for this booking");
    }
    return payments.get(0);
  }

  private Payment getLatestPendingPayment(Booking booking) {
    Payment payment = getLatestPayment(booking);
    if (payment.getStatus() != PaymentStatus.PENDING) {
      throw new IllegalArgumentException("Payment is no longer pending");
    }
    return payment;
  }

  private long toSmallestUnit(BigDecimal amount) {
    return amount.multiply(BigDecimal.valueOf(100))
        .setScale(0, RoundingMode.HALF_UP)
        .longValueExact();
  }
}
