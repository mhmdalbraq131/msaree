import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';

class MockAuthRepository implements AuthRepository {
  UserEntity? _currentUser;
  final List<UserSession> _sessions = [];
  final List<DeviceEntity> _devices = [];

  MockAuthRepository() {
    _currentUser = const UserEntity(
      id: 'usr-101',
      fullName: 'محمد البرق',
      email: 'mhmdalbraq131@gmail.com',
      phone: '+967 777 123 456',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      nationality: 'اليمن',
      nationalId: '1012984920',
      gender: 'ذكر',
      dob: '1995-12-10',
      role: UserRole.customer,
      permissions: ['read_bookings', 'make_booking', 'use_wallet', 'read_notifications'],
      passport: PassportInfo(
        passportNo: '083948301',
        expiryDate: '2030-05-18',
        issuingCountry: 'اليمن',
        fullNameInPassport: 'MOHAMED AL-BARQ',
      ),
      emergencyContact: EmergencyContact(
        name: 'أحمد البرق',
        relationship: 'أخ',
        phone: '+967 771 999 888',
        email: 'ahmad@gmail.com',
      ),
    );

    _sessions.add(const UserSession(
      sessionId: 'sess-849',
      userId: 'usr-101',
      deviceId: 'dev-apple-15',
      deviceName: 'iPhone 15 Pro Max',
      ipAddress: '192.168.1.5',
      loginTime: '2026-07-20 12:00:00',
      lastActiveTime: '2026-07-20 15:00:00',
      isTrusted: true,
      isActive: true,
    ));

    _devices.add(const DeviceEntity(
      deviceId: 'dev-apple-15',
      deviceName: 'iPhone 15 Pro Max',
      deviceOs: 'iOS 17.4',
      pushToken: 'apns-token-83928491028',
      isTrusted: true,
      registeredAt: '2026-06-01 10:00:00',
    ));
  }

  @override
  Future<UserEntity?> getCurrentUser() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _currentUser;
  }

  @override
  Future<UserEntity> loginWithEmail(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 800));
    if (email == 'mhmdalbraq131@gmail.com' && password == 'Masari2026!') {
      return _currentUser!;
    }
    throw Exception('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  @override
  Future<void> sendPhoneOtp(String phone) async {
    await Future.delayed(const Duration(milliseconds: 600));
  }

  @override
  Future<UserEntity> verifyPhoneOtp(String phone, String otpCode) async {
    await Future.delayed(const Duration(milliseconds: 700));
    if (otpCode == '2026') {
      return _currentUser!;
    }
    throw Exception('رمز التحقق ثنائي العامل (OTP) غير صحيح');
  }

  @override
  Future<void> registerUser(UserEntity user, String password) async {
    await Future.delayed(const Duration(milliseconds: 1000));
    _currentUser = user;
  }

  @override
  Future<void> sendPasswordReset(String email) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<void> confirmPasswordReset(String token, String newPassword) async {
    await Future.delayed(const Duration(milliseconds: 800));
  }

  @override
  Future<void> sendEmailVerification() async {
    await Future.delayed(const Duration(milliseconds: 400));
  }

  @override
  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 500));
    _currentUser = null;
  }

  @override
  Future<List<UserSession>> getActiveSessions(String userId) async {
    return _sessions;
  }

  @override
  Future<void> revokeSession(String sessionId) async {
    _sessions.removeWhere((element) => element.sessionId == sessionId);
  }

  @override
  Future<List<DeviceEntity>> getDevices(String userId) async {
    return _devices;
  }

  @override
  Future<void> registerDevice(String userId, DeviceEntity device) async {
    _devices.add(device);
  }

  @override
  Future<void> removeDevice(String userId, String deviceId) async {
    _devices.removeWhere((element) => element.deviceId == deviceId);
  }
}

class MockRoleRepository implements RoleRepository {
  final Map<String, UserRole> _rolesTable = {};

  MockRoleRepository() {
    _rolesTable['usr-101'] = UserRole.customer;
  }

  @override
  Future<UserRole> getUserRole(String userId) async {
    return _rolesTable[userId] ?? UserRole.guest;
  }

  @override
  Future<void> updateUserRole(String userId, UserRole role) async {
    _rolesTable[userId] = role;
  }

