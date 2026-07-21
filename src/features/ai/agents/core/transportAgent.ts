/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class TransportAgent implements BaseAgent {
  readonly id = 'agent-transport';
  readonly name = 'Masari Transport Coordinator Agent';
  readonly description = 'Coordinates multi-modal transit options including flights, buses, private cars, train connections, and airport transfers.';

  readonly capabilities: AgentCapability[] = [
    { id: 'multimodal_transit', name: 'Multi-modal Transport Coordinator', description: 'Combines air, land, and car transfers for complete mobility.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('مواصلات') || q.includes('توصيل') || q.includes('تكسي') || q.includes('سيارة') || q.includes('قطار') || q.includes('transport') || q.includes('transfer') || q.includes('car') || q.includes('train')) {
      return 0.92;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🚗 **تنسيق خيارات النقل والمواصلات عبر عميل النقل الموحد:**\n\n1. **توصيل مطار VIP خاص (GMC / مرسيدس):** $80 | من المطار مباشرة إلى الفندق مع سائق خاص.\n2. **قطار الحرمين السريع:** $25 | جدة ➔ مكة في 30 دقيقة فقط بسرعة 300 كم/س.\n3. **تأجير سيارات بدفع رباعي:** $50 / يوم | تسليم واستلام ميسر.`;
    const contentEn = `🚗 **Multi-Modal Transit Options via Transport Agent:**\n\n1. **VIP Private Airport Transfer (GMC / Mercedes):** $80 | Direct airport-to-hotel pick-up with dedicated driver.\n2. **Haramain High-Speed Rail:** $25 | Jeddah ➔ Makkah in 30 minutes at 300 km/h.\n3. **SUV Rental Car:** $50 / day | Easy pick-up & drop-off at all hubs.`;

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
