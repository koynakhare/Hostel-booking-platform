import { useState } from "react";
import { useGetMyBookingsQuery, useCancelBookingMutation } from "@/api/bookingApi";
import Table, { type Column } from "@/components/ui/Table";
import Badge, { statusToBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Booking } from "@/types/booking";

export default function MyBookingsPage() {
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [cancelId, setCancelId] = useState<number | null>(null);

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
      render: (r) =>
        r.status !== "CANCELLED" ? (
          <Button size="sm" variant="danger" onClick={() => setCancelId(r.id)}>
            Cancel
          </Button>
        ) : null,
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
