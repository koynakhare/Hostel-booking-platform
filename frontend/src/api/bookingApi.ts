import { baseApi } from "@/api/baseApi";
import { showToast } from "@/features/toast/toastSlice";
import type {
  Booking,
  CreateBookingRequest,
  LockRoomRequest,
  LockRoomResponse,
} from "@/types/booking";

const roomAvailabilityTags = [{ type: "Room" as const }];

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    lockRoom: builder.mutation<LockRoomResponse, LockRoomRequest>({
      query: (body) => ({
        url: "/bookings/lock",
        method: "POST",
        body,
      }),
      invalidatesTags: roomAvailabilityTags,
    }),
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", ...roomAvailabilityTags],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([
              "Booking",
              { type: "Room", id: `sheet-${data.hostelId}` },
            ]),
          );
          if (arg.paymentMethod === "CASH_ON_ARRIVAL") {
            dispatch(showToast({ message: "Booking confirmed! Pay cash on arrival.", type: "success" }));
          }
        } catch { /* handled */ }
      },
    }),
    getMyBookings: builder.query<Booking[], void>({
      query: () => "/bookings/my",
      providesTags: ["Booking"],
    }),
    getBooking: builder.query<Booking, number>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Booking", id }],
    }),
    cancelBooking: builder.mutation<void, number>({
      query: (id) => ({ url: `/bookings/${id}`, method: "DELETE" }),
      invalidatesTags: ["Booking", ...roomAvailabilityTags],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(showToast({ message: "Booking cancelled.", type: "success" }));
        } catch { /* handled */ }
      },
    }),
  }),
});

export const {
  useLockRoomMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useCancelBookingMutation,
} = bookingApi;
