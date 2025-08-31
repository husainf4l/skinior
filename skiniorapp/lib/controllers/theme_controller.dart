import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../themes/app_themes.dart';

class ThemeController extends GetxController {
  RxBool isDarkMode = false.obs;

  @override
  void onInit() {
    super.onInit();
    _loadThemeFromPrefs();
  }

  void toggleTheme() {
    isDarkMode.value = !isDarkMode.value;
    _saveThemeToPrefs();
    Get.changeTheme(
      isDarkMode.value ? AppThemes.darkTheme : AppThemes.lightTheme,
    );
  }

  void setTheme(bool isDark) {
    isDarkMode.value = isDark;
    _saveThemeToPrefs();
    Get.changeTheme(isDark ? AppThemes.darkTheme : AppThemes.lightTheme);
  }

  Future<void> _loadThemeFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    isDarkMode.value = prefs.getBool('isDarkMode') ?? false;
    Get.changeTheme(
      isDarkMode.value ? AppThemes.darkTheme : AppThemes.lightTheme,
    );
  }

  Future<void> _saveThemeToPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', isDarkMode.value);
  }

  ThemeData get currentTheme =>
      isDarkMode.value ? AppThemes.darkTheme : AppThemes.lightTheme;
}
