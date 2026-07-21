import { ConnectorInterface } from '../types';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: 'economy' | 'business' | 'first';
}

export interface FlightOffer {
  id: string;
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  priceAmount: number;
  currency: string;
  availableSeats: number;
}

export interface FlightBookingRequest {
  offerId: string;
  passengerNames: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface FlightBookingResult {
  pnr: string;
  status: 'confirmed' | 'pending' | 'failed';
  totalPrice: number;
  currency: string;
  eTicketNumbers: string[];
  issuedAt: string;
}

export interface AirlinesProvider extends ConnectorInterface {
  searchFlights(params: FlightSearchParams): Promise<FlightOffer[]>;
  bookFlight(request: FlightBookingRequest): Promise<FlightBookingResult>;
  cancelBooking(pnr: string): Promise<boolean>;
}
