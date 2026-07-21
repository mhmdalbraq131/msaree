import { ConnectorInterface } from '../types';

export interface ExchangeRateResult {
  baseCurrency: string;
  rates: Record<string, number>;
  updatedAt: string;
}

export interface CurrencyConversionParams {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface CurrencyConversionResult {
  convertedAmount: number;
  rateUsed: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface CurrencyProvider extends ConnectorInterface {
  getRates(baseCurrency: string): Promise<ExchangeRateResult>;
  convert(params: CurrencyConversionParams): Promise<CurrencyConversionResult>;
}
