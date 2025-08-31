import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class AuthController extends GetxController {
  final AuthService _authService = AuthService();

  RxBool isLoading = false.obs;
  RxString errorMessage = ''.obs;
  RxBool isLoggedIn = false.obs;

  @override
  void onInit() {
    super.onInit();
    checkLoginStatus();
  }

  Future<void> checkLoginStatus() async {
    isLoggedIn.value = await _authService.isLoggedIn();
  }

  Future<void> login(String email, String password) async {
    if (email.isEmpty || password.isEmpty) {
      errorMessage.value = 'Please fill in all fields';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    final result = await _authService.login(email, password);

    isLoading.value = false;

    if (result['success']) {
      isLoggedIn.value = true;
      Get.offAllNamed('/home'); // Navigate to home after successful login
    } else {
      errorMessage.value = result['message'];
    }
  }

  Future<void> register(String name, String email, String password) async {
    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      errorMessage.value = 'Please fill in all fields';
      return;
    }

    if (password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    final result = await _authService.register(name, email, password);

    isLoading.value = false;

    if (result['success']) {
      Get.snackbar(
        'Success',
        'Registration successful! Please login.',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      // Switch to login tab
    } else {
      errorMessage.value = result['message'];
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    isLoggedIn.value = false;
    Get.offAllNamed('/login');
  }
}
