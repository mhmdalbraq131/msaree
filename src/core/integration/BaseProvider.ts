import { ApiClient } from './ApiClient';

import { ConnectorInterface, EnvironmentMode, HealthCheckResult, ProviderCategory, ProviderHealth } from './types';

export abstract class BaseProvider implements ConnectorInterface {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly category: ProviderCategory;
  public mode: EnvironmentMode = 'development';
  public healthStatus: ProviderHealth = 'online';

  protected apiClient!: ApiClient;

  protected initApiClient(baseUrl: string, timeoutMs = 8000): void {
    this.apiClient = new ApiClient({
      providerId: this.id,
      baseUrl,
      timeoutMs,
      rateLimitOptions: {
        maxRequestsPerWindow: 60,
        windowMs: 60000
      }
    });
  }

  public async executeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (this.mode === 'development') {
      return this.executeMockRequest<T>(endpoint, options);
    }
    return this.apiClient.request<T>(endpoint, options);
  }

  protected abstract executeMockRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;

  public async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      if (this.mode === 'development') {
        const latencyMs = Math.floor(Math.random() * 80) + 20; // 20-100ms
        this.healthStatus = 'online';
        return {
          providerId: this.id,
          category: this.category,
          status: 'online',
          latencyMs,
          lastChecked: new Date().toISOString(),
          details: 'Mock provider running in development environment'
        };
      }

      await this.executeRequest<unknown>('/health');
      const latencyMs = Date.now() - startTime;
      
      if (latencyMs > 3000) {
        this.healthStatus = 'slow_response';
      } else {
        this.healthStatus = 'online';
      }

      return {
        providerId: this.id,
        category: this.category,
        status: this.healthStatus,
        latencyMs,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      this.healthStatus = 'unavailable';
      return {
        providerId: this.id,
        category: this.category,
        status: 'unavailable',
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
