import { BaseProvider } from '../BaseProvider';
import { SmsMessage, SmsProvider, SmsSendResult } from '../interfaces/SmsProvider';
import { ProviderCategory } from '../types';

export class MockSmsProvider extends BaseProvider implements SmsProvider {
  public readonly id = 'mock-twilio-sms';
  public readonly name = 'Twilio / Telecom SMS Gateway';
  public readonly category: ProviderCategory = 'sms';

  constructor() {
    super();
    this.initApiClient('https://api.mock-sms.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async sendSms(message: SmsMessage): Promise<SmsSendResult> {
    await new Promise((res) => setTimeout(res, 90));
    return {
      messageId: `MSG-SMS-${Date.now()}`,
      status: 'delivered'
    };
  }
}
