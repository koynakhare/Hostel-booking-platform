package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class LockRoomRequest {

  @NotNull(message = "Room id is required")
  private Long roomId;

  @NotNull(message = "Check-in date is required")
  private LocalDate checkIn;

  @NotNull(message = "Check-out date is required")
  private LocalDate checkOut;

  @NotNull(message = "Seat count is required")
  @Min(value = 1, message = "You must book at least 1 seat")
  @Max(value = 2, message = "You can book at most 2 seats at a time")
  private Integer seatCount;

  public LockRoomRequest() {
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  public LocalDate getCheckIn() {
    return checkIn;
  }

  public void setCheckIn(LocalDate checkIn) {
    this.checkIn = checkIn;
  }

  public LocalDate getCheckOut() {
    return checkOut;
  }

  public void setCheckOut(LocalDate checkOut) {
    this.checkOut = checkOut;
  }

  public Integer getSeatCount() {
    return seatCount;
  }

  public void setSeatCount(Integer seatCount) {
    this.seatCount = seatCount;
  }
}