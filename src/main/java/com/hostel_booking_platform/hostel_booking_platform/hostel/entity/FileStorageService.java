package com.hostel_booking_platform.hostel_booking_platform.hostel.entity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

  @Value("${file.upload-dir}")
  private String uploadDir;

  public List<String> storeHostelImages(Long hostelId, MultipartFile[] files) {
    if (files == null || files.length == 0) {
      return new ArrayList<>();
    }

    List<String> imageUrls = new ArrayList<>();

    for (MultipartFile file : files) {
      if (file == null || file.isEmpty()) {
        continue;
      }

      validateImage(file);

      String originalFilename = file.getOriginalFilename();
      String extension = getFileExtension(originalFilename);
      String fileName = UUID.randomUUID() + extension;

      try (InputStream inputStream = file.getInputStream()) {
        if (inputStream == null) {
          throw new IllegalArgumentException("Invalid image file. Please re-select the image in Postman.");
        }

        Path folderPath = Paths.get(uploadDir, hostelId.toString()).toAbsolutePath();
        Files.createDirectories(folderPath);

        Path targetPath = folderPath.resolve(fileName);
        Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);

        imageUrls.add("/uploads/hostels/" + hostelId + "/" + fileName);
      } catch (IOException ex) {
        throw new IllegalArgumentException("Failed to store image: " + originalFilename);
      }
    }

    return imageUrls;
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

  private String getFileExtension(String originalFilename) {
    if (originalFilename == null || !originalFilename.contains(".")) {
      return "";
    }
    return originalFilename.substring(originalFilename.lastIndexOf("."));
  }
}