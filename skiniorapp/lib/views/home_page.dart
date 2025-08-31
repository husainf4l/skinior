import 'package:flutter/material.dart';
import '../widgets/professional_app_bar.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: const ProfessionalAppBar(
        showLogo: true,
        showNotification: true,
        notificationCount: 2, // Example: 2 unread notifications
        showThemeToggle: true,
        showLogout: true,
        showBack: false,
      ),
      body: Container(
        color: theme.scaffoldBackgroundColor,
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Hero Section
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 64,
                ),
                child: Column(
                  children: [
                    Image.asset(
                      theme.brightness == Brightness.dark
                          ? 'assets/logo/skinior-logo-white.png'
                          : 'assets/logo/skinior-logo-black.png',
                      height: 80,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          height: 80,
                          width: 200,
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              'SKINIOR',
                              style: TextStyle(
                                color: theme.colorScheme.onPrimary,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 40),
                    Text(
                      'Welcome to Skinior!',
                      style: theme.textTheme.headlineLarge?.copyWith(
                        color: theme.colorScheme.onSurface,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Your personalized skincare journey starts here. We analyze your skin, learn your routine, and adapt over time.',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: theme.colorScheme.outline.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.check_circle_outline,
                            size: 48,
                            color: theme.colorScheme.primary,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Login Successful!',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: theme.colorScheme.onSurface,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'You are now logged into your Skinior account.',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 48),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
