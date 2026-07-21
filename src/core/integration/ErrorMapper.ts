import { UnifiedPlatformException } from './types';

export class ErrorMapper {
  /**
   * Maps any error or HTTP response code into a standardized UnifiedPlatformException
   */
  public static mapError(error: unknown, providerId: string, defaultCode = 'PROVIDER_ERROR'): UnifiedPlatformException {
    if (error instanceof UnifiedPlatformException) {
      return error;
    }

    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
      return new UnifiedPlatformException(
        'NETWORK_OFFLINE_OR_BLOCKED',
        `Network connection failed for provider [${providerId}]: ${error.message}`,
        providerId,
        0,
        error
      );
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return new UnifiedPlatformException(
        'REQUEST_TIMEOUT',
        `Request timed out for provider [${providerId}]`,
        providerId,
        408,
        error
      );
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      const errObj = error as { status: number; message?: string };
      const code = this.getErrorCodeFromStatus(errObj.status);
      return new UnifiedPlatformException(
        code,
        errObj.message || `Provider [${providerId}] returned HTTP status ${errObj.status}`,
        providerId,
        errObj.status,
        error
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    return new UnifiedPlatformException(defaultCode, message, providerId, 500, error);
  }

  private static getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400: return 'INVALID_REQUEST_PAYLOAD';
      case 401: return 'PROVIDER_UNAUTHORIZED';
      case 403: return 'PROVIDER_ACCESS_DENIED';
      case 404: return 'RESOURCE_NOT_FOUND';
      case 408: return 'REQUEST_TIMEOUT';
      case 429: return 'RATE_LIMIT_EXCEEDED';
      case 500: return 'PROVIDER_INTERNAL_ERROR';
      case 502: return 'BAD_GATEWAY';
      case 503: return 'SERVICE_UNAVAILABLE';
      case 504: return 'GATEWAY_TIMEOUT';
      default: return 'HTTP_ERROR_' + status;
    }
  }
}
