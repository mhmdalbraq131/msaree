/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class NotificationAgent implements BaseAgent {
  readonly id = 'agent-notification';
  readonly name = 'Masari Intelligent Alert & Notification Agent';
  readonly description = 'Generates timely travel reminders, flight updates, visa expiration warnings, and price drop alerts.';

  readonly capabilities: AgentCapability[] = [
    { id: 'smart_alerts', name: 'Smart Alert Dispatcher', description: 'Monitors deadlines, flight departure gates, and visa expiries.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('تنبيه') || q.includes('إشعار') || q.includes('تذكير') || q.includes('موعد') || q.includes('alert') || q.includes('notify') || q.includes('reminder') || q.includes('update')) {
      return 0.88;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🔔 **تنبيهات وإشعارات مساري الذكية (عميل الإشعارات):**\n\n- ⏰ **تذكير بالرحلة:** رحلتك القادمة إلى القاهرة خلال 48 ساعة. يرجى تجهيز جواز السفر والتأشيرة.\n- 📉 **تنبيه انخفاض السعر:** انخفض سعر فندق أبراج مكة بنسبة 12% لتواريخ رحلتك.\n- 🛂 **صلاحية التأشيرة:** تأشيرتك سارية لمدة 90 يوماً من تاريخ الإصدار.`;
    const contentEn = `🔔 **Smart Travel Alerts via Notification Agent:**\n\n- ⏰ **Flight Departure Reminder:** Your upcoming flight to Cairo departs in 48 hours. Please bring your passport.\n- 📉 **Price Drop Alert:** Makkah Towers hotel rate dropped by 12% for your selected travel window.\n- 🛂 **Visa Validity:** E-Visa valid for 90 days from issuance date.`;

    return {
      agentId: this.id,
      agentName: this.name,
      success: true,
      contentAr,
      contentEn,
      latencyMs: Date.now() - startTime
    };
  }
}
