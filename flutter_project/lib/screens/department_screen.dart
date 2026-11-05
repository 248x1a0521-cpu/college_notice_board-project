import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';

class DepartmentScreen extends StatelessWidget {
  final void Function(int tabIndex)? onNavigateToHome;

  const DepartmentScreen({
    super.key,
    this.onNavigateToHome,
  });

  static const List<Map<String, dynamic>> departmentMetadata = [
    {
      'name': 'General / All Departments',
      'code': 'GEN',
      'icon': Icons.public_rounded,
      'color': Color(0xFF0284C7),
      'description': 'Campus-wide announcements, admissions, and central notices',
    },
    {
      'name': 'Computer Science and Engineering (CSE)',
      'code': 'CSE',
      'icon': Icons.code_rounded,
      'color': Color(0xFF6366F1),
      'description': 'AI, Software systems, lab schedules, and coding workshops',
    },
    {
      'name': 'Information Technology (IT)',
      'code': 'IT',
      'icon': Icons.devices_rounded,
      'color': Color(0xFF0EA5E9),
      'description': 'Cloud computing, networks, and technical symposiums',
    },
    {
      'name': 'Electronics and Communication Engineering (ECE)',
      'code': 'ECE',
      'icon': Icons.memory_rounded,
      'color': Color(0xFFEC4899),
      'description': 'VLSI, embedded systems, robotics, and circuit labs',
    },
    {
      'name': 'Electrical and Electronics Engineering (EEE)',
      'code': 'EEE',
      'icon': Icons.bolt_rounded,
      'color': Color(0xFFF59E0B),
      'description': 'Power systems, machines, high voltage, and green energy',
    },
    {
      'name': 'Mechanical Engineering (ME)',
      'code': 'ME',
      'icon': Icons.settings_suggest_rounded,
      'color': Color(0xFFEA580C),
      'description': 'Automobile labs, thermodynamics, CAD/CAM, and design',
    },
    {
      'name': 'Civil Engineering',
      'code': 'CIVIL',
      'icon': Icons.foundation_rounded,
      'color': Color(0xFF10B981),
      'description': 'Structural labs, surveying, geotech, and site inspections',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NoticeProvider>();
    final counts = provider.departmentCounts;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Academic Departments'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(24),
          child: Padding(
            padding: const EdgeInsets.only(left: 16, bottom: 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Select a department to view filtered notices',
                style: TextStyle(
                  fontSize: 12,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: departmentMetadata.length,
        itemBuilder: (context, index) {
          final dept = departmentMetadata[index];
          final String deptName = dept['name'] as String;
          final String deptCode = dept['code'] as String;
          final IconData icon = dept['icon'] as IconData;
          final Color accentColor = dept['color'] as Color;
          final String desc = dept['description'] as String;

          final int count = counts[deptName] ?? 0;

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () {
                // Set department filter and navigate to Home
                provider.setDepartmentFilter(deptName);
                if (onNavigateToHome != null) {
                  onNavigateToHome!(0); // Switch to Home tab
                } else {
                  Navigator.pop(context);
                }
              },
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    // Department Icon Container
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: accentColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(icon, color: accentColor, size: 26),
                    ),
                    const SizedBox(width: 16),

                    // Department Name and Description
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                deptCode,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: accentColor,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            deptName,
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            desc,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                              fontSize: 11,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 12),

                    // Notice Count Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: count > 0
                            ? theme.colorScheme.primaryContainer
                            : theme.colorScheme.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$count',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: count > 0
                              ? theme.colorScheme.primary
                              : theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.chevron_right_rounded,
                      color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
