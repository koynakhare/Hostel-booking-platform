import { useState } from "react";
import { useGetMyBookingsQuery, useCancelBookingMutation } from "@/api/bookingApi";
import PayBookingModal from "@/features/student/components/PayBookingModal";
import Table, { type Column } from "@/components/ui/Table";
import Badge, { statusToBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  PAYMENT_METHOD_SHORT,
  canCompletePayment,
  paymentStatusLabel,
  paymentStatusVariant,
} from "@/utils/paymentLabels";
import type { Booking } from "@/types/booking";

const PAGE_SIZE = 5;

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyBookingsQuery({ page, limit: PAGE_SIZE });
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [payBooking, setPayBooking] = useState<Booking | null>(null);

  const bookings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

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
      key: "paymentMethod",
      label: "Payment",
      render: (r) => (
        <span className="text-sm text-text-primary">{PAYMENT_METHOD_SHORT[r.paymentMethod]}</span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (r) => (
        <Badge
          label={paymentStatusLabel(r.paymentStatus, r.paymentMethod, r.status)}
          variant={paymentStatusVariant(r.paymentStatus, r.paymentMethod, r.status)}
        />
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (r) => formatCurrency(r.totalAmount),
    },
    {
      key: "id",
      label: "Actions",
      render: (r) => (
        <div className="flex flex-wrap gap-1.5">
          {canCompletePayment(r) && (
            <Button size="sm" onClick={() => setPayBooking(r)}>
              Pay
            </Button>
          )}
          {r.status !== "CANCELLED" && (
            <Button size="sm" variant="danger" onClick={() => setCancelId(r.id)}>
              Cancel
            </Button>
          )}
        </div>
      ),
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
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Table
        columns={columns}
        data={bookings}
        loading={isLoading}
        dense
        emptyMessage="No bookings yet. Browse hostels to book your first room!"
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
      />
      <PayBookingModal
        booking={payBooking}
        open={payBooking !== null}
        onClose={() => setPayBooking(null)}
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
