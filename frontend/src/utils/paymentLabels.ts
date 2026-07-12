import type { Booking, PaymentMethod } from "@/types/booking";
import { PAYMENT_METHODS } from "@/utils/constants";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  RAZORPAY: "Razorpay (UPI / Card / Netbanking)",
  STRIPE: "Stripe (Card)",
  CASH_ON_ARRIVAL: "Cash on Arrival",
};

export const PAYMENT_METHOD_SHORT: Record<PaymentMethod, string> = {
  RAZORPAY: "Razorpay",
  STRIPE: "Stripe",
  CASH_ON_ARRIVAL: "Cash on Arrival",
};

export function paymentStatusLabel(
  status?: string,
  paymentMethod?: PaymentMethod,
  bookingStatus?: string,
): string {
  if (bookingStatus === "CONFIRMED") {
    if (paymentMethod === PAYMENT_METHODS.CASH_ON_ARRIVAL) return "Due on Arrival";
    return "Paid";
  }
  if (status === "SUCCESS") return "Paid";
  if (status === "FAILED") return "Failed";
  if (status === "REFUNDED") return "Refunded";
  return "Pending";
}

export function canCompletePayment(booking: Booking): boolean {
  if (booking.status === "CANCELLED" || booking.status === "EXPIRED") return false;
  if (booking.paymentStatus === "SUCCESS") return false;
  if (booking.paymentStatus === "REFUNDED") return false;

  if (
    booking.paymentMethod === PAYMENT_METHODS.CASH_ON_ARRIVAL
    && booking.status === "CONFIRMED"
  ) {
    return true;
  }

  return (
    booking.status === "PENDING"
    && (booking.paymentMethod === PAYMENT_METHODS.RAZORPAY
      || booking.paymentMethod === PAYMENT_METHODS.STRIPE)
  );
}

export function paymentStatusVariant(
  status?: string,
  paymentMethod?: PaymentMethod,
  bookingStatus?: string,
): "success" | "warning" | "danger" | "neutral" {
  const label = paymentStatusLabel(status, paymentMethod, bookingStatus);
  if (label === "Paid") return "success";
  if (label === "Due on Arrival" || label === "Pending") return "warning";
  if (label === "Failed") return "danger";
  return "neutral";
}
