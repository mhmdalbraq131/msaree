/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class SupportAgent implements BaseAgent {
  readonly id = 'agent-support';
  readonly name = 'Masari Customer Service & Support Agent';
  readonly description = 'Provides instant customer support, answers FAQs, diagnoses booking or payment problems, and routes support cases.';

  readonly capabilities: AgentCapability[] = [
    { id: 'customer_support', name: 'Customer Service Concierge', description: 'Answers questions about refunds, booking policies, and platform services.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('دعم') || q.includes('مساعدة') || q.includes('مشكلة') || q.includes('استفسار') || q.includes('سياسة') || q.includes('support') || q.includes('help') || q.includes('problem') || q.includes('faq')) {
      return 0.85;
    }
    return 0.2; // Fallback general query handler
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    const contentAr = `🎧 **مركز خدمة العملاء والدعم الفني (عميل الدعم):**\n\nأهلاً بك! أنا هنا لمساعدتك في منصة **مساري**.\n\n- **الاسترداد المالي:** يتم إيداع المبالغ فورياً في المحفظة الإلكترونية.\n- **تغيير مواعيد السفر:** يمكنك تعديل حجوزاتك قبل 24 ساعة من موعد المغادرة مجاناً.\n- **المساعدة المباشرة:** إذا أردت رفع تذكرة دعم فني، سأقوم بربطك بالقسم المختص فوراً.`;
    const contentEn = `🎧 **Customer Support & FAQs (Support Agent):**\n\nHello! I am here to assist you with any inquiries on **MASARI** platform.\n\n- **Refund Policy:** Instant credit straight back to your digital wallet.\n- **Date Modifications:** Free booking date adjustments up to 24 hours prior to departure.\n- **Ticket Escalation:** If required, I can escalate your query directly to an human agent.`;

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
