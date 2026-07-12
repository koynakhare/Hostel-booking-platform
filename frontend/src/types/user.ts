import type { Role } from "@/utils/constants";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  currentPassword?: string;
  newPassword?: string;
}
