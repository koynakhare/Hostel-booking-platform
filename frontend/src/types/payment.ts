import type { Booking } from "@/types/booking";

export interface PaymentConfig {
  razorpayEnabled: boolean;
  stripeEnabled: boolean;
  razorpayKeyId: string;
  stripePublishableKey: string;
  currency: string;
}

export interface RazorpayOrder {
  bookingId: number;
  orderId: string;
  keyId: string;
  amount: number;
  currency: string;
  hostelName: string;
}

export interface VerifyRazorpayRequest {
  bookingId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface StripeCheckout {
  bookingId: number;
  sessionId: string;
  checkoutUrl: string;
  publishableKey: string;
}

export interface VerifyStripeRequest {
  bookingId: number;
  sessionId: string;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export type PaymentVerifyResponse = Booking;
