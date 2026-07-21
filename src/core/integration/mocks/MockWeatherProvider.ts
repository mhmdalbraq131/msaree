import { BaseProvider } from '../BaseProvider';
import { WeatherForecastResult, WeatherProvider } from '../interfaces/WeatherProvider';
import { ProviderCategory } from '../types';

export class MockWeatherProvider extends BaseProvider implements WeatherProvider {
  public readonly id = 'mock-weather-service';
  public readonly name = 'Global Destination Weather Mock';
  public readonly category: ProviderCategory = 'weather';

  constructor() {
    super();
    this.initApiClient('https://api.mock-weather.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async getForecast(city: string): Promise<WeatherForecastResult> {
    await new Promise((res) => setTimeout(res, 60));
    return {
      city,
      country: 'مكة المكرمة / السعودية',
      tempCelsius: 38,
      conditionAr: 'مشمس ومشمس جزئياً',
      conditionEn: 'Sunny and clear skies',
      humidityPercent: 25,
      windSpeedKmh: 14,
      forecastDate: new Date().toISOString().substring(0, 10)
    };
  }
}
