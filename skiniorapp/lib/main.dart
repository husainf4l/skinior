import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'views/login_page.dart';
import 'views/home_page.dart';
import 'controllers/auth_controller.dart';
import 'controllers/theme_controller.dart';
import 'themes/app_themes.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Initialize the theme controller
    Get.put(ThemeController());
    
    return Obx(() {
      final themeController = Get.find<ThemeController>();
      return GetMaterialApp(
        title: 'Skinior',
        theme: AppThemes.lightTheme,
        darkTheme: AppThemes.darkTheme,
        themeMode: themeController.themeMode.value,
        initialRoute: '/',
        getPages: [
          GetPage(name: '/', page: () => const AuthWrapper()),
          GetPage(name: '/login', page: () => const LoginPage()),
          GetPage(name: '/home', page: () => const HomePage()),
        ],
        debugShowCheckedModeBanner: false,
      );
    });
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final AuthController authController = Get.put(AuthController());
    
    return Obx(() {
      // Show loading if checking auth status
      if (authController.isLoading.value) {
        final theme = Theme.of(context);
        final isDark = theme.brightness == Brightness.dark;
        
        return Scaffold(
          backgroundColor: theme.scaffoldBackgroundColor,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  isDark
                      ? 'assets/logo/skinior-logo-white.png'
                      : 'assets/logo/skinior-logo-black.png',
                  height: 60,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 60,
                      width: 150,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          'SKINIOR',
                          style: TextStyle(
                            color: theme.colorScheme.onPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 32),
                CircularProgressIndicator(
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(height: 16),
                Text(
                  'Loading...',
                  style: TextStyle(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        );
      }
      
      // Navigate based on login status
      return authController.isLoggedIn.value 
        ? const HomePage() 
        : const LoginPage();
    });
  }
}
