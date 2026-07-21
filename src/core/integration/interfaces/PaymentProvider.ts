import { ConnectorInterface } from '../types';

export interface PaymentChargeRequest {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'wallet' | 'bank_transfer' | 'cash_agent';
  customerEmail: string;
  description: string;
  referenceNo: string;
}

export interface PaymentChargeResult {
  transactionId: string;
  status: 'succeeded' | 'pending' | 'failed';
  amount: number;
  currency: string;
  paymentGatewayRef: string;
  timestamp: string;
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface RefundResult {
  refundId: string;
  status: 'processed' | 'pending' | 'failed';
  amount: number;
}

export interface PaymentProvider extends ConnectorInterface {
  processPayment(request: PaymentChargeRequest): Promise<PaymentChargeResult>;
  verifyTransaction(transactionId: string): Promise<PaymentChargeResult>;
  refundPayment(request: RefundRequest): Promise<RefundResult>;
}
