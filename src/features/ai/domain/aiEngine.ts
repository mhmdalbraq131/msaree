/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, Flight, TourismPackage, UmrahPackage, HajjPackage } from '../../../types';
import { EnterpriseAiOrchestrator } from '../application/aiOrchestrator';
import { 
  mockRecommendations, 
  mockExpenseCategories, 
  pilgrimChecklist, 
  requiredDocuments, 
  ritualSteps, 
  mockAdminAnalytics, 
  mockNotifications,
  mockCoupons
} from '../data/mockAiData';
import { mockFlights, mockTourismPackages, mockUmrahPackages, mockHajjPackages } from '../../../data/packages';

// High performance natural language result structure
export interface AiResult {
  messageAr: string;
  messageEn: string;
  intent: string;
  data?: any;
  actionExecuted?: {
    type: string;
    success: boolean;
    detailsAr: string;
    detailsEn: string;
  };
  suggestions?: string[];
}

export class MasariAiEngine {
  /**
   * Process Natural Language Queries & Execute Platform Actions via Enterprise Orchestrator Pipeline
   */
  static processQuery(
    query: string, 
    context: {
      lang: 'ar' | 'en';
      bookings: Booking[];
      setBookings: (b: Booking[]) => void;
      wallet: any;
      setWallet: (w: any) => void;
      walletTransactions: any[];
      setWalletTransactions: (t: any[]) => void;
      currency: string;
      formatCurrency: (val: number) => string;
    }
  ): AiResult {
    // Trigger Enterprise AI Orchestrator asynchronously for audit, context collection and multi-provider tracking
    EnterpriseAiOrchestrator.processUserQuery({
      sessionId: 'session-enterprise-user',
      userId: 'usr-masari-789',
      userRole: query.toLowerCase().includes('admin') || query.toLowerCase().includes('إدارة') ? 'admin' : 'user',
      query,
      lang: context.lang,
      bookings: context.bookings,
      setBookings: context.setBookings,
      wallet: context.wallet,
      setWallet: context.setWallet,
      currency: context.currency,
      formatCurrency: context.formatCurrency
    }).catch(err => console.warn('[Enterprise AI Pipeline] Background orchestrator logging:', err));

    const q = query.toLowerCase().trim();
    const isAr = context.lang === 'ar';

    // ----------------------------------------------------
    // ACTION: Apply Coupons (WELCOME50, MASARI10, HAJJ2026)
    // ----------------------------------------------------
    if (q.includes('coupon') || q.includes('كوبون') || q.includes('خصم') || q.includes('رمز')) {
      const match = mockCoupons.find(c => q.includes(c.code.toLowerCase()));
      if (match) {
        // Apply coupon WELCOME50 by adding travel credits or depositing
        if (match.code === 'WELCOME50') {
          const updatedWallet = {
            ...context.wallet,
            availableBalance: context.wallet.availableBalance + 50,
            travelCredit: context.wallet.travelCredit + 50
          };
          context.setWallet(updatedWallet);
          
          const newTx = {
            id: `tx-ai-${Date.now()}`,
            referenceNo: `MSR-TX-AI-${Math.floor(1000 + Math.random() * 9000)}`,
            type: 'deposit',
            status: 'completed',
            amount: 50.0,
            descriptionAr: `تطبيق كوبون الذكاء الاصطناعي ${match.code} - رصيد سفر إضافي`,
            descriptionEn: `Applied AI Coupon ${match.code} - Bonus Travel Credit`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          context.setWalletTransactions([newTx, ...context.walletTransactions]);

          return {
            intent: 'apply_coupon',
            messageAr: `🎉 تم بنجاح تفعيل كوبون الخصم الخاص بك (${match.code})! لقد قمنا بإضافة ${context.formatCurrency(50)} كهدية رصيد سفر فوري إلى محفظتك الاستثمارية الرقمية.`,
            messageEn: `🎉 Coupon code (${match.code}) has been successfully redeemed! We've credited ${context.formatCurrency(50)} as bonus travel credits directly into your Masari wallet.`,
            actionExecuted: {
              type: 'APPLY_COUPON',
              success: true,
              detailsAr: `تم تفعيل كوبون بقيمة ${context.formatCurrency(50)} وتعديل الحساب بنجاح.`,
              detailsEn: `Redeemed coupon ${match.code} for ${context.formatCurrency(50)} credit.`
            },
            suggestions: [isAr ? 'عرض رصيد المحفظة المحدث' : 'Check Updated Wallet Balance', isAr ? 'عرض المعاملات المالية الأخيرة' : 'View recent transactions']
          };
        } else {
          return {
            intent: 'apply_coupon',
            messageAr: `تم تفعيل الكوبون المذكور (${match.code}). سيتم تطبيق خصم ${match.discount}${match.type === 'percent' ? '%' : ' USD'} تلقائياً على حجزك التالي.`,
            messageEn: `Coupon (${match.code}) is successfully locked. A discount of ${match.discount}${match.type === 'percent' ? '%' : ' USD'} will be applied on your next booking purchase.`,
            actionExecuted: {
              type: 'APPLY_COUPON',
              success: true,
              detailsAr: `تم حجز الكوبون للتطبيق التلقائي.`,
              detailsEn: `Locked coupon for next checkout apply.`
            }
          };
        }
      }
    }

    // ----------------------------------------------------
    // ACTION: Cancel Booking (e.g. "cancel booking MSR-2026-F1" or "إلغاء حجز")
    // ----------------------------------------------------
    if (q.includes('cancel') || q.includes('إلغاء') || q.includes('الغاء')) {
      // Look for code in query
      const matchRef = q.match(/msr-[a-z0-9-]+/);
      const foundRef = matchRef ? matchRef[0].toUpperCase() : null;

      if (foundRef) {
        const targetBooking = context.bookings.find(b => b.bookingRef === foundRef);
        if (targetBooking) {
          // Process cancel
          const filtered = context.bookings.filter(b => b.bookingRef !== foundRef);
          context.setBookings(filtered);

          // Refund to wallet
          const refundValue = targetBooking.price;
          const updatedWallet = {
            ...context.wallet,
            availableBalance: context.wallet.availableBalance + refundValue
          };
          context.setWallet(updatedWallet);

          // Add transaction
          const newTx = {
            id: `tx-refund-${Date.now()}`,
            referenceNo: `MSR-TX-REFUND-${Math.floor(1000 + Math.random() * 9000)}`,
            type: 'deposit',
            status: 'completed',
            amount: refundValue,
            descriptionAr: `استرداد مالي تلقائي لإلغاء الحجز رقم ${foundRef}`,
            descriptionEn: `Automatic cash refund for canceled booking ${foundRef}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          context.setWalletTransactions([newTx, ...context.walletTransactions]);

          return {
            intent: 'cancel_booking',
            messageAr: `✅ تم بنجاح إلغاء الحجز رقم (${foundRef}) الخاص بـ (${isAr ? targetBooking.titleAr : targetBooking.titleEn}). لقد تم إرجاع كامل المبلغ المدفوع وقدره ${context.formatCurrency(refundValue)} كدفعة مستردة إلى محفظتك الإلكترونية فوراً.`,
            messageEn: `✅ Booking ${foundRef} for (${targetBooking.titleEn}) has been successfully canceled. A full refund of ${context.formatCurrency(refundValue)} has been credited back to your Masari electronic wallet.`,
            actionExecuted: {
              type: 'CANCEL_BOOKING',
              success: true,
              detailsAr: `تم إلغاء الحجز وإعادة ${context.formatCurrency(refundValue)} للمحفظة.`,
              detailsEn: `Canceled booking ${foundRef} & refunded ${context.formatCurrency(refundValue)}.`
            },
            suggestions: [isAr ? 'قائمة الحجوزات النشطة الحالية' : 'View active bookings', isAr ? 'تفاصيل الرصيد في المحفظة' : 'Check wallet details']
          };
        } else {
          return {
            intent: 'cancel_booking_not_found',
            messageAr: `⚠️ عذراً، لم نتمكن من العثور على أي حجز نشط متطابق مع الرمز (${foundRef}). يرجى التحقق من الرقم والمحاولة مرة أخرى.`,
            messageEn: `⚠️ Sorry, we couldn't find any active booking matching reference (${foundRef}). Please double check your booking code and try again.`,
          };
        }
      } else {
        return {
          intent: 'cancel_booking_prompt',
          messageAr: `لإلغاء حجز معين تلقائياً، يرجى كتابة رمز الحجز كاملاً (مثال: MSR-2026-FLU9243) وسأقوم بمعالجته واسترداد أموالك فوراً.`,
          messageEn: `To automatically cancel a booking, please specify your exact booking reference code (e.g., MSR-2026-FLI1043) and I will process the refund.`,
          suggestions: context.bookings.map(b => `${isAr ? 'إلغاء الحجز' : 'Cancel booking'} ${b.bookingRef}`)
        };
      }
    }

    // ----------------------------------------------------
    // ACTION: Create Booking (e.g. "book cheaper flight to Cairo")
    // ----------------------------------------------------
    if (q.includes('book') || q.includes('حجز') || q.includes('احجز')) {
      if (q.includes('bus') || q.includes('باص')) {
        // Create a bus booking
        const busRef = `MSR-2026-BUS${Math.floor(1000 + Math.random() * 9000)}`;
        const busPrice = 15;
        if (context.wallet.availableBalance < busPrice) {
          return {
            intent: 'insufficient_funds',
            messageAr: `❌ رصيدك المتاح في المحفظة (${context.formatCurrency(context.wallet.availableBalance)}) غير كافٍ لحجز تذكرة باص الرويشان (${context.formatCurrency(busPrice)}). يرجى شحن الرصيد أولاً.`,
            messageEn: `❌ Your available wallet balance (${context.formatCurrency(context.wallet.availableBalance)}) is insufficient for Al-Rowaishan Bus ticket (${context.formatCurrency(busPrice)}). Please recharge first.`,
          };
        }
        
        const newBooking: Booking = {
          id: `b-bus-${Date.now()}`,
          bookingRef: busRef,
          type: 'bus',
          titleAr: 'تذكرة باص الرويشان: صنعاء ➔ عدن',
          titleEn: 'Al-Rowaishan Bus: Sanaa to Aden',
          price: busPrice,
          bookingDate: new Date().toISOString().substring(0, 10),
          departureDate: '2026-08-01',
          status: 'confirmed',
          details: {
            passengersCount: 1,
            phone: '+967 777 777 777',
            email: 'mhmdalbraq131@gmail.com',
            additionalInfo: 'VIP Elite Class - booked via MASARI AI Agent Platform'
          }
        };

        context.setBookings([newBooking, ...context.bookings]);
        context.setWallet({ ...context.wallet, availableBalance: context.wallet.availableBalance - busPrice });

        return {
          intent: 'create_booking',
          messageAr: `🎉 تهانينا! لقد تم حجز تذكرة الباص بنجاح عبر المحفظة الموحدة. الرمز الخاص بك هو (${busRef}). تم خصم ${context.formatCurrency(busPrice)} وتحديث قائمة الحجوزات.`,
          messageEn: `🎉 Congratulations! Your bus ticket has been successfully booked using your unified wallet. Reference is (${busRef}). Deducted ${context.formatCurrency(busPrice)} and added to your bookings list.`,
          actionExecuted: {
            type: 'CREATE_BOOKING',
            success: true,
            detailsAr: `تم حجز تذكرة باص الرويشان رقم ${busRef}`,
            detailsEn: `Booked Al-Rowaishan bus ticket ${busRef}`
          }
        };
      }
    }

    // ----------------------------------------------------
    // INTENT: Natural Language Search: "cheapest bus from Sana'a to Aden"
    // ----------------------------------------------------
    if (q.includes('bus') || q.includes('باص') || q.includes('نقل جماعي')) {
      if (q.includes('sana') || q.includes('صنعاء') || q.includes('aden') || q.includes('عدن') || q.includes('أرخص') || q.includes('cheapest')) {
        return {
          intent: 'search_bus',
          messageAr: `🚌 عثرت لك على **أرخص رحلة باص بري مباشرة**:\n\n**شركة الرويشان للنقل الحديث (VIP)**\n- **المسار**: صنعاء ➔ عدن (رحلات يومية مباشرة)\n- **السعر**: ${context.formatCurrency(15)} فقط\n- **المميزات**: تكييف مركزي كامل، شاشات ذكية لكل مقعد، إنترنت لاسلكي مجاني، وجبات خفيفة ومشروبات ضيافة.\n\nهل ترغب في تأكيد الحجز الفوري والدفع الآمن عبر محفظة مساري الرقمية الآن؟`,
          messageEn: `🚌 I found the **cheapest direct inter-city bus trip** for you:\n\n**Al-Rowaishan Modern Transport (VIP Elite)**\n- **Route**: Sana'a to Aden (Daily Direct departures)\n- **Price**: only ${context.formatCurrency(15)}\n- **Amenities**: Full Climate Control, Smart Seat Screen, Free travel WiFi, complimentary beverages & light lunch.\n\nWould you like me to book this for you right away using your wallet balance?`,
          data: {
            busId: 'b1',
            price: 15,
            company: 'Al-Rowaishan'
          },
          suggestions: [isAr ? 'نعم، احجز تذكرة الباص الآن' : 'Yes, book this bus ticket now', isAr ? 'البحث عن نقل خاص بديل' : 'Search for private transfer alternatives']
        };
      }
    }

    // ----------------------------------------------------
    // INTENT: Natural Language Search: "Find me a hotel near the Haram"
    // ----------------------------------------------------
    if (q.includes('hotel') || q.includes('فندق') || q.includes('إقامة') || q.includes('مكة') || q.includes('makkah') || q.includes('haram') || q.includes('حرم')) {
      return {
        intent: 'search_hotels',
        messageAr: `🕋 لقد بحثت في الفنادق الشريكة وعثرت على الإقامة الأقرب للحرم المكي الشريف:\n\n**فندق بولمان زمزم مكة (5 نجوم)**\n- **الموقع**: يقع في أبراج البيت المطلة مباشرة على ساحات الحرم.\n- **سعر الليلة**: ${context.formatCurrency(120)} شاملاً الإفطار الملوكي.\n- **مستوى الرضا**: 4.8/5 نجوم تقييم العملاء.\n\nيمكنك استخدام رصيد محفظتك لتأكيد الغرفة بنقرة واحدة سريعة.`,
        messageEn: `🕋 I searched through our premium partners and found the best stay closest to the Holy Haram:\n\n**Pullman Zamzam Makkah Hotel (5-Star)**\n- **Location**: Situated inside Abraj Al-Bait complex, overlooking the main Holy Mosque plazas.\n- **Night Rate**: ${context.formatCurrency(120)} including dynamic gourmet breakfast buffet.\n- **Rating**: 4.8/5 verified traveler feedback.\n\nWould you like to reserve a premium room overlooking Haram right now?`,
        suggestions: [isAr ? 'البحث عن عروض فنادق مكة الاقتصادية' : 'Search economic hotels in Makkah', isAr ? 'عرض باقات العمرة المتكاملة' : 'View full Umrah packages']
      };
    }

    // ----------------------------------------------------
    // INTENT: Natural Language Search: "I need an Umrah package for five days"
    // ----------------------------------------------------
    if (q.includes('umrah') || q.includes('عمرة') || q.includes('باقة عمرة')) {
      return {
        intent: 'search_umrah',
        messageAr: `🕌 إليك أفضل باقة عمرة مخصصة لمدة قصيرة متطابقة مع رغبتك:\n\n**باقة طواف الياسمين للعمرة (5 أيام)**\n- **السعر الإجمالي**: ${context.formatCurrency(280)} شامل كل المعاملات\n- **الإقامة**: غرف دبل بفندق فندق أنوار المدينة موفنبيك القريب جداً من الحرم.\n- **تذكرة السفر**: طيران الخطوط اليمنية (صنعاء - جدة - صنعاء)\n- **الخدمات الإضافية**: إصدار التأشيرة الإلكترونية مجاناً + نقل VIP داخلي.\n\nهل تود تأكيد باقة العمرة هذه وحجز مقعدك؟`,
        messageEn: `🕌 Here is our top-rated express Umrah package tailored closely to your 5-day request:\n\n**Tawaf Al-Yasmeen Express Umrah (5 Days)**\n- **Total Cost**: ${context.formatCurrency(280)} all-inclusive\n- **Lodging**: Anwar Al Madinah Mövenpick premium double rooms.\n- **Flights**: Yemenia Airways (Sanaa - Jeddah - Sanaa included)\n- **Extras**: Free E-Visa processing & private land transport VIP links.\n\nWould you like me to initiate the Booking process for this package?`,
        suggestions: [isAr ? 'حجز باقة عمرة 5 أيام الآن' : 'Book this 5-day Umrah package now', isAr ? 'مقارنة مع عروض الحج الفاخرة' : 'Compare with luxury Hajj packages']
      };
    }

    // ----------------------------------------------------
    // INTENT: Natural Language Search: "I want a VIP airport transfer"
    // ----------------------------------------------------
    if (q.includes('transfer') || q.includes('VIP airport') || q.includes('توصيل') || q.includes('نقل خاص') || q.includes('تاكسي')) {
      return {
        intent: 'search_transfers',
        messageAr: `🚗 لقد قمت بفرز أسطول النقل الخاص المتاح وعثرت على الخيار الملوكي للتوصيل:\n\n**توصيل خاص فاخر: مطار جدة الدولي إلى مكة الكرمة**\n- **السيارة**: جمس صالون يوكن Yukon XL فاخر مجهز بأرقى درجات التبريد والراحة.\n- **السعر**: ${context.formatCurrency(60)} إجمالي لجميع الركاب (1-6 أفراد)\n- **المميزات**: سائق يمني محترف، استقبال عند بوابات الوصول بالاسم، مياه باردة وضيافة مجانية.\n\nاضغط على الزر أدناه لتأكيد حجز التوصيل الفوري وسرعة الخدمة.`,
        messageEn: `🚗 I have filtered our premium transport fleet and matched your request with our top VIP transport link:\n\n**VIP Airport Private Transfer: Jeddah Airport (JED) to Makkah**\n- **Vehicle**: Modern GMC Yukon XL Executive SUV with climate control & premium luxury seats.\n- **Price**: ${context.formatCurrency(60)} flat rate for up to 6 passengers with luggage.\n- **Features**: Bilingual professional driver, meet & greet terminal service with name boards, fresh cold water.\n\nWould you like me to book this VIP Yukon transfer now?`,
        suggestions: [isAr ? 'تأكيد حجز التوصيل الفوري' : 'Book Yukon Transfer now', isAr ? 'عرض خيارات استئجار السيارات اليومية' : 'Show daily car rental fleets']
      };
    }

    // ----------------------------------------------------
    // INTENT: Natural Language Search: "I only have 500 USD" (Budget constraint search)
    // ----------------------------------------------------
    if (q.includes('500') || q.includes('ميزانية') || q.includes('budget') || q.includes('رصيدي') || q.includes('dollars')) {
      return {
        intent: 'budget_planning',
        messageAr: `🎯 **بناءً على ميزانيتك المحددة بـ 500 دولار أمريكي، قمت بوضع خطة سفر متكاملة وموفرة للغاية**:\n\n1. **الرحلة البرية**: باص شركة الرويشان الممتاز من صنعاء إلى عدن ➔ **(${context.formatCurrency(15)})**\n2. **تأشيرة الدخول**: إصدار تأشيرة عمرة إلكترونية فورية وسريعة مضمونة ➔ **(${context.formatCurrency(130)})**\n3. **الإقامة والسياحة**: باقة طواف الياسمين الاقتصادية أو حجز فندق اقتصادي ➔ **(${context.formatCurrency(280)})**\n- **التكلفة الإجمالية**: ${context.formatCurrency(425)} فقط!\n- **المتبقي في محفظتك**: ${context.formatCurrency(75)} للتسوق الشخصي والنفقات.\n\nخطة ذكية ومثالية تناسب ميزانيتك بالكامل. هل ترغب في تفعيل وحجز هذه الخطة دفعة واحدة؟`,
        messageEn: `🎯 **Based on your budget constraint of 500 USD, I have generated an optimal, cost-efficient travel package**:\n\n1. **Transit**: Al-Rowaishan VIP Bus (Sanaa to Aden daily) ➔ **(${context.formatCurrency(15)})**\n2. **E-Visa**: Express Electronic Umrah & Entry Visa with medical insurance ➔ **(${context.formatCurrency(130)})**\n3. **Lodging**: Anwar Al Madinah economic stay & transfer package ➔ **(${context.formatCurrency(280)})**\n- **Total Package Cost**: Only **${context.formatCurrency(425)}**!\n- **Savings Remaining**: **${context.formatCurrency(75)}** in your wallet for souvenirs and personal costs.\n\nThis is a highly optimized itinerary. Would you like to secure this 500 USD budget plan?`,
        suggestions: [isAr ? 'تأكيد وحجز الخطة الموفرة' : 'Book this optimized budget plan', isAr ? 'تعديل ميزانية البحث إلى 1000' : 'Change search budget to 1000 USD']
      };
    }

    // ----------------------------------------------------
    // FINANCIAL ASSISTANT: Balance, reward points, expense, suggestion
    // ----------------------------------------------------
    if (q.includes('balance') || q.includes('wallet') || q.includes('financial') || q.includes('رصيد') || q.includes('محفظة') || q.includes('حساب') || q.includes('مصاريف') || q.includes('اموال') || q.includes('أموال')) {
      return {
        intent: 'wallet_assistant',
        messageAr: `💳 **تقرير المحفظة المالية الموحد والتحليل الذكي للنفقات لمساري**:\n\n- **الرصيد المتاح حالياً**: ${context.formatCurrency(context.wallet.availableBalance)}\n- **الرصيد الملتزم به (محجوز)**: ${context.formatCurrency(context.wallet.reservedBalance)}\n- **نقاط المكافآت المجمعة**: ${context.wallet.rewardBalance} نقطة (ما يعادل ${context.formatCurrency(context.wallet.rewardBalance * 0.1)} رصيد سفر)\n- **أرصدة الهدايا الفعالة**: ${context.formatCurrency(context.wallet.giftBalance)}\n\n💡 **نصيحة الميزانية الذكية**: استناداً لرحلاتك السابقة، ننصحك باستخدام نقاط مكافآتك الحالية للحصول على خصم فوري بقيمة 10% على تذكرة طيران اليمنية القادمة لتوفر ما يقارب 45 دولاراً!`,
        messageEn: `💳 **Unified Masari Financial Core Ledger & Smart Expense Breakdown**:\n\n- **Available Wallet Balance**: ${context.formatCurrency(context.wallet.availableBalance)}\n- **Reserved Booking Balance**: ${context.formatCurrency(context.wallet.reservedBalance)}\n- **Accumulated Reward Points**: ${context.wallet.rewardBalance} Points (equivalent to ${context.formatCurrency(context.wallet.rewardBalance * 0.1)} travel credit)\n- **Active Gift Balance**: ${context.formatCurrency(context.wallet.giftBalance)}\n\n💡 **Smart Budget Tip**: Based on your spending trends, we recommend redeeming your active reward points on your next Yemenia flight booking to instantly save 10% (equivalent to saving $45!).`,
        data: {
          wallet: context.wallet,
          expenseBreakdown: mockExpenseCategories
        },
        suggestions: [isAr ? 'تطبيق نقاط المكافآت للحصول على خصم' : 'Apply loyalty points for discount', isAr ? 'سجل المعاملات المالية بالكامل' : 'View full transactions ledger']
      };
    }

    // ----------------------------------------------------
    // PILGRIM ASSISTANT: Ritual guidance, preparation, checklist, faq
    // ----------------------------------------------------
    if (q.includes('hajj') || q.includes('حج') || q.includes('شروط') || q.includes('مناسك') || q.includes('checklist') || q.includes('preparation') || q.includes('documents') || q.includes('وثائق')) {
      return {
        intent: 'pilgrim_assistant',
        messageAr: `🕋 **دليل التخطيط والمناسك المعتمد للحجاج والمعتمرين اليمنيين**:\n\n- **المستندات المطلوبة**: جواز السفر اليمني ساري الصلاحية، تأشيرة العمرة الإلكترونية، الهوية الوطنية الموحدة، وشهادة فحص المناعة الدولية.\n- **الخطوة التالية الملحّة**: يرجى تأكيد تصريح العمرة عبر منصة (نسك) الرسمية أو تفويض مساري لاستخراجه تلقائياً بضمان كامل.\n\n- **مراحل مناسك العمرة الأساسية**: 1. الإحرام عند الميقات ➔ 2. الطواف بالبيت العتيق سبعة أشواط ➔ 3. السعي بين الصفا والمروة ➔ 4. الحلق أو التقصير والتحلل.\n\nلقد أعددنا لك قائمة تحقق مخصصة وجاهزة للطباعة والتحميل داخل التطبيق لمتابعة ترتيباتك.`,
        messageEn: `🕋 **Unified Pilgrim Ritual Guidance & Preparation Companion (Yemeni Endowments compliant)**:\n\n- **Critical Requirements**: Valid Yemeni passport, active E-Visa, unified national ID, and the verified international immunization certificate.\n- **Your Immediate Next Action**: Secure your official pilgrimage permit via the (Nusuk) platform or authorize Masari team to auto-generate it securely.\n\n- **Core Ritual Stages**: 1. Entering Ihram at Miqat ➔ 2. Seven Tawaf circumambulations ➔ 3. Sa'ee hills traversal ➔ 4. Shaving/trimming to exit Ihram.\n\nWe have loaded your custom checklist and dynamic preparation status directly inside your Pilgrim Assistant screen!`,
        data: {
          checklist: pilgrimChecklist,
          docs: requiredDocuments,
          rituals: ritualSteps
        },
        suggestions: [isAr ? 'عرض قائمة التحقق التفاعلية' : 'Show interactive prep checklist', isAr ? 'عرض الوثائق الرسمية المطلوبة' : 'Check required documents status']
      };
    }

    // ----------------------------------------------------
    // ADMIN ASSISTANT: Analytics, Revenue, Destinations
    // ----------------------------------------------------
    if (q.includes('admin') || q.includes('revenue') || q.includes('analytics') || q.includes('إدارة') || q.includes('ارباح') || q.includes('أرباح') || q.includes('احصائيات') || q.includes('إحصائيات')) {
      return {
        intent: 'admin_assistant',
        messageAr: `📊 **لوحة التحكم والتحليل الاستراتيجي الذكي للمسؤولين - مساري**:\n\n- **إجمالي الإيرادات المسجلة**: ${context.formatCurrency(mockAdminAnalytics.totalRevenue)} (بارتفاع بلغ +${mockAdminAnalytics.revenueChangePercent}% عن الشهر السابق).\n- **أهم وجهة حجز**: مكة المكرمة بنسبة استحواذ بلغت 48% من إجمالي العمليات.\n- **محفزات الإلغاء الأبرز**: تأخر إصدار تأشيرة السفر للعملاء (بمعدل 45% من إجمالي الطلبات الملغاة).\n\n💡 **توصية تشغيلية**: نقترح تفعيل خيار "الربط الآلي المباشر لإصدار التأشيرة" مع وكلاء الخارجية لخفض معدلات الإلغاء بمعدل 30% خلال مواسم الذروة القادمة.`,
        messageEn: `📊 **Enterprise Executive Administrative Analytics & Strategy Portal**:\n\n- **Total Revenue**: ${context.formatCurrency(mockAdminAnalytics.totalRevenue)} (+${mockAdminAnalytics.revenueChangePercent}% month-over-month increase).\n- **Primary Booking Hub**: Makkah holds 48% of our platform demand share.\n- **Primary Cancellation Cause**: Visa issuance delays (accounting for 45% of total voids).\n\n💡 **Operational Recommendation**: We suggest enabling the "Immediate E-Visa API Link" with official KSA diplomatic portals to drop peak-season cancellation spikes by up to 30%.`,
        data: {
          analytics: mockAdminAnalytics
        },
        suggestions: [isAr ? 'تصدير تقرير الإيرادات السنوي' : 'Export yearly revenue report', isAr ? 'عرض تفاصيل إلغاء الحجوزات' : 'Inspect cancellation trends details']
      };
    }

    // ----------------------------------------------------
    // DEFAULT SMART RESPONSE (Conversational Q&A / Search recommendation)
    // ----------------------------------------------------
    return {
      intent: 'general_conversational',
      messageAr: `👋 مرحباً بك في **منصة مساري للذكاء الاصطناعي الموحدة والحديثة**!\n\nأنا مساعد السفر الذكي الخاص بك. يمكنني مساعدتك في:\n- **البحث المباشر**: الفنادق، الباصات، الطيران، وباقات الحج والعمرة.\n- **إجراء العمليات**: مثل تأكيد الحجوزات، تطبيق الكوبونات، وإلغاء الحجوزات تلقائياً مع الاسترداد المالي للمحفظة.\n- **التخطيط المالي**: فحص رصيد المحفظة، تحليل النفقات، وتقديم ميزانية مخصصة.\n- **إرشاد الحجاج**: مناسك العمرة، وقائمة التحقق التفاعلية.\n\nما الذي يمكنني القيام به من أجلك اليوم؟ يمكنك كتابة أي سؤال أو اختيار أحد الاقتراحات السريعة بالأسفل.`,
      messageEn: `👋 Welcome to the **MASARI Enterprise AI Intelligence & Travel Agent Platform**!\n\nI am your intelligent travel co-pilot. I am fully integrated into our platform and can help you:\n- **Natural Search**: Instantly find flights, bus transit, hotels, visa options, and Hajj/Umrah packages.\n- **Platform Actions**: Seamlessly create or cancel bookings, apply coupons, and issue automatic refunds.\n- **Financial Insights**: Show wallet statements, reward points, and structured expense suggestions.\n- **Pilgrim Support**: Guide you through pilgrimage rituals, documents, and interactive checklists.\n\nHow can I serve you today? Feel free to ask a question or tap on any quick prompts below.`,
      suggestions: [
        isAr ? 'أرخص باص من صنعاء إلى عدن' : 'Cheapest bus from Sana\'a to Aden',
        isAr ? 'فندق قريب من الحرم المكي' : 'Hotel near the Haram',
        isAr ? 'باقة عمرة لمدة خمسة أيام' : 'Umrah package for five days',
        isAr ? 'توصيل مطار VIP' : 'VIP airport transfer',
        isAr ? 'ميزانيتي المتاحة 500 دولار فقط' : 'I only have 500 USD',
        isAr ? 'فحص رصيد المحفظة والتحليل المالي' : 'Check wallet balance & analysis',
        isAr ? 'دليل مناسك العمرة والتحضيرات' : 'Umrah ritual guide & prep'
      ]
    };
  }
}
