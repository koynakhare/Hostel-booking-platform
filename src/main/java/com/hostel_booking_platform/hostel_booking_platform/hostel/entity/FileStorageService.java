package com.hostel_booking_platform.hostel_booking_platform.hostel.entity;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hostel_booking_platform.hostel_booking_platform.config.CloudinaryProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

  private final CloudinaryProperties cloudinaryProperties;
  private final ObjectProvider<Cloudinary> cloudinaryProvider;

  public FileStorageService(
      CloudinaryProperties cloudinaryProperties,
      ObjectProvider<Cloudinary> cloudinaryProvider) {
    this.cloudinaryProperties = cloudinaryProperties;
    this.cloudinaryProvider = cloudinaryProvider;
  }

  public List<String> storeHostelImages(Long hostelId, MultipartFile[] files) {
    if (files == null || files.length == 0) {
      return new ArrayList<>();
    }

    Cloudinary cloudinary = requireCloudinary();
    List<String> imageUrls = new ArrayList<>();

    for (MultipartFile file : files) {
      if (file == null || file.isEmpty()) {
        continue;
      }

      validateImage(file);

      try {
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "hostels/" + hostelId,
                "public_id", UUID.randomUUID().toString(),
                "resource_type", "image"));

        String secureUrl = (String) uploadResult.get("secure_url");
        if (secureUrl == null || secureUrl.isBlank()) {
          throw new IllegalArgumentException("Cloudinary did not return an image URL");
        }
        imageUrls.add(secureUrl);
      } catch (IOException ex) {
        throw new IllegalArgumentException("Failed to read image file: " + file.getOriginalFilename());
      } catch (Exception ex) {
        throw new IllegalArgumentException("Failed to upload image to Cloudinary: " + file.getOriginalFilename());
      }
    }

    return imageUrls;
  }

  private Cloudinary requireCloudinary() {
    if (!cloudinaryProperties.isConfigured()) {
      throw new IllegalArgumentException(
          "Image upload requires Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    }

    Cloudinary cloudinary = cloudinaryProvider.getIfAvailable();
    if (cloudinary == null) {
      throw new IllegalStateException("Cloudinary client is not available");
    }
    return cloudinary;
  }

  private void validateImage(MultipartFile file) {
    String contentType = file.getContentType();
    String filename = file.getOriginalFilename();

    boolean validContentType = contentType != null && (
        contentType.equals("image/jpeg") ||
        contentType.equals("image/jpg") ||
        contentType.equals("image/png") ||
        contentType.equals("image/webp") ||
        contentType.equals("application/octet-stream")
    );

    boolean validExtension = filename != null && (
        filename.toLowerCase().endsWith(".jpg") ||
        filename.toLowerCase().endsWith(".jpeg") ||
        filename.toLowerCase().endsWith(".png") ||
        filename.toLowerCase().endsWith(".webp")
    );

    if (!validContentType && !validExtension) {
      throw new IllegalArgumentException("Only JPG, PNG, and WEBP images are allowed");
    }
  }
}
