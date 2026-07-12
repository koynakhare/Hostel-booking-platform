package com.hostel_booking_platform.hostel_booking_platform.booking.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class PricingUtil {

  private static final int DAYS_PER_MONTH = 30;

  private PricingUtil() {}

  public static long stayDays(LocalDate checkIn, LocalDate checkOut) {
    long days = ChronoUnit.DAYS.between(checkIn, checkOut);
    return days < 1 ? 1 : days;
  }

  public static BigDecimal dailyRateFromMonthly(BigDecimal pricePerMonth) {
    return pricePerMonth.divide(
        BigDecimal.valueOf(DAYS_PER_MONTH), 4, RoundingMode.HALF_UP);
  }

  public static BigDecimal calculateTotalAmount(
      BigDecimal pricePerMonth, LocalDate checkIn, LocalDate checkOut, int seatCount) {
    long days = stayDays(checkIn, checkOut);
    BigDecimal dailyRate = dailyRateFromMonthly(pricePerMonth);
    return dailyRate
        .multiply(BigDecimal.valueOf(days))
        .multiply(BigDecimal.valueOf(seatCount))
        .setScale(0, RoundingMode.HALF_UP);
  }
}
