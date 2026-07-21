import { BaseProvider } from '../BaseProvider';
import { 
  AirlinesProvider, 
  FlightBookingRequest, 
  FlightBookingResult, 
  FlightOffer, 
  FlightSearchParams 
} from '../interfaces/AirlinesProvider';
import { ProviderCategory } from '../types';

export class MockAirlinesProvider extends BaseProvider implements AirlinesProvider {
  public readonly id = 'mock-yemenia-airways';
  public readonly name = 'Yemenia Airways Mock Connector';
  public readonly category: ProviderCategory = 'airlines';

  constructor() {
    super();
    this.initApiClient('https://api.mock-airlines.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [
      {
        id: `fl-${Date.now()}-1`,
        airlineCode: 'IY',
        airlineName: 'الخطوط الجوية اليمنية (Yemenia)',
        flightNumber: 'IY-601',
        departureAirport: params.origin || 'SAH',
        arrivalAirport: params.destination || 'CAI',
        departureTime: `${params.departureDate || '2026-08-01'}T08:30:00Z`,
        arrivalTime: `${params.departureDate || '2026-08-01'}T11:45:00Z`,
        durationMinutes: 195,
        priceAmount: 480,
        currency: 'USD',
        availableSeats: 12
      },
      {
        id: `fl-${Date.now()}-2`,
        airlineCode: 'IY',
        airlineName: 'الخطوط الجوية اليمنية (Yemenia)',
        flightNumber: 'IY-607',
        departureAirport: params.origin || 'SAH',
        arrivalAirport: params.destination || 'AMM',
        departureTime: `${params.departureDate || '2026-08-01'}T14:15:00Z`,
        arrivalTime: `${params.departureDate || '2026-08-01'}T17:30:00Z`,
        durationMinutes: 195,
        priceAmount: 520,
        currency: 'USD',
        availableSeats: 8
      }
    ];
  }

  public async bookFlight(request: FlightBookingRequest): Promise<FlightBookingResult> {
    await new Promise((res) => setTimeout(res, 300));
    return {
      pnr: `IY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      totalPrice: 480,
      currency: 'USD',
      eTicketNumbers: request.passengerNames.map((_, idx) => `635-${Date.now().toString().slice(-8)}-${idx + 1}`),
      issuedAt: new Date().toISOString()
    };
  }

  public async cancelBooking(pnr: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 100));
    return pnr.length > 0;
  }
}
