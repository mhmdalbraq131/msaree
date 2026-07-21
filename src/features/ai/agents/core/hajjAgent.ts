/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class HajjAgent implements BaseAgent {
  readonly id = 'agent-hajj';
  readonly name = 'Masari Hajj Pilgrim Companion Agent';
  readonly description = 'Provides pilgrim preparation checklists, ritual timelines, Mina/Arafat tent guides, and Hajj package management.';

  readonly capabilities: AgentCapability[] = [
    { id: 'hajj_guidance', name: 'Hajj Ritual Companion', description: 'Guides pilgrims through obligatory Hajj rituals step-by-step.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('حج') || q.includes('مناسك الحج') || q.includes('منى') || q.includes('عرفات') || q.includes('مزدلفة') || q.includes('طواف الإفاضة') || q.includes('hajj') || q.includes('pilgrim') || q.includes('arafat')) {
      return 0.96;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🕋 **دليل ومرافقة الحجاج عبر عميل الحج المعتمد:**\n\n1. **باقة الحج الملكية (VIP):** $2,450 | مخيمات مكيفة بمخيمات منى المطورة + قطار المشاعر + فندق 5 نجوم بمكة.\n2. **جدول المناسك:** الإحرام ➔ الوقوف بعرفة ➔ المبيت بمزدلفة ➔ رمي الجمرات وطواف الإفاضة.\n3. **التصاريح:** ربط آلي مباشر مع وزارة الحج والعمرة.`;
    const contentEn = `🕋 **Hajj Pilgrim Companion Guidance via Hajj Agent:**\n\n1. **Royal Hajj Package (VIP):** $2,450 | Premium AC Mina Tents + Holy Sites Train + 5-Star Makkah Hotel.\n2. **Ritual Sequence:** Ihram ➔ Arafat Stand ➔ Muzdalifah Night ➔ Jamarat & Tawaf Al-Ifadah.\n3. **Permits:** Direct sync with Ministry of Hajj & Umrah systems.`;

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
