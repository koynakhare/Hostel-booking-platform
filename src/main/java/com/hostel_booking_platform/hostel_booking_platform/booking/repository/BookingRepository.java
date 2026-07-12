package com.hostel_booking_platform.hostel_booking_platform.booking.repository;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Booking;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

  Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  List<Booking> findByRoomId(Long roomId);

  @Query("""
      SELECT b FROM Booking b
      WHERE b.room.id = :roomId
        AND b.status = :status
        AND b.checkIn < :checkOut
        AND b.checkOut > :checkIn
      """)
  List<Booking> findOverlappingBookings(
      @Param("roomId") Long roomId,
      @Param("checkIn") LocalDate checkIn,
      @Param("checkOut") LocalDate checkOut,
      @Param("status") BookingStatus status);
}