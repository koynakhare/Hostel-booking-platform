package com.hostel_booking_platform.hostel_booking_platform.hostel.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;


public class HostelResponse {

  private Long id;
  private String name;
  private String description;
  private String address;
  private String city;
  private String state;
  private String pinCode;
  private Integer totalRooms;
  private String amenities;
  private List<String> images;
  private Long ownerId;
  private String ownerName;
  private String ownerPhone;
  private boolean active;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public HostelResponse() {
  }

  public static HostelResponse fromEntity(Hostel hostel) {
    HostelResponse response = new HostelResponse();
    response.setId(hostel.getId());
    response.setName(hostel.getName());
    response.setDescription(hostel.getDescription());
    response.setAddress(hostel.getAddress());
    response.setCity(hostel.getCity());
    response.setState(hostel.getState());
    response.setPinCode(hostel.getPinCode());
    response.setTotalRooms(hostel.getTotalRooms());
    response.setAmenities(hostel.getAmenities());
    response.setImages(new ArrayList<>(hostel.getImages()));
    response.setOwnerId(hostel.getOwner().getId());
    response.setOwnerName(hostel.getOwner().getFullName());
    response.setOwnerPhone(hostel.getOwner().getPhoneNumber());
    response.setActive(hostel.isActive());
    response.setCreatedAt(hostel.getCreatedAt());
    response.setUpdatedAt(hostel.getUpdatedAt());
    return response;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getPinCode() {
    return pinCode;
  }

  public void setPinCode(String pinCode) {
    this.pinCode = pinCode;
  }

  public Integer getTotalRooms() {
    return totalRooms;
  }

  public void setTotalRooms(Integer totalRooms) {
    this.totalRooms = totalRooms;
  }

  public String getAmenities() {
    return amenities;
  }

  public void setAmenities(String amenities) {
    this.amenities = amenities;
  }

  public List<String> getImages() {
    return images;
  }

  public void setImages(List<String> images) {
    this.images = images;
  }

  public Long getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(Long ownerId) {
    this.ownerId = ownerId;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }

  public String getOwnerPhone() {
    return ownerPhone;
  }

  public void setOwnerPhone(String ownerPhone) {
    this.ownerPhone = ownerPhone;
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