import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:video_player/video_player.dart';
import '../controllers/auth_controller.dart';
import '../controllers/theme_controller.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final AuthController authController = Get.find();
  final ThemeController themeController = Get.find();

  late VideoPlayerController _heroController;
  late VideoPlayerController _featureController;
  late VideoPlayerController _worksController;

  @override
  void initState() {
    super.initState();
    _heroController = VideoPlayerController.asset('assets/videos/hero.webm')
      ..initialize().then((_) {
        setState(() {});
      });
    _featureController =
        VideoPlayerController.asset('assets/videos/feature.webm')
          ..initialize().then((_) {
            setState(() {});
          });
    _worksController = VideoPlayerController.asset('assets/videos/works.webm')
      ..initialize().then((_) {
        setState(() {});
      });
  }

  @override
  void dispose() {
    _heroController.dispose();
    _featureController.dispose();
    _worksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: themeController.isDarkMode.value
            ? const Color(0xFF121212)
            : Colors.white,
        foregroundColor: themeController.isDarkMode.value
            ? Colors.white
            : Colors.black,
        elevation: 0,
        title: Image.asset(
          themeController.isDarkMode.value
              ? 'assets/logo/skinior-logo-white.png'
              : 'assets/logo/skinior-logo-black.png',
          height: 40,
        ),
        actions: [
          IconButton(
            icon: Icon(
              themeController.isDarkMode.value
                  ? Icons.light_mode
                  : Icons.dark_mode,
              color: themeController.isDarkMode.value
                  ? Colors.white
                  : Colors.black,
            ),
            onPressed: () => themeController.toggleTheme(),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => authController.logout(),
          ),
        ],
      ),
      body: Container(
        color: themeController.isDarkMode.value
            ? const Color(0xFF121212)
            : Colors.white,
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
                      themeController.isDarkMode.value
                          ? 'assets/logo/skinior-logo-white.png'
                          : 'assets/logo/skinior-logo-black.png',
                      height: 80,
                    ),
                    const SizedBox(height: 40),
                    Text(
                      'Your Evolving Routine',
                      style: Theme.of(context).textTheme.headlineLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Learns your skin, your routine, and your lifestyle then tracks your results and adapts your plan over time.',
                      style: Theme.of(context).textTheme.bodyLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),
                    _heroController.value.isInitialized
                        ? Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 15,
                                  offset: const Offset(0, 5),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: AspectRatio(
                                aspectRatio: _heroController.value.aspectRatio,
                                child: VideoPlayer(_heroController),
                              ),
                            ),
                          )
                        : Container(
                            height: 200,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                  ],
                ),
              ),
              // Intelligent Features Section
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 64,
                ),
                color: themeController.isDarkMode.value
                    ? const Color(0xFF1E1E1E)
                    : Colors.grey[50],
                child: Column(
                  children: [
                    Text(
                      'Intelligent Features',
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Skinior features intelligent routines that seamlessly adapt to your changing skin needs and evolve with you over time.',
                      style: Theme.of(context).textTheme.bodyLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 40),
                    _featureController.value.isInitialized
                        ? Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 15,
                                  offset: const Offset(0, 5),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: AspectRatio(
                                aspectRatio:
                                    _featureController.value.aspectRatio,
                                child: VideoPlayer(_featureController),
                              ),
                            ),
                          )
                        : Container(
                            height: 200,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                  ],
                ),
              ),
              // How It Works Section
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 64,
                ),
                child: Column(
                  children: [
                    Text(
                      'How It Works',
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Your journey with Skinior begins with a comprehensive and advanced skin analysis using the latest artificial intelligence technology.',
                      style: Theme.of(context).textTheme.bodyLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 40),
                    _worksController.value.isInitialized
                        ? Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 15,
                                  offset: const Offset(0, 5),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: AspectRatio(
                                aspectRatio: _worksController.value.aspectRatio,
                                child: VideoPlayer(_worksController),
                              ),
                            ),
                          )
                        : Container(
                            height: 200,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                    const SizedBox(height: 48), // Extra space at bottom
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
