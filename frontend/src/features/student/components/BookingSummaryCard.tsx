import Card from "@/components/ui/Card";
import RoomFeatureBadges from "@/components/ui/RoomFeatureBadges";
import { formatCurrency, formatDate, calculateBookingTotal, daysBetween, dailyRateFromMonthly } from "@/utils/formatters";
import type { RoomSheetItem } from "@/types/room";

interface Props {
  hostelName: string;
  room: RoomSheetItem;
  checkIn: string;
  checkOut: string;
  seatCount: number;
}

export default function BookingSummaryCard({
  hostelName,
  room,
  checkIn,
  checkOut,
  seatCount,
}: Props) {
  const days = daysBetween(checkIn, checkOut);
  const dailyRate = dailyRateFromMonthly(room.pricePerMonth);
  const total = calculateBookingTotal(room.pricePerMonth, checkIn, checkOut, seatCount);

  return (
    <Card dark>
      <h3 className="text-base font-bold text-text-on-dark">Booking Summary</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Hostel</dt>
          <dd className="font-medium text-text-on-dark">{hostelName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Room</dt>
          <dd className="font-medium text-text-on-dark">{room.roomNumber} ({room.roomType})</dd>
        </div>
        <div className="flex justify-between items-start gap-4">
          <dt className="text-text-on-dark-muted">Features</dt>
          <dd>
            <RoomFeatureBadges
              hasWindow={room.hasWindow}
              hasBalcony={room.hasBalcony}
            />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Seats</dt>
          <dd className="text-text-on-dark">{seatCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Rent/seat/day</dt>
          <dd className="text-text-on-dark">{formatCurrency(dailyRate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Check-in</dt>
          <dd className="text-text-on-dark">{formatDate(checkIn)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Check-out</dt>
          <dd className="text-text-on-dark">{formatDate(checkOut)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-on-dark-muted">Duration</dt>
          <dd className="text-text-on-dark">{days} day{days > 1 ? "s" : ""}</dd>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-3">
          <dt className="font-semibold text-text-on-dark">Total</dt>
          <dd className="text-lg font-bold text-accent">{formatCurrency(total)}</dd>
        </div>
      </dl>
    </Card>
  );
}
