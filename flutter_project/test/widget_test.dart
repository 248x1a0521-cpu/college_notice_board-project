import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:campus_connect/models/notice.dart';
import 'package:campus_connect/providers/notice_provider.dart';
import 'package:campus_connect/services/storage_service.dart';
import 'package:campus_connect/screens/home_screen.dart';
import 'package:campus_connect/screens/create_notice_screen.dart';
import 'package:campus_connect/theme/app_theme.dart';

/// Mock StorageService for in-memory widget testing without platform channel dependency
class MockStorageService extends StorageService {
  final List<Notice> _mockStore = [];

  @override
  Future<List<Notice>> loadNotices() async {
    return List.from(_mockStore);
  }

  @override
  Future<bool> saveNotices(List<Notice> notices) async {
    _mockStore.clear();
    _mockStore.addAll(notices);
    return true;
  }

  @override
  Future<bool> clearAllNotices() async {
    _mockStore.clear();
    return true;
  }
}

void main() {
  group('CampusConnect Widget Tests', () {
    late MockStorageService mockStorage;
    late NoticeProvider noticeProvider;

    setUp(() {
      mockStorage = MockStorageService();
      noticeProvider = NoticeProvider(storageService: mockStorage);
    });

    testWidgets('1. HomeScreen displays empty state when there are no notices',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        ChangeNotifierProvider<NoticeProvider>.value(
          value: noticeProvider,
          child: MaterialApp(
            theme: AppTheme.lightTheme,
            home: const HomeScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify the empty state illustration and text are displayed
      expect(find.text('No notices available'), findsOneWidget);
      expect(find.text('Create First Notice'), findsOneWidget);
      expect(find.text('Total: 0 notices'), findsOneWidget);
    });

    testWidgets('2. CreateNoticeScreen displays validation errors for invalid input',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        ChangeNotifierProvider<NoticeProvider>.value(
          value: noticeProvider,
          child: MaterialApp(
            theme: AppTheme.lightTheme,
            home: const CreateNoticeScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap the publish button without filling fields
      final submitButton = find.text('Publish College Notice');
      expect(submitButton, findsOneWidget);
      await tester.ensureVisible(submitButton);
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify validation error messages
      expect(find.text('Notice title is required'), findsOneWidget);
      expect(find.text('Please select a valid department'), findsOneWidget);
      expect(find.text('Please select a notice category'), findsOneWidget);
      expect(find.text('Publisher name or designation is required'), findsOneWidget);
      expect(find.text('Notice description is required'), findsOneWidget);
    });

    testWidgets('3. Adding a notice updates NoticeProvider and HomeScreen list',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        ChangeNotifierProvider<NoticeProvider>.value(
          value: noticeProvider,
          child: MaterialApp(
            theme: AppTheme.lightTheme,
            home: const HomeScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Initially empty
      expect(find.text('No notices available'), findsOneWidget);

      // Add a notice programmatically via provider
      final testNotice = Notice(
        id: 'test-uuid-1',
        title: 'Campus Hackathon 2026 Registration Open',
        description:
            'Annual inter-college coding marathon with prizes over 50,000 INR. Register before Friday at student portal.',
        department: 'Computer Science and Engineering (CSE)',
        category: 'Academic',
        priority: 'High',
        publisherName: 'CSE Department Head',
        publishedDate: DateTime.now(),
      );

      await noticeProvider.addNotice(testNotice);
      await tester.pumpAndSettle();

      // Verify notice card appears and empty state disappears
      expect(find.text('No notices available'), findsNothing);
      expect(find.text('Campus Hackathon 2026 Registration Open'), findsOneWidget);
      expect(find.text('HIGH'), findsOneWidget);
      expect(find.text('Total: 1 notice'), findsOneWidget);
    });
  });
}
