import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/wallet_entity.dart';
import '../../domain/repositories/wallet_repository.dart';
import 'wallet_repository_impl.dart';

class TransactionService {
  final TransactionRepository _txRepo;
  final CouponRepository _couponRepo;

  TransactionService(this._txRepo, this._couponRepo);

  Future<TransactionEntity> initPaymentGatewayRecharge(String walletId, double amount, String method) async {
    final ref = 'MSR-RECH-${DateTime.now().millisecondsSinceEpoch}';
    final transaction = TransactionEntity(
      transactionId: 'tx-rech-${DateTime.now().millisecondsSinceEpoch}',
      walletId: walletId,
      referenceNo: ref,
      type: TransactionType.deposit,
      status: TransactionStatus.pending,
      amount: amount,
      descriptionAr: 'شحن رصيد المحفظة عبر بوابة الدفع الإلكتروني ($method)',
      descriptionEn: 'Wallet Recharge Initiated via Electronic Gateway ($method)',
      timestamp: DateTime.now().toString(),
      metaData: {'method': method},
    );

    await _txRepo.createTransaction(transaction);
    return transaction;
  }

  Future<void> finalizePaymentGatewayRecharge(String transactionId, String gatewayTxId) async {
    await _txRepo.updateTransactionStatus(transactionId, TransactionStatus.completed);
    final tx = await _txRepo.getTransactionById(transactionId);

    final ledgerEntry = LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}',
      transactionId: transactionId,
      walletId: tx.walletId,
      timestamp: DateTime.now().toString(),
      debit: 0.0,
      credit: tx.amount,
      balanceAfter: tx.amount,
      description: 'شحن رصيد إلكتروني ناجح برقم بوابة: $gatewayTxId',
    );
    await _txRepo.createLedgerEntry(ledgerEntry);
  }

  Future<double> applyCouponCode(String code, double purchaseAmount) async {
    final coupon = await _couponRepo.getCouponByCode(code);
    if (coupon == null || !coupon.isActive) {
      throw Exception('كود الخصم غير فعال أو غير موجود');
    }

    final now = DateTime.now();
    final expiry = DateTime.parse(coupon.expiryDate);
    if (now.isAfter(expiry)) {
      throw Exception('كود الخصم منتهي الصلاحية');
    }

    if (purchaseAmount < coupon.minPurchaseAmount) {
      throw Exception('قيمة الحجز أقل من الحد الأدنى لتطبيق هذا الكوبون وهو \$${coupon.minPurchaseAmount}');
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      throw Exception('نفدت عدد مرات استخدام كود الخصم هذا');
    }

    double discount = 0.0;
    if (coupon.isPercentage) {
      discount = purchaseAmount * (coupon.discountValue / 100);
      if (discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    await _couponRepo.updateCouponUsage(code);
    return discount;
  }
}

class WalletService {
  final WalletRepository _walletRepo;
  final TransactionRepository _txRepo;

  WalletService(this._walletRepo, this._txRepo);

  Future<WalletEntity> depositToWallet(String userId, double amount, TransactionType type, String descAr, String descEn) async {
    final wallet = await _walletRepo.getWalletByUserId(userId);
    
    if (amount <= 0) {
      throw Exception('قيمة العملية المالية يجب أن تكون أكبر من الصفر');
    }

    final updatedWallet = wallet.copyWith(
      availableBalance: wallet.availableBalance + amount,
      lastUpdatedAt: DateTime.now().toString(),
    );

    await _walletRepo.updateWalletBalances(updatedWallet);

    final txId = 'tx-${DateTime.now().millisecondsSinceEpoch}';
    final ref = 'MSR-TX-${DateTime.now().millisecondsSinceEpoch}';
    
    final tx = TransactionEntity(
      transactionId: txId,
      walletId: wallet.walletId,
      referenceNo: ref,
      type: type,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: descAr,
      descriptionEn: descEn,
      timestamp: DateTime.now().toString(),
    );

    await _txRepo.createTransaction(tx);

    final ledgerEntry = LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}',
      transactionId: txId,
      walletId: wallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: 0.0,
      credit: amount,
      balanceAfter: updatedWallet.availableBalance,
      description: descAr,
    );
    await _txRepo.createLedgerEntry(ledgerEntry);

    return updatedWallet;
  }

  Future<WalletEntity> withdrawFromWallet(String userId, double amount, String descAr, String descEn) async {
    final wallet = await _walletRepo.getWalletByUserId(userId);
    
    if (amount <= 0) {
      throw Exception('قيمة السحب المالي يجب أن تكون أكبر من الصفر');
    }

    if (wallet.availableBalance < amount) {
      throw Exception('عذراً، الرصيد المتاح في المحفظة غير كافٍ لإجراء هذه العملية المالية');
    }

    final updatedWallet = wallet.copyWith(
      availableBalance: wallet.availableBalance - amount,
      lastUpdatedAt: DateTime.now().toString(),
    );

    await _walletRepo.updateWalletBalances(updatedWallet);

    final txId = 'tx-${DateTime.now().millisecondsSinceEpoch}';
    final ref = 'MSR-TX-${DateTime.now().millisecondsSinceEpoch}';

    final tx = TransactionEntity(
      transactionId: txId,
      walletId: wallet.walletId,
      referenceNo: ref,
      type: TransactionType.withdrawal,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: descAr,
      descriptionEn: descEn,
      timestamp: DateTime.now().toString(),
    );

    await _txRepo.createTransaction(tx);

    final ledgerEntry = LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}',
      transactionId: txId,
      walletId: wallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: amount,
      credit: 0.0,
      balanceAfter: updatedWallet.availableBalance,
      description: descAr,
    );
    await _txRepo.createLedgerEntry(ledgerEntry);

    return updatedWallet;
  }

  Future<WalletEntity> payForBooking(String userId, String bookingId, double amount, String bookingTitleAr, String bookingTitleEn) async {
    final wallet = await _walletRepo.getWalletByUserId(userId);

    if (wallet.availableBalance < amount) {
      throw Exception('عذراً، الرصيد المتوفر في محفظتك لا يغطي قيمة حجز ($bookingTitleAr)');
    }

    final updatedWallet = wallet.copyWith(
      availableBalance: wallet.availableBalance - amount,
      reservedBalance: wallet.reservedBalance + amount,
      lastUpdatedAt: DateTime.now().toString(),
    );

    await _walletRepo.updateWalletBalances(updatedWallet);

    final txId = 'tx-${DateTime.now().millisecondsSinceEpoch}';
    final ref = 'MSR-TX-${DateTime.now().millisecondsSinceEpoch}';

    final tx = TransactionEntity(
      transactionId: txId,
      walletId: wallet.walletId,
      referenceNo: ref,
      type: TransactionType.bookingPayment,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: 'حجز قيمة عقد رحلة حجز: $bookingTitleAr',
      descriptionEn: 'Escrow Reserve for Flight/Campaign: $bookingTitleEn',
      timestamp: DateTime.now().toString(),
      relatedBookingId: bookingId,
    );

    await _txRepo.createTransaction(tx);

    final ledgerEntry = LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}',
      transactionId: txId,
      walletId: wallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: amount,
      credit: 0.0,
      balanceAfter: updatedWallet.availableBalance,
      description: 'حجز رصيد عقد معلق للحجز: $bookingId',
    );
    await _txRepo.createLedgerEntry(ledgerEntry);

    return updatedWallet;
  }

  Future<WalletEntity> refundBooking(String userId, String bookingId, double amount, String bookingTitleAr, String bookingTitleEn) async {
    final wallet = await _walletRepo.getWalletByUserId(userId);

    final updatedWallet = wallet.copyWith(
      availableBalance: wallet.availableBalance + amount,
      reservedBalance: wallet.reservedBalance >= amount ? wallet.reservedBalance - amount : 0.0,
      lastUpdatedAt: DateTime.now().toString(),
    );

    await _walletRepo.updateWalletBalances(updatedWallet);

    final txId = 'tx-${DateTime.now().millisecondsSinceEpoch}';
    final ref = 'MSR-TX-${DateTime.now().millisecondsSinceEpoch}';

    final tx = TransactionEntity(
      transactionId: txId,
      walletId: wallet.walletId,
      referenceNo: ref,
      type: TransactionType.refund,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: 'استرجاع مبلغ عقد حجز لـ: $bookingTitleAr',
      descriptionEn: 'Refund Credit of Travel booking: $bookingTitleEn',
      timestamp: DateTime.now().toString(),
      relatedBookingId: bookingId,
    );

    await _txRepo.createTransaction(tx);

    final ledgerEntry = LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}',
      transactionId: txId,
      walletId: wallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: 0.0,
      credit: amount,
      balanceAfter: updatedWallet.availableBalance,
      description: 'إرجاع رصيد من حجز ملغى: $bookingId',
    );
    await _txRepo.createLedgerEntry(ledgerEntry);

    return updatedWallet;
  }

  Future<WalletEntity> transferFunds(String senderUserId, String receiverUserId, double amount) async {
    final senderWallet = await _walletRepo.getWalletByUserId(senderUserId);
    final receiverWallet = await _walletRepo.getWalletByUserId(receiverUserId);

    if (senderWallet.availableBalance < amount) {
      throw Exception('الرصيد المتاح لا يكفي لإتمام عملية التحويل المالي');
    }

    final updatedSender = senderWallet.copyWith(
      availableBalance: senderWallet.availableBalance - amount,
      lastUpdatedAt: DateTime.now().toString(),
    );

    final updatedReceiver = receiverWallet.copyWith(
      availableBalance: receiverWallet.availableBalance + amount,
      lastUpdatedAt: DateTime.now().toString(),
    );

    await _walletRepo.updateWalletBalances(updatedSender);
    await _walletRepo.updateWalletBalances(updatedReceiver);

    final txId = 'tx-${DateTime.now().millisecondsSinceEpoch}';
    final ref = 'MSR-TX-${DateTime.now().millisecondsSinceEpoch}';

    final senderTx = TransactionEntity(
      transactionId: '$txId-S',
      walletId: senderWallet.walletId,
      referenceNo: ref,
      type: TransactionType.walletTransfer,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: 'تحويل مالي مرسل إلى المحفظة برقم ${receiverWallet.walletId}',
      descriptionEn: 'Fund Transfer sent to Wallet ID: ${receiverWallet.walletId}',
      timestamp: DateTime.now().toString(),
    );

    final receiverTx = TransactionEntity(
      transactionId: '$txId-R',
      walletId: receiverWallet.walletId,
      referenceNo: ref,
      type: TransactionType.walletTransfer,
      status: TransactionStatus.completed,
      amount: amount,
      descriptionAr: 'تحويل مالي مستلم من المحفظة برقم ${senderWallet.walletId}',
      descriptionEn: 'Fund Transfer received from Wallet ID: ${senderWallet.walletId}',
      timestamp: DateTime.now().toString(),
    );

    await _txRepo.createTransaction(senderTx);
    await _txRepo.createTransaction(receiverTx);

    await _txRepo.createLedgerEntry(LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}-S',
      transactionId: '$txId-S',
      walletId: senderWallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: amount,
      credit: 0.0,
      balanceAfter: updatedSender.availableBalance,
      description: 'حوالة صادرة للمحفظة: ${receiverWallet.walletId}',
    ));

    await _txRepo.createLedgerEntry(LedgerEntry(
      entryId: 'led-${DateTime.now().millisecondsSinceEpoch}-R',
      transactionId: '$txId-R',
      walletId: receiverWallet.walletId,
      timestamp: DateTime.now().toString(),
      debit: 0.0,
      credit: amount,
      balanceAfter: updatedReceiver.availableBalance,
      description: 'حوالة واردة من المحفظة: ${senderWallet.walletId}',
    ));

    return updatedSender;
  }
}

// Financial Providers
final financialTransactionServiceProvider = Provider<TransactionService>((ref) {
  final txRepo = ref.watch(transactionRepositoryProvider);
  final couponRepo = ref.watch(couponRepositoryProvider);
  return TransactionService(txRepo, couponRepo);
});

final walletServiceProvider = Provider<WalletService>((ref) {
  final walletRepo = ref.watch(walletRepositoryProvider);
  final txRepo = ref.watch(transactionRepositoryProvider);
  return WalletService(walletRepo, txRepo);
});
