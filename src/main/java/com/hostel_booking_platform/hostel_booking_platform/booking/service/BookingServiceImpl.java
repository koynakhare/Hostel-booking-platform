package com.hostel_booking_platform.hostel_booking_platform.booking.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.dto.BookingResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.CreateBookingRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomRequest;
import com.hostel_booking_platform.hostel_booking_platform.booking.dto.LockRoomResponse;
import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Booking;
import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Payment;
import com.hostel_booking_platform.hostel_booking_platform.booking.entity.RoomLock;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.BookingStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentMethod;
import com.hostel_booking_platform.hostel_booking_platform.booking.enums.PaymentStatus;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.BookingRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.PaymentRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.RoomLockRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.AvailabilityUtil;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.AvailabilityUtil.DateRangeSeats;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.PricingUtil;
import com.hostel_booking_platform.hostel_booking_platform.booking.util.SeatCountUtil;
import com.hostel_booking_platform.hostel_booking_platform.room.entity.Room;
import com.hostel_booking_platform.hostel_booking_platform.room.repository.RoomRepository;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.Role;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

  private static final int LOCK_MINUTES = 10;

  private final BookingRepository bookingRepository;
  private final RoomLockRepository roomLockRepository;
  private final PaymentRepository paymentRepository;
  private final RoomRepository roomRepository;
  private final UserRepository userRepository;

  public BookingServiceImpl(
      BookingRepository bookingRepository,
      RoomLockRepository roomLockRepository,
      PaymentRepository paymentRepository,
      RoomRepository roomRepository,
      UserRepository userRepository) {
    this.bookingRepository = bookingRepository;
    this.roomLockRepository = roomLockRepository;
    this.paymentRepository = paymentRepository;
    this.roomRepository = roomRepository;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public LockRoomResponse lockRoom(LockRoomRequest request, String userEmail) {
    User user = getStudentOrThrow(userEmail);
    Room room = getActiveRoomOrThrow(request.getRoomId());
    validateDates(request.getCheckIn(), request.getCheckOut());
    validateSeatCount(request.getSeatCount());

    if (!hasAvailableSeats(room, request.getCheckIn(), request.getCheckOut(), request.getSeatCount(), user.getId())) {
      throw new IllegalArgumentException("Not enough seats available for selected dates");
    }

    if (hasActiveLockByOtherUser(room.getId(), user.getId(), request.getCheckIn(), request.getCheckOut())) {
      throw new IllegalArgumentException("Room is temporarily locked by another user");
    }

    RoomLock lock = roomLockRepository
        .findByRoomIdAndUserIdAndCheckInAndCheckOut(
            room.getId(), user.getId(), request.getCheckIn(), request.getCheckOut())
        .orElse(new RoomLock());

    lock.setRoom(room);
    lock.setUser(user);
    lock.setCheckIn(request.getCheckIn());
    lock.setCheckOut(request.getCheckOut());
    lock.setSeatCount(request.getSeatCount());
    lock.setExpiresAt(LocalDateTime.now().plusMinutes(LOCK_MINUTES));

    RoomLock savedLock = roomLockRepository.save(lock);
    return LockRoomResponse.fromEntity(savedLock);
  }

  @Override
  @Transactional
  public BookingResponse createBooking(CreateBookingRequest request, String userEmail) {
    User user = getStudentOrThrow(userEmail);
    Room room = getActiveRoomOrThrow(request.getRoomId());
    validateDates(request.getCheckIn(), request.getCheckOut());

    RoomLock lock = roomLockRepository
        .findByRoomIdAndUserIdAndCheckInAndCheckOut(
            room.getId(), user.getId(), request.getCheckIn(), request.getCheckOut())
        .orElseThrow(() -> new IllegalArgumentException("Please lock the room before booking"));

    if (lock.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Room lock has expired. Please lock again");
    }

    validateSeatCount(request.getSeatCount());

    if (!lock.getSeatCount().equals(request.getSeatCount())) {
      throw new IllegalArgumentException("Seat count does not match the locked room");
    }

    if (!hasAvailableSeats(room, request.getCheckIn(), request.getCheckOut(), request.getSeatCount(), user.getId())) {
      throw new IllegalArgumentException("Not enough seats available for selected dates");
    }

    BigDecimal totalAmount = PricingUtil.calculateTotalAmount(
        room.getPricePerMonth(), request.getCheckIn(), request.getCheckOut(), request.getSeatCount());

    Booking booking = new Booking();
    booking.setRoom(room);
    booking.setUser(user);
    booking.setCheckIn(request.getCheckIn());
    booking.setCheckOut(request.getCheckOut());
    booking.setStatus(BookingStatus.PENDING);
    booking.setPaymentMethod(request.getPaymentMethod());
    booking.setTotalAmount(totalAmount);
    booking.setSeatCount(request.getSeatCount());

    Booking savedBooking = bookingRepository.save(booking);

    Payment payment = new Payment();
    payment.setBooking(savedBooking);
    payment.setAmount(totalAmount);
    payment.setPaymentMethod(request.getPaymentMethod());
    payment.setStatus(PaymentStatus.PENDING);

    if (request.getPaymentMethod() == PaymentMethod.RAZORPAY
        || request.getPaymentMethod() == PaymentMethod.STRIPE) {
      payment.setGatewayOrderId("order_" + savedBooking.getId() + "_" + System.currentTimeMillis());
    }

    Payment savedPayment = paymentRepository.save(payment);
    roomLockRepository.delete(lock);

    BookingResponse response = BookingResponse.fromEntity(savedBooking);
    response.setGatewayOrderId(savedPayment.getGatewayOrderId());
    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public BookingResponse getBooking(Long bookingId, String userEmail) {
    User user = getUserOrThrow(userEmail);
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    if (!booking.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("You are not allowed to view this booking");
    }

    return BookingResponse.fromEntity(booking);
  }

  @Override
  @Transactional(readOnly = true)
  public List<BookingResponse> getMyBookings(String userEmail) {
    User user = getUserOrThrow(userEmail);

    return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
        .stream()
        .map(BookingResponse::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void cancelBooking(Long bookingId, String userEmail) {
    User user = getUserOrThrow(userEmail);
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    if (!booking.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("You are not allowed to cancel this booking");
    }

    if (booking.getStatus() == BookingStatus.CANCELLED
        || booking.getStatus() == BookingStatus.EXPIRED) {
      throw new IllegalArgumentException("Booking is already cancelled");
    }

    booking.setStatus(BookingStatus.CANCELLED);
    bookingRepository.save(booking);

    paymentRepository.findByBookingIdOrderByCreatedAtDesc(bookingId)
        .forEach(payment -> {
          if (payment.getStatus() == PaymentStatus.SUCCESS) {
            payment.setStatus(PaymentStatus.REFUNDED);
          } else {
            payment.setStatus(PaymentStatus.FAILED);
          }
          paymentRepository.save(payment);
        });
  }

  private User getStudentOrThrow(String userEmail) {
    User user = getUserOrThrow(userEmail);
    if (user.getRole() != Role.STUDENT) {
      throw new IllegalArgumentException("Only students can book rooms");
    }
    return user;
  }

  private User getUserOrThrow(String userEmail) {
    return userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
  }

  private Room getActiveRoomOrThrow(Long roomId) {
    Room room = roomRepository.findById(roomId)
        .orElseThrow(() -> new IllegalArgumentException("Room not found"));

    if (!room.isActive()) {
      throw new IllegalArgumentException("Room is not available");
    }
    return room;
  }

  private void validateDates(LocalDate checkIn, LocalDate checkOut) {
    if (checkIn == null || checkOut == null) {
      throw new IllegalArgumentException("checkIn and checkOut are required");
    }
    if (!checkOut.isAfter(checkIn)) {
      throw new IllegalArgumentException("checkOut must be after checkIn");
    }
  }

  private void validateSeatCount(Integer seatCount) {
    if (seatCount == null || seatCount < 1 || seatCount > 2) {
      throw new IllegalArgumentException("You can book only 1 or 2 seats at a time");
    }
  }

  private boolean hasAvailableSeats(
      Room room, LocalDate checkIn, LocalDate checkOut, int requestedSeats, Long userId) {
    int usedSeats = getUsedSeatCount(room.getId(), checkIn, checkOut, userId);
    return usedSeats + requestedSeats <= room.getCapacity();
  }

  private int getUsedSeatCount(
      Long roomId, LocalDate checkIn, LocalDate checkOut, Long excludeUserId) {
    List<DateRangeSeats> reservations = new java.util.ArrayList<>();

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

  private boolean hasActiveLockByOtherUser(
      Long roomId, Long userId, LocalDate checkIn, LocalDate checkOut) {

    LocalDateTime now = LocalDateTime.now();

    return roomLockRepository.findByRoomIdAndExpiresAtAfter(roomId, now)
        .stream()
        .anyMatch(lock ->
            !lock.getUser().getId().equals(userId)
                && AvailabilityUtil.datesOverlap(
                    lock.getCheckIn(), lock.getCheckOut(), checkIn, checkOut));
  }
}