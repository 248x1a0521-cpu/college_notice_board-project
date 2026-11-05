import 'package:flutter/foundation.dart';
import '../models/notice.dart';
import '../services/storage_service.dart';

enum SortOrder { newest, oldest }

class NoticeProvider extends ChangeNotifier {
  final StorageService _storageService;

  List<Notice> _notices = [];
  bool _isLoading = true;
  String? _errorMessage;

  // Search, filter & sort state
  String _searchQuery = '';
  String _selectedDepartment = 'All'; // 'All' or specific department
  SortOrder _sortOrder = SortOrder.newest;

  NoticeProvider({StorageService? storageService})
      : _storageService = storageService ?? StorageService() {
    loadNotices();
  }

  // Getters
  List<Notice> get allNotices => List.unmodifiable(_notices);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasError => _errorMessage != null;

  String get searchQuery => _searchQuery;
  String get selectedDepartment => _selectedDepartment;
  SortOrder get sortOrder => _sortOrder;

  int get totalNoticesCount => _notices.length;

  /// Returns filtered and sorted notices based on both search query and department filter
  List<Notice> get filteredNotices {
    List<Notice> list = List.from(_notices);

    // 1. Department filter
    if (_selectedDepartment != 'All') {
      list = list.where((notice) =>
          notice.department.toLowerCase() == _selectedDepartment.toLowerCase()).toList();
    }

    // 2. Search filter by title
    if (_searchQuery.trim().isNotEmpty) {
      final query = _searchQuery.trim().toLowerCase();
      list = list.where((notice) =>
          notice.title.toLowerCase().contains(query)).toList();
    }

    // 3. Sorting by publishedDate
    list.sort((a, b) {
      if (_sortOrder == SortOrder.newest) {
        return b.publishedDate.compareTo(a.publishedDate);
      } else {
        return a.publishedDate.compareTo(b.publishedDate);
      }
    });

    return list;
  }

  /// Calculates department-wise notice counts dynamically.
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
      // Match exact or normalized department
      if (counts.containsKey(dept)) {
        counts[dept] = (counts[dept] ?? 0) + 1;
      } else {
        // Fallback or add dynamically
        counts[dept] = (counts[dept] ?? 0) + 1;
      }
    }

    return counts;
  }

  /// Load notices from storage service
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
      _errorMessage = 'Could not load notices: ${e.toString()}';
      notifyListeners();
    }
  }

  /// Add a notice and persist immediately
  Future<bool> addNotice(Notice notice) async {
    try {
      _notices.insert(0, notice);
      await _storageService.saveNotices(_notices);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to save notice: $e';
      notifyListeners();
      return false;
    }
  }

  /// Delete a notice and persist immediately
  Future<bool> deleteNotice(String id) async {
    try {
      _notices.removeWhere((item) => item.id == id);
      await _storageService.saveNotices(_notices);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to delete notice: $e';
      notifyListeners();
      return false;
    }
  }

  /// Clear all notices (with confirmation action in UI)
  Future<bool> clearAllNotices() async {
    try {
      _notices.clear();
      await _storageService.clearAllNotices();
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to clear notices: $e';
      notifyListeners();
      return false;
    }
  }

  /// Update search query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Update selected department filter
  void setDepartmentFilter(String department) {
    _selectedDepartment = department;
    notifyListeners();
  }

  /// Toggle or set sort order
  void setSortOrder(SortOrder order) {
    _sortOrder = order;
    notifyListeners();
  }

  /// Reset all filters
  void resetFilters() {
    _searchQuery = '';
    _selectedDepartment = 'All';
    _sortOrder = SortOrder.newest;
    notifyListeners();
  }
}
