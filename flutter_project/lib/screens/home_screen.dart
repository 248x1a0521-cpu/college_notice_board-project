import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../widgets/notice_card.dart';
import '../widgets/empty_state.dart';
import '../widgets/loading_state.dart';
import '../widgets/error_state.dart';
import 'create_notice_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<String> _departments = [
    'All',
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering',
    'General / All Departments',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<NoticeProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.school_rounded,
                color: theme.colorScheme.primary,
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'CampusConnect',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.3,
                  ),
                ),
                Text(
                  'College Notice Board',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Sort Menu
          PopupMenuButton<SortOrder>(
            icon: const Icon(Icons.sort_rounded),
            tooltip: 'Sort notices',
            initialValue: provider.sortOrder,
            onSelected: (order) {
              provider.setSortOrder(order);
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: SortOrder.newest,
                child: Row(
                  children: [
                    Icon(Icons.arrow_downward_rounded, size: 18),
                    SizedBox(width: 8),
                    Text('Newest first'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: SortOrder.oldest,
                child: Row(
                  children: [
                    Icon(Icons.arrow_upward_rounded, size: 18),
                    SizedBox(width: 8),
                    Text('Oldest first'),
                  ],
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Reload notices',
            onPressed: () => provider.loadNotices(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            color: theme.colorScheme.surface,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  onChanged: (value) => provider.setSearchQuery(value),
                  decoration: InputDecoration(
                    hintText: 'Search notices by title...',
                    prefixIcon: const Icon(Icons.search_rounded),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded),
                            onPressed: () {
                              _searchController.clear();
                              provider.setSearchQuery('');
                            },
                          )
                        : null,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                // Department Filter Horizontal Scroll Chips
                SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _departments.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final dept = _departments[index];
                      final isSelected = provider.selectedDepartment == dept;
                      final label = dept == 'All'
                          ? 'All Notices'
                          : dept.contains('(')
                              ? dept.split('(').last.replaceAll(')', '')
                              : dept;

                      return FilterChip(
                        selected: isSelected,
                        label: Text(label),
                        showCheckmark: false,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight:
                              isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSurface,
                        ),
                        selectedColor: theme.colorScheme.primary,
                        backgroundColor: theme.colorScheme.surfaceContainerHighest,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        onSelected: (_) {
                          provider.setDepartmentFilter(dept);
                        },
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
                // Total notices counter & active filter indicator
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Total: ${provider.filteredNotices.length} notice${provider.filteredNotices.length == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    if (provider.searchQuery.isNotEmpty ||
                        provider.selectedDepartment != 'All')
                      GestureDetector(
                        onTap: () {
                          _searchController.clear();
                          provider.resetFilters();
                        },
                        child: Text(
                          'Clear Filters',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Main 4 States: Loading, Error, Empty, Data
          Expanded(
            child: _buildBodyState(context, provider),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const CreateNoticeScreen(),
            ),
          );
        },
        icon: const Icon(Icons.add_rounded),
        label: const Text('Post Notice'),
      ),
    );
  }

  Widget _buildBodyState(BuildContext context, NoticeProvider provider) {
    // 1. Loading state
    if (provider.isLoading) {
      return const LoadingState(message: 'Loading college notices...');
    }

    // 2. Error state
    if (provider.hasError) {
      return ErrorState(
        errorMessage: provider.errorMessage ?? 'An unexpected error occurred.',
        onRetry: () => provider.loadNotices(),
      );
    }

    final notices = provider.filteredNotices;

    // 3. Empty state
    if (notices.isEmpty) {
      if (provider.searchQuery.isNotEmpty || provider.selectedDepartment != 'All') {
        return EmptyState(
          title: 'No matching notices found',
          subtitle:
              'No notices matched "${provider.searchQuery}" in ${provider.selectedDepartment}. Try adjusting your filters.',
          actionLabel: 'Reset All Filters',
          onAction: () {
            _searchController.clear();
            provider.resetFilters();
          },
        );
      }
      return EmptyState(
        title: 'No notices available',
        subtitle:
            'The college notice board is currently empty. Tap below to create and publish the first notice.',
        actionLabel: 'Create First Notice',
        onAction: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const CreateNoticeScreen(),
            ),
          );
        },
      );
    }

    // 4. Data state
    return RefreshIndicator(
      onRefresh: () => provider.loadNotices(),
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 88),
        itemCount: notices.length,
        itemBuilder: (context, index) {
          return NoticeCard(notice: notices[index]);
        },
      ),
    );
  }
}
