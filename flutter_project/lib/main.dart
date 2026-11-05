import 'package:flutter/material.dart';
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
      // Tap "Add Notice" opens the modal/screen with back navigation
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
      const SizedBox(), // Placeholder for center action
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
}
