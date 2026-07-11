package com.hostel_booking_platform.hostel_booking_platform.hostel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateHostelRequest {

  @NotBlank(message = "Hostel name is required")
  private String name;

  @NotBlank(message = "Description is required")
  @Size(max = 1000, message = "Description cannot exceed 1000 characters")
  private String description;

  @NotBlank(message = "Address is required")
  private String address;

  @NotBlank(message = "City is required")
  private String city;

  @NotBlank(message = "State is required")
  private String state;

  @NotBlank(message = "Pin code is required")
  private String pinCode;

  @NotNull(message = "Total rooms is required")
  @Min(value = 1, message = "Total rooms must be at least 1")
  private Integer totalRooms;

  @Size(max = 1000, message = "Amenities cannot exceed 1000 characters")
  private String amenities;

  public CreateHostelRequest() {
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
}