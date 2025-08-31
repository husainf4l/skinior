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
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32.0),
                  child: Column(
                    children: [
                      // Top spacing - proportional to screen
                      SizedBox(height: constraints.maxHeight * 0.08),

                      // Header Section - Apple-style centered
                      Column(
                        children: [
                          Image.asset(
                            isDark
                                ? 'assets/logo/skinior-logo-white.png'
                                : 'assets/logo/skinior-logo-black.png',
                            height: 24,
                          ),
                          const SizedBox(height: 32),
                          Text(
                            'Your Evolving Routine',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w600,
                              color: theme.colorScheme.onSurface,
                              letterSpacing: -0.8,
                              height: 1.15,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'The world\'s first agentic skincare platform',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w400,
                              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                              height: 1.4,
                              letterSpacing: -0.1,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),

                      // Main content area
                      SizedBox(height: constraints.maxHeight * 0.06),

                      // Tab Bar - Apple style
                      Container(
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: AnimatedBuilder(
                          animation: _tabController.animation!,
                          builder: (context, child) {
                            return TabBar(
                              controller: _tabController,
                              indicator: BoxDecoration(
                                color: theme.colorScheme.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              indicatorSize: TabBarIndicatorSize.tab,
                              indicatorPadding: const EdgeInsets.all(2),
                              splashFactory: NoSplash.splashFactory,
                              overlayColor: WidgetStateProperty.all(
                                Colors.transparent,
                              ),
                              labelColor: theme.colorScheme.onPrimary,
                              unselectedLabelColor: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                              labelStyle: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                              unselectedLabelStyle: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w400,
                              ),
                              tabs: const [
                                Tab(height: 44, text: 'Sign In'),
                                Tab(height: 44, text: 'Sign Up'),
                              ],
                            );
                          },
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Forms
                      SizedBox(
                        height: 300,
                        child: TabBarView(
                          controller: _tabController,
                          children: [_buildLoginForm(), _buildRegisterForm()],
                        ),
                      ),

                      // Flexible spacing
                      const SizedBox(height: 40),

                      // Social Login Section
                      _buildDivider(context),
                      const SizedBox(height: 24),
                      _buildSocialButtons(context),

                      // Bottom spacing
                      SizedBox(height: constraints.maxHeight * 0.05),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildLoginForm() {
    return Obx(
      () => Column(
        children: [
          _buildTextField(
            context,
            controller: emailController,
            label: 'Email',
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          _buildTextField(
            context,
            controller: passwordController,
            label: 'Password',
            icon: Icons.lock_outline,
            obscureText: true,
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {
                Get.snackbar(
                  'Forgot Password',
                  'Feature coming soon!',
                  snackPosition: SnackPosition.BOTTOM,
                  backgroundColor: Colors.blue.withValues(alpha: 0.1),
                  colorText: Colors.blue,
                );
              },
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 4),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(
                'Forgot Password?',
                style: TextStyle(
                  fontSize: 13,
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (authController.errorMessage.value.isNotEmpty) ...[
            _buildErrorMessage(authController.errorMessage.value),
            const SizedBox(height: 12),
          ],
          _buildPrimaryButton(
            context,
            onPressed: authController.isLoading.value
                ? null
                : () => authController.login(
                    emailController.text.trim(),
                    passwordController.text,
                  ),
            text: 'Sign In',
            isLoading: authController.isLoading.value,
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    BuildContext context, {
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
  }) {
    final theme = Theme.of(context);
    return TextField(
      controller: controller,
      style: TextStyle(
        fontSize: 17,
        fontWeight: FontWeight.w400,
        color: theme.colorScheme.onSurface,
        height: 1.3,
      ),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(
          fontSize: 17,
          fontWeight: FontWeight.w400,
          color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
        ),
        floatingLabelStyle: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: theme.colorScheme.onSurface,
        ),
        prefixIcon: Icon(
          icon,
          size: 20,
          color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.outline,
            width: 1,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.outline,
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.primary,
            width: 2,
          ),
        ),
        filled: true,
        fillColor: theme.colorScheme.surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        // App Store accessibility requirements
        semanticCounterText: '$label field',
      ),
      keyboardType: keyboardType,
      obscureText: obscureText,
      textInputAction: keyboardType == TextInputType.emailAddress
          ? TextInputAction.next
          : TextInputAction.done,
      autocorrect: false,
      enableSuggestions: keyboardType != TextInputType.emailAddress,
    );
  }

  Widget _buildErrorMessage(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.red.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.red.withValues(alpha: 0.2), width: 1),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline, color: Colors.red, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: Colors.red,
                fontSize: 13,
                fontWeight: FontWeight.w400,
                height: 1.3,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrimaryButton(
    BuildContext context, {
    required VoidCallback? onPressed,
    required String text,
    required bool isLoading,
  }) {
    final theme = Theme.of(context);
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.primary,
          foregroundColor: theme.colorScheme.onPrimary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
          shadowColor: Colors.transparent,
          disabledBackgroundColor: theme.colorScheme.primary.withValues(alpha: 0.3),
          minimumSize: const Size(double.infinity, 50),
        ),
        child: isLoading
            ? SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  color: theme.colorScheme.onPrimary,
                  strokeWidth: 2,
                  semanticsLabel: 'Loading',
                ),
              )
            : Semantics(
                label: text,
                button: true,
                child: Text(
                  text,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: theme.colorScheme.outline.withValues(alpha: 0.3),
            thickness: 1,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'or continue with',
            style: TextStyle(
              fontSize: 14,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            color: theme.colorScheme.outline.withValues(alpha: 0.3),
            thickness: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildSocialButtons(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Expanded(
          child: SizedBox(
            height: 50,
            child: OutlinedButton(
              onPressed: authController.isLoading.value
                  ? null
                  : () => authController.signInWithGoogle(),
              style: OutlinedButton.styleFrom(
                backgroundColor: theme.colorScheme.surface,
                foregroundColor: theme.colorScheme.onSurface,
                side: BorderSide(
                  color: theme.colorScheme.outline,
                  width: 1,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                minimumSize: const Size(double.infinity, 50),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Use local asset or cached image for better performance
                  Icon(
                    Icons.g_mobiledata,
                    size: 20,
                    color: theme.colorScheme.onSurface,
                    semanticLabel: 'Google logo',
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Google',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      letterSpacing: -0.2,
                      color: theme.colorScheme.onSurface,
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
            height: 50,
            child: ElevatedButton(
              onPressed: authController.isLoading.value
                  ? null
                  : () => authController.signInWithApple(),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.inverseSurface,
                foregroundColor: theme.colorScheme.onInverseSurface,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.apple,
                    size: 18,
                    semanticLabel: 'Apple logo',
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Apple',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      letterSpacing: -0.2,
                      color: theme.colorScheme.onInverseSurface,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRegisterForm() {
    return Obx(
      () => Column(
        children: [
          _buildTextField(
            context,
            controller: nameController,
            label: 'Full Name',
            icon: Icons.person_outline,
          ),
          const SizedBox(height: 14),
          _buildTextField(
            context,
            controller: emailController,
            label: 'Email',
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 14),
          _buildTextField(
            context,
            controller: passwordController,
            label: 'Password',
            icon: Icons.lock_outline,
            obscureText: true,
          ),
          const SizedBox(height: 16),
          if (authController.errorMessage.value.isNotEmpty) ...[
            _buildErrorMessage(authController.errorMessage.value),
            const SizedBox(height: 12),
          ],
          _buildPrimaryButton(
            context,
            onPressed: authController.isLoading.value
                ? null
                : () => authController.register(
                    nameController.text.trim(),
                    emailController.text.trim(),
                    passwordController.text,
                  ),
            text: 'Create Account',
            isLoading: authController.isLoading.value,
          ),
        ],
      ),
    );
  }
}
