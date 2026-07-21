import { ConnectorInterface } from '../types';

export interface EmailMessage {
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  templateId?: string;
}

export interface EmailSendResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
}

export interface EmailProvider extends ConnectorInterface {
  sendEmail(message: EmailMessage): Promise<EmailSendResult>;
}
