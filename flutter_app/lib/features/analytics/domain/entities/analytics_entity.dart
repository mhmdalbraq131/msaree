class AnalyticsEventEntity {
  final String eventId;
  final String eventName;
  final String timestamp;
  final Map<String, dynamic> parameters;

  const AnalyticsEventEntity({
    required this.eventId,
    required this.eventName,
    required this.timestamp,
    required this.parameters,
  });
}
