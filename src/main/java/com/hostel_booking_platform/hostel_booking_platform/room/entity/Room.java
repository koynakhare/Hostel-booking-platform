package com.hostel_booking_platform.hostel_booking_platform.room.entity;

import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "rooms",
    uniqueConstraints = @UniqueConstraint(columnNames = {"hostel_id", "room_number"})
)
public class Room {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "hostel_id", nullable = false)
  private Hostel hostel;

  @Column(nullable = false)
  private Integer floorNumber;

  @Column(nullable = false)
  private Integer rowPosition;

  @Column(nullable = false)
  private Integer colPosition;

  @Column(name = "room_number", nullable = false)
  private String roomNumber;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RoomType roomType;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal pricePerMonth;

  @Column(nullable = false)
  private Integer capacity;

  @Column(nullable = false)
  private boolean hasWindow;

  @Column(nullable = false)
  private boolean hasBalcony;

  @Column(nullable = false)
  private boolean active = true;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  public Room() {
  }

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Hostel getHostel() {
    return hostel;
  }

  public void setHostel(Hostel hostel) {
    this.hostel = hostel;
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

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}
