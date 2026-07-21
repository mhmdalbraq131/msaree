import { BaseProvider } from '../BaseProvider';
import { 
  GeocodeLocation, 
  MapsProvider, 
  RouteCalculationParams, 
  RouteCalculationResult 
} from '../interfaces/MapsProvider';
import { ProviderCategory } from '../types';

export class MockMapsProvider extends BaseProvider implements MapsProvider {
  public readonly id = 'mock-google-maps';
  public readonly name = 'Google Maps Platform Mock';
  public readonly category: ProviderCategory = 'maps';

  constructor() {
    super();
    this.initApiClient('https://api.mock-maps.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async geocode(address: string): Promise<GeocodeLocation> {
    await new Promise((res) => setTimeout(res, 80));
    return {
      address,
      latitude: 15.3694,
      longitude: 44.1910,
      city: 'صنعاء',
      country: 'اليمن'
    };
  }

  public async calculateRoute(params: RouteCalculationParams): Promise<RouteCalculationResult> {
    await new Promise((res) => setTimeout(res, 120));
    return {
      distanceKm: 1250,
      durationMinutes: 840,
      routePolyline: 'encoded_mock_polyline_data'
    };
  }
}
