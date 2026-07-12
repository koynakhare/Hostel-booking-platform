package com.hostel_booking_platform.hostel_booking_platform.common.exception;

import org.springframework.dao.DataAccessException;
import org.hibernate.LazyInitializationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = new HashMap<>();

    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      fieldErrors.put(error.getField(), error.getDefaultMessage());
    }

    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Validation Failed");
    body.put("errors", fieldErrors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Bad Request");
    body.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<Map<String, Object>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Bad Request");
    body.put("message", "Image file is too large. Maximum allowed size is 5MB per file.");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(MultipartException.class)
  public ResponseEntity<Map<String, Object>> handleMultipart(MultipartException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Bad Request");
    body.put("message", "Invalid file upload. Please send images as form-data with key 'images'.");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(NullPointerException.class)
public ResponseEntity<Map<String, Object>> handleNullPointer(NullPointerException ex) {
  Map<String, Object> body = new HashMap<>();
  body.put("timestamp", LocalDateTime.now());
  body.put("status", HttpStatus.BAD_REQUEST.value());
  body.put("error", "Bad Request");
  body.put("message", "Invalid request data. Please check your form fields and image file.");
  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}
  
@ExceptionHandler(DataIntegrityViolationException.class)
public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
  Map<String, Object> body = new HashMap<>();
  body.put("timestamp", LocalDateTime.now());
  body.put("status", HttpStatus.BAD_REQUEST.value());
  body.put("error", "Bad Request");
  body.put("message", "Cannot delete this hostel because related records still exist.");
  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}

@ExceptionHandler({LazyInitializationException.class, DataAccessException.class})
public ResponseEntity<Map<String, Object>> handleDataAccess(Exception ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Bad Request");
    body.put("message", ex.getMessage() != null ? ex.getMessage() : "Database error while saving hostel");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
    body.put("error", "Internal Server Error");
    String message = ex.getMessage();
    if (message == null && ex.getCause() != null) {
      message = ex.getCause().getMessage();
    }
    if (message == null) {
      message = ex.getClass().getSimpleName();
    }
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}