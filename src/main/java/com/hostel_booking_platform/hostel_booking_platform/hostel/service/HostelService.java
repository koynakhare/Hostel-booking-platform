package com.hostel_booking_platform.hostel_booking_platform.hostel.service;

import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.CreateHostelRequest;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.HostelResponse;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.PagedResponse;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HostelService {

  HostelResponse createHostel(CreateHostelRequest request, MultipartFile[] images, String ownerEmail);
  HostelResponse getHostel(Long id);
  HostelResponse updateHostel(Long id, CreateHostelRequest request, MultipartFile[] images, List<String> existingImages, boolean syncImages, String ownerEmail);
  void deleteHostel(Long id, String ownerEmail);
  PagedResponse<HostelResponse> searchHostels(Integer page, Integer limit, String city, String search);
}