import 'package:flutter/material.dart';
import 'professional_app_bar.dart';

// Example 1: Homepage with logo, notifications and user menu
class HomePageExample extends StatelessWidget {
  const HomePageExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ProfessionalAppBar(
        showLogo: true,
        showNotification: true,
        notificationCount: 3, // Example: 3 unread notifications
        showThemeToggle: true,
        showLogout: true,
        showBack: false,
      ),
      body: const Center(child: Text('Home Page Content')),
    );
  }
}

// Example 2: Detail page with back button
class ProfilePageExample extends StatelessWidget {
  const ProfilePageExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ProfessionalAppBar(
        title: "Profile Settings",
        showLogo: false,
        showBack: true,
        showThemeToggle: true,
        showLogout: false,
      ),
      body: const Center(child: Text('Profile Settings Content')),
    );
  }
}

// Example 3: Custom actions
class MessagesPageExample extends StatelessWidget {
  const MessagesPageExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ProfessionalAppBar(
        title: "Messages",
        showBack: true,
        showLogout: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => _handleSearch(context),
            tooltip: 'Search messages',
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _handleFilter(context),
            tooltip: 'Filter messages',
          ),
        ],
      ),
      body: const Center(child: Text('Messages Content')),
    );
  }

  void _handleSearch(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Search functionality')),
    );
  }

  void _handleFilter(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Filter functionality')),
    );
  }
}

// Example 4: Custom title widget
class PremiumPageExample extends StatelessWidget {
  const PremiumPageExample({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: ProfessionalAppBar(
        titleWidget: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.stars,
              color: Colors.amber[600],
              size: 24,
            ),
            const SizedBox(width: 8),
            Text(
              'Premium',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.onSurface,
              ),
            ),
          ],
        ),
        showBack: true,
        showLogout: false,
      ),
      body: const Center(child: Text('Premium Features Content')),
    );
  }
}

// Example 5: Minimal AppBar
class AboutPageExample extends StatelessWidget {
  const AboutPageExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const ProfessionalAppBar(
        title: "About Skinior",
        showLogo: false,
        showThemeToggle: false,
        showLogout: false,
        showBack: true,
        elevation: 1, // Slight elevation for definition
      ),
      body: const Center(child: Text('About Content')),
    );
  }
}

// Example 6: Custom styling
class CustomStyledExample extends StatelessWidget {
  const CustomStyledExample({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: ProfessionalAppBar(
        title: "Custom Style",
        showBack: true,
        showLogout: false,
        backgroundColor: theme.colorScheme.primaryContainer,
        foregroundColor: theme.colorScheme.onPrimaryContainer,
        elevation: 2,
      ),
      body: const Center(child: Text('Custom Styled Content')),
    );
  }
}