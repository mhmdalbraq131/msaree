enum TransactionType {
  deposit,
  withdrawal,
  bookingPayment,
  refund,
  bonus,
  promotion,
  adjustment,
  adminCredit,
  adminDebit,
  walletTransfer,
}

enum TransactionStatus {
  pending,
  completed,
  failed,
  reversed,
}

class WalletEntity {
  final String walletId;
  final String userId;
  final double availableBalance;
  final double pendingBalance;
  final double reservedBalance;
  final double rewardBalance;
  final double giftBalance;
  final double travelCredit;
  final String currency;
  final String lastUpdatedAt;

  const WalletEntity({
    required this.walletId,
    required this.userId,
    this.availableBalance = 0.0,
    this.pendingBalance = 0.0,
    this.reservedBalance = 0.0,
    this.rewardBalance = 0.0,
    this.giftBalance = 0.0,
    this.travelCredit = 0.0,
    this.currency = 'USD',
    required this.lastUpdatedAt,
  });

  WalletEntity copyWith({
    String? walletId,
    String? userId,
    double? availableBalance,
    double? pendingBalance,
    double? reservedBalance,
    double? rewardBalance,
    double? giftBalance,
    double? travelCredit,
    String? currency,
    String? lastUpdatedAt,
  }) {
    return WalletEntity(
      walletId: walletId ?? this.walletId,
      userId: userId ?? this.userId,
      availableBalance: availableBalance ?? this.availableBalance,
      pendingBalance: pendingBalance ?? this.pendingBalance,
      reservedBalance: reservedBalance ?? this.reservedBalance,
      rewardBalance: rewardBalance ?? this.rewardBalance,
      giftBalance: giftBalance ?? this.giftBalance,
      travelCredit: travelCredit ?? this.travelCredit,
      currency: currency ?? this.currency,
      lastUpdatedAt: lastUpdatedAt ?? this.lastUpdatedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'walletId': walletId,
        'userId': userId,
        'availableBalance': availableBalance,
        'pendingBalance': pendingBalance,
        'reservedBalance': reservedBalance,
        'rewardBalance': rewardBalance,
        'giftBalance': giftBalance,
        'travelCredit': travelCredit,
        'currency': currency,
        'lastUpdatedAt': lastUpdatedAt,
      };

  factory WalletEntity.fromJson(Map<String, dynamic> json) => WalletEntity(
        walletId: json['walletId'] as String,
        userId: json['userId'] as String,
        availableBalance: (json['availableBalance'] as num?)?.toDouble() ?? 0.0,
        pendingBalance: (json['pendingBalance'] as num?)?.toDouble() ?? 0.0,
        reservedBalance: (json['reservedBalance'] as num?)?.toDouble() ?? 0.0,
        rewardBalance: (json['rewardBalance'] as num?)?.toDouble() ?? 0.0,
        giftBalance: (json['giftBalance'] as num?)?.toDouble() ?? 0.0,
        travelCredit: (json['travelCredit'] as num?)?.toDouble() ?? 0.0,
        currency: json['currency'] as String? ?? 'USD',
        lastUpdatedAt: json['lastUpdatedAt'] as String,
      );
}

class TransactionEntity {
  final String transactionId;
  final String walletId;
  final String referenceNo; // e.g., MSR-TX-2026-X839D
  final TransactionType type;
  final TransactionStatus status;
  final double amount;
  final String currency;
  final String descriptionAr;
  final String descriptionEn;
  final String timestamp;
  final String? paymentGatewayTxId;
  final String? relatedBookingId;
  final Map<String, dynamic> metaData;

  const TransactionEntity({
    required this.transactionId,
    required this.walletId,
    required this.referenceNo,
    required this.type,
    required this.status,
    required this.amount,
    this.currency = 'USD',
    required this.descriptionAr,
    required this.descriptionEn,
    required this.timestamp,
    this.paymentGatewayTxId,
    this.relatedBookingId,
    this.metaData = const {},
  });

