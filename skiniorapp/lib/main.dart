import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/theme_controller.dart';
import 'controllers/auth_controller.dart';
import 'views/login_page.dart';
import 'views/home_page.dart';
import 'themes/app_themes.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize controllers
  final themeController = ThemeController();
  final authController = AuthController();

  // Load theme preference
  themeController.onInit();
  authController.onInit();

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final ThemeController themeController = Get.put(ThemeController());
  final AuthController authController = Get.put(AuthController());

  MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => GetMaterialApp(
        title: 'Skinior',
        theme: themeController.currentTheme,
        darkTheme: AppThemes.darkTheme,
        themeMode: themeController.isDarkMode.value
            ? ThemeMode.dark
            : ThemeMode.light,
        initialRoute: '/',
        getPages: [
          GetPage(name: '/', page: () => AuthWrapper()),
          GetPage(name: '/login', page: () => LoginPage()),
          GetPage(name: '/home', page: () => HomePage()),
        ],
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  final AuthController authController = Get.find();

  AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      if (authController.isLoggedIn.value) {
        return HomePage();
      } else {
        return LoginPage();
      }
    });
  }
}
