package com.hostel_booking_platform.hostel_booking_platform.booking.repository;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.RoomLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RoomLockRepository extends JpaRepository<RoomLock, Long> {

  @Query("""
      SELECT rl FROM RoomLock rl
      WHERE rl.room.id = :roomId
        AND rl.user.id = :userId
        AND rl.checkIn = :checkIn
        AND rl.checkOut = :checkOut
      """)
  Optional<RoomLock> findByRoomIdAndUserIdAndCheckInAndCheckOut(
      @Param("roomId") Long roomId,
      @Param("userId") Long userId,
      @Param("checkIn") LocalDate checkIn,
      @Param("checkOut") LocalDate checkOut);

  List<RoomLock> findByRoomIdAndExpiresAtAfter(Long roomId, LocalDateTime now);

  void deleteByRoomId(Long roomId);

  List<RoomLock> findByExpiresAtBefore(LocalDateTime now);

  void deleteByExpiresAtBefore(LocalDateTime now);
}