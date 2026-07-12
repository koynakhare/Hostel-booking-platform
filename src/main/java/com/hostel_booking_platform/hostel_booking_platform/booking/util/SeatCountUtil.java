package com.hostel_booking_platform.hostel_booking_platform.booking.util;

public final class SeatCountUtil {

  private SeatCountUtil() {
  }

  public static int resolve(Integer seatCount) {
    if (seatCount == null || seatCount < 1) {
      return 1;
    }
    return seatCount;
  }
}
