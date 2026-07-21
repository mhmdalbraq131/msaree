import { CacheOptions, RateLimitOptions, RetryOptions } from './types';

import { ConnectionMonitor } from './ConnectionMonitor';
import { ErrorMapper } from './ErrorMapper';
import { OfflineCache } from './OfflineCache';
import { RateLimiter } from './RateLimiter';
import { RequestInterceptor } from './RequestInterceptor';
import { ResponseInterceptor } from './ResponseInterceptor';
import { RetryPolicy } from './RetryPolicy';

export interface ApiClientConfig {
  providerId: string;
  baseUrl: string;
  timeoutMs?: number;
  retryOptions?: Partial<RetryOptions>;
  rateLimitOptions?: RateLimitOptions;
}

export class ApiClient {
  public readonly requestInterceptor = new RequestInterceptor();
  public readonly responseInterceptor = new ResponseInterceptor();
  private retryPolicy = new RetryPolicy();
  private rateLimiter = new RateLimiter();
  private cache = new OfflineCache();
  private connectionMonitor = ConnectionMonitor.getInstance();

  constructor(private config: ApiClientConfig) {}

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheOpts?: CacheOptions
  ): Promise<T> {
    const fullUrl = `${this.config.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const cacheKey = `${options.method || 'GET'}:${fullUrl}:${JSON.stringify(options.body || '')}`;

    // Check offline cache if requested or offline
    if (cacheOpts && !cacheOpts.forceRefresh && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    if (!this.connectionMonitor.getStatus()) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
      throw ErrorMapper.mapError(new Error('Device is offline'), this.config.providerId, 'NETWORK_OFFLINE');
    }

    // Rate limiting
    if (this.config.rateLimitOptions) {
      this.rateLimiter.checkLimit(this.config.providerId, this.config.rateLimitOptions);
    }

    // Execute through RetryPolicy
    return this.retryPolicy.execute(async () => {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutMs = this.config.timeoutMs || 10000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const interceptResult = await this.requestInterceptor.execute(
          this.config.providerId,
          fullUrl,
          {
            ...options,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'X-Masari-Provider': this.config.providerId,
              ...(options.headers || {})
            }
          }
        );

        const rawResponse = await fetch(interceptResult.url, interceptResult.options);
        clearTimeout(timeoutId);

        const durationMs = Date.now() - startTime;
        const processedResponse = await this.responseInterceptor.execute(
          this.config.providerId,
          rawResponse,
          durationMs
        );

        if (!processedResponse.ok) {
          throw { status: processedResponse.status, message: await processedResponse.text() };
        }

        const data = (await processedResponse.json()) as T;

        if (cacheOpts?.ttlMs) {
          this.cache.set(cacheKey, data, cacheOpts.ttlMs);
        }

        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        throw ErrorMapper.mapError(err, this.config.providerId);
      }
    }, this.config.retryOptions);
  }

  public getCache(): OfflineCache {
    return this.cache;
  }
}
