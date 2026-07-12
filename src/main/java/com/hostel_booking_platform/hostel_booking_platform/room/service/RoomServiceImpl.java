package com.hostel_booking_platform.hostel_booking_platform.room.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.enums.BookingStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.BookingRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.RoomLockRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.AvailabilityUtil;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.AvailabilityUtil.DateRangeSeats;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.SeatCountUtil;
import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import com.hostel_booking_platform.hostel_booking_platform.hostel.repository.HostelRepository;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.CreateRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.room.dto.RoomSheetResponse;
import com.hostel_booking_platform.hostel_booking_platform.room.entity.Room;
import com.hostel_booking_platform.hostel_booking_platform.room.enums.RoomStatus;
import com.hostel_booking_platform.hostel_booking_platform.room.repository.RoomRepository;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.Role;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

  private final RoomRepository roomRepository;
  private final HostelRepository hostelRepository;
  private final UserRepository userRepository;
  private final BookingRepository bookingRepository;
  private final RoomLockRepository roomLockRepository;

  public RoomServiceImpl(
      RoomRepository roomRepository,
      HostelRepository hostelRepository,
      UserRepository userRepository,
      BookingRepository bookingRepository,
      RoomLockRepository roomLockRepository) {
    this.roomRepository = roomRepository;
    this.hostelRepository = hostelRepository;
    this.userRepository = userRepository;
    this.bookingRepository = bookingRepository;
    this.roomLockRepository = roomLockRepository;
  }

  @Override
  @Transactional
  public RoomResponse createRoom(Long hostelId, CreateRoomRequest request, String ownerEmail) {
    Hostel hostel = getHostelOrThrow(hostelId);
    verifyOwner(hostel, ownerEmail);

    if (roomRepository.existsByHostelIdAndRoomNumberIgnoreCase(hostelId, request.getRoomNumber().trim())) {
      throw new IllegalArgumentException("Room number already exists in this hostel");
    }

    Room room = new Room();
    room.setHostel(hostel);
    room.setFloorNumber(request.getFloorNumber());
    room.setRowPosition(request.getRowPosition());
    room.setColPosition(request.getColPosition());
    room.setRoomNumber(request.getRoomNumber().trim());
    room.setRoomType(request.getRoomType());
    room.setPricePerMonth(request.getPricePerMonth());
    room.setCapacity(request.getCapacity());
    room.setHasWindow(request.isHasWindow());
    room.setHasBalcony(request.isHasBalcony());
    room.setActive(true);

    Room savedRoom = roomRepository.save(room);
    return RoomResponse.fromEntity(savedRoom);
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoomResponse> getRoomsByHostel(Long hostelId) {
    getHostelOrThrow(hostelId);

    return roomRepository.findByHostelIdOrderByFloorNumberAscRowPositionAscColPositionAsc(hostelId)
        .stream()
        .map(RoomResponse::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public RoomSheetResponse getRoomSheet(Long hostelId, LocalDate checkIn, LocalDate checkOut) {
    Hostel hostel = getHostelOrThrow(hostelId);

    if (checkIn == null || checkOut == null) {
      throw new IllegalArgumentException("checkIn and checkOut are required");
    }
    if (!checkOut.isAfter(checkIn)) {
      throw new IllegalArgumentException("checkOut must be after checkIn");
    }

    List<Room> rooms = roomRepository
        .findByHostelIdAndActiveTrueOrderByFloorNumberAscRowPositionAscColPositionAsc(hostelId);

    Map<Integer, RoomSheetResponse.FloorSheet> floorMap = new LinkedHashMap<>();

    for (Room room : rooms) {
      RoomSheetResponse.FloorSheet floor = floorMap.computeIfAbsent(
          room.getFloorNumber(),
          RoomSheetResponse.FloorSheet::new);

      RoomSheetResponse.RoomSlot slot = new RoomSheetResponse.RoomSlot();
      slot.setId(room.getId());
      slot.setRoomNumber(room.getRoomNumber());
      slot.setRoomType(room.getRoomType());
      slot.setPricePerMonth(room.getPricePerMonth());
      slot.setCapacity(room.getCapacity());
      slot.setHasWindow(room.isHasWindow());
      slot.setHasBalcony(room.isHasBalcony());
      slot.setRowPosition(room.getRowPosition());
      slot.setColPosition(room.getColPosition());
      int availableSeats = getAvailableSeatCount(room, checkIn, checkOut);
      slot.setAvailableSeats(availableSeats);
      slot.setStatus(availableSeats <= 0 ? RoomStatus.BOOKED : RoomStatus.AVAILABLE);

      floor.getRooms().add(slot);
    }

    RoomSheetResponse response = new RoomSheetResponse();
    response.setHostelId(hostel.getId());
    response.setHostelName(hostel.getName());
    response.setCheckIn(checkIn);
    response.setCheckOut(checkOut);
    response.setFloors(new ArrayList<>(floorMap.values()));
    return response;
  }

  @Override
  @Transactional
  public RoomResponse updateRoom(Long hostelId, Long roomId, CreateRoomRequest request, String ownerEmail) {
    Hostel hostel = getHostelOrThrow(hostelId);
    verifyOwner(hostel, ownerEmail);

    Room room = roomRepository.findByIdAndHostelId(roomId, hostelId)
        .orElseThrow(() -> new IllegalArgumentException("Room not found"));

    if (roomRepository.existsByHostelIdAndRoomNumberIgnoreCaseAndIdNot(
        hostelId, request.getRoomNumber().trim(), roomId)) {
      throw new IllegalArgumentException("Room number already exists in this hostel");
    }

    room.setFloorNumber(request.getFloorNumber());
    room.setRowPosition(request.getRowPosition());
    room.setColPosition(request.getColPosition());
    room.setRoomNumber(request.getRoomNumber().trim());
    room.setRoomType(request.getRoomType());
    room.setPricePerMonth(request.getPricePerMonth());
    room.setCapacity(request.getCapacity());
    room.setHasWindow(request.isHasWindow());
    room.setHasBalcony(request.isHasBalcony());

    return RoomResponse.fromEntity(roomRepository.save(room));
  }

  @Override
  @Transactional
  public void deleteRoom(Long hostelId, Long roomId, String ownerEmail) {
    Hostel hostel = getHostelOrThrow(hostelId);
    verifyOwner(hostel, ownerEmail);

    Room room = roomRepository.findByIdAndHostelId(roomId, hostelId)
        .orElseThrow(() -> new IllegalArgumentException("Room not found"));

    room.setActive(false);
    roomRepository.save(room);
  }

  private int getAvailableSeatCount(Room room, LocalDate checkIn, LocalDate checkOut) {
    int usedSeats = getUsedSeatCount(room.getId(), checkIn, checkOut, null);
    return Math.max(0, room.getCapacity() - usedSeats);
  }

  private int getUsedSeatCount(
      Long roomId, LocalDate checkIn, LocalDate checkOut, Long excludeUserId) {
    List<DateRangeSeats> reservations = new ArrayList<>();

    bookingRepository
        .findOverlappingBookings(roomId, checkIn, checkOut, BookingStatus.CONFIRMED)
        .forEach(booking -> reservations.add(new DateRangeSeats(
            booking.getCheckIn(),
            booking.getCheckOut(),
            SeatCountUtil.resolve(booking.getSeatCount()))));

    bookingRepository
        .findOverlappingBookings(roomId, checkIn, checkOut, BookingStatus.PENDING)
        .forEach(booking -> reservations.add(new DateRangeSeats(
            booking.getCheckIn(),
            booking.getCheckOut(),
            SeatCountUtil.resolve(booking.getSeatCount()))));

    LocalDateTime now = LocalDateTime.now();
    roomLockRepository.findByRoomIdAndExpiresAtAfter(roomId, now)
        .stream()
        .filter(lock -> AvailabilityUtil.datesOverlap(
            lock.getCheckIn(), lock.getCheckOut(), checkIn, checkOut))
        .filter(lock -> excludeUserId == null || !lock.getUser().getId().equals(excludeUserId))
        .forEach(lock -> reservations.add(new DateRangeSeats(
            lock.getCheckIn(),
            lock.getCheckOut(),
            SeatCountUtil.resolve(lock.getSeatCount()))));

    return AvailabilityUtil.peakUsedSeats(checkIn, checkOut, reservations);
  }

  private Hostel getHostelOrThrow(Long hostelId) {
    return hostelRepository.findById(hostelId)
        .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));
  }

  private void verifyOwner(Hostel hostel, String ownerEmail) {
    User owner = userRepository.findByEmail(ownerEmail)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (owner.getRole() != Role.OWNER) {
      throw new IllegalArgumentException("Only owners can manage rooms");
    }

    if (!ownerEmail.equals(hostel.getOwner().getEmail())) {
      throw new IllegalArgumentException("You are not the owner of this hostel");
    }
  }
}