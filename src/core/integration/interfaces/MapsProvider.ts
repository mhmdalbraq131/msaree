import { ConnectorInterface } from '../types';

export interface GeocodeLocation {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface RouteCalculationParams {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export interface RouteCalculationResult {
  distanceKm: number;
  durationMinutes: number;
  routePolyline?: string;
}

export interface MapsProvider extends ConnectorInterface {
  geocode(address: string): Promise<GeocodeLocation>;
  calculateRoute(params: RouteCalculationParams): Promise<RouteCalculationResult>;
}
