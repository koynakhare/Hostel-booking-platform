export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

export const HOSTEL_PLACEHOLDER_SRC = "/hostel-placeholder.svg";

export const AUTH_TOKEN_KEY = "hostel_auth_token";
export const AUTH_USER_KEY = "hostel_auth_user";
export const PAYMENT_SETTINGS_KEY = "hostel_payment_settings";

export const ROLES = {
  OWNER: "OWNER",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROOM_STATUS = {
  AVAILABLE: "AVAILABLE",
  LOCKED: "LOCKED",
  BOOKED: "BOOKED",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  LOCKED: "LOCKED",
  EXPIRED: "EXPIRED",
} as const;

export const PAYMENT_METHODS = {
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
  CASH_ON_ARRIVAL: "CASH_ON_ARRIVAL",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const ROOM_TYPES = [
  "STANDARD",
  "WINDOW",
  "BALCONY",
  "AC",
  "NON_AC",
  "DELUXE",
] as const;

export const OWNER_ROUTES = {
  dashboard: "/owner/dashboard",
  hostels: "/owner/hostels",
  hostelNew: "/owner/hostels/new",
  hostelEdit: "/owner/hostels/:id/edit",
  rooms: "/owner/hostels/:hostelId/rooms",
  bookings: "/owner/bookings",
  payments: "/owner/payments",
} as const;

export const STUDENT_ROUTES = {
  browse: "/student/hostels",
  details: "/student/hostels/:id",
  checkout: "/student/checkout/:hostelId",
  myBookings: "/student/bookings",
  paymentSuccess: "/student/payment/success",
} as const;
