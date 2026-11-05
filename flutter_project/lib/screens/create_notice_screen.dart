import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/notice.dart';
import '../providers/notice_provider.dart';
import '../utils/validators.dart';

class CreateNoticeScreen extends StatefulWidget {
  const CreateNoticeScreen({super.key});

  @override
  State<CreateNoticeScreen> createState() => _CreateNoticeScreenState();
}

class _CreateNoticeScreenState extends State<CreateNoticeScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _publisherController = TextEditingController();

  String? _selectedDepartment;
  String? _selectedCategory;
  String _selectedPriority = 'Medium';
  DateTime? _selectedExpiryDate;

  bool _isSubmitting = false;

  final List<String> _departments = [
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering',
    'General / All Departments',
  ];

  final List<String> _categories = [
    'Academic',
    'Examination',
    'Placement & Training',
    'Sports & Cultural',
    'Administrative',
    'Hostel & Transport',
  ];

  final List<String> _priorities = ['Low', 'Medium', 'High'];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _publisherController.dispose();
    super.dispose();
  }

  Future<void> _pickExpiryDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedExpiryDate ?? now.add(const Duration(days: 7)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _selectedExpiryDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    // Validate form
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_isSubmitting) return; // Prevent double submit

    setState(() {
      _isSubmitting = true;
    });

    final newNotice = Notice(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      department: _selectedDepartment!,
      category: _selectedCategory!,
      priority: _selectedPriority,
      expiryDate: _selectedExpiryDate,
      publisherName: _publisherController.text.trim(),
      publishedDate: DateTime.now(),
    );

    final provider = context.read<NoticeProvider>();
    final success = await provider.addNotice(newNotice);

    if (mounted) {
      setState(() {
        _isSubmitting = false;
      });

      if (success) {
        // Clear form
        _formKey.currentState?.reset();
        _titleController.clear();
        _descriptionController.clear();
        _publisherController.clear();
        _selectedDepartment = null;
        _selectedCategory = null;
        _selectedPriority = 'Medium';
        _selectedExpiryDate = null;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                SizedBox(width: 10),
                Text('Notice published successfully!'),
              ],
            ),
            backgroundColor: Color(0xFF0A2540),
            behavior: SnackBarBehavior.floating,
          ),
        );

        // Navigate back to notice list
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Failed to save notice.'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New Notice'),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            children: [
              // Notice Title
              Text(
                'Notice Title *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                validator: Validators.validateTitle,
                maxLength: 120,
                textCapitalization: TextCapitalization.sentences,
                decoration: const InputDecoration(
                  hintText: 'e.g., End Semester Examination Schedule - Autumn 2026',
                  prefixIcon: Icon(Icons.title_rounded),
                ),
              ),
              const SizedBox(height: 16),

              // Department Dropdown
              Text(
                'Department *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedDepartment,
                validator: Validators.validateDepartment,
                isExpanded: true,
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.apartment_rounded),
                  hintText: 'Select Target Department',
                ),
                items: _departments.map((dept) {
                  return DropdownMenuItem(
                    value: dept,
                    child: Text(
                      dept,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 14),
                    ),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedDepartment = val;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Category Dropdown
              Text(
                'Notice Category *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                validator: Validators.validateCategory,
                isExpanded: true,
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.category_rounded),
                  hintText: 'Select Notice Category',
                ),
                items: _categories.map((cat) {
                  return DropdownMenuItem(
                    value: cat,
                    child: Text(cat, style: const TextStyle(fontSize: 14)),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedCategory = val;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Priority Selection
              Text(
                'Priority Level *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: _priorities.map((p) {
                  final isSelected = _selectedPriority == p;
                  Color color;
                  if (p == 'High') color = const Color(0xFFDC2626);
                  else if (p == 'Medium') color = const Color(0xFFD97706);
                  else color = const Color(0xFF059669);

                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: ChoiceChip(
                        label: Text(p),
                        selected: isSelected,
                        selectedColor: color.withOpacity(0.2),
                        avatar: Icon(
                          Icons.flag_rounded,
                          size: 16,
                          color: isSelected ? color : Colors.grey,
                        ),
                        labelStyle: TextStyle(
                          color: isSelected ? color : theme.colorScheme.onSurface,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                        side: BorderSide(
                          color: isSelected ? color : Colors.grey.shade300,
                          width: isSelected ? 1.5 : 1,
                        ),
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              _selectedPriority = p;
                            });
                          }
                        },
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Expiry Date (Optional)
              Text(
                'Notice Expiry Date (Optional)',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              InkWell(
                onTap: _pickExpiryDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today_rounded, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _selectedExpiryDate != null
                              ? DateFormat('EEE, MMM dd, yyyy').format(_selectedExpiryDate!)
                              : 'Select expiry date (e.g., event/deadline date)',
                          style: TextStyle(
                            color: _selectedExpiryDate != null
                                ? theme.colorScheme.onSurface
                                : theme.colorScheme.onSurfaceVariant,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      if (_selectedExpiryDate != null)
                        IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          onPressed: () {
                            setState(() {
                              _selectedExpiryDate = null;
                            });
                          },
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Publisher Name
              Text(
                'Publisher Name / Designation *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: _publisherController,
                validator: Validators.validatePublisherName,
                maxLength: 80,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(
                  hintText: 'e.g., Dr. A. Sharma, Head of Department',
                  prefixIcon: Icon(Icons.person_rounded),
                ),
              ),
              const SizedBox(height: 16),

              // Full Description
              Text(
                'Notice Content / Description *',
                style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descriptionController,
                validator: Validators.validateDescription,
                maxLines: 6,
                maxLength: 2500,
                decoration: const InputDecoration(
                  hintText:
                      'Provide comprehensive information including dates, venue, eligibility, and instructions (minimum 20 characters)...',
                  alignLabelWithHint: true,
                ),
              ),
              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                height: 52,
                child: FilledButton.icon(
                  onPressed: _isSubmitting ? null : _submitForm,
                  icon: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.publish_rounded),
                  label: Text(
                    _isSubmitting ? 'Publishing Notice...' : 'Publish College Notice',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
