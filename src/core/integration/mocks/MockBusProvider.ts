import { BaseProvider } from '../BaseProvider';
import { 
  BusBookingRequest, 
  BusBookingResult, 
  BusProvider, 
  BusSearchParams, 
  BusTripOffer 
} from '../interfaces/BusProvider';
import { ProviderCategory } from '../types';

export class MockBusProvider extends BaseProvider implements BusProvider {
  public readonly id = 'mock-alborag-express';
  public readonly name = 'Al-Borag VIP Bus Fleet Connector';
  public readonly category: ProviderCategory = 'bus';

  constructor() {
    super();
    this.initApiClient('https://api.mock-bus.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async searchTrips(params: BusSearchParams): Promise<BusTripOffer[]> {
    await new Promise((res) => setTimeout(res, 100));
    return [
      {
        tripId: 'bus-trip-101',
        companyName: 'أسطول البرق السريع VIP',
        busType: 'VIP',
        departureTime: '2026-08-01T20:00:00Z',
        arrivalTime: '2026-08-02T08:00:00Z',
        originStation: params.origin || 'صنعاء',
        destinationStation: params.destination || 'جدة / مكة',
        priceAmount: 85,
        currency: 'USD',
        availableSeats: 22
      }
    ];
  }

  public async bookSeats(request: BusBookingRequest): Promise<BusBookingResult> {
    await new Promise((res) => setTimeout(res, 200));
    return {
      ticketNumber: `BUS-TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'confirmed',
      totalPrice: request.seatNumbers.length * 85,
      currency: 'USD'
    };
  }
}
