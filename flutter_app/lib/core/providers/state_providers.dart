// state_providers.dart
// Enterprise State Management using Riverpod union states for MASARI PLATFORM

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/identity_models.dart';
import '../models/financial_models.dart';
import '../repositories/identity_repositories.dart';
import '../repositories/financial_repositories.dart';
import '../services/identity_services.dart';
import '../services/financial_services.dart';

// ==========================================
// 1. GENERIC ADVANCED STATE WRAPPERS
// ==========================================

abstract class MasariState<T> {
  const MasariState();

  R when<R>({
    required R Function() loading,
    required R Function(T data) success,
    required R Function(String error) failure,
    required R Function() empty,
    required R Function() unauthorized,
    required R Function() expiredSession,
  }) {
    if (this is MasariLoading<T>) return loading();
    if (this is MasariSuccess<T>) return success((this as MasariSuccess<T>).data);
    if (this is MasariFailure<T>) return failure((this as MasariFailure<T>).errorMessage);
    if (this is MasariEmpty<T>) return empty();
    if (this is MasariUnauthorized<T>) return unauthorized();
    if (this is MasariExpiredSession<T>) return expiredSession();
    throw Exception('Unknown state hierarchy');
  }
}

class MasariLoading<T> extends MasariState<T> {
  const MasariLoading();
}

class MasariSuccess<T> extends MasariState<T> {
  final T data;
  const MasariSuccess(this.data);
}

class MasariFailure<T> extends MasariState<T> {
  final String errorMessage;
  const MasariFailure(this.errorMessage);
}

class MasariEmpty<T> extends MasariState<T> {
  const MasariEmpty();
}

class MasariUnauthorized<T> extends MasariState<T> {
  const MasariUnauthorized();
}

class MasariExpiredSession<T> extends MasariState<T> {
  const MasariExpiredSession();
}

// ==========================================
// 2. AUTHENTICATION STATE NOTIFIER
// ==========================================

class AuthStateNotifier extends StateNotifier<MasariState<UserEntity>> {
  final AuthenticationService _authService;
  final AuthRepository _authRepo;

  AuthStateNotifier(this._authService, this._authRepo) : super(const MasariLoading()) {
    checkCurrentUser();
  }

  Future<void> checkCurrentUser() async {
    state = const MasariLoading();
    try {
      final user = await _authRepo.getCurrentUser();
      if (user != null) {
        state = MasariSuccess(user);
      } else {
        state = const MasariUnauthorized();
      }
    } catch (e) {
      state = MasariFailure('عذراً، فشل التحقق من جلسة المستخدم: ${e.toString()}');
    }
  }

  Future<void> login(String email, String password, {bool rememberMe = true}) async {
    state = const MasariLoading();
    try {
      final user = await _authService.authenticateWithEmail(email, password, rememberMe: rememberMe);
      state = MasariSuccess(user);
    } catch (e) {
      state = MasariFailure(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> loginWithPhoneOtp(String phone, String otp) async {
    state = const MasariLoading();
    try {
      final user = await _authService.verifyOtpAuthentication(phone, otp);
      state = MasariSuccess(user);
    } catch (e) {
      state = MasariFailure(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> triggerSessionExpiration() async {
    state = const MasariExpiredSession();
    await _authService.terminateSession();
  }

  Future<void> logout() async {
    state = const MasariLoading();
    try {
      await _authService.terminateSession();
      state = const MasariUnauthorized();
    } catch (e) {
      state = MasariFailure('فشل تسجيل الخروج الآمن');
    }
  }
}

final authStateProvider = StateNotifierProvider<AuthStateNotifier, MasariState<UserEntity>>((ref) {
  final authSvc = ref.watch(authenticationServiceProvider);
  final authRepo = ref.watch(authRepositoryProvider);
  return AuthStateNotifier(authSvc, authRepo);
});

// ==========================================
// 3. FINANCIAL WALLET STATE NOTIFIER
// ==========================================

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

// ==========================================
// 4. TRANSACTIONS HISTORY NOTIFIER
// ==========================================

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
