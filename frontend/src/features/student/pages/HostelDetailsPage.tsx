import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetHostelQuery } from "@/api/hostelApi";
import { useGetRoomSheetQuery } from "@/api/roomApi";
import SeatMap from "@/features/student/components/SeatMap";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import HostelImage from "@/components/ui/HostelImage";
import RoomFeatureBadges from "@/components/ui/RoomFeatureBadges";
import {
  addDays,
  dailyRateFromMonthly,
  formatCurrency,
  isValidStayDateRange,
  localToday,
} from "@/utils/formatters";
import type { RoomSheetItem } from "@/types/room";
import Input from "@/components/ui/Input";
import { STUDENT_ROUTES } from "@/utils/constants";

export default function HostelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hostelId = Number(id);

  const today = localToday();

  const [draftCheckIn, setDraftCheckIn] = useState("");
  const [draftCheckOut, setDraftCheckOut] = useState("");
  const [appliedCheckIn, setAppliedCheckIn] = useState("");
  const [appliedCheckOut, setAppliedCheckOut] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomSheetItem | null>(null);

  const datesReady = isValidStayDateRange(appliedCheckIn, appliedCheckOut);
  const checkoutMin = draftCheckIn ? addDays(draftCheckIn, 1) : addDays(today, 1);

  const { data: hostel, isLoading: loadingHostel } = useGetHostelQuery(hostelId);
  const {
    data: sheet,
    isLoading: loadingSheet,
    isFetching: fetchingSheet,
  } = useGetRoomSheetQuery(
    { hostelId, checkIn: appliedCheckIn, checkOut: appliedCheckOut },
    {
      skip: !hostelId || !datesReady,
      refetchOnMountOrArgChange: true,
    },
  );

  const formatFloorLabel = (floorNumber: number) =>
    floorNumber === 0 ? "Ground Floor" : `Floor ${floorNumber}`;

  const [seatCount, setSeatCount] = useState(1);

  const maxSeatsForRoom = (room: RoomSheetItem) =>
    Math.min(2, room.availableSeats ?? room.capacity);

  const tryApplyDates = (checkIn: string, checkOut: string) => {
    if (!isValidStayDateRange(checkIn, checkOut)) {
      return;
    }

    setDateError(null);
    if (checkIn !== appliedCheckIn || checkOut !== appliedCheckOut) {
      setAppliedCheckIn(checkIn);
      setAppliedCheckOut(checkOut);
      setSelectedRoom(null);
      setSeatCount(1);
    }
  };

  const handleCheckInChange = (value: string) => {
    if (!value) {
      setDraftCheckIn("");
      return;
    }

    setDraftCheckIn(value);
    setDateError(null);

    let nextCheckOut = draftCheckOut;
    if (nextCheckOut && nextCheckOut <= value) {
      nextCheckOut = "";
      setDraftCheckOut("");
    }

    tryApplyDates(value, nextCheckOut);
  };

  const handleCheckOutChange = (value: string) => {
    if (!value) {
      setDraftCheckOut("");
      return;
    }

    setDraftCheckOut(value);
    setDateError(null);

    if (!draftCheckIn) {
      setDateError("Select a check-in date first.");
      return;
    }

    if (value <= draftCheckIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }

    tryApplyDates(draftCheckIn, value);
  };

  useEffect(() => {
    if (!selectedRoom) return;
    const maxSeats = maxSeatsForRoom(selectedRoom);
    if (seatCount > maxSeats) {
      setSeatCount(maxSeats);
    }
  }, [selectedRoom, seatCount]);

  const handleSelectRoom = (room: RoomSheetItem) => {
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
      setSeatCount(1);
      return;
    }
    setSelectedRoom(room);
    setSeatCount(1);
  };

  const handleBook = () => {
    if (!selectedRoom || !datesReady) return;
    navigate(`/student/checkout/${hostelId}`, {
      state: { room: selectedRoom, checkIn: appliedCheckIn, checkOut: appliedCheckOut, seatCount },
    });
  };

  if (loadingHostel) return <Loader label="Loading hostel..." />;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={STUDENT_ROUTES.browse}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-accent"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to all hostels
      </Link>

      {/* Gallery + info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {hostel?.images?.length ? (
            <div className="grid grid-cols-2 gap-2">
              {hostel.images.map((img, i) => (
                <HostelImage
                  key={i}
                  src={img}
                  alt={hostel.name}
                  className={`rounded-lg object-cover ${i === 0 ? "col-span-2 h-56 w-full" : "h-28 w-full"}`}
                />
              ))}
            </div>
          ) : (
            <HostelImage
              src={null}
              alt={hostel?.name ?? "Hostel"}
              className="card-base h-56 w-full rounded-lg object-cover"
            />
          )}
        </div>

        <Card>
          <h2 className="text-xl font-bold text-text-primary">{hostel?.name}</h2>
          <p className="mt-1 text-sm text-text-muted">{hostel?.city}, {hostel?.state}</p>
          <p className="mt-4 text-sm text-text-primary">{hostel?.description}</p>
          {hostel?.amenities && (
            <p className="mt-3 text-sm text-text-muted">
              <span className="font-medium text-text-primary">Amenities:</span> {hostel.amenities}
            </p>
          )}
          <p className="mt-2 text-sm text-text-muted">{hostel?.address}</p>
        </Card>
      </div>

      {/* Date selection + seat map */}
      <Card accentTop>
        <h3 className="mb-4 text-base font-bold text-text-primary">Select Room</h3>
        <p className="mb-4 text-xs text-text-muted">
          Seat counts apply to your full stay. A room may have more seats free on some days,
          but you can only book what is available for every day between check-in and check-out.
        </p>
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Check-in</label>
            <Input
              type="date"
              value={draftCheckIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Check-out</label>
            <Input
              type="date"
              value={draftCheckOut}
              min={checkoutMin}
              disabled={!draftCheckIn}
              onChange={(e) => handleCheckOutChange(e.target.value)}
            />
          </div>
        </div>

        {dateError && (
          <p className="mb-4 text-sm text-red-600">{dateError}</p>
        )}

        {!datesReady ? (
          <p className="text-sm text-text-muted">
            Choose check-in and check-out dates to view room availability.
          </p>
        ) : loadingSheet || fetchingSheet ? (
          <Loader label="Loading room map..." />
        ) : sheet?.floors.length ? (
          <div className="space-y-8">
            {sheet.floors.map((floor) => (
              <div key={floor.floorNumber}>
                <h4 className="mb-3 text-sm font-semibold text-text-primary">
                  {formatFloorLabel(floor.floorNumber)}
                </h4>
                <SeatMap
                  rooms={floor.rooms}
                  selectedRoomId={selectedRoom?.id ?? null}
                  onSelect={handleSelectRoom}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No rooms available for this hostel.</p>
        )}

        {selectedRoom && (
          <div className="mt-6 space-y-4 rounded-lg bg-bg-page p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">Room {selectedRoom.roomNumber}</p>
                <p className="text-sm text-text-muted">
                  {formatCurrency(dailyRateFromMonthly(selectedRoom.pricePerMonth))}/seat/day ·{" "}
                  {selectedRoom.availableSeats ?? selectedRoom.capacity} seat
                  {(selectedRoom.availableSeats ?? selectedRoom.capacity) === 1 ? "" : "s"} available
                  for this stay
                </p>
                <div className="mt-2">
                  <RoomFeatureBadges
                    hasWindow={selectedRoom.hasWindow}
                    hasBalcony={selectedRoom.hasBalcony}
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-text-muted">Seats to book</p>
                <div className="flex gap-2">
                  {[1, 2]
                    .filter((count) => count <= maxSeatsForRoom(selectedRoom))
                    .map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSeatCount(count)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        seatCount === count
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-subtle text-text-primary hover:bg-card-bg"
                      }`}
                    >
                      {count} seat{count > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleBook}>Book Now</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
