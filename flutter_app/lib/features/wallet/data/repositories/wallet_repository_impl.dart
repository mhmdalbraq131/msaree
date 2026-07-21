import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/wallet_entity.dart';
import '../../domain/repositories/wallet_repository.dart';

class MockWalletRepository implements WalletRepository {
  final Map<String, WalletEntity> _walletsTable = {};

  MockWalletRepository() {
    _walletsTable['usr-101'] = WalletEntity(
      walletId: 'wlt-803',
      userId: 'usr-101',
      availableBalance: 1250.00,
      pendingBalance: 150.00,
      reservedBalance: 450.00,
      rewardBalance: 75.00,
      giftBalance: 50.00,
      travelCredit: 200.00,
      currency: 'USD',
      lastUpdatedAt: '2026-07-20 15:00:00',
    );
  }

  @override
  Future<WalletEntity> getWalletByUserId(String userId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    if (_walletsTable.containsKey(userId)) {
      return _walletsTable[userId]!;
    }
    final newWallet = WalletEntity(
      walletId: 'wlt-${DateTime.now().millisecondsSinceEpoch}',
      userId: userId,
      availableBalance: 0.0,
      pendingBalance: 0.0,
      reservedBalance: 0.0,
      rewardBalance: 0.0,
      giftBalance: 0.0,
      travelCredit: 0.0,
      currency: 'USD',
      lastUpdatedAt: DateTime.now().toString(),
    );
    _walletsTable[userId] = newWallet;
    return newWallet;
  }

  @override
  Future<void> updateWalletBalances(WalletEntity wallet) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _walletsTable[wallet.userId] = wallet;
  }

  @override
  Future<void> createWallet(String userId) async {
    await getWalletByUserId(userId);
  }
}

class MockTransactionRepository implements TransactionRepository {
  final List<TransactionEntity> _transactions = [];
  final List<LedgerEntry> _ledger = [];

  MockTransactionRepository() {
    _transactions.add(const TransactionEntity(
      transactionId: 'tx-101',
      walletId: 'wlt-803',
      referenceNo: 'MSR-TX-2026-F983A',
      type: TransactionType.deposit,
      status: TransactionStatus.completed,
      amount: 1500.0,
      descriptionAr: 'شحن رصيد المحفظة عبر بطاقة الائتمان',
      descriptionEn: 'Credit Card Wallet Deposit Successful',
      timestamp: '2026-07-15 10:24:12',
    ));

    _transactions.add(const TransactionEntity(
      transactionId: 'tx-102',
      walletId: 'wlt-803',
      referenceNo: 'MSR-TX-2026-B8391',
      type: TransactionType.bookingPayment,
      status: TransactionStatus.completed,
      amount: 450.0,
      descriptionAr: 'دفع حجز طيران • صنعاء - القاهرة',
      descriptionEn: 'Flight Booking Payment • Sanaa - Cairo',
      timestamp: '2026-07-15 11:30:00',
      relatedBookingId: 'b-100',
    ));

    _transactions.add(const TransactionEntity(
      transactionId: 'tx-103',
      walletId: 'wlt-803',
      referenceNo: 'MSR-TX-2026-R8310',
      type: TransactionType.bonus,
      status: TransactionStatus.completed,
      amount: 75.0,
      descriptionAr: 'مكافأة ترحيبية من منصة مساري لعام 1447هـ',
      descriptionEn: 'Masari Welcome Promotion Reward Credit',
      timestamp: '2026-07-20 09:00:00',
    ));

    _ledger.add(const LedgerEntry(
      entryId: 'led-1',
      transactionId: 'tx-101',
      walletId: 'wlt-803',
      timestamp: '2026-07-15 10:24:12',
      debit: 0.0,
      credit: 1500.0,
      balanceAfter: 1500.0,
      description: 'شحن محفظة',
    ));

    _ledger.add(const LedgerEntry(
      entryId: 'led-2',
      transactionId: 'tx-102',
      walletId: 'wlt-803',
      timestamp: '2026-07-15 11:30:00',
      debit: 450.0,
      credit: 0.0,
      balanceAfter: 1050.0,
      description: 'دفع قيمة حجز طيران',
    ));

    _ledger.add(const LedgerEntry(
      entryId: 'led-3',
      transactionId: 'tx-103',
      walletId: 'wlt-803',
      timestamp: '2026-07-20 09:00:00',
      debit: 0.0,
      credit: 75.0,
      balanceAfter: 1125.0,
      description: 'إيداع مكافأة ولاء ترحيبية',
    ));
  }

