import { BaseProvider } from '../BaseProvider';
import { EmailMessage, EmailProvider, EmailSendResult } from '../interfaces/EmailProvider';
import { ProviderCategory } from '../types';

export class MockEmailProvider extends BaseProvider implements EmailProvider {
  public readonly id = 'mock-sendgrid-email';
  public readonly name = 'SendGrid / SMTP Email Connector';
  public readonly category: ProviderCategory = 'email';

  constructor() {
    super();
    this.initApiClient('https://api.mock-email.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      messageId: `MSG-EMAIL-${Date.now()}`,
      status: 'sent'
    };
  }
}
