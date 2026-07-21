import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_repository_impl.dart';

class EncryptionService {
  String encryptData(String plainText) {
    final bytes = utf8.encode(plainText);
    return 'ENC_${base64.encode(bytes)}';
  }

  String decryptData(String encryptedText) {
    if (!encryptedText.startsWith('ENC_')) return encryptedText;
    final clean = encryptedText.replaceFirst('ENC_', '');
    final bytes = base64.decode(clean);
    return utf8.decode(bytes);
  }
}

class SecurityService {
  final SecurityRepository _securityRepo;
  final EncryptionService _encryptionService;

  SecurityService(this._securityRepo, this._encryptionService);

  Future<bool> authenticateWithPin(String pin, String correctPinHash) async {
    final hash = _encryptionService.encryptData(pin);
    return hash == correctPinHash;
  }

  Future<bool> verifyDeviceTrust(String deviceId) async {
    return _securityRepo.checkDeviceTrust(deviceId);
  }

  Future<void> handleFailedLogin(String ipAddress) async {
    await _securityRepo.incrementFailedAttempts(ipAddress);
    final attempts = await _securityRepo.getFailedAttempts(ipAddress);
    if (attempts >= 5) {
      await _securityRepo.logSecurityActivity(AuditLog(
        id: 'aud-${DateTime.now().millisecondsSinceEpoch}',
        userId: 'system_anonymous',
        action: 'BRUTE_FORCE_DETECTED',
        ipAddress: ipAddress,
        timestamp: DateTime.now().toString(),
        details: 'تم رصد 5 محاولات دخول خاطئة ومتتالية من العنوان IP.',
        severity: 'CRITICAL',
      ));
    }
  }

  Future<void> resetLoginAttempts(String ipAddress) async {
    await _securityRepo.resetFailedAttempts(ipAddress);
  }

  Future<bool> isIpBlocked(String ipAddress) async {
    final attempts = await _securityRepo.getFailedAttempts(ipAddress);
    return attempts >= 5;
  }
}

class SessionService {
  final SessionRepository _sessionRepo;
  final AuthRepository _authRepo;

  SessionService(this._sessionRepo, this._authRepo);

  Future<bool> validateSessionTimeout(String lastActiveTime) async {
    final lastTime = DateTime.parse(lastActiveTime);
    final difference = DateTime.now().difference(lastTime).inMinutes;
    if (difference >= 15) {
      await _sessionRepo.clearLocalSession();
      return true; // Session expired
    }
    return false;
  }

  Future<void> handleSessionTouch(String sessionId) async {
    await _sessionRepo.touchSession(sessionId);
  }

  Future<void> forceSignOutAllOtherDevices(String userId, String currentSessionId) async {
    final sessions = await _authRepo.getActiveSessions(userId);
    for (final s in sessions) {
      if (s.sessionId != currentSessionId) {
        await _authRepo.revokeSession(s.sessionId);
      }
    }
  }
}

class AuthenticationService {
  final AuthRepository _authRepo;
  final SessionRepository _sessionRepo;
  final SecurityRepository _securityRepo;

  AuthenticationService(this._authRepo, this._sessionRepo, this._securityRepo);

  Future<UserEntity> authenticateWithEmail(String email, String password, {bool rememberMe = true}) async {
    try {
      final user = await _authRepo.loginWithEmail(email, password);
      final sessionId = 'sess-${DateTime.now().millisecondsSinceEpoch}';
      
      if (rememberMe) {
        await _sessionRepo.saveSessionLocally(sessionId, user.id);
      }

      await _securityRepo.logSecurityActivity(AuditLog(
        id: 'aud-${DateTime.now().millisecondsSinceEpoch}',
        userId: user.id,
        action: 'EMAIL_LOGIN_SUCCESS',
        ipAddress: '192.168.1.1',
        timestamp: DateTime.now().toString(),
        details: 'تم تسجيل الدخول بنجاح بالبريد الإلكتروني للرمز ${user.id}.',
        severity: 'INFO',
      ));

      return user;
    } catch (e) {
      await _securityRepo.logSecurityActivity(AuditLog(
        id: 'aud-${DateTime.now().millisecondsSinceEpoch}',
        userId: 'unknown',
        action: 'EMAIL_LOGIN_FAILED',
        ipAddress: '192.168.1.1',
        timestamp: DateTime.now().toString(),
        details: 'فشل تسجيل الدخول للبريد ${email}: ${e.toString()}',
        severity: 'WARNING',
      ));
      rethrow;
    }
  }

  Future<UserEntity> verifyOtpAuthentication(String phone, String otp) async {
    try {
      final user = await _authRepo.verifyPhoneOtp(phone, otp);
      final sessionId = 'sess-${DateTime.now().millisecondsSinceEpoch}';
      await _sessionRepo.saveSessionLocally(sessionId, user.id);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> requestPasswordReset(String email) async {
    await _authRepo.sendPasswordReset(email);
  }

  Future<void> terminateSession() async {
    final localToken = await _sessionRepo.getLocalSessionToken();
    if (localToken != null) {
      await _authRepo.revokeSession(localToken);
      await _sessionRepo.clearLocalSession();
    }
    await _authRepo.logout();
  }
}

// Service Providers
final encryptionServiceProvider = Provider<EncryptionService>((ref) => EncryptionService());

final securityServiceProvider = Provider<SecurityService>((ref) {
  final securityRepo = ref.watch(securityRepositoryProvider);
  final encryptionSvc = ref.watch(encryptionServiceProvider);
  return SecurityService(securityRepo, encryptionSvc);
});

final sessionServiceProvider = Provider<SessionService>((ref) {
  final sessionRepo = ref.watch(sessionRepositoryProvider);
  final authRepo = ref.watch(authRepositoryProvider);
  return SessionService(sessionRepo, authRepo);
});

final authenticationServiceProvider = Provider<AuthenticationService>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  final sessionRepo = ref.watch(sessionRepositoryProvider);
  final securityRepo = ref.watch(securityRepositoryProvider);
  return AuthenticationService(authRepo, sessionRepo, securityRepo);
});
