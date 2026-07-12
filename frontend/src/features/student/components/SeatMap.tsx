import { useMemo } from "react";
import type { RoomSheetItem } from "@/types/room";
import { dailyRateFromMonthly } from "@/utils/formatters";

export type SeatStatus = "AVAILABLE" | "BOOKED" | "SELECTED" | "LOCKED" | "UNAVAILABLE";

interface SeatMapProps {
  rooms: RoomSheetItem[];
  selectedRoomId: number | null;
  onSelect: (room: RoomSheetItem) => void;
}

const statusColors: Record<SeatStatus, string> = {
  AVAILABLE: "bg-emerald-100 border-emerald-400 text-emerald-700 hover:bg-emerald-200 cursor-pointer",
  SELECTED: "bg-accent/20 border-accent text-accent-dark ring-2 ring-accent cursor-pointer",
  BOOKED: "bg-red-100 border-red-300 text-red-600 cursor-not-allowed opacity-70",
  LOCKED: "bg-amber-100 border-amber-300 text-amber-700 cursor-not-allowed opacity-70",
  UNAVAILABLE: "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-50",
};

const GRID_COLS = 4;

function layoutRooms(rooms: RoomSheetItem[]): RoomSheetItem[] {
  const uniquePositions = new Set(
    rooms.map((room) => `${room.rowPosition}-${room.colPosition}`),
  );

  if (uniquePositions.size === rooms.length) {
    return rooms;
  }

  return rooms.map((room, index) => ({
    ...room,
    rowPosition: Math.floor(index / GRID_COLS) + 1,
    colPosition: (index % GRID_COLS) + 1,
  }));
}

export default function SeatMap({ rooms, selectedRoomId, onSelect }: SeatMapProps) {
  const positionedRooms = useMemo(() => layoutRooms(rooms), [rooms]);
  const maxRow = Math.max(...positionedRooms.map((r) => r.rowPosition), 1);
  const maxCol = Math.max(...positionedRooms.map((r) => r.colPosition), 1);

  const getRoomAt = (row: number, col: number) =>
    positionedRooms.find((r) => r.rowPosition === row && r.colPosition === col);

  const getStatus = (room: RoomSheetItem): SeatStatus => {
    if (room.id === selectedRoomId) return "SELECTED";
    return room.status as SeatStatus;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs">
        {(["AVAILABLE", "SELECTED", "BOOKED", "LOCKED"] as SeatStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${statusColors[s].split(" ")[0]} ${statusColors[s].split(" ")[1]}`} />
            <span className="text-text-muted">{s}</span>
          </div>
        ))}
      </div>

      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `repeat(${maxCol}, minmax(64px, 1fr))` }}
      >
        {Array.from({ length: maxRow }, (_, ri) =>
          Array.from({ length: maxCol }, (_, ci) => {
            const room = getRoomAt(ri + 1, ci + 1);
            if (!room) {
              return <div key={`${ri}-${ci}`} className="h-16 w-16" />;
            }
            const status = getStatus(room);
            const clickable = status === "AVAILABLE" || status === "SELECTED";
            const featureLabel = [
              room.hasWindow ? "Window" : "No window",
              room.hasBalcony ? "Balcony" : "No balcony",
            ].join(" · ");

            return (
              <button
                key={room.id}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelect(room)}
                className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${statusColors[status]}`}
                title={`Room ${room.roomNumber} — ${featureLabel} — ${room.availableSeats ?? room.capacity} seats free for stay — ₹${Math.round(dailyRateFromMonthly(room.pricePerMonth))}/seat/day`}
              >
                <span className="font-bold">{room.roomNumber}</span>
                <span className="text-[10px] opacity-70">
                  {room.availableSeats ?? room.capacity} free
                </span>
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
