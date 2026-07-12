import { useState } from "react";
import { useGetOwnerBookingsQuery } from "@/api/bookingApi";
import Table, { type Column } from "@/components/ui/Table";
import Badge, { statusToBadgeVariant } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { PAYMENT_METHOD_SHORT, paymentStatusLabel, paymentStatusVariant } from "@/utils/paymentLabels";
import type { Booking } from "@/types/booking";

const PAGE_SIZE = 10;

export default function OwnerBookingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOwnerBookingsQuery({ page, limit: PAGE_SIZE });

  const bookings = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns: Column<Booking>[] = [
    { key: "hostelName", label: "Hostel" },
    { key: "roomNumber", label: "Room" },
    {
      key: "userFullName",
      label: "Student",
      render: (r) => r.userFullName ?? r.userEmail,
    },
    { key: "userEmail", label: "Email" },
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
      render: (r) => PAYMENT_METHOD_SHORT[r.paymentMethod],
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
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={bookings}
        loading={isLoading}
        emptyMessage="No bookings yet. Students can book rooms from the student panel."
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
