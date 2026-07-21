/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class UmrahAgent implements BaseAgent {
  readonly id = 'agent-umrah';
  readonly name = 'Masari Umrah Spiritual Agent';
  readonly description = 'Manages Umrah packages, ritual steps (Tawaf, Sa\'ee, Halq), Haram proximity hotels, and express e-visas.';

  readonly capabilities: AgentCapability[] = [
    { id: 'umrah_search', name: 'Umrah Package Assistant', description: 'Recommends express Umrah packages with hotel & transit options.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('عمرة') || q.includes('طواف') || q.includes('سعي') || q.includes('إحرام') || q.includes('الحرم') || q.includes('روضة') || q.includes('umrah') || q.includes('tawaf') || q.includes('saee')) {
      return 0.96;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `✨ **باقات ودليل العمرة المعتمد عبر عميل العمرة:**\n\n1. **باقة العمرة الاقتصادية (7 أيام):** $650 | طيران + فندق 4 نجوم قرب الحرم + مواصلات المزارات.\n2. **باقة العمرة الفاخرة (10 أيام):** $1,200 | إقامة بالأبراج المطلة + قطار الحرمين السريع بين مكة والمدينة.\n3. **خدمة النسك:** حجز المواعيد الآلية للزيارة والصلاة في الروضة الشريفة.`;
    const contentEn = `✨ **Verified Umrah Packages & Guidance via Umrah Agent:**\n\n1. **Economy Umrah Package (7 Days):** $650 | Flights + 4-Star Hotel near Haram + Ziyarat transfers.\n2. **Luxury Umrah Package (10 Days):** $1,200 | Haram View Tower Stay + Haramain High-Speed Rail Makkah-Madinah.\n3. **Nusuk Permits:** Automated appointment booking for Rawdah Sharif visits.`;

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
