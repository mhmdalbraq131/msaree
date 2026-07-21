import '../entities/wallet_entity.dart';

abstract class WalletRepository {
  Future<WalletEntity> getWalletByUserId(String userId);
  Future<void> updateWalletBalances(WalletEntity wallet);
  Future<void> createWallet(String userId);
}

abstract class TransactionRepository {
  Future<TransactionEntity> getTransactionById(String transactionId);
  Future<List<TransactionEntity>> getTransactionsByWalletId(String walletId);
  Future<void> createTransaction(TransactionEntity transaction);
  Future<void> updateTransactionStatus(String transactionId, TransactionStatus status);
  Future<void> createLedgerEntry(LedgerEntry entry);
  Future<List<LedgerEntry>> getLedgerEntriesByWalletId(String walletId);
}

abstract class CouponRepository {
  Future<CouponEntity?> getCouponByCode(String code);
  Future<void> updateCouponUsage(String code);
  Future<void> createCoupon(CouponEntity coupon);
}