  Map<String, dynamic> toJson() => {
        'transactionId': transactionId,
        'walletId': walletId,
        'referenceNo': referenceNo,
        'type': type.name,
        'status': status.name,
        'amount': amount,
        'currency': currency,
        'descriptionAr': descriptionAr,
        'descriptionEn': descriptionEn,
        'timestamp': timestamp,
        'paymentGatewayTxId': paymentGatewayTxId,
        'relatedBookingId': relatedBookingId,
        'metaData': metaData,
      };

  factory TransactionEntity.fromJson(Map<String, dynamic> json) => TransactionEntity(
        transactionId: json['transactionId'] as String,
        walletId: json['walletId'] as String,
        referenceNo: json['referenceNo'] as String,
        type: TransactionType.values.firstWhere((e) => e.name == json['type']),
        status: TransactionStatus.values.firstWhere((e) => e.name == json['status']),
        amount: (json['amount'] as num).toDouble(),
        currency: json['currency'] as String? ?? 'USD',
        descriptionAr: json['descriptionAr'] as String,
        descriptionEn: json['descriptionEn'] as String,
        timestamp: json['timestamp'] as String,
        paymentGatewayTxId: json['paymentGatewayTxId'] as String?,
        relatedBookingId: json['relatedBookingId'] as String?,
        metaData: Map<String, dynamic>.from(json['metaData'] ?? {}),
      );
}

class LedgerEntry {
  final String entryId;
  final String transactionId;
  final String walletId;
  final String timestamp;
  final double debit; // outflows
  final double credit; // inflows
  final double balanceAfter;
  final String description;

  const LedgerEntry({
    required this.entryId,
    required this.transactionId,
    required this.walletId,
    required this.timestamp,
    required this.debit,
    required this.credit,
    required this.balanceAfter,
    required this.description,
  });

  Map<String, dynamic> toJson() => {
        'entryId': entryId,
        'transactionId': transactionId,
        'walletId': walletId,
        'timestamp': timestamp,
        'debit': debit,
        'credit': credit,
        'balanceAfter': balanceAfter,
        'description': description,
      };

  factory LedgerEntry.fromJson(Map<String, dynamic> json) => LedgerEntry(
        entryId: json['entryId'] as String,
        transactionId: json['transactionId'] as String,
        walletId: json['walletId'] as String,
        timestamp: json['timestamp'] as String,
        debit: (json['debit'] as num).toDouble(),
        credit: (json['credit'] as num).toDouble(),
        balanceAfter: (json['balanceAfter'] as num).toDouble(),
        description: json['description'] as String,
      );
}

class CouponEntity {
  final String id;
  final String code;
  final double discountValue; // percentage or fixed value
  final bool isPercentage;
  final double minPurchaseAmount;
  final double maxDiscountAmount;
  final String expiryDate;
  final bool isActive;
  final int usageLimit;
  final int usageCount;

  const CouponEntity({
    required this.id,
    required this.code,
    required this.discountValue,
    this.isPercentage = true,
    this.minPurchaseAmount = 0.0,
    this.maxDiscountAmount = 1000.0,
    required this.expiryDate,
    this.isActive = true,
    this.usageLimit = 100,
    this.usageCount = 0,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'code': code,
        'discountValue': discountValue,
        'isPercentage': isPercentage,
        'minPurchaseAmount': minPurchaseAmount,
        'maxDiscountAmount': maxDiscountAmount,
        'expiryDate': expiryDate,
        'isActive': isActive,
        'usageLimit': usageLimit,
        'usageCount': usageCount,
      };

  factory CouponEntity.fromJson(Map<String, dynamic> json) => CouponEntity(
        id: json['id'] as String,
        code: json['code'] as String,
        discountValue: (json['discountValue'] as num).toDouble(),
        isPercentage: json['isPercentage'] as bool? ?? true,
        minPurchaseAmount: (json['minPurchaseAmount'] as num?)?.toDouble() ?? 0.0,
        maxDiscountAmount: (json['maxDiscountAmount'] as num?)?.toDouble() ?? 1000.0,
        expiryDate: json['expiryDate'] as String,
        isActive: json['isActive'] as bool? ?? true,
        usageLimit: json['usageLimit'] as int? ?? 100,
        usageCount: json['usageCount'] as int? ?? 0,
      );
}
