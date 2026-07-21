import { BaseProvider } from '../BaseProvider';
import { 
  PaymentChargeRequest, 
  PaymentChargeResult, 
  PaymentProvider, 
  RefundRequest, 
  RefundResult 
} from '../interfaces/PaymentProvider';
import { ProviderCategory } from '../types';

export class MockPaymentProvider extends BaseProvider implements PaymentProvider {
  public readonly id = 'mock-masari-pay-gateway';
  public readonly name = 'Masari Pay Secure Gateway';
  public readonly category: ProviderCategory = 'payment';

  constructor() {
    super();
    this.initApiClient('https://api.mock-pay.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async processPayment(request: PaymentChargeRequest): Promise<PaymentChargeResult> {
    await new Promise((res) => setTimeout(res, 300));
    return {
      transactionId: `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'succeeded',
      amount: request.amount,
      currency: request.currency,
      paymentGatewayRef: `GW-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    };
  }

  public async verifyTransaction(transactionId: string): Promise<PaymentChargeResult> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      transactionId,
      status: 'succeeded',
      amount: 150,
      currency: 'USD',
      paymentGatewayRef: `GW-REF-${transactionId}`,
      timestamp: new Date().toISOString()
    };
  }

  public async refundPayment(request: RefundRequest): Promise<RefundResult> {
    await new Promise((res) => setTimeout(res, 200));
    return {
      refundId: `RFD-${Date.now()}`,
      status: 'processed',
      amount: request.amount
    };
  }
}
