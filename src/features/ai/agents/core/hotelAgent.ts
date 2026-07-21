/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class HotelAgent implements BaseAgent {
  readonly id = 'agent-hotel';
  readonly name = 'Masari Hospitality & Hotel Agent';
  readonly description = 'Searches hotels, compares star ratings, proximity to Haram and major landmarks, and optimizes room stays.';

  readonly capabilities: AgentCapability[] = [
    { id: 'hotel_search', name: 'Hotel Search', description: 'Finds verified hotels and suites.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('فندق') || q.includes('سكن') || q.includes('غرفة') || q.includes('أبراج') || q.includes('hotel') || q.includes('stay') || q.includes('room') || q.includes('accommodation')) {
      return 0.93;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🏨 **توصيات الفنادق المتاحة عبر عميل الضيافة:**\n\n1. **فندق أبعاد مكة (أمام ساحة الحرم مباشرة):** 5 نجوم | $180 / ليلة | إفطار مجاني.\n2. **فندق دار الهجرة (المدينة المنورة):** 4 نجوم | $110 / ليلة | إطلالة على المسجد النبوي.`;
    const contentEn = `🏨 **Hotel Options via Hospitality Agent:**\n\n1. **Abaad Makkah Hotel (Steps from Haram Plaza):** 5-Star | $180 / night | Free breakfast.\n2. **Dar Al-Hijra (Madinah):** 4-Star | $110 / night | Prophet's Mosque view.`;

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
