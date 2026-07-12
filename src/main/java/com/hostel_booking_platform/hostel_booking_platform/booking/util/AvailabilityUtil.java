package com.hostel_booking_platform.hostel_booking_platform.booking.util;

import java.time.LocalDate;
import java.util.List;
import java.util.TreeMap;

public final class AvailabilityUtil {

  private AvailabilityUtil() {}

  public record DateRangeSeats(LocalDate checkIn, LocalDate checkOut, int seatCount) {}

  public static int peakUsedSeats(
      LocalDate rangeStart, LocalDate rangeEnd, List<DateRangeSeats> reservations) {
    TreeMap<LocalDate, Integer> deltas = new TreeMap<>();

    for (DateRangeSeats reservation : reservations) {
      if (!datesOverlap(reservation.checkIn(), reservation.checkOut(), rangeStart, rangeEnd)) {
        continue;
      }

      LocalDate start = reservation.checkIn().isBefore(rangeStart) ? rangeStart : reservation.checkIn();
      LocalDate end = reservation.checkOut().isAfter(rangeEnd) ? rangeEnd : reservation.checkOut();
      if (!start.isBefore(end)) {
        continue;
      }

      deltas.merge(start, reservation.seatCount(), Integer::sum);
      deltas.merge(end, -reservation.seatCount(), Integer::sum);
    }

    int current = 0;
    int peak = 0;
    for (int delta : deltas.values()) {
      current += delta;
      peak = Math.max(peak, current);
    }
    return peak;
  }

  public static boolean datesOverlap(
      LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
    return start1.isBefore(end2) && end1.isAfter(start2);
  }
}
