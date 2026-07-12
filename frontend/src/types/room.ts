export type RoomType =
  | "STANDARD"
  | "WINDOW"
  | "BALCONY"
  | "AC"
  | "NON_AC"
  | "DELUXE";

export type RoomStatus =
  | "AVAILABLE"
  | "LOCKED"
  | "BOOKED"
  | "UNAVAILABLE";

export interface Room {
  id: number;
  hostelId: number;
  floorNumber: number;
  rowPosition: number;
  colPosition: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerMonth: number;
  capacity: number;
  hasWindow: boolean;
  hasBalcony: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomSheetItem {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerMonth: number;
  capacity: number;
  availableSeats: number;
  hasWindow: boolean;
  hasBalcony: boolean;
  rowPosition: number;
  colPosition: number;
  status: RoomStatus;
}

export interface RoomSheetFloor {
  floorNumber: number;
  rooms: RoomSheetItem[];
}

export interface RoomSheetResponse {
  hostelId: number;
  hostelName: string;
  checkIn: string;
  checkOut: string;
  floors: RoomSheetFloor[];
}

export interface CreateRoomRequest {
  hostelId: number;
  floorNumber: number;
  rowPosition: number;
  colPosition: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerMonth: number;
  capacity: number;
  hasWindow: boolean;
  hasBalcony: boolean;
}
