import { ConnectorInterface } from '../types';

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  starRating?: number;
}

export interface HotelOffer {
  hotelId: string;
  name: string;
  city: string;
  address: string;
  starRating: number;
  roomType: string;
  pricePerNight: number;
  currency: string;
  imageUrl?: string;
  availableRooms: number;
}

export interface HotelBookingRequest {
  hotelId: string;
  roomType: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
}

export interface HotelBookingResult {
  reservationId: string;
  hotelName: string;
  status: 'confirmed' | 'pending' | 'failed';
  totalPrice: number;
  currency: string;
}

export interface HotelsProvider extends ConnectorInterface {
  searchHotels(params: HotelSearchParams): Promise<HotelOffer[]>;
  bookHotel(request: HotelBookingRequest): Promise<HotelBookingResult>;
  cancelReservation(reservationId: string): Promise<boolean>;
}
