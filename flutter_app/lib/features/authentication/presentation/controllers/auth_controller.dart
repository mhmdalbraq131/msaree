import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/auth_services.dart';

// ==========================================
// GENERIC ADVANCED STATE WRAPPERS
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
// AUTHENTICATION STATE NOTIFIER
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
