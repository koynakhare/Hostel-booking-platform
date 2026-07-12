package com.hostel_booking_platform.hostel_booking_platform.hostel.repository;

import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HostelRepository extends JpaRepository<Hostel, Long> {

  boolean existsByOwnerIdAndNameIgnoreCase(Long ownerId, String name);

  boolean existsByOwnerIdAndNameIgnoreCaseAndIdNot(Long ownerId, String name, Long id);

  @Query("""
      SELECT h FROM Hostel h
      WHERE h.active = true
      AND (:city IS NULL OR LOWER(h.city) = LOWER(:city))
      AND (
        :search IS NULL
        OR LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(h.description) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(h.address) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(h.city) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(h.state) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(h.amenities) LIKE LOWER(CONCAT('%', :search, '%'))
      )
      """)
  Page<Hostel> searchHostels(
      @Param("city") String city,
      @Param("search") String search,
      Pageable pageable);
}
