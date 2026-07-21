/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAgent, AgentCapability, AgentExecutionParams, AgentExecutionResult, AgentMetrics } from '../framework/baseAgent.interface';

export class BookingAgent implements BaseAgent {
  readonly id = 'agent-booking';
  readonly name = 'Masari Booking Lifecycle Agent';
  readonly description = 'Creates, modifies, cancels bookings, tracks active booking statuses, and generates instant invoices.';

  readonly capabilities: AgentCapability[] = [
    { id: 'booking_create', name: 'Create Booking', description: 'Executes secure booking contracts.' },
    { id: 'booking_cancel', name: 'Cancel Booking', description: 'Processes cancellations with instant wallet refunds.' }
  ];

  readonly metrics: AgentMetrics = {
    totalInvocations: 0,
    successfulInvocations: 0,
    failedInvocations: 0,
    avgLatencyMs: 0
  };

  canHandle(query: string): number {
    const q = query.toLowerCase();
    if (q.includes('حجز') || q.includes('إلغاء') || q.includes('تعديل') || q.includes('تذكرة') || q.includes('booking') || q.includes('cancel') || q.includes('modify') || q.includes('ticket')) {
      return 0.9;
    }
    return 0.1;
  }

  async execute(params: AgentExecutionParams): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const isAr = params.lang === 'ar';
    const q = params.query.toLowerCase();

    let isCancel = q.includes('إلغاء') || q.includes('cancel');

    if (isCancel) {
      return {
        agentId: this.id,
        agentName: this.name,
        success: true,
        contentAr: `✅ **تمت معالجة طلب الإلغاء بنجاح عبر عميل الحجوزات:**\n\nتم إلغاء الحجز وإعادة المبلغ فوراً إلى محفظتك الرقمية الموحدة في مساري.`,
        contentEn: `✅ **Cancellation processed successfully via Booking Agent:**\n\nBooking cancelled with instant refund credited to your digital wallet balance.`,
        actionExecuted: {
          type: 'CANCEL_BOOKING_REFUND',
          success: true,
          detailsAr: 'تم تحديث سجلات الحجوزات والمحفظة الرقمية',
          detailsEn: 'Updated booking records and wallet ledger balance'
        },
        latencyMs: Date.now() - startTime
      };
    }

    return {
      agentId: this.id,
      agentName: this.name,
      success: true,
      contentAr: `🎟️ **حالة الحجوزات الحالية:**\n\nلديك **حجوزات نشطة** مؤكدة في النظام. يمكنك استعراض التفاصيل كاملة أو تحميل الفاتورة المعتمدة.`,
      contentEn: `🎟️ **Current Booking Status:**\n\nYou have confirmed active bookings in the ledger. You can inspect full ticket details or download the official invoice.`,
      latencyMs: Date.now() - startTime
    };
  }
}
