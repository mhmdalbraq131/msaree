import { ConnectorInterface } from '../types';

export interface SmsMessage {
  phoneNumber: string;
  message: string;
}

export interface SmsSendResult {
  messageId: string;
  status: 'delivered' | 'pending' | 'failed';
}

export interface SmsProvider extends ConnectorInterface {
  sendSms(message: SmsMessage): Promise<SmsSendResult>;
}
