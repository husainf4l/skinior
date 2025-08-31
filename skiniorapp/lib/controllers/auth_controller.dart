import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import '../services/auth_service.dart';

class AuthController extends GetxController {
  final AuthService _authService = AuthService();
  final GoogleSignIn _googleSignIn = GoogleSignIn();

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

  Future<void> signInWithGoogle() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        isLoading.value = false;
        return; // User canceled the sign-in
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final String? accessToken = googleAuth.accessToken;
      final String? idToken = googleAuth.idToken;

      if (accessToken != null && idToken != null) {
        // Send tokens to your backend to get NestJS token
        final result = await _authService.socialLogin('google', {
          'accessToken': accessToken,
          'idToken': idToken,
        });

        isLoading.value = false;

        if (result['success']) {
          isLoggedIn.value = true;
          Get.offAllNamed('/home');
        } else {
          errorMessage.value = result['message'];
        }
      } else {
        isLoading.value = false;
        errorMessage.value = 'Google sign-in failed';
      }
    } catch (error) {
      isLoading.value = false;
      errorMessage.value = 'Google sign-in error: $error';
    }
  }

  Future<void> signInWithApple() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      // Send Apple credential to your backend to get NestJS token
      final result = await _authService.socialLogin('apple', {
        'identityToken': credential.identityToken,
        'authorizationCode': credential.authorizationCode,
        'email': credential.email,
        'givenName': credential.givenName,
        'familyName': credential.familyName,
      });

      isLoading.value = false;

      if (result['success']) {
        isLoggedIn.value = true;
        Get.offAllNamed('/home');
      } else {
        errorMessage.value = result['message'];
      }
    } catch (error) {
      isLoading.value = false;
      errorMessage.value = 'Apple sign-in error: $error';
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    await _googleSignIn.signOut(); // Sign out from Google as well
    isLoggedIn.value = false;
    Get.offAllNamed('/login');
  }
}
