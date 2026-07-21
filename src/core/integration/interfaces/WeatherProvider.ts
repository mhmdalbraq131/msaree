import { ConnectorInterface } from '../types';

export interface WeatherForecastResult {
  city: string;
  country: string;
  tempCelsius: number;
  conditionAr: string;
  conditionEn: string;
  humidityPercent: number;
  windSpeedKmh: number;
  forecastDate: string;
}

export interface WeatherProvider extends ConnectorInterface {
  getForecast(city: string): Promise<WeatherForecastResult>;
}