  @override
  Future<List<Permission>> getPermissionsForRole(UserRole role) async {
    switch (role) {
      case UserRole.guest:
        return [
          const Permission(id: 'read_packages', name: 'قراءة العروض وباقات السفر', description: 'يسمح بعرض الباقات للضيوف والمستخدمين', category: 'booking'),
        ];
      case UserRole.customer:
        return [
          const Permission(id: 'read_packages', name: 'قراءة العروض وباقات السفر', description: 'يسمح بعرض الباقات للضيوف والمستخدمين', category: 'booking'),
          const Permission(id: 'make_booking', name: 'إجراء عمليات حجز جديدة', description: 'يسمح للمسافر بإنشاء حجوزات مباشرة', category: 'booking'),
          const Permission(id: 'use_wallet', name: 'استخدام المحفظة الرقمية', description: 'يسمح بدفع الحجوزات واستقبال الاستردادات عبر المحفظة', category: 'wallet'),
          const Permission(id: 'read_notifications', name: 'تلقي التنبيهات وإشعارات الرحلات', description: 'يسمح بالحصول على إشعارات أمنية وتأكيد حجز', category: 'system'),
        ];
      case UserRole.employee:
      case UserRole.subAdmin:
      case UserRole.admin:
      case UserRole.superAdmin:
        return [
          const Permission(id: 'read_packages', name: 'قراءة العروض وباقات السفر', description: 'يسمح بعرض الباقات للضيوف والمستخدمين', category: 'booking'),
          const Permission(id: 'make_booking', name: 'إجراء عمليات حجز جديدة', description: 'يسمح للمسافر بإنشاء حجوزات مباشرة', category: 'booking'),
          const Permission(id: 'use_wallet', name: 'استخدام المحفظة الرقمية', description: 'يسمح بدفع الحجوزات واستقبال الاستردادات عبر المحفظة', category: 'wallet'),
          const Permission(id: 'read_notifications', name: 'تلقي التنبيهات وإشعارات الرحلات', description: 'يسمح بالحصول على إشعارات أمنية وتأكيد حجز', category: 'system'),
          const Permission(id: 'manage_system', name: 'إدارة النظام الشاملة والرقابة المالية', description: 'حق الرقابة والمصادقة على الحركات والودائع', category: 'system'),
        ];
    }
  }
}

class MockPermissionRepository implements PermissionRepository {
  @override
  Future<List<Permission>> getAllPermissions() async {
    return [
      const Permission(id: 'read_packages', name: 'قراءة العروض وباقات السفر', description: 'يسمح بعرض الباقات للضيوف والمستخدمين', category: 'booking'),
      const Permission(id: 'make_booking', name: 'إجراء عمليات حجز جديدة', description: 'يسمح للمسافر بإنشاء حجوزات مباشرة', category: 'booking'),
      const Permission(id: 'use_wallet', name: 'استخدام المحفظة الرقمية', description: 'يسمح بدفع الحجوزات واستقبال الاستردادات عبر المحفظة', category: 'wallet'),
      const Permission(id: 'read_notifications', name: 'تلقي التنبيهات وإشعارات الرحلات', description: 'يسمح بالحصول على إشعارات أمنية وتأكيد حجز', category: 'system'),
      const Permission(id: 'manage_system', name: 'إدارة النظام الشاملة والرقابة المالية', description: 'حق الرقابة والمصادقة على الحركات والودائع', category: 'system'),
    ];
  }

  @override
  Future<bool> checkPermission(String userId, String permissionId) async {
    return true;
  }
}

class MockSecurityRepository implements SecurityRepository {
  final List<AuditLog> _logs = [];
  final Map<String, int> _failedAttempts = {};

  @override
  Future<void> logSecurityActivity(AuditLog log) async {
    _logs.add(log);
  }

  @override
  Future<List<AuditLog>> getSecurityLogs(String userId) async {
    return _logs;
  }

  @override
  Future<bool> checkDeviceTrust(String deviceId) async {
    return true;
  }

  @override
  Future<void> registerBiometrics(String userId, String biometricToken) async {}

  @override
  Future<bool> verifyBiometrics(String userId, String biometricToken) async {
    return true;
  }

  @override
  Future<void> incrementFailedAttempts(String ipAddress) async {
    final val = _failedAttempts[ipAddress] ?? 0;
    _failedAttempts[ipAddress] = val + 1;
  }

  @override
  Future<int> getFailedAttempts(String ipAddress) async {
    return _failedAttempts[ipAddress] ?? 0;
  }

  @override
  Future<void> resetFailedAttempts(String ipAddress) async {
    _failedAttempts[ipAddress] = 0;
  }
}

class MockSessionRepository implements SessionRepository {
  String? _localToken;

  @override
  Future<void> saveSessionLocally(String sessionId, String userId) async {
    _localToken = sessionId;
  }

  @override
  Future<String?> getLocalSessionToken() async {
    return _localToken;
  }

  @override
  Future<void> clearLocalSession() async {
    _localToken = null;
  }

  @override
  Future<void> touchSession(String sessionId) async {}
}

// Dependency Injection Providers
final authRepositoryProvider = Provider<AuthRepository>((ref) => MockAuthRepository());
final roleRepositoryProvider = Provider<RoleRepository>((ref) => MockRoleRepository());
final permissionRepositoryProvider = Provider<PermissionRepository>((ref) => MockPermissionRepository());
final securityRepositoryProvider = Provider<SecurityRepository>((ref) => MockSecurityRepository());
final sessionRepositoryProvider = Provider<SessionRepository>((ref) => MockSessionRepository());
