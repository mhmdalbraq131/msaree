import { ConnectorInterface } from '../types';

export interface BusSearchParams {
  origin: string;
  destination: string;
  travelDate: string;
  passengers: number;
}

export interface BusTripOffer {
  tripId: string;
  companyName: string;
  busType: 'VIP' | 'Executive' | 'Standard';
  departureTime: string;
  arrivalTime: string;
  originStation: string;
  destinationStation: string;
  priceAmount: number;
  currency: string;
  availableSeats: number;
}

export interface BusBookingRequest {
  tripId: string;
  seatNumbers: string[];
  passengerNames: string[];
}

export interface BusBookingResult {
  ticketNumber: string;
  status: 'confirmed' | 'failed';
  totalPrice: number;
  currency: string;
}

export interface BusProvider extends ConnectorInterface {
  searchTrips(params: BusSearchParams): Promise<BusTripOffer[]>;
  bookSeats(request: BusBookingRequest): Promise<BusBookingResult>;
}
