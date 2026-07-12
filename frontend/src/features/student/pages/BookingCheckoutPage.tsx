import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { createResolver } from "@/utils/form";
import { z } from "zod";
import { useGetHostelQuery } from "@/api/hostelApi";
import { useLockRoomMutation, useCreateBookingMutation } from "@/api/bookingApi";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import BookingSummaryCard from "@/features/student/components/BookingSummaryCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import Loader from "@/components/ui/Loader";
import { PAYMENT_METHODS, STUDENT_ROUTES } from "@/utils/constants";
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

  const { data: hostel, isLoading } = useGetHostelQuery(Number(hostelId));
  const [lockRoom, { isLoading: locking }] = useLockRoomMutation();
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: createResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      paymentMethod: "RAZORPAY",
    },
  });

  if (!state?.room) {
    return (
      <Card>
        <p className="text-sm text-text-muted">No room selected. Please go back and select a room.</p>
        <Button className="mt-4" onClick={() => navigate(`/student/hostels/${hostelId}`)}>
          Back to Hostel
        </Button>
      </Card>
    );
  }

  if (isLoading) return <Loader label="Loading..." />;

  const onSubmit = async (data: FormData) => {
    const { room, checkIn, checkOut, seatCount = 1 } = state;
    try {
      await lockRoom({ roomId: room.id, checkIn, checkOut, seatCount }).unwrap();
      await createBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        paymentMethod: data.paymentMethod,
        seatCount,
      }).unwrap();
      navigate(STUDENT_ROUTES.myBookings);
    } catch { /* handled */ }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle p-3">
                    <input
                      type="radio"
                      value={value}
                      checked={field.value === value}
                      onChange={() => field.onChange(value)}
                      className="text-accent"
                    />
                    <span className="text-sm">{key.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
            )}
          />

          <Button type="submit" loading={locking || booking} className="w-full">
            Confirm & Pay
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
