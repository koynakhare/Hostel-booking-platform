package com.hostel_booking_platform.hostel_booking_platform.room.dto;

import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomStatus;
import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RoomSheetResponse {

  private Long hostelId;
  private String hostelName;
  private LocalDate checkIn;
  private LocalDate checkOut;
  private List<FloorSheet> floors = new ArrayList<>();

  public RoomSheetResponse() {
  }

  public Long getHostelId() {
    return hostelId;
  }

  public void setHostelId(Long hostelId) {
    this.hostelId = hostelId;
  }

  public String getHostelName() {
    return hostelName;
  }

  public void setHostelName(String hostelName) {
    this.hostelName = hostelName;
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

  public List<FloorSheet> getFloors() {
    return floors;
  }

  public void setFloors(List<FloorSheet> floors) {
    this.floors = floors;
  }

  public static class FloorSheet {
    private Integer floorNumber;
    private List<RoomSlot> rooms = new ArrayList<>();

    public FloorSheet() {
    }

    public FloorSheet(Integer floorNumber) {
      this.floorNumber = floorNumber;
    }

    public Integer getFloorNumber() {
      return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
      this.floorNumber = floorNumber;
    }

    public List<RoomSlot> getRooms() {
      return rooms;
    }

    public void setRooms(List<RoomSlot> rooms) {
      this.rooms = rooms;
    }
  }

  public static class RoomSlot {
    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private BigDecimal pricePerMonth;
    private Integer capacity;
    private boolean hasWindow;
    private boolean hasBalcony;
    private Integer rowPosition;
    private Integer colPosition;
    private RoomStatus status;
    private Integer availableSeats;

    public RoomSlot() {
    }

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getRoomNumber() {
      return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
      this.roomNumber = roomNumber;
    }

    public RoomType getRoomType() {
      return roomType;
    }

    public void setRoomType(RoomType roomType) {
      this.roomType = roomType;
    }

    public BigDecimal getPricePerMonth() {
      return pricePerMonth;
    }

    public void setPricePerMonth(BigDecimal pricePerMonth) {
      this.pricePerMonth = pricePerMonth;
    }

    public Integer getCapacity() {
      return capacity;
    }

    public void setCapacity(Integer capacity) {
      this.capacity = capacity;
    }

    public boolean isHasWindow() {
      return hasWindow;
    }

    public void setHasWindow(boolean hasWindow) {
      this.hasWindow = hasWindow;
    }

    public boolean isHasBalcony() {
      return hasBalcony;
    }

    public void setHasBalcony(boolean hasBalcony) {
      this.hasBalcony = hasBalcony;
    }

    public Integer getRowPosition() {
      return rowPosition;
    }

    public void setRowPosition(Integer rowPosition) {
      this.rowPosition = rowPosition;
    }

    public Integer getColPosition() {
      return colPosition;
    }

    public void setColPosition(Integer colPosition) {
      this.colPosition = colPosition;
    }

    public RoomStatus getStatus() {
      return status;
    }

    public void setStatus(RoomStatus status) {
      this.status = status;
    }

    public Integer getAvailableSeats() {
      return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
      this.availableSeats = availableSeats;
    }
  }
}