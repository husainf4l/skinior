import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import '../controllers/theme_controller.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  final AuthController authController = Get.put(AuthController());
  final ThemeController themeController = Get.put(ThemeController());

  late TabController _tabController;

  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: themeController.isDarkMode.value
            ? const Color(0xFF121212)
            : Colors.white,
        child: SafeArea(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height - 
                        MediaQuery.of(context).padding.top - 
                        MediaQuery.of(context).padding.bottom,
            ),
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32.0,
                  vertical: 24.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    // Logo and Title
                    Row(
                      children: [
                        Image.asset(
                          themeController.isDarkMode.value
                              ? 'assets/logo/skinior-logo-white.png'
                              : 'assets/logo/skinior-logo-black.png',
                          height: 24,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Your Evolving Routine',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w300,
                        color: themeController.isDarkMode.value
                            ? Colors.white
                            : Colors.black,
                        letterSpacing: -0.5,
                        height: 1.2,
                      ),
                      textAlign: TextAlign.left,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'The world\'s first agentic skincare platform',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: themeController.isDarkMode.value
                            ? Colors.white60
                            : Colors.black54,
                        height: 1.4,
                        letterSpacing: 0.1,
                      ),
                      textAlign: TextAlign.left,
                    ),
                    const SizedBox(height: 32),

                    // Tab Bar
                    Container(
                      decoration: BoxDecoration(
                        color: themeController.isDarkMode.value
                            ? const Color(0xFF1E1E1E)
                            : Colors.grey[50],
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 8,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: TabBar(
                        controller: _tabController,
                        indicator: BoxDecoration(
                          color: themeController.isDarkMode.value
                              ? Colors.white
                              : Colors.black,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        indicatorSize: TabBarIndicatorSize.tab,
                        splashFactory: NoSplash.splashFactory,
                        overlayColor: WidgetStateProperty.all(Colors.transparent),
                        labelColor: themeController.isDarkMode.value
                            ? Colors.black
                            : Colors.white,
                        unselectedLabelColor: themeController.isDarkMode.value
                            ? Colors.white70
                            : Colors.black54,
                        tabs: const [
                          Tab(
                            height: 48,
                            text: 'Login',
                          ),
                          Tab(
                            height: 48,
                            text: 'Register',
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Tab Bar View
                    Flexible(
                      child: TabBarView(
                        controller: _tabController,
                        children: [_buildLoginForm(), _buildRegisterForm()],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm() {
    return Obx(
      () => Column(
        children: [
          TextField(
            controller: emailController,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: themeController.isDarkMode.value
                  ? Colors.white
                  : Colors.black,
            ),
            decoration: InputDecoration(
              labelText: 'Email',
              labelStyle: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: themeController.isDarkMode.value
                    ? Colors.white60
                    : Colors.black54,
              ),
              prefixIcon: Icon(
                Icons.email_outlined,
                size: 20,
                color: themeController.isDarkMode.value
                    ? Colors.white60
                    : Colors.black54,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white12
                      : Colors.black12,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white12
                      : Colors.black12,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white
                      : Colors.black,
                  width: 1.5,
                ),
              ),
              filled: true,
              fillColor: themeController.isDarkMode.value
                  ? const Color(0xFF1C1C1C)
                  : const Color(0xFFF8F8F8),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 14),
          TextField(
            controller: passwordController,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: themeController.isDarkMode.value
                  ? Colors.white
                  : Colors.black,
            ),
            decoration: InputDecoration(
              labelText: 'Password',
              labelStyle: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: themeController.isDarkMode.value
                    ? Colors.white60
                    : Colors.black54,
              ),
              prefixIcon: Icon(
                Icons.lock_outline,
                size: 20,
                color: themeController.isDarkMode.value
                    ? Colors.white60
                    : Colors.black54,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white12
                      : Colors.black12,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white12
                      : Colors.black12,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: themeController.isDarkMode.value
                      ? Colors.white
                      : Colors.black,
                  width: 1.5,
                ),
              ),
              filled: true,
              fillColor: themeController.isDarkMode.value
                  ? const Color(0xFF1C1C1C)
                  : const Color(0xFFF8F8F8),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
            obscureText: true,
          ),
          const SizedBox(height: 24),
          if (authController.errorMessage.value.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                authController.errorMessage.value,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: authController.isLoading.value
                  ? null
                  : () => authController.login(
                      emailController.text.trim(),
                      passwordController.text,
                    ),
              style: ElevatedButton.styleFrom(
                backgroundColor: themeController.isDarkMode.value
                    ? Colors.white
                    : Colors.black,
                foregroundColor: themeController.isDarkMode.value
                    ? Colors.black
                    : Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
                shadowColor: Colors.transparent,
              ),
              child: authController.isLoading.value
                  ? CircularProgressIndicator(
                      color: themeController.isDarkMode.value
                          ? Colors.black
                          : Colors.white,
                    )
                  : const Text(
                      'Sign In',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () {
              // Forgot password functionality
            },
            child: Text(
              'Forgot Password?',
              style: TextStyle(
                color: themeController.isDarkMode.value
                    ? Colors.white70
                    : Colors.black54,
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Divider
          Row(
            children: [
              Expanded(
                child: Divider(
                  color: themeController.isDarkMode.value
                      ? Colors.white24
                      : Colors.black26,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'or continue with',
                  style: TextStyle(
                    color: themeController.isDarkMode.value
                        ? Colors.white54
                        : Colors.black54,
                  ),
                ),
              ),
              Expanded(
                child: Divider(
                  color: themeController.isDarkMode.value
                      ? Colors.white24
                      : Colors.black26,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Social Login Buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: authController.isLoading.value
                        ? null
                        : () => authController.signInWithGoogle(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      side: BorderSide(
                        color: Colors.grey[300]!,
                        width: 1,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.network(
                          'https://developers.google.com/identity/images/g-logo.png',
                          height: 20,
                          width: 20,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Google',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: authController.isLoading.value
                        ? null
                        : () => authController.signInWithApple(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.apple,
                          size: 20,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Apple',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterForm() {
    return Obx(
      () => Column(
        children: [
          TextField(
            controller: nameController,
            decoration: InputDecoration(
              labelText: 'Full Name',
              prefixIcon: const Icon(Icons.person),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: emailController,
            decoration: InputDecoration(
              labelText: 'Email',
              prefixIcon: const Icon(Icons.email),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: passwordController,
            decoration: InputDecoration(
              labelText: 'Password',
              prefixIcon: const Icon(Icons.lock),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            obscureText: true,
          ),
          const SizedBox(height: 24),
          if (authController.errorMessage.value.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                authController.errorMessage.value,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: authController.isLoading.value
                  ? null
                  : () => authController.register(
                      nameController.text.trim(),
                      emailController.text.trim(),
                      passwordController.text,
                    ),
              style: ElevatedButton.styleFrom(
                backgroundColor: themeController.isDarkMode.value
                    ? Colors.white
                    : Colors.black,
                foregroundColor: themeController.isDarkMode.value
                    ? Colors.black
                    : Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
                shadowColor: Colors.transparent,
              ),
              child: authController.isLoading.value
                  ? CircularProgressIndicator(
                      color: themeController.isDarkMode.value
                          ? Colors.black
                          : Colors.white,
                    )
                  : const Text(
                      'Create Account',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Divider
          Row(
            children: [
              Expanded(
                child: Divider(
                  color: themeController.isDarkMode.value
                      ? Colors.white24
                      : Colors.black26,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'or continue with',
                  style: TextStyle(
                    color: themeController.isDarkMode.value
                        ? Colors.white54
                        : Colors.black54,
                  ),
                ),
              ),
              Expanded(
                child: Divider(
                  color: themeController.isDarkMode.value
                      ? Colors.white24
                      : Colors.black26,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Social Login Buttons
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: authController.isLoading.value
                        ? null
                        : () => authController.signInWithGoogle(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      side: BorderSide(
                        color: Colors.grey[300]!,
                        width: 1,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.network(
                          'https://developers.google.com/identity/images/g-logo.png',
                          height: 20,
                          width: 20,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Google',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: authController.isLoading.value
                        ? null
                        : () => authController.signInWithApple(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.apple,
                          size: 20,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Apple',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}