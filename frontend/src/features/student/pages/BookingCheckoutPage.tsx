import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { createResolver } from "@/utils/form";
import { z } from "zod";
import { useGetHostelQuery } from "@/api/hostelApi";
import { useLockRoomMutation, useCreateBookingMutation } from "@/api/bookingApi";
import {
  useGetPaymentConfigQuery,
} from "@/api/paymentApi";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { useOnlinePayment } from "@/features/student/hooks/useOnlinePayment";
import BookingSummaryCard from "@/features/student/components/BookingSummaryCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import Loader from "@/components/ui/Loader";
import { PAYMENT_METHODS, STUDENT_ROUTES } from "@/utils/constants";
import { PAYMENT_LABELS } from "@/utils/paymentLabels";
import type { PaymentMethod } from "@/types/booking";
import type { RoomSheetItem } from "@/types/room";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE", "CASH_ON_ARRIVAL"]),
});

type FormData = z.infer<typeof schema>;

interface LocationState {
  room: RoomSheetItem;
  checkIn: string;
  checkOut: string;
  seatCount: number;
}

export default function BookingCheckoutPage() {
  const { hostelId } = useParams<{ hostelId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const state = location.state as LocationState | null;
  const { payForBooking, isPaying } = useOnlinePayment();

  const { data: hostel, isLoading } = useGetHostelQuery(Number(hostelId));
  const { data: paymentConfig, isLoading: loadingConfig } = useGetPaymentConfigQuery();
  const [lockRoom, { isLoading: locking }] = useLockRoomMutation();
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();

  const availableMethods = useMemo(
    () =>
      (Object.values(PAYMENT_METHODS) as PaymentMethod[]).filter((method) => {
        if (method === PAYMENT_METHODS.RAZORPAY) return paymentConfig?.razorpayEnabled;
        if (method === PAYMENT_METHODS.STRIPE) return paymentConfig?.stripeEnabled;
        return true;
      }),
    [paymentConfig],
  );

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      paymentMethod: PAYMENT_METHODS.CASH_ON_ARRIVAL,
    },
  });

  const didInitMethod = useRef(false);
  useEffect(() => {
    if (!didInitMethod.current && availableMethods.length > 0) {
      setValue("paymentMethod", availableMethods[0]);
      didInitMethod.current = true;
    }
  }, [availableMethods, setValue]);

  const selectedMethod = watch("paymentMethod");

  if (!state?.room) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <p className="text-sm text-text-muted">No room selected. Please go back and select a room.</p>
          <Button className="mt-4" onClick={() => navigate(`/student/hostels/${hostelId}`)}>
            Back to Hostel
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || loadingConfig) return <Loader label="Loading..." />;

  const onSubmit = async (data: FormData) => {
    const { room, checkIn, checkOut, seatCount = 1 } = state;
    try {
      await lockRoom({ roomId: room.id, checkIn, checkOut, seatCount }).unwrap();
      const created = await createBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        paymentMethod: data.paymentMethod,
        seatCount,
      }).unwrap();

      if (data.paymentMethod === PAYMENT_METHODS.CASH_ON_ARRIVAL) {
        navigate(STUDENT_ROUTES.myBookings);
        return;
      }

      await payForBooking(created.id, data.paymentMethod, hostel?.name ?? "", {
        onDismiss: () => navigate(STUDENT_ROUTES.myBookings),
      });
    } catch { /* handled */ }
  };

  return (
    <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
      <Card accentTop>
        <h2 className="mb-4 text-lg font-bold text-text-primary">Confirm Booking</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField name="fullName" control={control} label="Full Name" required disabled />
          <TextField name="email" control={control} label="Email" required disabled />

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-primary">Payment Method</p>
                {availableMethods.length === 0 ? (
                  <p className="text-sm text-text-muted">No online payment gateways configured.</p>
                ) : (
                  availableMethods.map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle p-3"
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                        className="text-accent"
                      />
                      <span className="text-sm">{PAYMENT_LABELS[value]}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            loading={locking || booking || isPaying}
            disabled={availableMethods.length === 0 && selectedMethod !== PAYMENT_METHODS.CASH_ON_ARRIVAL}
            className="w-full"
          >
            {selectedMethod === PAYMENT_METHODS.CASH_ON_ARRIVAL ? "Confirm Booking" : "Confirm & Pay"}
          </Button>
        </form>
      </Card>

      <BookingSummaryCard
        hostelName={hostel?.name ?? ""}
        room={state.room}
        checkIn={state.checkIn}
        checkOut={state.checkOut}
        seatCount={state.seatCount ?? 1}
      />
    </div>
  );
}
