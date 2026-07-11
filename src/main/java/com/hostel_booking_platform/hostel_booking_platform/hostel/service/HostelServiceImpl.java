package com.hostel_booking_platform.hostel_booking_platform.hostel.service;

import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.CreateHostelRequest;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.HostelResponse;
import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.FileStorageService;
import com.hostel_booking_platform.hostel_booking_platform.hostel.entity.Hostel;
import com.hostel_booking_platform.hostel_booking_platform.hostel.repository.HostelRepository;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.Role;
import com.hostel_booking_platform.hostel_booking_platform.user.entity.User;
import com.hostel_booking_platform.hostel_booking_platform.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class HostelServiceImpl implements HostelService {

  private final HostelRepository hostelRepository;
  private final UserRepository userRepository;
  private final FileStorageService fileStorageService;

  public HostelServiceImpl(
      HostelRepository hostelRepository,
      UserRepository userRepository,
      FileStorageService fileStorageService) {
    this.hostelRepository = hostelRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
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
}