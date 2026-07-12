import type { BOOKING_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from "@/utils/constants";

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface LockRoomRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
  seatCount: number;
}

export interface LockRoomResponse {
  lockId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  expiresAt: string;
}

export interface CreateBookingRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
  paymentMethod: PaymentMethod;
  seatCount: number;
}

export interface Booking {
  id: number;
  roomId: number;
  roomNumber: string;
  hostelId: number;
  hostelName: string;
  userId: number;
  userEmail: string;
  userFullName?: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  gatewayOrderId?: string;
  createdAt?: string;
  updatedAt?: string;
}
