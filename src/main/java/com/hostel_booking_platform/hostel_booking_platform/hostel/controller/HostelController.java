package com.hostel_booking_platform.hostel_booking_platform.hostel.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.CreateHostelRequest;
import com.hostel_booking_platform.hostel_booking_platform.hostel.dto.HostelResponse;
import com.hostel_booking_platform.hostel_booking_platform.hostel.service.HostelService;


@RestController
@RequestMapping("/api/hostels")
public class HostelController {

  private final HostelService hostelService;

  public HostelController(HostelService hostelService) {
    this.hostelService = hostelService;
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<HostelResponse> createHostel(
      @Valid @ModelAttribute CreateHostelRequest request,
      @RequestParam(value = "images", required = false) MultipartFile[] images,
      @AuthenticationPrincipal UserDetails userDetails) {

    HostelResponse response = hostelService.createHostel(
        request,
        images,
        userDetails.getUsername()
    );

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
}