class Validators {
  /// Validate title (required, min 5 chars, max 120, not whitespace-only)
  static String? validateTitle(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Notice title is required';
    }
    final trimmed = value.trim();
    if (trimmed.length < 5) {
      return 'Title must be at least 5 characters long';
    }
    if (trimmed.length > 120) {
      return 'Title cannot exceed 120 characters';
    }
    return null;
  }

  /// Validate description (required, min 20 chars, max 2000, not whitespace-only)
  static String? validateDescription(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Notice description is required';
    }
    final trimmed = value.trim();
    if (trimmed.length < 20) {
      return 'Description must be at least 20 characters (current: ${trimmed.length})';
    }
    if (trimmed.length > 2500) {
      return 'Description cannot exceed 2500 characters';
    }
    return null;
  }

  /// Validate department selection
  static String? validateDepartment(String? value) {
    if (value == null || value.trim().isEmpty || value == 'Select Department') {
      return 'Please select a valid department';
    }
    return null;
  }

  /// Validate category selection
  static String? validateCategory(String? value) {
    if (value == null || value.trim().isEmpty || value == 'Select Category') {
      return 'Please select a notice category';
    }
    return null;
  }

  /// Validate priority selection
  static String? validatePriority(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please select a priority level';
    }
    const valid = ['High', 'Medium', 'Low'];
    if (!valid.contains(value)) {
      return 'Invalid priority selected';
    }
    return null;
  }

  /// Validate publisher name (required, min 3 chars, max 80, not whitespace-only)
  static String? validatePublisherName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Publisher name or designation is required';
    }
    final trimmed = value.trim();
    if (trimmed.length < 3) {
      return 'Publisher name must be at least 3 characters';
    }
    if (trimmed.length > 80) {
      return 'Publisher name cannot exceed 80 characters';
    }
    return null;
  }

  /// Optional expiry date validation
  static String? validateExpiryDate(DateTime? expiryDate, DateTime publishedDate) {
    if (expiryDate == null) return null;
    final pubDay = DateTime(publishedDate.year, publishedDate.month, publishedDate.day);
    final expDay = DateTime(expiryDate.year, expiryDate.month, expiryDate.day);
    if (expDay.isBefore(pubDay)) {
      return 'Expiry date cannot be earlier than today';
    }
    return null;
  }
}
