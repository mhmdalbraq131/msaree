import { ConnectorInterface } from '../types';

export interface PushNotificationMessage {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushSendResult {
  messageId: string;
  status: 'sent' | 'failed';
}

export interface PushNotificationProvider extends ConnectorInterface {
  sendPush(notification: PushNotificationMessage): Promise<PushSendResult>;
}
