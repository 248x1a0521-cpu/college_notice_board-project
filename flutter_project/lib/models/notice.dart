import 'package:uuid/uuid.dart';

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

  /// Deserialization from JSON map (stored in SharedPreferences)
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

  /// Serialization to JSON map
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

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Notice &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
