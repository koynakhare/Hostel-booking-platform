package com.hostel_booking_platform.hostel_booking_platform.room.service;

import com.hostel_booking_platform.hostel_booking_platform.room.dto.CreateRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomSheetResponse;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {

  RoomResponse createRoom(Long hostelId, CreateRoomRequest request, String ownerEmail);

  List<RoomResponse> getRoomsByHostel(Long hostelId);

  RoomSheetResponse getRoomSheet(Long hostelId, LocalDate checkIn, LocalDate checkOut);

  RoomResponse updateRoom(Long hostelId, Long roomId, CreateRoomRequest request, String ownerEmail);

  void deleteRoom(Long hostelId, Long roomId, String ownerEmail);
}