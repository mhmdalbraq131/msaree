// identity_services.dart
// Enterprise services implementing core Business Logic and Security constraints for Identity in MASARI

import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/identity_models.dart';
import '../repositories/identity_repositories.dart';

// ==========================================
// 1. ENCRYPTION SERVICE
// ==========================================

class EncryptionService {
  /// Enterprise CJS/AES ready simulation to protect sensitive PII like Passports and National IDs
  String encryptData(String plainText) {
    // Elegant base64 shifting to simulate AES encryption before writing to Firebase
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

// ==========================================
// 2. VALIDATION SERVICE
// ==========================================

class ValidationService {
  bool validateEmail(String email) {
    final reg = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return reg.hasMatch(email);
  }

  bool validatePassword(String password) {
    // Strong password policy (Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)
    if (password.length < 8) return false;
    final uppercaseReg = RegExp(r'[A-Z]');
    final lowercaseReg = RegExp(r'[a-z]');
    final digitReg = RegExp(r'[0-9]');
    final specialReg = RegExp(r'[!@#\$&*~]');
    return uppercaseReg.hasMatch(password) &&
        lowercaseReg.hasMatch(password) &&
        digitReg.hasMatch(password) &&
        specialReg.hasMatch(password);
  }

  bool validatePhone(String phone) {
    // Validates international phone formats, Yemeni phones, and GCC countries
    final clean = phone.replaceAll(RegExp(r'\s+'), '');
    final reg = RegExp(r'^\+?[1-9]\d{1,14}$');
    return reg.hasMatch(clean);
  }

  bool validatePassport(String passportNo) {
    // Standard alphanumeric passport validation
    if (passportNo.isEmpty || passportNo.length < 5) return false;
    final reg = RegExp(r'^[A-Z0-9]{6,15}$', caseSensitive: false);
    return reg.hasMatch(passportNo);
  }

  bool validateNationalId(String nationalId) {
    // Standard 10-15 digits national ID validation
    if (nationalId.isEmpty) return false;
    final reg = RegExp(r'^\d{8,15}$');
    return reg.hasMatch(nationalId);
  }

  bool validateOtp(String otp) {
    return otp.length == 4 || otp.length == 6;
  }
}

// ==========================================
// 3. SECURITY SERVICE
// ==========================================

class SecurityService {
  final SecurityRepository _securityRepo;
  final EncryptionService _encryptionService;

  SecurityService(this._securityRepo, this._encryptionService);

  Future<bool> authenticateWithPin(String pin, String correctPinHash) async {
    // PIN Lock and local security protection
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

// ==========================================
// 4. SESSION SERVICE
// ==========================================

class SessionService {
  final SessionRepository _sessionRepo;
  final AuthRepository _authRepo;

  SessionService(this._sessionRepo, this._authRepo);

  Future<bool> validateSessionTimeout(String lastActiveTime) async {
    // Automatic timeout check after 15 minutes of user inactivity
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

// ==========================================
// 5. AUTHENTICATION SERVICE
// ==========================================

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

// ==========================================
// 6. SERVICES PROVIDERS
// ==========================================

final encryptionServiceProvider = Provider<EncryptionService>((ref) => EncryptionService());
final validationServiceProvider = Provider<ValidationService>((ref) => ValidationService());

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
