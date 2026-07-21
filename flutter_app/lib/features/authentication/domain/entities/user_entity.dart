enum UserRole {
  guest,
  customer,
  employee,
  subAdmin,
  admin,
  superAdmin,
}

class Permission {
  final String id;
  final String name;
  final String description;
  final String category; // 'booking', 'wallet', 'user_management', 'system'

  const Permission({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'category': category,
      };

  factory Permission.fromJson(Map<String, dynamic> json) => Permission(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String,
        category: json['category'] as String,
      );
}

class PassportInfo {
  final String passportNo;
  final String expiryDate;
  final String issuingCountry;
  final String fullNameInPassport;

  const PassportInfo({
    required this.passportNo,
    required this.expiryDate,
    required this.issuingCountry,
    required this.fullNameInPassport,
  });

  Map<String, dynamic> toJson() => {
        'passportNo': passportNo,
        'expiryDate': expiryDate,
        'issuingCountry': issuingCountry,
        'fullNameInPassport': fullNameInPassport,
      };

  factory PassportInfo.fromJson(Map<String, dynamic> json) => PassportInfo(
        passportNo: json['passportNo'] as String,
        expiryDate: json['expiryDate'] as String,
        issuingCountry: json['issuingCountry'] as String,
        fullNameInPassport: json['fullNameInPassport'] as String,
      );
}

class EmergencyContact {
  final String name;
  final String relationship;
  final String phone;
  final String email;

  const EmergencyContact({
    required this.name,
    required this.relationship,
    required this.phone,
    required this.email,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'relationship': relationship,
        'phone': phone,
        'email': email,
      };

  factory EmergencyContact.fromJson(Map<String, dynamic> json) => EmergencyContact(
        name: json['name'] as String,
        relationship: json['relationship'] as String,
        phone: json['phone'] as String,
        email: json['email'] as String,
      );
}

class TravelPreferences {
  final String seatPreference; // 'aisle', 'window', 'none'
  final String mealPreference; // 'halal', 'vegan', 'kosher', 'none'
  final String roomPreference; // 'single', 'double', 'suite'
  final List<String> preferredAirlines;
  final List<String> preferredHotels;

  const TravelPreferences({
    this.seatPreference = 'none',
    this.mealPreference = 'none',
    this.roomPreference = 'none',
    this.preferredAirlines = const [],
    this.preferredHotels = const [],
  });

  Map<String, dynamic> toJson() => {
        'seatPreference': seatPreference,
        'mealPreference': mealPreference,
        'roomPreference': roomPreference,
        'preferredAirlines': preferredAirlines,
        'preferredHotels': preferredHotels,
      };

  factory TravelPreferences.fromJson(Map<String, dynamic> json) => TravelPreferences(
        seatPreference: json['seatPreference'] as String? ?? 'none',
        mealPreference: json['mealPreference'] as String? ?? 'none',
        roomPreference: json['roomPreference'] as String? ?? 'none',
        preferredAirlines: List<String>.from(json['preferredAirlines'] ?? []),
        preferredHotels: List<String>.from(json['preferredHotels'] ?? []),
      );
}

class SavedTraveler {
  final String id;
  final String fullName;
  final String relationship;
  final String dob;
  final String passportNo;
  final String nationality;

  const SavedTraveler({
    required this.id,
    required this.fullName,
    required this.relationship,
    required this.dob,
    required this.passportNo,
    required this.nationality,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'fullName': fullName,
        'relationship': relationship,
        'dob': dob,
        'passportNo': passportNo,
        'nationality': nationality,
      };

  factory SavedTraveler.fromJson(Map<String, dynamic> json) => SavedTraveler(
        id: json['id'] as String,
        fullName: json['fullName'] as String,
        relationship: json['relationship'] as String,
        dob: json['dob'] as String,
        passportNo: json['passportNo'] as String,
        nationality: json['nationality'] as String,
      );
}

class SavedDocument {
  final String id;
  final String documentType; // 'passport', 'national_id', 'visa'
  final String docNumber;
  final String expiryDate;
  final String fileUrl;

