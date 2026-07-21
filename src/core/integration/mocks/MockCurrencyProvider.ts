import { BaseProvider } from '../BaseProvider';
import { 
  CurrencyConversionParams, 
  CurrencyConversionResult, 
  CurrencyProvider, 
  ExchangeRateResult 
} from '../interfaces/CurrencyProvider';
import { ProviderCategory } from '../types';

export class MockCurrencyProvider extends BaseProvider implements CurrencyProvider {
  public readonly id = 'mock-central-bank-fx';
  public readonly name = 'Central Bank FX Rates Mock';
  public readonly category: ProviderCategory = 'currency';

  constructor() {
    super();
    this.initApiClient('https://api.mock-fx.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async getRates(baseCurrency: string): Promise<ExchangeRateResult> {
    await new Promise((res) => setTimeout(res, 50));
    return {
      baseCurrency,
      rates: {
        USD: 1,
        YER: 530,
        SAR: 3.75,
        EGP: 48.5,
        AED: 3.67
      },
      updatedAt: new Date().toISOString()
    };
  }

  public async convert(params: CurrencyConversionParams): Promise<CurrencyConversionResult> {
    await new Promise((res) => setTimeout(res, 50));
    let rate = 1;
    if (params.fromCurrency === 'USD' && params.toCurrency === 'YER') rate = 530;
    else if (params.fromCurrency === 'USD' && params.toCurrency === 'SAR') rate = 3.75;
    else if (params.fromCurrency === 'YER' && params.toCurrency === 'USD') rate = 1 / 530;

    return {
      convertedAmount: params.amount * rate,
      rateUsed: rate,
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency
    };
  }
}
