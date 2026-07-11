package com.hostel_booking_platform.hostel_booking_platform.hostel.service;

import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.CreateHostelRequest;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.HostelResponse;
import org.springframework.web.multipart.MultipartFile;

public interface HostelService {

  HostelResponse createHostel(CreateHostelRequest request, MultipartFile[] images, String ownerEmail);
}