  const SavedDocument({
    required this.id,
    required this.documentType,
    required this.docNumber,
    required this.expiryDate,
    required this.fileUrl,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'documentType': documentType,
        'docNumber': docNumber,
        'expiryDate': expiryDate,
        'fileUrl': fileUrl,
      };

  factory SavedDocument.fromJson(Map<String, dynamic> json) => SavedDocument(
        id: json['id'] as String,
        documentType: json['documentType'] as String,
        docNumber: json['docNumber'] as String,
        expiryDate: json['expiryDate'] as String,
        fileUrl: json['fileUrl'] as String,
      );
}

class SavedAddress {
  final String id;
  final String label; // 'home', 'work', 'other'
  final String country;
  final String city;
  final String street;
  final String postalCode;

  const SavedAddress({
    required this.id,
    required this.label,
    required this.country,
    required this.city,
    required this.street,
    required this.postalCode,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'country': country,
        'city': city,
        'street': street,
        'postalCode': postalCode,
      };

  factory SavedAddress.fromJson(Map<String, dynamic> json) => SavedAddress(
        id: json['id'] as String,
        label: json['label'] as String,
        country: json['country'] as String,
        city: json['city'] as String,
        street: json['street'] as String,
        postalCode: json['postalCode'] as String,
      );
}

class NotificationPreferences {
  final bool emailNotifications;
  final bool pushNotifications;
  final bool smsNotifications;
  final bool flightStatusAlerts;
  final bool promotionalAlerts;

  const NotificationPreferences({
    this.emailNotifications = true,
    this.pushNotifications = true,
    this.smsNotifications = true,
    this.flightStatusAlerts = true,
    this.promotionalAlerts = false,
  });

  Map<String, dynamic> toJson() => {
        'emailNotifications': emailNotifications,
        'pushNotifications': pushNotifications,
        'smsNotifications': smsNotifications,
        'flightStatusAlerts': flightStatusAlerts,
        'promotionalAlerts': promotionalAlerts,
      };

  factory NotificationPreferences.fromJson(Map<String, dynamic> json) => NotificationPreferences(
        emailNotifications: json['emailNotifications'] as bool? ?? true,
        pushNotifications: json['pushNotifications'] as bool? ?? true,
        smsNotifications: json['smsNotifications'] as bool? ?? true,
        flightStatusAlerts: json['flightStatusAlerts'] as bool? ?? true,
        promotionalAlerts: json['promotionalAlerts'] as bool? ?? false,
      );
}

class PrivacyPreferences {
  final bool shareAnalytics;
  final bool twoFactorEnabled;
  final bool biometricEnabled;
  final bool showProfilePublicly;

  const PrivacyPreferences({
    this.shareAnalytics = false,
    this.twoFactorEnabled = false,
    this.biometricEnabled = false,
    this.showProfilePublicly = false,
  });

  Map<String, dynamic> toJson() => {
        'shareAnalytics': shareAnalytics,
        'twoFactorEnabled': twoFactorEnabled,
        'biometricEnabled': biometricEnabled,
        'showProfilePublicly': showProfilePublicly,
      };

  factory PrivacyPreferences.fromJson(Map<String, dynamic> json) => PrivacyPreferences(
        shareAnalytics: json['shareAnalytics'] as bool? ?? false,
        twoFactorEnabled: json['twoFactorEnabled'] as bool? ?? false,
        biometricEnabled: json['biometricEnabled'] as bool? ?? false,
        showProfilePublicly: json['showProfilePublicly'] as bool? ?? false,
      );
}

class UserEntity {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String avatarUrl;
  final String nationality;
  final String nationalId;
  final String gender;
  final String dob;
  final String preferredLanguage;
  final String preferredCurrency;
  final UserRole role;
  final List<String> permissions;
  final String? tenantId; // Ready for multi-tenant Hajj/Umrah agencies

  final PassportInfo? passport;
  final EmergencyContact? emergencyContact;
  final TravelPreferences travelPreferences;
  final List<SavedTraveler> savedTravelers;
  final List<SavedDocument> savedDocuments;
  final List<SavedAddress> savedAddresses;
  final NotificationPreferences notificationPreferences;
  final PrivacyPreferences privacyPreferences;

