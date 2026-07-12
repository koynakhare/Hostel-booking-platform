package com.hostel_booking_platform.hostel_booking_platform.room.repository;

import com.hostel_booking_platform.hostel_booking_platform.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

  List<Room> findByHostelIdAndActiveTrueOrderByFloorNumberAscRowPositionAscColPositionAsc(Long hostelId);

  List<Room> findByHostelIdOrderByFloorNumberAscRowPositionAscColPositionAsc(Long hostelId);

  boolean existsByHostelIdAndRoomNumberIgnoreCase(Long hostelId, String roomNumber);

  boolean existsByHostelIdAndRoomNumberIgnoreCaseAndIdNot(Long hostelId, String roomNumber, Long id);

  long countByHostelIdAndActiveTrue(Long hostelId);

  Optional<Room> findByIdAndHostelId(Long id, Long hostelId);
}