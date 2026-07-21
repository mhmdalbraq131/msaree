class SupportTicketEntity {
  final String ticketId;
  final String subject;
  final String status; // 'open', 'resolved', 'closed'
  final String description;

  const SupportTicketEntity({
    required this.ticketId,
    required this.subject,
    required this.status,
    required this.description,
  });
}
