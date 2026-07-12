package com.hostel_booking_platform.hostel_booking_platform.room.dto;

import com.hostel_booking_platform.hostel_booking_platform.room.entity.Room;
import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomResponse {

  private Long id;
  private Long hostelId;
  private Integer floorNumber;
  private Integer rowPosition;
  private Integer colPosition;
  private String roomNumber;
  private RoomType roomType;
  private BigDecimal pricePerMonth;
  private Integer capacity;
  private boolean hasWindow;
  private boolean hasBalcony;
  private boolean active;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public RoomResponse() {
  }

  public static RoomResponse fromEntity(Room room) {
    RoomResponse response = new RoomResponse();
    response.setId(room.getId());
    response.setHostelId(room.getHostel().getId());
    response.setFloorNumber(room.getFloorNumber());
    response.setRowPosition(room.getRowPosition());
    response.setColPosition(room.getColPosition());
    response.setRoomNumber(room.getRoomNumber());
    response.setRoomType(room.getRoomType());
    response.setPricePerMonth(room.getPricePerMonth());
    response.setCapacity(room.getCapacity());
    response.setHasWindow(room.isHasWindow());
    response.setHasBalcony(room.isHasBalcony());
    response.setActive(room.isActive());
    response.setCreatedAt(room.getCreatedAt());
    response.setUpdatedAt(room.getUpdatedAt());
    return response;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getHostelId() { return hostelId; }
  public void setHostelId(Long hostelId) { this.hostelId = hostelId; }

  public Integer getFloorNumber() { return floorNumber; }
  public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

  public Integer getRowPosition() { return rowPosition; }
  public void setRowPosition(Integer rowPosition) { this.rowPosition = rowPosition; }

  public Integer getColPosition() { return colPosition; }
  public void setColPosition(Integer colPosition) { this.colPosition = colPosition; }

  public String getRoomNumber() { return roomNumber; }
  public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

  public RoomType getRoomType() { return roomType; }
  public void setRoomType(RoomType roomType) { this.roomType = roomType; }

  public BigDecimal getPricePerMonth() { return pricePerMonth; }
  public void setPricePerMonth(BigDecimal pricePerMonth) { this.pricePerMonth = pricePerMonth; }

  public Integer getCapacity() { return capacity; }
  public void setCapacity(Integer capacity) { this.capacity = capacity; }

  public boolean isHasWindow() { return hasWindow; }
  public void setHasWindow(boolean hasWindow) { this.hasWindow = hasWindow; }

  public boolean isHasBalcony() { return hasBalcony; }
  public void setHasBalcony(boolean hasBalcony) { this.hasBalcony = hasBalcony; }

  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}