import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import '../controllers/theme_controller.dart';

class ProfessionalAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final Widget? titleWidget;
  final List<Widget>? actions;
  final bool showLogo;
  final bool showThemeToggle;
  final bool showBack;
  final bool showLogout;
  final bool showNotification;
  final int notificationCount;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onBack;
  final double elevation;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const ProfessionalAppBar({
    super.key,
    this.title,
    this.titleWidget,
    this.actions,
    this.showLogo = true,
    this.showThemeToggle = true,
    this.showBack = false,
    this.showLogout = true,
    this.showNotification = true,
    this.notificationCount = 0,
    this.onNotificationTap,
    this.onBack,
    this.elevation = 0,
    this.backgroundColor,
    this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    // Get controllers safely
    final AuthController? authController = Get.isRegistered<AuthController>() 
        ? Get.find<AuthController>() 
        : null;
    final ThemeController? themeController = Get.isRegistered<ThemeController>() 
        ? Get.find<ThemeController>() 
        : null;

    return AppBar(
      backgroundColor: backgroundColor ?? theme.scaffoldBackgroundColor,
      foregroundColor: foregroundColor ?? theme.colorScheme.onSurface,
      elevation: elevation,
      scrolledUnderElevation: 0,
      leading: showBack ? _buildBackButton(context) : null,
      automaticallyImplyLeading: showBack,
      title: _buildTitle(context, theme, isDark),
      centerTitle: true,
      actions: _buildActions(context, theme, isDark, authController, themeController),
    );
  }

  Widget? _buildTitle(BuildContext context, ThemeData theme, bool isDark) {
    if (titleWidget != null) return titleWidget;
    
    if (showLogo) {
      return Image.asset(
        isDark
            ? 'assets/logo/skinior-logo-white.png'
            : 'assets/logo/skinior-logo-black.png',
        height: 24,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          return Text(
            'Skinior',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
              letterSpacing: -0.5,
            ),
          );
        },
      );
    }
    
    if (title != null) {
      return Text(
        title!,
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: theme.colorScheme.onSurface,
          letterSpacing: -0.5,
        ),
      );
    }
    
    return null;
  }

  Widget? _buildBackButton(BuildContext context) {
    return IconButton(
      icon: Icon(
        Icons.arrow_back_ios,
        size: 20,
      ),
      onPressed: onBack ?? () => Navigator.of(context).pop(),
      tooltip: 'Back',
    );
  }

  Widget _buildNotificationButton(BuildContext context, ThemeData theme) {
    return Stack(
      children: [
        IconButton(
          icon: Icon(
            Icons.notifications_outlined,
            size: 22,
          ),
          onPressed: onNotificationTap ?? () => _showNotifications(context),
          tooltip: 'Notifications',
        ),
        if (notificationCount > 0)
          Positioned(
            right: 6,
            top: 6,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.red[600],
                borderRadius: BorderRadius.circular(10),
              ),
              constraints: const BoxConstraints(
                minWidth: 18,
                minHeight: 18,
              ),
              child: Text(
                notificationCount > 99 ? '99+' : '$notificationCount',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }

  List<Widget> _buildActions(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    AuthController? authController,
    ThemeController? themeController,
  ) {
    final List<Widget> actionWidgets = [];

    // Add custom actions first
    if (actions != null) {
      actionWidgets.addAll(actions!);
    }

    // Notification bell
    if (showNotification) {
      actionWidgets.add(
        _buildNotificationButton(context, theme),
      );
    }

    // Theme toggle button
    if (showThemeToggle && themeController != null) {
      actionWidgets.add(
        IconButton(
          icon: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: Icon(
              isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
              key: ValueKey(isDark),
              size: 22,
            ),
          ),
          onPressed: () => themeController.toggleTheme(),
          tooltip: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        ),
      );
    }

    // Logout button
    if (showLogout && authController != null) {
      actionWidgets.add(
        PopupMenuButton<String>(
          icon: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              Icons.person_outline,
              size: 18,
              color: theme.colorScheme.onSurface,
            ),
          ),
          offset: const Offset(0, 50),
          elevation: 8,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          itemBuilder: (BuildContext context) => [
            PopupMenuItem<String>(
              value: 'profile',
              child: Row(
                children: [
                  Icon(
                    Icons.person_outline,
                    size: 20,
                    color: theme.colorScheme.onSurface,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Profile',
                    style: TextStyle(
                      color: theme.colorScheme.onSurface,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            PopupMenuItem<String>(
              value: 'settings',
              child: Row(
                children: [
                  Icon(
                    Icons.settings_outlined,
                    size: 20,
                    color: theme.colorScheme.onSurface,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Settings',
                    style: TextStyle(
                      color: theme.colorScheme.onSurface,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const PopupMenuDivider(),
            PopupMenuItem<String>(
              value: 'logout',
              child: Row(
                children: [
                  Icon(
                    Icons.logout_outlined,
                    size: 20,
                    color: Colors.red[600],
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Logout',
                    style: TextStyle(
                      color: Colors.red[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
          onSelected: (String value) {
            switch (value) {
              case 'profile':
                // Handle profile navigation
                Get.snackbar(
                  'Profile',
                  'Profile page coming soon!',
                  snackPosition: SnackPosition.BOTTOM,
                  duration: const Duration(seconds: 2),
                );
                break;
              case 'settings':
                // Handle settings navigation
                Get.snackbar(
                  'Settings',
                  'Settings page coming soon!',
                  snackPosition: SnackPosition.BOTTOM,
                  duration: const Duration(seconds: 2),
                );
                break;
              case 'logout':
                _showLogoutDialog(context, authController);
                break;
            }
          },
        ),
      );
    }

    return actionWidgets;
  }

  void _showLogoutDialog(BuildContext context, AuthController authController) {
    final theme = Theme.of(context);
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: [
              Icon(
                Icons.logout_outlined,
                color: Colors.red[600],
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                'Logout',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onSurface,
                ),
              ),
            ],
          ),
          content: Text(
            'Are you sure you want to logout?',
            style: TextStyle(
              fontSize: 16,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              style: TextButton.styleFrom(
                foregroundColor: theme.colorScheme.onSurface.withValues(alpha: 0.6),
              ),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                authController.logout();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[600],
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  void _showNotifications(BuildContext context) {
    final theme = Theme.of(context);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.7,
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: theme.colorScheme.outline.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              
              // Header
              Row(
                children: [
                  Icon(
                    Icons.notifications,
                    color: theme.colorScheme.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Notifications',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Get.snackbar(
                        'Mark All Read',
                        'All notifications marked as read',
                        snackPosition: SnackPosition.BOTTOM,
                        duration: const Duration(seconds: 2),
                      );
                    },
                    child: Text(
                      'Mark All Read',
                      style: TextStyle(
                        color: theme.colorScheme.primary,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Notifications list
              Expanded(
                child: notificationCount > 0
                    ? _buildNotificationsList(context, theme)
                    : _buildEmptyState(context, theme),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationsList(BuildContext context, ThemeData theme) {
    // Sample notifications
    final notifications = [
      {
        'title': 'Welcome to Skinior!',
        'message': 'Start your skincare journey today',
        'time': '2 minutes ago',
        'unread': true,
        'icon': Icons.celebration,
      },
      {
        'title': 'Routine Reminder',
        'message': 'Time for your morning skincare routine',
        'time': '1 hour ago',
        'unread': true,
        'icon': Icons.schedule,
      },
      {
        'title': 'Product Recommendation',
        'message': 'New products added to your routine',
        'time': '3 hours ago',
        'unread': false,
        'icon': Icons.shopping_bag,
      },
    ];

    return ListView.builder(
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final notification = notifications[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: notification['unread'] as bool
                ? theme.colorScheme.primaryContainer.withValues(alpha: 0.3)
                : theme.colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: theme.colorScheme.outline.withValues(alpha: 0.1),
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  notification['icon'] as IconData,
                  color: theme.colorScheme.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notification['title'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification['message'] as String,
                      style: TextStyle(
                        fontSize: 14,
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification['time'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                      ),
                    ),
                  ],
                ),
              ),
              if (notification['unread'] as bool)
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context, ThemeData theme) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none,
            size: 64,
            color: theme.colorScheme.outline,
          ),
          const SizedBox(height: 16),
          Text(
            'No notifications',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'We\'ll notify you when something important happens',
            style: TextStyle(
              fontSize: 14,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}