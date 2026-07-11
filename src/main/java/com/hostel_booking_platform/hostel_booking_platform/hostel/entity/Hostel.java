package com.hostel_booking_platform.hostel_booking_platform.hostel.entity;

import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
  name = "hostels",
  uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id", "name"})
)
public class Hostel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, length = 1000)
  private String description;

  @Column(nullable = false)
  private String address;

  @Column(nullable = false)
  private String city;

  @Column(nullable = false)
  private String state;

  @Column(nullable = false)
  private String pinCode;

  @Column(nullable = false)
  private Integer totalRooms;

  @Column(length = 1000)
  private String amenities;

  @ElementCollection
  @CollectionTable(name = "hostel_images", joinColumns = @JoinColumn(name = "hostel_id"))
  @Column(name = "image_url", nullable = false)
  private List<String> images = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  @Column(nullable = false)
  private boolean active = true;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  public Hostel() {
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

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public String getState() { return state; }
  public void setState(String state) { this.state = state; }

  public String getPinCode() { return pinCode; }
  public void setPinCode(String pinCode) { this.pinCode = pinCode; }

  public Integer getTotalRooms() { return totalRooms; }
  public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

  public String getAmenities() { return amenities; }
  public void setAmenities(String amenities) { this.amenities = amenities; }

  public List<String> getImages() { return images; }

  public void setImages(List<String> images) {
    this.images.clear();
    if (images != null) {
      this.images.addAll(images);
    }
  }

  public User getOwner() { return owner; }
  public void setOwner(User owner) { this.owner = owner; }

  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}