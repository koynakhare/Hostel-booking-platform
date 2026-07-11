package com.hostel_booking_platform.hostel_booking_platform.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String absolutePath = Paths.get(uploadDir).toAbsolutePath().toString().replace("\\", "/");
    registry.addResourceHandler("/uploads/hostels/**")
        .addResourceLocations("file:/" + absolutePath + "/");
  }
}