import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../themes/app_themes.dart';

class ThemeController extends GetxController {
  RxBool isDarkMode = false.obs;
  Rx<ThemeMode> themeMode = ThemeMode.system.obs;

  @override
  void onInit() {
    super.onInit();
    _loadThemeFromPrefs();
  }

  void toggleTheme() {
    isDarkMode.value = !isDarkMode.value;
    themeMode.value = isDarkMode.value ? ThemeMode.dark : ThemeMode.light;
    _saveThemeToPrefs();
    Get.changeThemeMode(themeMode.value);
  }

  void setTheme(bool isDark) {
    isDarkMode.value = isDark;
    themeMode.value = isDark ? ThemeMode.dark : ThemeMode.light;
    _saveThemeToPrefs();
    Get.changeThemeMode(themeMode.value);
  }

  void setSystemTheme() {
    themeMode.value = ThemeMode.system;
    final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
    isDarkMode.value = brightness == Brightness.dark;
    _saveSystemThemePreference();
    Get.changeThemeMode(ThemeMode.system);
  }

  Future<void> _loadThemeFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check if user has saved a theme mode preference
    final savedThemeMode = prefs.getString('themeMode');
    if (savedThemeMode != null) {
      switch (savedThemeMode) {
        case 'light':
          themeMode.value = ThemeMode.light;
          isDarkMode.value = false;
          break;
        case 'dark':
          themeMode.value = ThemeMode.dark;
          isDarkMode.value = true;
          break;
        case 'system':
        default:
          themeMode.value = ThemeMode.system;
          final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
          isDarkMode.value = brightness == Brightness.dark;
          break;
      }
    } else {
      // Default to system theme if no preference is saved
      themeMode.value = ThemeMode.system;
      final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
      isDarkMode.value = brightness == Brightness.dark;
    }
    
    Get.changeThemeMode(themeMode.value);
  }

  Future<void> _saveThemeToPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    String themeModeString;
    switch (themeMode.value) {
      case ThemeMode.light:
        themeModeString = 'light';
        break;
      case ThemeMode.dark:
        themeModeString = 'dark';
        break;
      case ThemeMode.system:
        themeModeString = 'system';
        break;
    }
    await prefs.setString('themeMode', themeModeString);
  }

  Future<void> _saveSystemThemePreference() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('themeMode', 'system');
  }

  ThemeData get currentTheme =>
      isDarkMode.value ? AppThemes.darkTheme : AppThemes.lightTheme;
}
