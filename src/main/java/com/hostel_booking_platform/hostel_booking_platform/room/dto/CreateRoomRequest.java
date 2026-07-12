package com.hostel_booking_platform.hostel_booking_platform.room.dto;

import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CreateRoomRequest {
  @NotNull(message = "Hostel id is required")
  private Long hostelId;
  
  public Long getHostelId() { return hostelId; }
  public void setHostelId(Long hostelId) { this.hostelId = hostelId; }

  @NotNull(message = "Floor number is required")
  @Min(value = 0, message = "Floor number must be 0 or greater")
  private Integer floorNumber;

  @NotNull(message = "Row position is required")
  @Min(value = 1, message = "Row position must be at least 1")
  private Integer rowPosition;

  @NotNull(message = "Column position is required")
  @Min(value = 1, message = "Column position must be at least 1")
  private Integer colPosition;

  @NotBlank(message = "Room number is required")
  private String roomNumber;

  @NotNull(message = "Room type is required")
  private RoomType roomType;

  @NotNull(message = "Price per month is required")
  @DecimalMin(value = "0.01", message = "Price must be greater than 0")
  private BigDecimal pricePerMonth;

  @NotNull(message = "Capacity is required")
  @Min(value = 1, message = "Capacity must be at least 1")
  private Integer capacity;

  private boolean hasWindow;
  private boolean hasBalcony;

  public CreateRoomRequest() {
  }

  public Integer getFloorNumber() {
    return floorNumber;
  }

  public void setFloorNumber(Integer floorNumber) {
    this.floorNumber = floorNumber;
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
}