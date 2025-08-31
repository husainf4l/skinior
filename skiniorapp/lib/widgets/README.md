# Professional AppBar Widget

A comprehensive, reusable AppBar widget for the Skinior app that provides consistent styling and functionality across all pages.

## Features

- 🎨 **Automatic theme adaptation** - Works seamlessly with light/dark themes
- 🔄 **Theme toggle button** - Animated theme switching
- 👤 **User menu** - Profile, settings, and logout options
- 🔔 **Notifications** - Bell icon with badge count and bottom sheet
- 🖼️ **Logo support** - Automatic logo/text fallback (smaller size: 24px)
- ⬅️ **Navigation** - Back button support
- 🎛️ **Customizable** - Flexible configuration options
- 📱 **Responsive** - Adapts to different screen sizes

## Usage Examples

### Basic Usage (Homepage)
```dart
import '../widgets/professional_app_bar.dart';

Scaffold(
  appBar: const ProfessionalAppBar(
    showLogo: true,
    showNotification: true,
    notificationCount: 2, // Badge shows "2"
    showThemeToggle: true,
    showLogout: true,
    showBack: false,
  ),
  body: YourContent(),
)
```

### Detail Page with Back Button
```dart
Scaffold(
  appBar: const ProfessionalAppBar(
    title: "Profile Settings",
    showLogo: false,
    showBack: true,
    showThemeToggle: true,
    showLogout: false,
  ),
  body: YourContent(),
)
```

### Custom Title Widget
```dart
Scaffold(
  appBar: ProfessionalAppBar(
    titleWidget: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.star),
        SizedBox(width: 8),
        Text("Premium"),
      ],
    ),
    showBack: true,
  ),
  body: YourContent(),
)
```

### With Custom Actions
```dart
Scaffold(
  appBar: ProfessionalAppBar(
    title: "Messages",
    showBack: true,
    actions: [
      IconButton(
        icon: Icon(Icons.search),
        onPressed: () => handleSearch(),
      ),
      IconButton(
        icon: Icon(Icons.more_vert),
        onPressed: () => showMenu(),
      ),
    ],
  ),
  body: YourContent(),
)
```

### Minimal AppBar
```dart
Scaffold(
  appBar: const ProfessionalAppBar(
    title: "About",
    showLogo: false,
    showThemeToggle: false,
    showLogout: false,
    showBack: true,
  ),
  body: YourContent(),
)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | `String?` | `null` | Text title for the AppBar |
| `titleWidget` | `Widget?` | `null` | Custom widget for title (overrides title and logo) |
| `actions` | `List<Widget>?` | `null` | Custom action buttons |
| `showLogo` | `bool` | `true` | Whether to show the Skinior logo (24px height) |
| `showNotification` | `bool` | `true` | Whether to show notification bell |
| `notificationCount` | `int` | `0` | Number of unread notifications (badge) |
| `onNotificationTap` | `VoidCallback?` | `null` | Custom notification handler |
| `showThemeToggle` | `bool` | `true` | Whether to show theme toggle button |
| `showBack` | `bool` | `false` | Whether to show back button |
| `showLogout` | `bool` | `true` | Whether to show user menu with logout |
| `onBack` | `VoidCallback?` | `null` | Custom back button handler |
| `elevation` | `double` | `0` | AppBar elevation |
| `backgroundColor` | `Color?` | `null` | Custom background color |
| `foregroundColor` | `Color?` | `null` | Custom foreground color |

## User Menu Options

The user menu (profile icon) provides:
- **Profile** - Navigate to user profile (placeholder)
- **Settings** - Navigate to app settings (placeholder)
- **Logout** - Secure logout with confirmation dialog

## Theme Integration

The AppBar automatically:
- Uses proper theme colors from `ColorScheme`
- Adapts logo based on theme brightness
- Provides smooth animations for theme changes
- Maintains consistent styling across themes

## Error Handling

- **Logo fallback** - Shows "Skinior" text if logo assets fail to load
- **Safe controller access** - Checks if controllers exist before using them
- **Graceful degradation** - Works even if controllers aren't available

## Accessibility

- **Tooltips** - All buttons have descriptive tooltips
- **Semantic labels** - Screen reader friendly
- **Material Design compliance** - Follows Android/iOS guidelines
- **Touch targets** - Proper sizing for touch interaction