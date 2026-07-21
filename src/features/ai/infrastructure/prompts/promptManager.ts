/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptTemplate } from '../models/aiModels';

export class PromptManager {
  private static templates: Map<string, PromptTemplate> = new Map([
    ['system_core', {
      id: 'system_core',
      category: 'system',
      version: '2.1.0',
      templateAr: 'أنت المساعد المالي والسياحي المباشر لمنصة مساري (MASARI PLATFORM). وظيفتك هي تقديم إجابات دقيقة وتنفيذ العمليات البرمجية بشكل آمن وحساب التكاليف بالعملات المحلية والعالمية.',
      templateEn: 'You are the official MASARI PLATFORM Enterprise AI Travel & Financial Copilot. Your job is to deliver high-precision answers, execute tool calls securely, and handle multi-currency ledgers.',
      variables: ['userId', 'userName', 'lang']
    }],
    ['role_user', {
      id: 'role_user',
      category: 'role',
      version: '1.0.0',
      templateAr: 'صلاحية المستخدم: مسافر/عميل معتمد ({userName}). الميزات المتاحة: حجز الرحلات، إدارة المحفظة الخاصة، فحص التذاكر، واسترداد الأموال.',
      templateEn: 'User Role: Verified Traveler ({userName}). Capabilities: Book trips, manage personal wallet, inspect tickets, and request refunds.',
      variables: ['userName']
    }],
    ['role_admin', {
      id: 'role_admin',
      category: 'role',
      version: '1.0.0',
      templateAr: 'صلاحية المستخدم: مسؤول نظام الإدارة العليا ({userName}). الميزات المتاحة: تحليلات الإيرادات الشاملة، اتجاهات الإلغاء، إحصائيات المحافظ الموحدة، والتوصيات التشغيلية.',
      templateEn: 'User Role: Executive System Administrator ({userName}). Capabilities: Full revenue analytics, cancellation trends, wallet ledger statistics, and strategic recommendations.',
      variables: ['userName']
    }],
    ['travel_search', {
      id: 'travel_search',
      category: 'travel',
      version: '1.2.0',
      templateAr: 'معلمات البحث عن رحلات السفر: من ({origin}) إلى ({destination}) بتاريخ ({departureDate}). الميزانية القصوى ({maxBudget}).',
      templateEn: 'Travel Search Parameters: From ({origin}) to ({destination}) departing ({departureDate}). Max budget ({maxBudget}).',
      variables: ['origin', 'destination', 'departureDate', 'maxBudget']
    }],
    ['booking_action', {
      id: 'booking_action',
      category: 'booking',
      version: '2.0.0',
      templateAr: 'إجراء الحجز: النوع ({bookingType})، المرجع ({refCode})، السعر ({price})، حالة الدفع في المحفظة ({walletStatus}).',
      templateEn: 'Booking Execution: Type ({bookingType}), Reference ({refCode}), Price ({price}), Wallet payment status ({walletStatus}).',
      variables: ['bookingType', 'refCode', 'price', 'walletStatus']
    }],
    ['wallet_ledger', {
      id: 'wallet_ledger',
      category: 'wallet',
      version: '1.5.0',
      templateAr: 'سجل المحفظة الرقمية: الرصيد المتاح ({availableBalance})، المحجوز ({reservedBalance})، نقاط المكافآت ({rewardPoints}).',
      templateEn: 'Digital Wallet Ledger: Available balance ({availableBalance}), Reserved ({reservedBalance}), Reward points ({rewardPoints}).',
      variables: ['availableBalance', 'reservedBalance', 'rewardPoints']
    }],
    ['admin_analytics', {
      id: 'admin_analytics',
      category: 'admin',
      version: '2.1.0',
      templateAr: 'التحليل الإداري للمسؤولين: إجمالي الإيرادات ({totalRevenue})، حصة مكة ({makkahShare})، السبب الأول للإلغاء ({topCancelReason}).',
      templateEn: 'Executive Admin Analytics: Total Revenue ({totalRevenue}), Makkah Market Share ({makkahShare}), Primary Cancellation Reason ({topCancelReason}).',
      variables: ['totalRevenue', 'makkahShare', 'topCancelReason']
    }],
    ['hajj_guidance', {
      id: 'hajj_guidance',
      category: 'hajj',
      version: '1.1.0',
      templateAr: 'دليل مناسك الحج 2026: باقة الحج ({packageName})، حالة التصريح ({permitStatus})، المراحل ({ritualsList}).',
      templateEn: 'Hajj 2026 Ritual Guidance: Hajj Package ({packageName}), Permit Status ({permitStatus}), Ritual Stages ({ritualsList}).',
      variables: ['packageName', 'permitStatus', 'ritualsList']
    }],
    ['umrah_guidance', {
      id: 'umrah_guidance',
      category: 'umrah',
      version: '1.1.0',
      templateAr: 'دليل مناسك العمرة: السعي والأنشطة للفندق ({hotelName}) بالقرب من ساحات الحرم المكي.',
      templateEn: 'Umrah Ritual Guidance: Sa\'ee & activities for hotel ({hotelName}) near Haram plazas.',
      variables: ['hotelName']
    }],
    ['visa_status', {
      id: 'visa_status',
      category: 'visa',
      version: '1.0.0',
      templateAr: 'حالة التأشيرة الإلكترونية: نوع التأشيرة ({visaType})، جواز السفر ({passportNo})، الصلاحية ({validityMonths}) شهراً.',
      templateEn: 'E-Visa Verification Status: Visa Type ({visaType}), Passport ({passportNo}), Validity ({validityMonths}) months.',
      variables: ['visaType', 'passportNo', 'validityMonths']
    }],
    ['notification_alert', {
      id: 'notification_alert',
      category: 'notification',
      version: '1.0.0',
      templateAr: 'تنبيه مساري الذكي: نوع التنبيه ({alertType})، الرسالة ({alertMessage}).',
      templateEn: 'Masari Smart Alert: Type ({alertType}), Message ({alertMessage}).',
      variables: ['alertType', 'alertMessage']
    }],
    ['recommendation_engine', {
      id: 'recommendation_engine',
      category: 'recommendation',
      version: '1.0.0',
      templateAr: 'محرك التوصيات المخصصة: مطابقة بنسبة ({matchScore}%) للوجهة ({destinationName}).',
      templateEn: 'Smart Recommendation Engine: ({matchScore}%) score match for destination ({destinationName}).',
      variables: ['matchScore', 'destinationName']
    }]
  ]);

  static getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  static renderPrompt(id: string, variables: Record<string, any>, lang: 'ar' | 'en' = 'ar'): string {
    const template = this.templates.get(id);
    if (!template) return '';

    let text = lang === 'ar' ? template.templateAr : template.templateEn;

    Object.entries(variables).forEach(([key, val]) => {
      const placeholder = `{${key}}`;
      text = text.replace(new RegExp(placeholder, 'g'), String(val ?? ''));
    });

    return text;
  }

  static registerTemplate(template: PromptTemplate) {
    this.templates.set(template.id, template);
  }
}
