import { BaseProvider } from '../BaseProvider';
import { PushNotificationMessage, PushNotificationProvider, PushSendResult } from '../interfaces/PushNotificationProvider';
import { ProviderCategory } from '../types';

export class MockPushProvider extends BaseProvider implements PushNotificationProvider {
  public readonly id = 'mock-firebase-fcm';
  public readonly name = 'Firebase Cloud Messaging FCM';
  public readonly category: ProviderCategory = 'push';

  constructor() {
    super();
    this.initApiClient('https://api.mock-push.masari.internal');
  }

  protected async executeMockRequest<T>(endpoint: string): Promise<T> {
    return { mock: true, endpoint } as unknown as T;
  }

  public async sendPush(notification: PushNotificationMessage): Promise<PushSendResult> {
    await new Promise((res) => setTimeout(res, 80));
    return {
      messageId: `FCM-PUSH-${Date.now()}`,
      status: 'sent'
    };
  }
}
