import { ConnectorInterface, ProviderCategory } from './types';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, ConnectorInterface> = new Map();

  private constructor() {}

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public register(provider: ConnectorInterface): void {
    this.providers.set(provider.id, provider);
  }

  public unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  public getProvider<T extends ConnectorInterface>(providerId: string): T | undefined {
    return this.providers.get(providerId) as T | undefined;
  }

  public getProvidersByCategory<T extends ConnectorInterface>(category: ProviderCategory): T[] {
    const matched: T[] = [];
    for (const provider of this.providers.values()) {
      if (provider.category === category) {
        matched.push(provider as T);
      }
    }
    return matched;
  }

  public getAllProviders(): ConnectorInterface[] {
    return Array.from(this.providers.values());
  }

  public clear(): void {
    this.providers.clear();
  }
}
