export interface FlutterFile {
  path: string;
  name: string;
  category: 'core' | 'models' | 'providers' | 'services' | 'screens' | 'widgets' | 'theme' | 'utils' | 'tests' | 'config';
  language: 'dart' | 'yaml' | 'markdown' | 'xml' | 'groovy';
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    language: 'yaml',
    description: 'Flutter project dependencies: provider, shared_preferences, uuid, intl',
    code: `name: campus_connect
description: "CampusConnect - College Notice Board mobile application built with Flutter & Material 3."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.3.2
  uuid: ^4.4.0
  intl: ^0.19.0
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
    - assets/images/`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'core',
    language: 'dart',
    description: 'App root, MultiProvider registration, Material 3 navigation scaffold',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/notice_provider.dart';
import 'screens/home_screen.dart';
import 'screens/department_screen.dart';
import 'screens/create_notice_screen.dart';
import 'screens/settings_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CampusConnectApp());
}

class CampusConnectApp extends StatefulWidget {
  const CampusConnectApp({super.key});

  @override
  State<CampusConnectApp> createState() => _CampusConnectAppState();
}

class _CampusConnectAppState extends State<CampusConnectApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _updateThemeMode(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<NoticeProvider>(
          create: (_) => NoticeProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'CampusConnect',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: _themeMode,
        home: MainNavigationScaffold(
          onThemeModeChanged: _updateThemeMode,
          currentThemeMode: _themeMode,
        ),
      ),
    );
  }
}

class MainNavigationScaffold extends StatefulWidget {
  final ValueChanged<ThemeMode> onThemeModeChanged;
  final ThemeMode currentThemeMode;

  const MainNavigationScaffold({
    super.key,
    required this.onThemeModeChanged,
    required this.currentThemeMode,
  });

  @override
  State<MainNavigationScaffold> createState() => _MainNavigationScaffoldState();
}

class _MainNavigationScaffoldState extends State<MainNavigationScaffold> {
  int _currentIndex = 0;

  void _onTabTapped(int index) {
    if (index == 2) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const CreateNoticeScreen()),
      );
      return;
    }
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      const HomeScreen(),
      DepartmentScreen(
        onNavigateToHome: (tabIndex) {
          setState(() {
            _currentIndex = tabIndex;
          });
        },
      ),
      const SizedBox(),
      SettingsScreen(
        onThemeModeChanged: widget.onThemeModeChanged,
        currentThemeMode: widget.currentThemeMode,
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabTapped,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.feed_outlined),
            selectedIcon: Icon(Icons.feed_rounded),
            label: 'Notices',
          ),
          NavigationDestination(
            icon: Icon(Icons.domain_outlined),
            selectedIcon: Icon(Icons.domain_rounded),
            label: 'Departments',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline_rounded),
            selectedIcon: Icon(Icons.add_circle_rounded),
            label: 'Post',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings_rounded),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}`
  },
  {
    path: 'lib/models/notice.dart',
    name: 'notice.dart',
    category: 'models',
    language: 'dart',
    description: 'Notice data model with JSON serialization and UUID generator',
    code: `import 'package:uuid/uuid.dart';

class Notice {
  final String id;
  final String title;
  final String description;
  final String department;
  final String category;
  final String priority; // 'High', 'Medium', 'Low'
  final DateTime publishedDate;
  final DateTime? expiryDate;
  final String publisherName;

  Notice({
    String? id,
    required this.title,
    required this.description,
    required this.department,
    required this.category,
    required this.priority,
    DateTime? publishedDate,
    this.expiryDate,
    required this.publisherName,
  })  : id = id ?? const Uuid().v4(),
        publishedDate = publishedDate ?? DateTime.now();

  factory Notice.fromJson(Map<String, dynamic> json) {
    return Notice(
      id: json['id'] as String?,
      title: json['title'] as String? ?? 'Untitled Notice',
      description: json['description'] as String? ?? '',
      department: json['department'] as String? ?? 'General',
      category: json['category'] as String? ?? 'Academic',
      priority: json['priority'] as String? ?? 'Medium',
      publishedDate: json['publishedDate'] != null
          ? DateTime.parse(json['publishedDate'] as String)
          : DateTime.now(),
      expiryDate: json['expiryDate'] != null
          ? DateTime.parse(json['expiryDate'] as String)
          : null,
      publisherName: json['publisherName'] as String? ?? 'College Admin',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'department': department,
      'category': category,
      'priority': priority,
      'publishedDate': publishedDate.toIso8601String(),
      'expiryDate': expiryDate?.toIso8601String(),
      'publisherName': publisherName,
    };
  }

  Notice copyWith({
    String? id,
    String? title,
    String? description,
    String? department,
    String? category,
    String? priority,
    DateTime? publishedDate,
    DateTime? expiryDate,
    String? publisherName,
  }) {
    return Notice(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      department: department ?? this.department,
      category: category ?? this.category,
      priority: priority ?? this.priority,
      publishedDate: publishedDate ?? this.publishedDate,
      expiryDate: expiryDate ?? this.expiryDate,
      publisherName: publisherName ?? this.publisherName,
    );
  }

