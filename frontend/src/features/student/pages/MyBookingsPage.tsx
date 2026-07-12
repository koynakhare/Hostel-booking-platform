import { useState } from "react";
import { useGetMyBookingsQuery, useCancelBookingMutation } from "@/api/bookingApi";
import { useOnlinePayment } from "@/features/student/hooks/useOnlinePayment";
import Table, { type Column } from "@/components/ui/Table";
import Badge, { statusToBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { PAYMENT_METHODS } from "@/utils/constants";
import type { Booking } from "@/types/booking";

export default function MyBookingsPage() {
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const { payForBooking, isPaying } = useOnlinePayment();
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  const handlePay = async (booking: Booking) => {
    setPayingId(booking.id);
    try {
      await payForBooking(booking.id, booking.paymentMethod, booking.hostelName);
    } catch { /* handled */ } finally {
      setPayingId(null);
    }
  };

  const columns: Column<Booking>[] = [
    { key: "hostelName", label: "Hostel" },
    { key: "roomNumber", label: "Room" },
    {
      key: "checkIn",
      label: "Check-in",
      render: (r) => formatDate(r.checkIn),
    },
    {
      key: "checkOut",
      label: "Check-out",
      render: (r) => formatDate(r.checkOut),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge label={r.status} variant={statusToBadgeVariant(r.status)} />,
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (r) => formatCurrency(r.totalAmount),
    },
    {
      key: "id",
      label: "Actions",
      render: (r) => {
        const canPay =
          r.status === "PENDING"
          && (r.paymentMethod === PAYMENT_METHODS.RAZORPAY || r.paymentMethod === PAYMENT_METHODS.STRIPE);

        return (
          <div className="flex gap-2">
            {canPay && (
              <Button
                size="sm"
                loading={isPaying && payingId === r.id}
                onClick={() => handlePay(r)}
              >
                Pay Now
              </Button>
            )}
            {r.status !== "CANCELLED" && (
              <Button size="sm" variant="danger" onClick={() => setCancelId(r.id)}>
                Cancel
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelBooking(cancelId).unwrap();
      setCancelId(null);
    } catch { /* handled */ }
  };

  return (
    <div>
      <Table
        columns={columns}
        data={bookings}
        loading={isLoading}
        emptyMessage="No bookings yet. Browse hostels to book your first room!"
      />
      <ConfirmDialog
        open={cancelId !== null}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmLabel="Cancel Booking"
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
