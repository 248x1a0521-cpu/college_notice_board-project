import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notice.dart';

class StorageService {
  static const String _noticesKey = 'campus_connect_notices_v1';

  /// Fetch all stored notices from SharedPreferences.
  /// Handles corrupted JSON, null data, and parsing exceptions safely.
  Future<List<Notice>> loadNotices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? jsonString = prefs.getString(_noticesKey);

      if (jsonString == null || jsonString.trim().isEmpty) {
        return [];
      }

      final dynamic decoded = jsonDecode(jsonString);
      if (decoded is! List) {
        // If data is corrupted or invalid structure, return empty list safely
        return [];
      }

      final List<Notice> notices = [];
      for (final item in decoded) {
        if (item is Map<String, dynamic>) {
          try {
            notices.add(Notice.fromJson(item));
          } catch (e) {
            // Skip invalid single items without crashing whole list
          }
        }
      }
      return notices;
    } catch (e) {
      throw Exception('Failed to load notices from local storage: $e');
    }
  }

  /// Persist notices list to SharedPreferences as JSON string.
  Future<bool> saveNotices(List<Notice> notices) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> rawList =
          notices.map((n) => n.toJson()).toList();
      final String jsonString = jsonEncode(rawList);
      return await prefs.setString(_noticesKey, jsonString);
    } catch (e) {
      throw Exception('Failed to save notices to local storage: $e');
    }
  }

  /// Clear all stored notices.
  Future<bool> clearAllNotices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_noticesKey);
    } catch (e) {
      throw Exception('Failed to clear notices: $e');
    }
  }
}
