import { baseApi } from "@/api/baseApi";
import { showToast } from "@/features/toast/toastSlice";
import type {
  PaymentConfig,
  RazorpayOrder,
  StripeCheckout,
  VerifyRazorpayRequest,
  VerifyStripeRequest,
  PaymentVerifyResponse,
} from "@/types/payment";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentConfig: builder.query<PaymentConfig, void>({
      query: () => "/payments/config",
    }),
    createRazorpayOrder: builder.mutation<RazorpayOrder, number>({
      query: (bookingId) => ({
        url: `/payments/razorpay/order/${bookingId}`,
        method: "POST",
      }),
    }),
    verifyRazorpayPayment: builder.mutation<PaymentVerifyResponse, VerifyRazorpayRequest>({
      query: (body) => ({
        url: "/payments/razorpay/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Payment successful! Booking confirmed.", type: "success" }));
        } catch { /* handled */ }
      },
    }),
    createStripeCheckout: builder.mutation<StripeCheckout, number>({
      query: (bookingId) => ({
        url: `/payments/stripe/checkout/${bookingId}`,
        method: "POST",
      }),
    }),
    verifyStripePayment: builder.mutation<PaymentVerifyResponse, VerifyStripeRequest>({
      query: (body) => ({
        url: "/payments/stripe/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Payment successful! Booking confirmed.", type: "success" }));
        } catch { /* handled */ }
      },
    }),
  }),
});

export const {
  useGetPaymentConfigQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateStripeCheckoutMutation,
  useVerifyStripePaymentMutation,
} = paymentApi;
