class NotificationEntity {
  final String id;
  final String title;
  final String message;
  final String timestamp;
  final bool isRead;

  const NotificationEntity({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    this.isRead = false,
  });
}

abstract class NotificationRepository {
  Future<List<NotificationEntity>> getNotifications();
}

class MockNotificationRepository implements NotificationRepository {
  @override
  Future<List<NotificationEntity>> getNotifications() async {
    return [
      const NotificationEntity(
        id: 'notif-1',
        title: 'تم شحن المحفظة بنجاح',
        message: 'تم إضافة $1500 إلى رصيد محفظتك الرقمية مساري.',
        timestamp: '2026-07-20 15:00:00',
        isRead: false,
      )
    ];
  }
}