  @override
  Future<TransactionEntity> getTransactionById(String transactionId) async {
    return _transactions.firstWhere((element) => element.transactionId == transactionId);
  }

  @override
  Future<List<TransactionEntity>> getTransactionsByWalletId(String walletId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _transactions.where((element) => element.walletId == walletId).toList();
  }

  @override
  Future<void> createTransaction(TransactionEntity transaction) async {
    _transactions.add(transaction);
  }

  @override
  Future<void> updateTransactionStatus(String transactionId, TransactionStatus status) async {
    final idx = _transactions.indexWhere((element) => element.transactionId == transactionId);
    if (idx != -1) {
      final old = _transactions[idx];
      _transactions[idx] = TransactionEntity(
        transactionId: old.transactionId,
        walletId: old.walletId,
        referenceNo: old.referenceNo,
        type: old.type,
        status: status,
        amount: old.amount,
        descriptionAr: old.descriptionAr,
        descriptionEn: old.descriptionEn,
        timestamp: old.timestamp,
        relatedBookingId: old.relatedBookingId,
        paymentGatewayTxId: old.paymentGatewayTxId,
        metaData: old.metaData,
      );
    }
  }

  @override
  Future<void> createLedgerEntry(LedgerEntry entry) async {
    _ledger.add(entry);
  }

  @override
  Future<List<LedgerEntry>> getLedgerEntriesByWalletId(String walletId) async {
    return _ledger.where((element) => element.walletId == walletId).toList();
  }
}

class MockCouponRepository implements CouponRepository {
  final Map<String, CouponEntity> _couponsTable = {};

  MockCouponRepository() {
    _couponsTable['MASARI15'] = const CouponEntity(
      id: 'cpn-1',
      code: 'MASARI15',
      discountValue: 15.0,
      isPercentage: true,
      minPurchaseAmount: 100.0,
      maxDiscountAmount: 500.0,
      expiryDate: '2026-12-31',
      isActive: true,
      usageLimit: 100,
      usageCount: 12,
    );

    _couponsTable['HAJJ1447'] = const CouponEntity(
      id: 'cpn-2',
      code: 'HAJJ1447',
      discountValue: 200.0,
      isPercentage: false,
      minPurchaseAmount: 1000.0,
      maxDiscountAmount: 200.0,
      expiryDate: '2026-09-01',
      isActive: true,
      usageLimit: 50,
      usageCount: 5,
    );
  }

  @override
  Future<CouponEntity?> getCouponByCode(String code) async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _couponsTable[code.toUpperCase()];
  }

  @override
  Future<void> updateCouponUsage(String code) async {
    final cleanCode = code.toUpperCase();
    if (_couponsTable.containsKey(cleanCode)) {
      final old = _couponsTable[cleanCode]!;
      _couponsTable[cleanCode] = CouponEntity(
        id: old.id,
        code: old.code,
        discountValue: old.discountValue,
        isPercentage: old.isPercentage,
        minPurchaseAmount: old.minPurchaseAmount,
        maxDiscountAmount: old.maxDiscountAmount,
        expiryDate: old.expiryDate,
        isActive: old.isActive,
        usageLimit: old.usageLimit,
        usageCount: old.usageCount + 1,
      );
    }
  }

  @override
  Future<void> createCoupon(CouponEntity coupon) async {
    _couponsTable[coupon.code.toUpperCase()] = coupon;
  }
}

// Providers
final walletRepositoryProvider = Provider<WalletRepository>((ref) => MockWalletRepository());
final transactionRepositoryProvider = Provider<TransactionRepository>((ref) => MockTransactionRepository());
final couponRepositoryProvider = Provider<CouponRepository>((ref) => MockCouponRepository());
