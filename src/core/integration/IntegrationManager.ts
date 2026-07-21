import { ConnectionMonitor } from './ConnectionMonitor';
import { HealthMonitor } from './HealthMonitor';
import { AirlinesProvider } from './interfaces/AirlinesProvider';
import { BusProvider } from './interfaces/BusProvider';
import { CurrencyProvider } from './interfaces/CurrencyProvider';
import { EmailProvider } from './interfaces/EmailProvider';
import { HotelsProvider } from './interfaces/HotelsProvider';
import { MapsProvider } from './interfaces/MapsProvider';
import { PaymentProvider } from './interfaces/PaymentProvider';
import { PushNotificationProvider } from './interfaces/PushNotificationProvider';
import { SmsProvider } from './interfaces/SmsProvider';
import { VisaProvider } from './interfaces/VisaProvider';
import { WeatherProvider } from './interfaces/WeatherProvider';

import { MockAirlinesProvider } from './mocks/MockAirlinesProvider';
import { MockBusProvider } from './mocks/MockBusProvider';
import { MockCurrencyProvider } from './mocks/MockCurrencyProvider';
import { MockEmailProvider } from './mocks/MockEmailProvider';
import { MockHotelsProvider } from './mocks/MockHotelsProvider';
import { MockMapsProvider } from './mocks/MockMapsProvider';
import { MockPaymentProvider } from './mocks/MockPaymentProvider';
import { MockPushProvider } from './mocks/MockPushProvider';
import { MockSmsProvider } from './mocks/MockSmsProvider';
import { MockVisaProvider } from './mocks/MockVisaProvider';
import { MockWeatherProvider } from './mocks/MockWeatherProvider';

import { ProviderRegistry } from './ProviderRegistry';
import { ConnectorInterface, EnvironmentMode, HealthCheckResult, ProviderCategory } from './types';

export class IntegrationManager {
  private static instance: IntegrationManager;
  private mode: EnvironmentMode = 'development';
  private registry = ProviderRegistry.getInstance();
  private healthMonitor = HealthMonitor.getInstance();
  private connectionMonitor = ConnectionMonitor.getInstance();

  private constructor() {
    this.bootstrapDefaultProviders();
  }

  public static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  public getMode(): EnvironmentMode {
    return this.mode;
  }

  public setMode(mode: EnvironmentMode): void {
    this.mode = mode;
    const providers = this.registry.getAllProviders();
    for (const provider of providers) {
      provider.mode = mode;
    }
  }

  private bootstrapDefaultProviders(): void {
    this.registry.register(new MockAirlinesProvider());
    this.registry.register(new MockHotelsProvider());
    this.registry.register(new MockBusProvider());
    this.registry.register(new MockVisaProvider());
    this.registry.register(new MockPaymentProvider());
    this.registry.register(new MockMapsProvider());
    this.registry.register(new MockCurrencyProvider());
    this.registry.register(new MockWeatherProvider());
    this.registry.register(new MockEmailProvider());
    this.registry.register(new MockSmsProvider());
    this.registry.register(new MockPushProvider());

    // Cascade initial mode
    this.setMode(this.mode);
  }

  public getAirlinesProvider(): AirlinesProvider {
    const list = this.registry.getProvidersByCategory<AirlinesProvider>('airlines');
    if (!list.length) throw new Error('No Airlines provider registered');
    return list[0];
  }

  public getHotelsProvider(): HotelsProvider {
    const list = this.registry.getProvidersByCategory<HotelsProvider>('hotels');
    if (!list.length) throw new Error('No Hotels provider registered');
    return list[0];
  }

  public getBusProvider(): BusProvider {
    const list = this.registry.getProvidersByCategory<BusProvider>('bus');
    if (!list.length) throw new Error('No Bus provider registered');
    return list[0];
  }

  public getVisaProvider(): VisaProvider {
    const list = this.registry.getProvidersByCategory<VisaProvider>('visa');
    if (!list.length) throw new Error('No Visa provider registered');
    return list[0];
  }

  public getPaymentProvider(): PaymentProvider {
    const list = this.registry.getProvidersByCategory<PaymentProvider>('payment');
    if (!list.length) throw new Error('No Payment provider registered');
    return list[0];
  }

  public getMapsProvider(): MapsProvider {
    const list = this.registry.getProvidersByCategory<MapsProvider>('maps');
    if (!list.length) throw new Error('No Maps provider registered');
    return list[0];
  }

  public getCurrencyProvider(): CurrencyProvider {
    const list = this.registry.getProvidersByCategory<CurrencyProvider>('currency');
    if (!list.length) throw new Error('No Currency provider registered');
    return list[0];
  }

  public getWeatherProvider(): WeatherProvider {
    const list = this.registry.getProvidersByCategory<WeatherProvider>('weather');
    if (!list.length) throw new Error('No Weather provider registered');
    return list[0];
  }

  public getEmailProvider(): EmailProvider {
    const list = this.registry.getProvidersByCategory<EmailProvider>('email');
    if (!list.length) throw new Error('No Email provider registered');
    return list[0];
  }

  public getSmsProvider(): SmsProvider {
    const list = this.registry.getProvidersByCategory<SmsProvider>('sms');
    if (!list.length) throw new Error('No SMS provider registered');
    return list[0];
  }

  public getPushProvider(): PushNotificationProvider {
    const list = this.registry.getProvidersByCategory<PushNotificationProvider>('push');
    if (!list.length) throw new Error('No Push provider registered');
    return list[0];
  }

  public async runHealthChecks(): Promise<HealthCheckResult[]> {
    const providers = this.registry.getAllProviders();
    const results: HealthCheckResult[] = [];

    for (const provider of providers) {
      const res = await this.healthMonitor.evaluateConnector(provider);
      results.push(res);
    }

    return results;
  }

  public isOnline(): boolean {
    return this.connectionMonitor.getStatus();
  }

  public registerCustomProvider(provider: ConnectorInterface): void {
    provider.mode = this.mode;
    this.registry.register(provider);
  }
}
