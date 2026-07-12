package com.hostel_booking_platform.hostel_booking_platform.booking.dto;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Booking;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.BookingStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

  private Long id;
  private Long roomId;
  private String roomNumber;
  private Long hostelId;
  private String hostelName;
  private Long userId;
  private String userEmail;
  private LocalDate checkIn;
  private LocalDate checkOut;
  private BookingStatus status;
  private PaymentMethod paymentMethod;
  private BigDecimal totalAmount;
  private String gatewayOrderId;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public BookingResponse() {
  }

  public static BookingResponse fromEntity(Booking booking) {
    BookingResponse response = new BookingResponse();
    response.setId(booking.getId());
    response.setRoomId(booking.getRoom().getId());
    response.setRoomNumber(booking.getRoom().getRoomNumber());
    response.setHostelId(booking.getRoom().getHostel().getId());
    response.setHostelName(booking.getRoom().getHostel().getName());
    response.setUserId(booking.getUser().getId());
    response.setUserEmail(booking.getUser().getEmail());
    response.setCheckIn(booking.getCheckIn());
    response.setCheckOut(booking.getCheckOut());
    response.setStatus(booking.getStatus());
    response.setPaymentMethod(booking.getPaymentMethod());
    response.setTotalAmount(booking.getTotalAmount());
    response.setCreatedAt(booking.getCreatedAt());
    response.setUpdatedAt(booking.getUpdatedAt());
    return response;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  public String getRoomNumber() {
    return roomNumber;
  }

  public void setRoomNumber(String roomNumber) {
    this.roomNumber = roomNumber;
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

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getUserEmail() {
    return userEmail;
  }

  public void setUserEmail(String userEmail) {
    this.userEmail = userEmail;
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

  public BookingStatus getStatus() {
    return status;
  }

  public void setStatus(BookingStatus status) {
    this.status = status;
  }

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  public String getGatewayOrderId() {
    return gatewayOrderId;
  }

  public void setGatewayOrderId(String gatewayOrderId) {
    this.gatewayOrderId = gatewayOrderId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}