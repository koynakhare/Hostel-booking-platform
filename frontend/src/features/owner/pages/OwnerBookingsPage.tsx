import { useMemo, useState } from "react";
import { useGetHostelsQuery } from "@/api/hostelApi";
import { useGetRoomSheetQuery } from "@/api/roomApi";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import Table, { type Column } from "@/components/ui/Table";
import Badge, { statusToBadgeVariant } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatters";
import type { RoomSheetItem } from "@/types/room";

interface BookingRow {
  id: string;
  hostelName: string;
  roomNumber: string;
  roomType: string;
  status: string;
  pricePerMonth: number;
}

export default function OwnerBookingsPage() {
  const user = useAppSelector(selectUser);
  const { data: hostelsData } = useGetHostelsQuery({});
  const [selectedHostelId, setSelectedHostelId] = useState<number | "">("");

  const myHostels = useMemo(
    () => hostelsData?.content.filter((h) => h.ownerId === user?.id) ?? [],
    [hostelsData, user?.id],
  );

  const today = new Date().toISOString().split("T")[0];
  const threeMonths = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];

  const hostelId = selectedHostelId || myHostels[0]?.id;
  const { data: sheet, isLoading } = useGetRoomSheetQuery(
    { hostelId: hostelId!, checkIn: today, checkOut: threeMonths },
    { skip: !hostelId },
  );

  const bookedRooms: BookingRow[] = useMemo(() => {
    if (!sheet) return [];
    return sheet.floors.flatMap((floor) =>
      floor.rooms
        .filter((r) => r.status === "BOOKED" || r.status === "LOCKED")
        .map((r: RoomSheetItem) => ({
          id: `${sheet.hostelId}-${r.id}`,
          hostelName: sheet.hostelName,
          roomNumber: r.roomNumber,
          roomType: r.roomType,
          status: r.status,
          pricePerMonth: r.pricePerMonth,
        })),
    );
  }, [sheet]);

  const columns: Column<BookingRow>[] = [
    { key: "hostelName", label: "Hostel" },
    { key: "roomNumber", label: "Room" },
    { key: "roomType", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge label={r.status} variant={statusToBadgeVariant(r.status)} />,
    },
    {
      key: "pricePerMonth",
      label: "Rent/Month",
      render: (r) => formatCurrency(r.pricePerMonth),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Filter by Hostel</label>
        <select
          value={selectedHostelId || myHostels[0]?.id || ""}
          onChange={(e) => setSelectedHostelId(Number(e.target.value))}
          className="w-full rounded-button border border-border-subtle bg-card-bg px-3 py-2.5 text-sm"
        >
          {myHostels.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>
      <Table
        columns={columns}
        data={bookedRooms}
        loading={isLoading}
        emptyMessage="No booked or locked rooms for this hostel."
      />
    </div>
  );
}
