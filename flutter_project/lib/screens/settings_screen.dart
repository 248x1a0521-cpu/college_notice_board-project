import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';

class SettingsScreen extends StatelessWidget {
  final ValueChanged<ThemeMode>? onThemeModeChanged;
  final ThemeMode currentThemeMode;

  const SettingsScreen({
    super.key,
    this.onThemeModeChanged,
    this.currentThemeMode = ThemeMode.system,
  });

  void _showClearAllConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        icon: const Icon(Icons.warning_amber_rounded, color: Colors.red, size: 40),
        title: const Text('Clear All Notices?'),
        content: const Text(
          'This action will permanently delete all notices from local storage. Are you sure you want to proceed?',
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
              Navigator.pop(ctx);
              final provider = context.read<NoticeProvider>();
              final success = await provider.clearAllNotices();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success
                          ? 'All notices have been cleared from local storage.'
                          : 'Failed to clear notices.',
                    ),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: const Text('Clear All'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NoticeProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings & About'),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // App Header Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0A2540), Color(0xFF1E3A8A)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0A2540).withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.school_rounded,
                      color: Colors.white,
                      size: 36,
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'CampusConnect',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'College Notice Board Application',
                    style: TextStyle(
                      fontSize: 13,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Version 1.0.0 (Build 1)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Statistics Section
          Text(
            'STATISTICS',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.campaign_rounded, color: theme.colorScheme.primary),
              ),
              title: const Text('Total Notices Published'),
              subtitle: const Text('Stored securely in offline local storage'),
              trailing: Text(
                '${provider.totalNoticesCount}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Theme & Appearance Section
          Text(
            'APPEARANCE & THEME',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.palette_outlined),
                  title: const Text('Theme System'),
                  subtitle: const Text('Material 3 Dynamic with Navy Blue (#0A2540) seed'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.dark_mode_outlined),
                  title: const Text('Display Mode'),
                  subtitle: Text(
                    theme.brightness == Brightness.dark ? 'Dark Mode' : 'Light Mode',
                  ),
                  trailing: Switch(
                    value: theme.brightness == Brightness.dark,
                    onChanged: (isDark) {
                      if (onThemeModeChanged != null) {
                        onThemeModeChanged!(isDark ? ThemeMode.dark : ThemeMode.light);
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // About Application Section
          Text(
            'ABOUT CAMPUSCONNECT',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'CampusConnect is an offline-first college notice board built with Flutter, Provider, SharedPreferences, and Material 3 design.\n\nKey Capabilities:',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.45,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 8),
                  _buildBullet(context, 'Real-time multi-criteria filtering by title & department'),
                  _buildBullet(context, 'Strict Form validation with whitespace and limit enforcement'),
                  _buildBullet(context, 'Automated department-wise notice aggregation'),
                  _buildBullet(context, 'Local JSON serialization with corruption recovery'),
                  _buildBullet(context, '100% test coverage with Flutter widget testing'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Storage Management Section
          Text(
            'DATA MANAGEMENT',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: Colors.red.shade700,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: Icon(Icons.delete_forever_rounded, color: Colors.red.shade700),
              title: Text(
                'Clear All Notices',
                style: TextStyle(
                  color: Colors.red.shade700,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: const Text('Removes all notices from SharedPreferences'),
              onTap: () => _showClearAllConfirmation(context),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildBullet(BuildContext context, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('•  ', style: TextStyle(fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 12.5,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
