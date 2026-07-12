package com.hostel_booking_platform.hostel_booking_platform.hostel.dto;

import java.util.List;

public class PagedResponse<T> {

  private List<T> content;
  private Integer page;
  private Integer limit;
  private long totalElements;
  private int totalPages;

  public PagedResponse() {
  }

  public PagedResponse(List<T> content, Integer page, Integer limit, long totalElements, int totalPages) {
    this.content = content;
    this.page = page;
    this.limit = limit;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
  public List<T> getContent() {
    return content;
  }
  
  public void setContent(List<T> content) {
    this.content = content;
  }
  
  public Integer getPage() {
    return page;
  }
  
  public void setPage(Integer page) {
    this.page = page;
  }
  
  public Integer getLimit() {
    return limit;
  }
  
  public void setLimit(Integer limit) {
    this.limit = limit;
  }
  
  public long getTotalElements() {
    return totalElements;
  }
  
  public void setTotalElements(long totalElements) {
    this.totalElements = totalElements;
  }
  
  public int getTotalPages() {
    return totalPages;
  }
  
  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }
}