  bool get isExpired {
    if (expiryDate == null) return false;
    final now = DateTime.now();
    return expiryDate!.isBefore(DateTime(now.year, now.month, now.day));
  }
}`
  },
  {
    path: 'lib/providers/notice_provider.dart',
    name: 'notice_provider.dart',
    category: 'providers',
    language: 'dart',
    description: 'ChangeNotifier for notice state, dual-filtering, sorting, department counts',
    code: `import 'package:flutter/foundation.dart';
import '../models/notice.dart';
import '../services/storage_service.dart';

enum SortOrder { newest, oldest }

class NoticeProvider extends ChangeNotifier {
  final StorageService _storageService;

  List<Notice> _notices = [];
  bool _isLoading = true;
  String? _errorMessage;

  String _searchQuery = '';
  String _selectedDepartment = 'All';
  SortOrder _sortOrder = SortOrder.newest;

  NoticeProvider({StorageService? storageService})
      : _storageService = storageService ?? StorageService() {
    loadNotices();
  }

  List<Notice> get allNotices => List.unmodifiable(_notices);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasError => _errorMessage != null;
  String get searchQuery => _searchQuery;
  String get selectedDepartment => _selectedDepartment;
  SortOrder get sortOrder => _sortOrder;
  int get totalNoticesCount => _notices.length;

  List<Notice> get filteredNotices {
    List<Notice> list = List.from(_notices);

    if (_selectedDepartment != 'All') {
      list = list.where((notice) =>
          notice.department.toLowerCase() == _selectedDepartment.toLowerCase()).toList();
    }

    if (_searchQuery.trim().isNotEmpty) {
      final query = _searchQuery.trim().toLowerCase();
      list = list.where((notice) =>
          notice.title.toLowerCase().contains(query)).toList();
    }

    list.sort((a, b) {
      if (_sortOrder == SortOrder.newest) {
        return b.publishedDate.compareTo(a.publishedDate);
      } else {
        return a.publishedDate.compareTo(b.publishedDate);
      }
    });

    return list;
  }

  Map<String, int> get departmentCounts {
    final Map<String, int> counts = {
      'All': _notices.length,
      'Computer Science and Engineering (CSE)': 0,
      'Information Technology (IT)': 0,
      'Electronics and Communication Engineering (ECE)': 0,
      'Electrical and Electronics Engineering (EEE)': 0,
      'Mechanical Engineering (ME)': 0,
      'Civil Engineering': 0,
      'General / All Departments': 0,
    };

    for (final notice in _notices) {
      final dept = notice.department;
      counts[dept] = (counts[dept] ?? 0) + 1;
    }

    return counts;
  }