  const UserEntity({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    this.avatarUrl = '',
    this.nationality = '',
    this.nationalId = '',
    this.gender = '',
    this.dob = '',
    this.preferredLanguage = 'ar',
    this.preferredCurrency = 'USD',
    this.role = UserRole.customer,
    this.permissions = const [],
    this.tenantId,
    this.passport,
    this.emergencyContact,
    this.travelPreferences = const TravelPreferences(),
    this.savedTravelers = const [],
    this.savedDocuments = const [],
    this.savedAddresses = const [],
    this.notificationPreferences = const NotificationPreferences(),
    this.privacyPreferences = const PrivacyPreferences(),
  });

  UserEntity copyWith({
    String? id,
    String? fullName,
    String? email,
    String? phone,
    String? avatarUrl,
    String? nationality,
    String? nationalId,
    String? gender,
    String? dob,
    String? preferredLanguage,
    String? preferredCurrency,
    UserRole? role,
    List<String>? permissions,
    String? tenantId,
    PassportInfo? passport,
    EmergencyContact? emergencyContact,
    TravelPreferences? travelPreferences,
    List<SavedTraveler>? savedTravelers,
    List<SavedDocument>? savedDocuments,
    List<SavedAddress>? savedAddresses,
    NotificationPreferences? notificationPreferences,
    PrivacyPreferences? privacyPreferences,
  }) {
    return UserEntity(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      nationality: nationality ?? this.nationality,
      nationalId: nationalId ?? this.nationalId,
      gender: gender ?? this.gender,
      dob: dob ?? this.dob,
      preferredLanguage: preferredLanguage ?? this.preferredLanguage,
      preferredCurrency: preferredCurrency ?? this.preferredCurrency,
      role: role ?? this.role,
      permissions: permissions ?? this.permissions,
      tenantId: tenantId ?? this.tenantId,
      passport: passport ?? this.passport,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      travelPreferences: travelPreferences ?? this.travelPreferences,
      savedTravelers: savedTravelers ?? this.savedTravelers,
      savedDocuments: savedDocuments ?? this.savedDocuments,
      savedAddresses: savedAddresses ?? this.savedAddresses,
      notificationPreferences: notificationPreferences ?? this.notificationPreferences,
      privacyPreferences: privacyPreferences ?? this.privacyPreferences,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'fullName': fullName,
        'email': email,
        'phone': phone,
        'avatarUrl': avatarUrl,
        'nationality': nationality,
        'nationalId': nationalId,
        'gender': gender,
        'dob': dob,
        'preferredLanguage': preferredLanguage,
        'preferredCurrency': preferredCurrency,
        'role': role.name,
        'permissions': permissions,
        'tenantId': tenantId,
        'passport': passport?.toJson(),
        'emergencyContact': emergencyContact?.toJson(),
        'travelPreferences': travelPreferences.toJson(),
        'savedTravelers': savedTravelers.map((t) => t.toJson()).toList(),
        'savedDocuments': savedDocuments.map((d) => d.toJson()).toList(),
        'savedAddresses': savedAddresses.map((a) => a.toJson()).toList(),
        'notificationPreferences': notificationPreferences.toJson(),
        'privacyPreferences': privacyPreferences.toJson(),
      };

  factory UserEntity.fromJson(Map<String, dynamic> json) => UserEntity(
        id: json['id'] as String,
        fullName: json['fullName'] as String,
        email: json['email'] as String,
        phone: json['phone'] as String,
        avatarUrl: json['avatarUrl'] as String? ?? '',
        nationality: json['nationality'] as String? ?? '',
        nationalId: json['nationalId'] as String? ?? '',
        gender: json['gender'] as String? ?? '',
        dob: json['dob'] as String? ?? '',
        preferredLanguage: json['preferredLanguage'] as String? ?? 'ar',
        preferredCurrency: json['preferredCurrency'] as String? ?? 'USD',
        role: UserRole.values.firstWhere((e) => e.name == json['role'], orElse: () => UserRole.customer),
        permissions: List<String>.from(json['permissions'] ?? []),
        tenantId: json['tenantId'] as String?,
        passport: json['passport'] != null ? PassportInfo.fromJson(json['passport']) : null,
        emergencyContact: json['emergencyContact'] != null ? EmergencyContact.fromJson(json['emergencyContact']) : null,
        travelPreferences: json['travelPreferences'] != null
            ? TravelPreferences.fromJson(json['travelPreferences'])
            : const TravelPreferences(),
        savedTravelers: (json['savedTravelers'] as List?)?.map((t) => SavedTraveler.fromJson(t)).toList() ?? const [],
        savedDocuments: (json['savedDocuments'] as List?)?.map((d) => SavedDocument.fromJson(d)).toList() ?? const [],
        savedAddresses: (json['savedAddresses'] as List?)?.map((a) => SavedAddress.fromJson(a)).toList() ?? const [],
        notificationPreferences: json['notificationPreferences'] != null
            ? NotificationPreferences.fromJson(json['notificationPreferences'])
            : const NotificationPreferences(),
        privacyPreferences: json['privacyPreferences'] != null
            ? PrivacyPreferences.fromJson(json['privacyPreferences'])
            : const PrivacyPreferences(),
      );
}

class UserSession {
  final String sessionId;
  final String userId;
  final String deviceId;
  final String deviceName;
  final String ipAddress;
  final String loginTime;
  final String lastActiveTime;
  final bool isTrusted;
  final bool isActive;

