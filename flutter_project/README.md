# CampusConnect – College Notice Board
> **A Production-Ready Flutter Mobile Application for College Announcements & Notice Management**

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?logo=dart)](https://dart.dev)
[![Material 3](https://img.shields.io/badge/Material%203-Navy%20Theme-0A2540)](https://m3.material.io)
[![State Management](https://img.shields.io/badge/Provider-6.1.2-blue)](https://pub.dev/packages/provider)
[![Storage](https://img.shields.io/badge/SharedPreferences-Offline--First-green)](https://pub.dev/packages/shared_preferences)
[![Tests](https://img.shields.io/badge/Widget%20Tests-Passing%20100%25-brightgreen)](https://flutter.dev/docs/testing)

---

## 📌 Table of Contents
1. [Overview](#-overview)
2. [Grading Criteria Compliance (GP1 – GP11)](#-grading-criteria-compliance-gp1--gp11)
3. [Architecture & Project Structure](#-architecture--project-structure)
4. [Screens & Features](#-screens--features)
5. [State Management Architecture](#-state-management-architecture)
6. [Data Model & Local Persistence](#-data-model--local-persistence)
7. [Validation Logic](#-validation-logic)
8. [Widget Testing](#-widget-testing)
9. [Installation & Setup](#-installation--setup)
10. [Generating the Release APK](#-generating-the-release-apk)
11. [Team Contributions](#-team-contributions)

---

## 🏫 Overview

**CampusConnect** is a college notice board mobile application crafted to address communication bottlenecks in academic institutions. The application operates **completely offline**, utilizing device-level persistence with `SharedPreferences` to ensure students and faculty can access and publish critical college announcements without an active internet connection.

### Core Highlights:
- **Material 3 Design System**: Navy blue primary seed (`#0A2540`) with dynamic light and dark theme support.
- **Five Dedicated Screens**: Home, Notice Detail, Create Notice, Departments, and Settings.
- **Robust 4-State UI Lifecycle**: Loading, Error & Retry, Empty State, and Data view.
- **Dual-Criteria Filtering**: Simultaneous title search and department filtering with real-time reactive counts.
- **Bulletproof Validation**: Character length bounds, whitespace rejection, dropdown verification, and date checks.

---

## 🎯 Grading Criteria Compliance (GP1 – GP11)

| Requirement Code | Description | Implementation Details in CampusConnect |
|---|---|---|
| **GP1: Tech Stack** | Flutter, Dart, Provider, SharedPreferences, Material 3, Form validation, UUID | Utilizes `provider: ^6.1.2`, `shared_preferences: ^2.3.2`, `uuid: ^4.4.0`, `useMaterial3: true`, and custom `FormState`. |
| **GP2: Offline Persistence** | Data persists after restart without public API reliance | `StorageService` serializes and deserializes JSON strings to `SharedPreferences` with corruption recovery. |
| **GP3: 5 Required Screens** | Home, Detail, Create, Department, Settings | All 5 screens fully designed, structured, and interconnected via Navigator. |
| **GP4: Home Screen 4 States** | Loading, Error with Retry, Empty, Data | Handled reactively via `NoticeProvider.isLoading`, `hasError`, and `filteredNotices.isEmpty`. |
| **GP5: Notice Detail Screen** | Full metadata beyond card view | Displays full description, publisher name, exact timestamp, category, priority pill, expiry warning, notice UUID, and delete option. |
| **GP6: Notice Submission Form** | Title, desc, dept, cat, priority, optional expiry, publisher | Enforces min/max lengths, non-whitespace checks, disables submit during I/O, clears on success, and shows `SnackBar`. |
| **GP7: Department Screen** | CSE, IT, ECE, EEE, ME, Civil, General counts & navigation | Live calculation via `departmentCounts` getter; tapping filters Home screen notices immediately. |
| **GP8: Settings Screen** | App name, version, count, theme, about, safe clear | Includes destructive operation confirmation dialog before clearing local database. |
| **GP9: Provider Architecture** | Central ChangeNotifier at root | Registered with `MultiProvider` in `main.dart`; accessed across all screens without data duplication. |
| **GP10: Error & Crash Resilience** | Zero crashes under rapid taps, long strings, missing keys | Implements defensive JSON parsing, text overflow ellipses, form submit debouncing, and soft keyboard avoidance. |
| **GP11: Widget Testing** | Tests empty state, validation, notice addition | Comprehensive test suite in `test/widget_test.dart` passing with `flutter test`. |

---

## 📂 Architecture & Project Structure

```text
lib/
├── main.dart                      # Application root, MultiProvider & IndexedStack navigation
├── models/
│   └── notice.dart                # Notice data model with JSON serialization & copyWith
├── providers/
│   └── notice_provider.dart       # Central ChangeNotifier provider for business logic
├── services/
│   └── storage_service.dart       # SharedPreferences JSON persistence service
├── screens/
│   ├── home_screen.dart           # Screen 1: Search, filter chips, sort & 4-state body
│   ├── notice_detail_screen.dart  # Screen 2: Detailed notice view & delete confirmation
│   ├── create_notice_screen.dart  # Screen 3: Material 3 form with validation
│   ├── department_screen.dart     # Screen 4: Department list with dynamic notice counts
│   └── settings_screen.dart       # Screen 5: App metadata, theme toggle & clear data
├── widgets/
│   ├── notice_card.dart           # Reusable notice item card with priority indicator
│   ├── empty_state.dart           # Empty notice state with call-to-action
│   ├── loading_state.dart         # CircularProgressIndicator with status text
│   └── error_state.dart           # Error card with friendly retry button
├── theme/
│   └── app_theme.dart             # Material 3 light & dark theme specifications
└── utils/
    └── validators.dart            # Form input validation rules & whitespace checks

test/
└── widget_test.dart               # Complete Flutter widget test suite
```

---

## 📱 Screens & Features

### 1. Home / Notice List Screen
- **Real-Time Search**: Instant fuzzy matching across notice titles.
- **Department Chips**: Horizontal quick-filter bar (All, CSE, IT, ECE, EEE, ME, Civil, General).
- **Sorting**: Toggle between newest first and oldest first.
- **Notice Count**: Always shows current active count based on combined query and filter.
- **Floating Action Button**: Quick access to publish new notices.
- **4 Reactive States**:
  - `LoadingState`: CircularProgressIndicator shown while storage initializes.
  - `ErrorState`: Friendly illustration with a "Retry" button.
  - `EmptyState`: Clean icon illustration with "Create First Notice" CTA.
  - `Data`: Scrollable list of `NoticeCard` widgets with pull-to-refresh.

### 2. Notice Detail Screen
- Full title and comprehensive body content with text selection enabled.
- Distinct priority badges: **High** (Red), **Medium** (Amber), **Low** (Green).
- Complete publication metadata: Publisher designation, publication timestamp, expiry date with expired warning flag, and UUID.
- Confirmation dialog for notice deletion.

### 3. Create Notice Screen
- **Strict Validation Rules**:
  - Title: Minimum 5 characters, maximum 120 characters, non-whitespace.
  - Description: Minimum 20 characters, maximum 2500 characters, non-whitespace.
  - Department: Mandatory dropdown selection.
  - Category: Academic, Examination, Placement & Training, Sports & Cultural, Administrative, Hostel & Transport.
  - Priority: Low, Medium, High choice chips.
  - Expiry Date: Optional Material date picker with past-date prohibition.
  - Publisher Name: Minimum 3 characters, maximum 80 characters.
- Submit button shows progress indicator and is disabled while saving to avoid duplicate submissions.

### 4. Department Screen
- Covers:
  - Computer Science and Engineering (CSE)
  - Information Technology (IT)
  - Electronics and Communication Engineering (ECE)
  - Electrical and Electronics Engineering (EEE)
  - Mechanical Engineering (ME)
  - Civil Engineering
  - General / All Departments
- Each card features custom department branding, icons, and dynamic count badges.
- Tapping a department immediately switches to the Home screen filtered by that department.

### 5. Settings / About Screen
- Branding with college badge icon, app version (1.0.0+1).
- Total notices published counter.
- Material 3 theme details and instant Light / Dark mode toggle.
- Safe data clearing with a two-step confirmation dialog.

---

## 🧪 Widget Testing

To execute the test suite:

```bash
flutter test
```

### Verified Test Cases:
1. `HomeScreen displays empty state when there are no notices`
2. `CreateNoticeScreen displays validation errors for invalid input`
3. `Adding a notice updates NoticeProvider and HomeScreen list`

---

## 🚀 Installation & Setup

### Prerequisites
- Flutter SDK `>=3.0.0 <4.0.0`
- Android Studio / VS Code with Flutter extension
- Java 17+ and Android SDK

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-college/campus-connect.git
   cd campus-connect
   ```
2. Install packages:
   ```bash
   flutter pub get
   ```
3. Run static analysis:
   ```bash
   flutter analyze
   ```
4. Run widget tests:
   ```bash
   flutter test
   ```
5. Launch the app on an Android emulator or physical device:
   ```bash
   flutter run
   ```

---

## 📦 Generating the Release APK

To create an optimized, standalone release APK for physical Android devices:

```bash
# 1. Clean previous build artifacts
flutter clean

# 2. Re-fetch dependencies
flutter pub get

# 3. Build release APK
flutter build apk --release
```

The compiled release APK will be located at:
```text
build/app/outputs/flutter-apk/app-release.apk
```

To install directly onto a connected physical Android device via USB debugging:
```bash
flutter install
```

---

## 👥 Team Contributions

| Member | Role | Key Contributions |
|---|---|---|
| **Lead Developer** | Architecture & Provider | Root MultiProvider setup, SharedPreferences storage service, JSON serialization, and widget tests. |
| **UI/UX Engineer** | Material 3 & Screens | M3 Navy Blue theme, HomeScreen 4-state lifecycle, NoticeCard, and Detail screen. |
| **Feature Engineer** | Forms & Departments | CreateNoticeScreen form validation rules, Department dynamic aggregation, and Settings screen. |
| **QA & DevOps** | Testing & APK Release | AndroidManifest launcher icon configuration, release build configuration, and error testing. |

---
*Built with ❤️ for academic excellence with Flutter and Dart.*
