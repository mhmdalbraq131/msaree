/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class VisaAgent implements BaseAgent {
  readonly id = 'agent-visa';
  readonly name = 'Masari E-Visa & Immigration Agent';
  readonly description = 'Verifies visa eligibility, checklists required documents, guides electronic applications, and checks validity.';

  readonly capabilities: AgentCapability[] = [
    { id: 'visa_check', name: 'Visa Eligibility Check', description: 'Inspects passport rules and e-visa entry clearances.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('تأشيرة') || q.includes('فيزا') || q.includes('جواز') || q.includes('إقامة') || q.includes('مستندات') || q.includes('visa') || q.includes('passport') || q.includes('permit') || q.includes('entry')) {
      return 0.94;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🛂 **متطلبات وحالة التأشيرة الإلكترونية عبر عميل التأشيرات:**\n\n- **تأشيرة العمرة الإلكترونية:** تتطلب صورة جواز سفر ساري (6 أشهر) + صورة شخصية خلفية بيضاء.\n- **مدة الإصدار:** 24 - 48 ساعة فقط.\n- **الرسوم الرقمية:** $120 شاملة التأمين الطبي المعتمد.`;
    const contentEn = `🛂 **E-Visa Status & Document Guidance via Visa Agent:**\n\n- **Umrah E-Visa:** Requires valid passport (min 6 months) + White background photo.\n- **Processing Time:** Fast-track 24 - 48 hours.\n- **Official Fee:** $120 including approved KSA health insurance.`;

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
