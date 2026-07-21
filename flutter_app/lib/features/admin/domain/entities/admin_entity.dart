class AdminLogEntity {
  final String logId;
  final String adminId;
  final String action;
  final String timestamp;

  const AdminLogEntity({
    required this.logId,
    required this.adminId,
    required this.action,
    required this.timestamp,
  });
}
