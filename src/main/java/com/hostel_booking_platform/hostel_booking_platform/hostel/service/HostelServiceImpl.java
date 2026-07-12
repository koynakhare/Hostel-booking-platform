package com.hostel_booking_platform.hostel_booking_platform.hostel.service;

import com.hostel_booking_platform.hostel_booking_platform.booking.entity.Booking;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.BookingRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.PaymentRepository;
import com.hostel_booking_platform.hostel_booking_platform.booking.repository.RoomLockRepository;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.CreateHostelRequest;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.HostelResponse;
import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.FileStorageService;
import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import com.hostel_booking_platform.hostel_booking_platform.hostel.repository.HostelRepository;
import com.hostel_booking_platform.hostel_booking_platform.room.entity.Room;
import com.hostel_booking_platform.hostel_booking_platform.room.repository.RoomRepository;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.Role;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HostelServiceImpl implements HostelService {

  private final HostelRepository hostelRepository;
  private final UserRepository userRepository;
  private final FileStorageService fileStorageService;
  private final RoomRepository roomRepository;
  private final BookingRepository bookingRepository;
  private final PaymentRepository paymentRepository;
  private final RoomLockRepository roomLockRepository;

  public HostelServiceImpl(
      HostelRepository hostelRepository,
      UserRepository userRepository,
      FileStorageService fileStorageService,
      RoomRepository roomRepository,
      BookingRepository bookingRepository,
      PaymentRepository paymentRepository,
      RoomLockRepository roomLockRepository) {
    this.hostelRepository = hostelRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
    this.roomRepository = roomRepository;
    this.bookingRepository = bookingRepository;
    this.paymentRepository = paymentRepository;
    this.roomLockRepository = roomLockRepository;
  }

  @Override
  @Transactional
  public HostelResponse createHostel(CreateHostelRequest request, MultipartFile[] images, String ownerEmail) {
    User owner = userRepository.findByEmail(ownerEmail)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (owner.getRole() != Role.OWNER) {
      throw new IllegalArgumentException("Only owners can create hostels");
    }

    if (hostelRepository.existsByOwnerIdAndNameIgnoreCase(owner.getId(), request.getName().trim())) {
      throw new IllegalArgumentException("You already have a hostel with this name");
    }

    Hostel hostel = new Hostel();
    hostel.setName(request.getName().trim());
    hostel.setDescription(request.getDescription());
    hostel.setAddress(request.getAddress());
    hostel.setCity(request.getCity());
    hostel.setState(request.getState());
    hostel.setPinCode(request.getPinCode());
    hostel.setTotalRooms(request.getTotalRooms());
    hostel.setAmenities(request.getAmenities());
    hostel.setOwner(owner);
    hostel.setActive(true);

    Hostel savedHostel = hostelRepository.save(hostel);

    List<String> imageUrls = fileStorageService.storeHostelImages(savedHostel.getId(), images);
    
    if (images != null && images.length > 0 && imageUrls.isEmpty()) {
      throw new IllegalArgumentException("No valid image files received. Please re-select images in Postman.");
    }
    savedHostel.setImages(new ArrayList<>(imageUrls));
    savedHostel = hostelRepository.save(savedHostel);

    return HostelResponse.fromEntity(savedHostel);
  }

  @Override 
  @Transactional(readOnly = true)
  public HostelResponse getHostel(Long id) {
    Hostel hostel = hostelRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));
    return HostelResponse.fromEntity(hostel);
  }

  @Override
  @Transactional(readOnly = true)
  public PagedResponse<HostelResponse> searchHostels(Integer page, Integer limit, String city, String search) {
    String cityFilter = normalizeFilter(city);
    String searchFilter = normalizeFilter(search);

    boolean unpaged = page == null && limit == null;
    Pageable pageable = unpaged
        ? Pageable.unpaged()
        : PageRequest.of(
            (page == null || page < 1) ? 0 : page - 1,
            (limit == null || limit < 1) ? 10 : limit);

    Page<Hostel> hostelPage = hostelRepository.searchHostels(cityFilter, searchFilter, pageable);

    List<HostelResponse> content = hostelPage.getContent().stream()
        .map(hostel -> {
          hostel.getImages().size();
          hostel.getOwner().getEmail();
          return HostelResponse.fromEntity(hostel);
        })
        .collect(Collectors.toList());

    Integer responsePage = unpaged ? null : ((page == null || page < 1) ? 1 : page);
    Integer responseLimit = unpaged ? null : ((limit == null || limit < 1) ? 10 : limit);

    return new PagedResponse<>(
        content,
        responsePage,
        responseLimit,
        hostelPage.getTotalElements(),
        hostelPage.getTotalPages());
  }

  private String normalizeFilter(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }

  @Override
  @Transactional
  public HostelResponse updateHostel(Long id, CreateHostelRequest request, MultipartFile[] images, String ownerEmail) {
    Hostel hostel = hostelRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));

        if (!ownerEmail.equals(hostel.getOwner().getEmail())) {
          throw new IllegalArgumentException("You are not the owner of this hostel");
        }
        if (hostelRepository.existsByOwnerIdAndNameIgnoreCaseAndIdNot(hostel.getOwner().getId(), request.getName().trim(), id)) {
          throw new IllegalArgumentException("You already have a hostel with this name");
        }

        hostel.setName(request.getName().trim());
        hostel.setDescription(request.getDescription());
        hostel.setAddress(request.getAddress());
        hostel.setCity(request.getCity());
        hostel.setState(request.getState());
        hostel.setPinCode(request.getPinCode());
        hostel.setTotalRooms(request.getTotalRooms());
        hostel.setAmenities(request.getAmenities());
        hostel.setActive(true);
        hostel = hostelRepository.save(hostel);
        if (images != null && images.length > 0) {
        List<String> imageUrls = fileStorageService.storeHostelImages(hostel.getId(), images);
        if (images != null && images.length > 0 && imageUrls.isEmpty()) {
          throw new IllegalArgumentException("No valid image files received. Please re-select images in Postman.");
        }
        hostel.setImages(new ArrayList<>(imageUrls));
        }
        hostel = hostelRepository.save(hostel);

        return HostelResponse.fromEntity(hostel);
  }

  @Override
  @Transactional
  public void deleteHostel(Long id, String ownerEmail) {
    Hostel hostel = hostelRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));

    if (!ownerEmail.equals(hostel.getOwner().getEmail())) {
      throw new IllegalArgumentException("You are not the owner of this hostel");
    }

    List<Room> rooms = roomRepository.findByHostelIdOrderByFloorNumberAscRowPositionAscColPositionAsc(id);
    for (Room room : rooms) {
      List<Booking> bookings = bookingRepository.findByRoomId(room.getId());
      for (Booking booking : bookings) {
        paymentRepository.deleteByBookingId(booking.getId());
      }
      bookingRepository.deleteAll(bookings);
      roomLockRepository.deleteByRoomId(room.getId());
    }
    roomRepository.deleteAll(rooms);
    hostelRepository.delete(hostel);
  }
}