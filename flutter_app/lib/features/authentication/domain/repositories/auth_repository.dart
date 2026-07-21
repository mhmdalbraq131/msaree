import '../entities/user_entity.dart';

abstract class AuthRepository {
  Future<UserEntity?> getCurrentUser();
  Future<UserEntity> loginWithEmail(String email, String password);
  Future<void> sendPhoneOtp(String phone);
  Future<UserEntity> verifyPhoneOtp(String phone, String otpCode);
  Future<void> registerUser(UserEntity user, String password);
  Future<void> sendPasswordReset(String email);
  Future<void> confirmPasswordReset(String token, String newPassword);
  Future<void> sendEmailVerification();
  Future<void> logout();
  Future<List<UserSession>> getActiveSessions(String userId);
  Future<void> revokeSession(String sessionId);
  Future<List<DeviceEntity>> getDevices(String userId);
  Future<void> registerDevice(String userId, DeviceEntity device);
  Future<void> removeDevice(String userId, String deviceId);
}

abstract class RoleRepository {
  Future<UserRole> getUserRole(String userId);
  Future<void> updateUserRole(String userId, UserRole role);
  Future<List<Permission>> getPermissionsForRole(UserRole role);
}

abstract class PermissionRepository {
  Future<List<Permission>> getAllPermissions();
  Future<bool> checkPermission(String userId, String permissionId);
}

abstract class SecurityRepository {
  Future<void> logSecurityActivity(AuditLog log);
  Future<List<AuditLog>> getSecurityLogs(String userId);
  Future<bool> checkDeviceTrust(String deviceId);
  Future<void> registerBiometrics(String userId, String biometricToken);
  Future<bool> verifyBiometrics(String userId, String biometricToken);
  Future<void> incrementFailedAttempts(String ipAddress);
  Future<int> getFailedAttempts(String ipAddress);
  Future<void> resetFailedAttempts(String ipAddress);
}

abstract class SessionRepository {
  Future<void> saveSessionLocally(String sessionId, String userId);
  Future<String?> getLocalSessionToken();
  Future<void> clearLocalSession();
  Future<void> touchSession(String sessionId);
}
