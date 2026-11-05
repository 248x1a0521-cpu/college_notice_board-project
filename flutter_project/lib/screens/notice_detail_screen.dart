import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/notice.dart';
import '../providers/notice_provider.dart';

class NoticeDetailScreen extends StatelessWidget {
  final Notice notice;

  const NoticeDetailScreen({
    super.key,
    required this.notice,
  });

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return const Color(0xFFDC2626);
      case 'medium':
        return const Color(0xFFD97706);
      case 'low':
        return const Color(0xFF059669);
      default:
        return const Color(0xFF64748B);
    }
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Notice?'),
        content: const Text(
          'Are you sure you want to delete this notice? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: Colors.red.shade700,
            ),
            onPressed: () async {
              Navigator.pop(ctx); // Close dialog
              final provider = context.read<NoticeProvider>();
              final success = await provider.deleteNotice(notice.id);
              if (context.mounted) {
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Notice deleted successfully'),
                      backgroundColor: Colors.black87,
                    ),
                  );
                  Navigator.pop(context); // Back to previous screen
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Failed to delete notice'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final priorityColor = _getPriorityColor(notice.priority);
    final pubFormatted =
        DateFormat('EEEE, MMMM dd, yyyy • hh:mm a').format(notice.publishedDate);
    final expFormatted = notice.expiryDate != null
        ? DateFormat('EEEE, MMMM dd, yyyy').format(notice.expiryDate!)
        : null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notice Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded),
            tooltip: 'Delete notice',
            color: Colors.red.shade400,
            onPressed: () => _confirmDelete(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Priority & Department Row
            Row(
              children: [
                // Department badge
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: theme.colorScheme.primary.withOpacity(0.2),
                    ),
                  ),
                  child: Text(
                    notice.department,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                ),
                const Spacer(),
                // Priority badge
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: priorityColor,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${notice.priority} Priority',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: priorityColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Complete Notice Title
            Text(
              notice.title,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),

            // Meta Info Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: theme.colorScheme.outlineVariant.withOpacity(0.5),
                ),
              ),
              child: Column(
                children: [
                  _buildMetaRow(
                    context,
                    Icons.person_outline_rounded,
                    'Published By',
                    notice.publisherName,
                  ),
                  const Divider(height: 16),
                  _buildMetaRow(
                    context,
                    Icons.event_note_rounded,
                    'Published On',
                    pubFormatted,
                  ),
                  const Divider(height: 16),
                  _buildMetaRow(
                    context,
                    Icons.category_outlined,
                    'Category',
                    notice.category,
                  ),
                  if (expFormatted != null) ...[
                    const Divider(height: 16),
                    _buildMetaRow(
                      context,
                      Icons.event_busy_rounded,
                      'Expiry Date',
                      notice.isExpired ? '$expFormatted (Expired)' : expFormatted,
                      highlightColor: notice.isExpired ? Colors.red : null,
                    ),
                  ],
                  const Divider(height: 16),
                  _buildMetaRow(
                    context,
                    Icons.fingerprint_rounded,
                    'Notice ID',
                    notice.id,
                    isMonospace: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Description Header
            Text(
              'Notice Content',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            // Full Description Content
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: theme.colorScheme.outlineVariant.withOpacity(0.4),
                ),
              ),
              child: SelectableText(
                notice.description,
                style: theme.textTheme.bodyLarge?.copyWith(
                  height: 1.6,
                  color: theme.colorScheme.onSurface,
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildMetaRow(
    BuildContext context,
    IconData icon,
    String label,
    String value, {
    Color? highlightColor,
    bool isMonospace = false,
  }) {
    final theme = Theme.of(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: theme.colorScheme.primary),
        const SizedBox(width: 10),
        SizedBox(
          width: 100,
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: highlightColor ?? theme.colorScheme.onSurface,
              fontFamily: isMonospace ? 'monospace' : null,
            ),
          ),
        ),
      ],
    );
  }
}
