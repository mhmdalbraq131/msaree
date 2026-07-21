/**
 * MASARI Platform - Enterprise Integration Foundation Types
 */

export type ProviderCategory = 
  | 'airlines'
  | 'hotels'
  | 'bus'
  | 'visa'
  | 'payment'
  | 'maps'
  | 'currency'
  | 'weather'
  | 'email'
  | 'sms'
  | 'push';

export type ProviderHealth = 'online' | 'offline' | 'slow_response' | 'timeout' | 'unavailable';

export type EnvironmentMode = 'development' | 'production';

export interface HealthCheckResult {
  providerId: string;
  category: ProviderCategory;
  status: ProviderHealth;
  latencyMs: number;
  lastChecked: string;
  details?: string;
}

export interface RequestLog {
  id: string;
  providerId: string;
  endpoint: string;
  method: string;
  timestamp: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ResponseLog {
  requestId: string;
  providerId: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
  success: boolean;
  error?: string;
  data?: unknown;
}

export interface CacheOptions {
  ttlMs: number;
  forceRefresh?: boolean;
}

export interface RetryOptions {
  maxRetries: number;
  backoffFactorMs: number;
  retryableStatusCodes?: number[];
}

export interface RateLimitOptions {
  maxRequestsPerWindow: number;
  windowMs: number;
}

export class UnifiedPlatformException extends Error {
  public readonly code: string;
  public readonly providerId: string;
  public readonly statusCode?: number;
  public readonly originalError?: unknown;
  public readonly timestamp: string;

  constructor(
    code: string,
    message: string,
    providerId: string,
    statusCode?: number,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'UnifiedPlatformException';
    this.code = code;
    this.providerId = providerId;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export interface ConnectorInterface {
  id: string;
  name: string;
  category: ProviderCategory;
  mode: EnvironmentMode;
  healthStatus: ProviderHealth;
  executeRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
  checkHealth(): Promise<HealthCheckResult>;
}
