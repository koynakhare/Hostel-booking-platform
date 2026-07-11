package com.hostel_booking_platform.hostel_booking_platform.hostel.repository;

import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostelRepository extends JpaRepository<Hostel, Long> {

  boolean existsByOwnerIdAndNameIgnoreCase(Long ownerId, String name);
}