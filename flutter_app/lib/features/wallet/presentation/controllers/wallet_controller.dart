import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/wallet_entity.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../../data/repositories/wallet_repository_impl.dart';
import '../../data/repositories/financial_services.dart';
import '../../../authentication/presentation/controllers/auth_controller.dart'; // import MasariState

class WalletStateNotifier extends StateNotifier<MasariState<WalletEntity>> {
  final WalletRepository _walletRepo;
  final WalletService _walletService;

  WalletStateNotifier(this._walletRepo, this._walletService) : super(const MasariLoading());

  Future<void> loadWallet(String userId) async {
    state = const MasariLoading();
    try {
      final wallet = await _walletRepo.getWalletByUserId(userId);
      state = MasariSuccess(wallet);
    } catch (e) {
      state = MasariFailure('فشل جلب تفاصيل وبيانات المحفظة المالية');
    }
  }

  Future<void> recharge(String userId, double amount, String method) async {
    state = const MasariLoading();
    try {
      final updated = await _walletService.depositToWallet(
        userId,
        amount,
        TransactionType.deposit,
        'شحن رصيد إلكتروني تلقائي بقيمة \$${amount.toStringAsFixed(2)}',
        'Automatic Recharge of \$${amount.toStringAsFixed(2)}',
      );
      state = MasariSuccess(updated);
    } catch (e) {
      state = MasariFailure(e.toString());
    }
  }

  Future<void> withdraw(String userId, double amount) async {
    state = const MasariLoading();
    try {
      final updated = await _walletService.withdrawFromWallet(
        userId,
        amount,
        'عملية سحب رصيد نقدي بقيمة \$${amount.toStringAsFixed(2)}',
        'Cash Withdrawal of \$${amount.toStringAsFixed(2)}',
      );
      state = MasariSuccess(updated);
    } catch (e) {
      state = MasariFailure(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> transfer(String senderUserId, String receiverUserId, double amount) async {
    state = const MasariLoading();
    try {
      final updated = await _walletService.transferFunds(senderUserId, receiverUserId, amount);
      state = MasariSuccess(updated);
    } catch (e) {
      state = MasariFailure(e.toString().replaceAll('Exception: ', ''));
    }
  }
}

final walletStateProvider = StateNotifierProvider<WalletStateNotifier, MasariState<WalletEntity>>((ref) {
  final walletRepo = ref.watch(walletRepositoryProvider);
  final walletSvc = ref.watch(walletServiceProvider);
  return WalletStateNotifier(walletRepo, walletSvc);
});

class TransactionsListNotifier extends StateNotifier<MasariState<List<TransactionEntity>>> {
  final TransactionRepository _txRepo;

  TransactionsListNotifier(this._txRepo) : super(const MasariLoading());

  Future<void> fetchHistory(String walletId) async {
    state = const MasariLoading();
    try {
      final list = await _txRepo.getTransactionsByWalletId(walletId);
      if (list.isEmpty) {
        state = const MasariEmpty();
      } else {
        state = MasariSuccess(list);
      }
    } catch (e) {
      state = MasariFailure('فشل تحميل كشف الحركات والعمليات المالية');
    }
  }
}

final transactionsListProvider = StateNotifierProvider<TransactionsListNotifier, MasariState<List<TransactionEntity>>>((ref) {
  final txRepo = ref.watch(transactionRepositoryProvider);
  return TransactionsListNotifier(txRepo);
});
