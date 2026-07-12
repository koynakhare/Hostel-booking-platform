package com.hostel_booking_platform.hostel_booking_platform.room.controller;

import com.hostel_booking_platform.hostel_booking_platform.room.dto.CreateRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomSheetResponse;
import com.hostel_booking_platform.hostel_booking_platform.room.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

  private final RoomService roomService;

  public RoomController(RoomService roomService) {
    this.roomService = roomService;
  }

  @PostMapping
  public ResponseEntity<RoomResponse> createRoom(
      @Valid @RequestBody CreateRoomRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {
  
    RoomResponse response = roomService.createRoom(
        request.getHostelId(),
        request,
        userDetails.getUsername());
  
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

 @GetMapping
public ResponseEntity<List<RoomResponse>> getRooms(@RequestParam Long hostelId) {
  return ResponseEntity.ok(roomService.getRoomsByHostel(hostelId));
}

@GetMapping("/sheet")
public ResponseEntity<RoomSheetResponse> getRoomSheet(
    @RequestParam Long hostelId,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

  return ResponseEntity.ok(roomService.getRoomSheet(hostelId, checkIn, checkOut));
}

@PutMapping("/{roomId}")
public ResponseEntity<RoomResponse> updateRoom(
    @PathVariable Long roomId,
    @Valid @RequestBody CreateRoomRequest request,
    @AuthenticationPrincipal UserDetails userDetails) {

  RoomResponse response = roomService.updateRoom(
      request.getHostelId(),
      roomId,
      request,
      userDetails.getUsername());
  return ResponseEntity.ok(response);
}

@DeleteMapping("/{roomId}")
public ResponseEntity<Void> deleteRoom(
    @PathVariable Long roomId,
    @RequestParam Long hostelId,
    @AuthenticationPrincipal UserDetails userDetails) {

  roomService.deleteRoom(hostelId, roomId, userDetails.getUsername());
  return ResponseEntity.noContent().build();
}
}