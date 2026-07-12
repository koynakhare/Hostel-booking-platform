package com.hostel_booking_platform.hostel_booking_platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

  private String frontendUrl = "http://localhost:5173";

  public String getFrontendUrl() {
    return frontendUrl;
  }

  public void setFrontendUrl(String frontendUrl) {
    this.frontendUrl = frontendUrl;
  }
}
