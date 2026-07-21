import { ConnectorInterface, HealthCheckResult, ProviderHealth } from './types';

export type HealthChangeListener = (result: HealthCheckResult) => void;

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthStore: Map<string, HealthCheckResult> = new Map();
  private listeners: HealthChangeListener[] = [];

  private constructor() {}

  public static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  public registerResult(result: HealthCheckResult): void {
    this.healthStore.set(result.providerId, result);
    this.listeners.forEach((listener) => listener(result));
  }

  public getHealth(providerId: string): HealthCheckResult | undefined {
    return this.healthStore.get(providerId);
  }

  public getAllHealth(): HealthCheckResult[] {
    return Array.from(this.healthStore.values());
  }

  public subscribe(listener: HealthChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public async evaluateConnector(connector: ConnectorInterface): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const result = await connector.checkHealth();
      this.registerResult(result);
      return result;
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const failedResult: HealthCheckResult = {
        providerId: connector.id,
        category: connector.category,
        status: 'unavailable',
        latencyMs,
        lastChecked: new Date().toISOString(),
        details: error instanceof Error ? error.message : String(error)
      };
      this.registerResult(failedResult);
      return failedResult;
    }
  }
}