  const UserSession({
    required this.sessionId,
    required this.userId,
    required this.deviceId,
    required this.deviceName,
    required this.ipAddress,
    required this.loginTime,
    required this.lastActiveTime,
    this.isTrusted = false,
    this.isActive = true,
  });

  Map<String, dynamic> toJson() => {
        'sessionId': sessionId,
        'userId': userId,
        'deviceId': deviceId,
        'deviceName': deviceName,
        'ipAddress': ipAddress,
        'loginTime': loginTime,
        'lastActiveTime': lastActiveTime,
        'isTrusted': isTrusted,
        'isActive': isActive,
      };

  factory UserSession.fromJson(Map<String, dynamic> json) => UserSession(
        sessionId: json['sessionId'] as String,
        userId: json['userId'] as String,
        deviceId: json['deviceId'] as String,
        deviceName: json['deviceName'] as String,
        ipAddress: json['ipAddress'] as String,
        loginTime: json['loginTime'] as String,
        lastActiveTime: json['lastActiveTime'] as String,
        isTrusted: json['isTrusted'] as bool? ?? false,
        isActive: json['isActive'] as bool? ?? true,
      );
}

class DeviceEntity {
  final String deviceId;
  final String deviceName;
  final String deviceOs;
  final String pushToken;
  final bool isTrusted;
  final String registeredAt;

  const DeviceEntity({
    required this.deviceId,
    required this.deviceName,
    required this.deviceOs,
    required this.pushToken,
    this.isTrusted = false,
    required this.registeredAt,
  });

  Map<String, dynamic> toJson() => {
        'deviceId': deviceId,
        'deviceName': deviceName,
        'deviceOs': deviceOs,
        'pushToken': pushToken,
        'isTrusted': isTrusted,
        'registeredAt': registeredAt,
      };

  factory DeviceEntity.fromJson(Map<String, dynamic> json) => DeviceEntity(
        deviceId: json['deviceId'] as String,
        deviceName: json['deviceName'] as String,
        deviceOs: json['deviceOs'] as String,
        pushToken: json['pushToken'] as String,
        isTrusted: json['isTrusted'] as bool? ?? false,
        registeredAt: json['registeredAt'] as String,
      );
}

class AuditLog {
  final String id;
  final String userId;
  final String action; // 'LOGIN', 'LOGOUT', 'WALLET_RECHARGE', 'BOOKING'
  final String ipAddress;
  final String timestamp;
  final String details;
  final String severity; // 'INFO', 'WARNING', 'CRITICAL'

  const AuditLog({
    required this.id,
    required this.userId,
    required this.action,
    required this.ipAddress,
    required this.timestamp,
    required this.details,
    this.severity = 'INFO',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'action': action,
        'ipAddress': ipAddress,
        'timestamp': timestamp,
        'details': details,
        'severity': severity,
      };

  factory AuditLog.fromJson(Map<String, dynamic> json) => AuditLog(
        id: json['id'] as String,
        userId: json['userId'] as String,
        action: json['action'] as String,
        ipAddress: json['ipAddress'] as String,
        timestamp: json['timestamp'] as String,
        details: json['details'] as String,
        severity: json['severity'] as String? ?? 'INFO',
      );
}
