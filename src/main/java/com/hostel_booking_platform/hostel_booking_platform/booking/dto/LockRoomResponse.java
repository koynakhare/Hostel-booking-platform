package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.RoomLock;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LockRoomResponse {

  private Long lockId;
  private Long roomId;
  private LocalDate checkIn;
  private LocalDate checkOut;
  private LocalDateTime expiresAt;

  public LockRoomResponse() {
  }

  public static LockRoomResponse fromEntity(RoomLock lock) {
    LockRoomResponse response = new LockRoomResponse();
    response.setLockId(lock.getId());
    response.setRoomId(lock.getRoom().getId());
    response.setCheckIn(lock.getCheckIn());
    response.setCheckOut(lock.getCheckOut());
    response.setExpiresAt(lock.getExpiresAt());
    return response;
  }

  public Long getLockId() {
    return lockId;
  }

  public void setLockId(Long lockId) {
    this.lockId = lockId;
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

  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(LocalDateTime expiresAt) {
    this.expiresAt = expiresAt;
  }
}