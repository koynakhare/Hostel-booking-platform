export interface Hostel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalRooms: number;
  amenities?: string;
  images: string[];
  ownerId: number;
  ownerName?: string;
  ownerPhone?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number | null;
  limit: number | null;
  totalElements: number;
  totalPages: number;
}

export interface HostelFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalRooms: number;
  amenities?: string;
}
