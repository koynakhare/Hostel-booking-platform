import { useNavigate } from "react-router-dom";
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateStripeCheckoutMutation,
} from "@/api/paymentApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { showToast } from "@/features/toast/toastSlice";
import { PAYMENT_METHODS, STUDENT_ROUTES } from "@/utils/constants";
import { openRazorpayCheckout } from "@/utils/razorpay";
import type { PaymentMethod } from "@/types/booking";

interface PayOptions {
  onDismiss?: () => void;
}

export function useOnlinePayment() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [createRazorpayOrder, { isLoading: razorpayLoading }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpay, { isLoading: verifyLoading }] = useVerifyRazorpayPaymentMutation();
  const [createStripeCheckout, { isLoading: stripeLoading }] = useCreateStripeCheckoutMutation();

  const payForBooking = async (
    bookingId: number,
    paymentMethod: PaymentMethod,
    hostelName: string,
    options?: PayOptions,
  ) => {
    if (paymentMethod === PAYMENT_METHODS.RAZORPAY) {
      const order = await createRazorpayOrder(bookingId).unwrap();
      await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        hostelName: hostelName || order.hostelName,
        userName: user?.fullName ?? "",
        userEmail: user?.email ?? "",
        onSuccess: async (response) => {
          await verifyRazorpay({
            bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }).unwrap();
          navigate(STUDENT_ROUTES.myBookings);
        },
        onDismiss: () => {
          dispatch(showToast({
            message: "Payment cancelled. You can retry from My Bookings.",
            type: "error",
          }));
          options?.onDismiss?.();
        },
      });
      return;
    }

    if (paymentMethod === PAYMENT_METHODS.STRIPE) {
      const checkout = await createStripeCheckout(bookingId).unwrap();
      window.location.href = checkout.checkoutUrl;
    }
  };

  return {
    payForBooking,
    isPaying: razorpayLoading || verifyLoading || stripeLoading,
  };
}