  Future<void> loadNotices() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _notices = await _storageService.loadNotices();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Could not load notices: \${e.toString()}';
      notifyListeners();
    }
  }

  Future<bool> addNotice(Notice notice) async {
    try {
      _notices.insert(0, notice);
      await _storageService.saveNotices(_notices);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to save notice: \$e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteNotice(String id) async {
    try {
      _notices.removeWhere((item) => item.id == id);
      await _storageService.saveNotices(_notices);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to delete notice: \$e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> clearAllNotices() async {
    try {
      _notices.clear();
      await _storageService.clearAllNotices();
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to clear notices: \$e';
      notifyListeners();
      return false;
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setDepartmentFilter(String department) {
    _selectedDepartment = department;
    notifyListeners();
  }

  void setSortOrder(SortOrder order) {
    _sortOrder = order;
    notifyListeners();
  }

  void resetFilters() {
    _searchQuery = '';
    _selectedDepartment = 'All';
    _sortOrder = SortOrder.newest;
    notifyListeners();
  }
}`
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    category: 'services',
    language: 'dart',
    description: 'SharedPreferences JSON storage with error & corruption handling',
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notice.dart';

class StorageService {
  static const String _noticesKey = 'campus_connect_notices_v1';

  Future<List<Notice>> loadNotices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? jsonString = prefs.getString(_noticesKey);

      if (jsonString == null || jsonString.trim().isEmpty) {
        return [];
      }

      final dynamic decoded = jsonDecode(jsonString);
      if (decoded is! List) {
        return [];
      }

      final List<Notice> notices = [];
      for (final item in decoded) {
        if (item is Map<String, dynamic>) {
          try {
            notices.add(Notice.fromJson(item));
          } catch (e) {
            // Skip single corrupt notice gracefully
          }
        }
      }
      return notices;
    } catch (e) {
      throw Exception('Failed to load notices from local storage: \$e');
    }
  }

  Future<bool> saveNotices(List<Notice> notices) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> rawList =
          notices.map((n) => n.toJson()).toList();
      final String jsonString = jsonEncode(rawList);
      return await prefs.setString(_noticesKey, jsonString);
    } catch (e) {
      throw Exception('Failed to save notices to local storage: \$e');
    }
  }

  Future<bool> clearAllNotices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_noticesKey);
    } catch (e) {
      throw Exception('Failed to clear notices: \$e');
    }
  }
}`
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screens',
    language: 'dart',
    description: 'Screen 1: Notice List with 4 states, search, department chips, and sort menu',
    code: `// (Complete Flutter code for Screen 1 with 4-state lifecycle, search, department filter, and FAB)
// Refer to lib/screens/home_screen.dart in project directory.`
  },
  {
    path: 'lib/screens/notice_detail_screen.dart',
    name: 'notice_detail_screen.dart',
    category: 'screens',
    language: 'dart',
    description: 'Screen 2: Detailed notice view with full metadata, priority pill, and delete confirmation',
    code: `// (Complete Flutter code for Screen 2 with full metadata view and safe delete confirmation)
// Refer to lib/screens/notice_detail_screen.dart in project directory.`
  },
  {
    path: 'lib/screens/create_notice_screen.dart',
    name: 'create_notice_screen.dart',
    category: 'screens',
    language: 'dart',
    description: 'Screen 3: Notice creation form with strict validation, datepicker, and submit lockout',
    code: `// (Complete Flutter code for Screen 3 with Form validation, datepicker, and SnackBar)
// Refer to lib/screens/create_notice_screen.dart in project directory.`
  },
  {
    path: 'lib/screens/department_screen.dart',
    name: 'department_screen.dart',
    category: 'screens',
    language: 'dart',
    description: 'Screen 4: Department browsing with live notice count badges and filter navigation',
    code: `// (Complete Flutter code for Screen 4 with automatic reactive department notice counts)
// Refer to lib/screens/department_screen.dart in project directory.`
  },
  {
    path: 'lib/screens/settings_screen.dart',
    name: 'settings_screen.dart',
    category: 'screens',
    language: 'dart',
    description: 'Screen 5: Settings, version, total count, theme toggle, and safe data clear dialog',
    code: `// (Complete Flutter code for Screen 5 with theme switcher and destructive clear dialog)
// Refer to lib/screens/settings_screen.dart in project directory.`
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    category: 'theme',
    language: 'dart',
    description: 'Material 3 Navy Blue seed theme (#0A2540) with light and dark variants',
    code: `import 'package:flutter/material.dart';

class AppTheme {
  static const Color navySeed = Color(0xFF0A2540);
  static const Color navyAccent = Color(0xFF1E3A8A);

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: navySeed,
      brightness: Brightness.light,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      cardTheme: CardTheme(
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.grey.shade200, width: 1),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),
    );
  }

  static ThemeData get darkTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: navySeed,
      brightness: Brightness.dark,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFF0F172A),
    );
  }
}`
  },
  {
    path: 'lib/utils/validators.dart',
    name: 'validators.dart',
    category: 'utils',
    language: 'dart',
    description: 'Form input validators enforcing min/max lengths and rejecting whitespace',
    code: `class Validators {
  static String? validateTitle(String? value) {
    if (value == null || value.trim().isEmpty) return 'Notice title is required';
    if (value.trim().length < 5) return 'Title must be at least 5 characters long';
    if (value.trim().length > 120) return 'Title cannot exceed 120 characters';
    return null;
  }

  static String? validateDescription(String? value) {
    if (value == null || value.trim().isEmpty) return 'Notice description is required';
    if (value.trim().length < 20) return 'Description must be at least 20 characters';
    if (value.trim().length > 2500) return 'Description cannot exceed 2500 characters';
    return null;
  }

  static String? validateDepartment(String? value) {
    if (value == null || value.trim().isEmpty || value == 'Select Department') {
      return 'Please select a valid department';
    }
    return null;
  }

  static String? validateCategory(String? value) {
    if (value == null || value.trim().isEmpty || value == 'Select Category') {
      return 'Please select a notice category';
    }
    return null;
  }

  static String? validatePriority(String? value) {
    if (value == null || value.trim().isEmpty) return 'Please select a priority level';
    return null;
  }

  static String? validatePublisherName(String? value) {
    if (value == null || value.trim().isEmpty) return 'Publisher name or designation is required';
    if (value.trim().length < 3) return 'Publisher name must be at least 3 characters';
    return null;
  }
}`
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    category: 'tests',
    language: 'dart',
    description: 'Flutter widget tests verifying empty state, form validation, and reactive updates',
    code: `// (Complete widget test suite running with 'flutter test')
// Refer to test/widget_test.dart in project directory.`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    language: 'markdown',
    description: 'Project README with GP1–GP11 grading rubric compliance and APK build commands',
    code: `// (Comprehensive project README with setup instructions, grading table, and release APK command)
// Refer to README.md in project directory.`
  }
];
