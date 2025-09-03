import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';
import MainLayout from '../components/MainLayout';

const { width } = Dimensions.get('window');

interface SkinScanProps {
  navigation: any;
}

interface ScanResult {
  skinType: string;
  concerns: string[];
  hydrationLevel: number;
  textureScore: number;
  clarityScore: number;
  recommendations: string[];
  confidence: number;
}

const SkinScan: React.FC<SkinScanProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Animations
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Start scanning animation
  const startScanAnimation = useCallback(() => {
    // Pulse animation for scanning indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Progress animation
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, [pulseAnimation, progressAnimation]);

  // Simulate AI skin analysis
  const performSkinAnalysis = useCallback(async () => {
    setIsScanning(true);
    startScanAnimation();

    // Simulate progressive scanning
    for (let i = 0; i <= 100; i += 10) {
      setScanProgress(i);
      await new Promise<void>(resolve => setTimeout(resolve, 150));
    }

    // Simulate AI processing delay
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // Mock analysis result
    const mockResult: ScanResult = {
      skinType: 'Combination',
      concerns: ['Dryness', 'Uneven texture', 'Minor discoloration'],
      hydrationLevel: 72,
      textureScore: 68,
      clarityScore: 85,
      recommendations: [
        'Use a gentle hydrating cleanser',
        'Apply vitamin C serum in the morning',
        'Use retinol 2-3 times per week',
        "Don't forget SPF 30+ daily",
      ],
      confidence: 94,
    };

    setScanResult(mockResult);
    setIsScanning(false);
    setScanProgress(0);

    // Reset animations
    pulseAnimation.setValue(0);
    progressAnimation.setValue(0);
  }, [startScanAnimation, pulseAnimation, progressAnimation]);

  // Start skin analysis
  const startSkinAnalysis = useCallback(async () => {
    await performSkinAnalysis();
  }, [performSkinAnalysis]);

  // Reset scan
  const resetScan = useCallback(() => {
    setScanResult(null);
    setScanProgress(0);
    setIsScanning(false);
    pulseAnimation.setValue(0);
    progressAnimation.setValue(0);
  }, [pulseAnimation, progressAnimation]);

  // Navigate to dashboard
  const viewDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  // Render scanning overlay
  const renderScanningOverlay = () => {
    if (!isScanning) return null;

    const pulseScale = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    const progressWidth = progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width - 80],
    });

    return (
      <View style={styles.scanningOverlay}>
        <View style={styles.scanningContainer}>
          <Animated.View
            style={[
              styles.scanningIndicator,
              {
                transform: [{ scale: pulseScale }],
              },
            ]}
          >
            <SFSymbol
              name="brain.head.profile"
              size={32}
              color={colors.accent}
              weight="medium"
            />
          </Animated.View>

          <Text style={styles.scanningTitle}>AI Analyzing Your Skin</Text>
          <Text style={styles.scanningSubtitle}>
            Examining texture, hydration, and clarity...
          </Text>

          <View style={styles.progressContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>

          <Text style={styles.progressText}>{scanProgress}%</Text>
        </View>
      </View>
    );
  };

  // Render scan results
  const renderScanResults = () => {
    if (!scanResult) return null;

    return (
      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <SFSymbol
            name="checkmark.circle.fill"
            size={32}
            color={colors.success}
            weight="medium"
          />
          <Text style={styles.resultsTitle}>Analysis Complete</Text>
          <Text style={styles.confidenceText}>
            {scanResult.confidence}% confidence
          </Text>
        </View>

        <View style={styles.scoresContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scanResult.hydrationLevel}%</Text>
            <Text style={styles.scoreLabel}>Hydration</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scanResult.textureScore}%</Text>
            <Text style={styles.scoreLabel}>Texture</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scanResult.clarityScore}%</Text>
            <Text style={styles.scoreLabel}>Clarity</Text>
          </View>
        </View>

        <View style={styles.skinTypeCard}>
          <Text style={styles.skinTypeLabel}>Detected Skin Type</Text>
          <Text style={styles.skinTypeValue}>{scanResult.skinType}</Text>
        </View>

        <View style={styles.concernsCard}>
          <Text style={styles.concernsTitle}>Key Concerns</Text>
          {scanResult.concerns.map((concern, index) => (
            <View key={index} style={styles.concernItem}>
              <SFSymbol
                name="exclamationmark.triangle.fill"
                size={16}
                color={colors.warning}
                weight="medium"
              />
              <Text style={styles.concernText}>{concern}</Text>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>AI Recommendations</Text>
          {scanResult.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationNumber}>
                <Text style={styles.recommendationNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={viewDashboard}
          >
            <Text style={styles.primaryButtonText}>View Dashboard</Text>
            <SFSymbol
              name="arrow.right"
              size={16}
              color={colors.primaryText}
              weight="medium"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
            <Text style={styles.secondaryButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <MainLayout title="AI Skin Scan" navigation={navigation}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
      />

      <View style={styles.container}>
        {/* Instructions or results */}
        {!scanResult && !isScanning && (
          <ScrollView
            style={styles.instructionsContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <SFSymbol
                name="brain.head.profile"
                size={48}
                color={colors.accent}
                weight="medium"
              />
            </View>
            <Text style={styles.instructionsTitle}>
              Get personalized skin insights
            </Text>
            <Text style={styles.instructionsText}>
              Our AI will analyze your skin's texture, hydration, and clarity to
              provide personalized recommendations for your skincare routine.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="eye.fill"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>
                  Advanced texture analysis
                </Text>
              </View>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="drop.fill"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>
                  Hydration level detection
                </Text>
              </View>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="sparkles"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>
                  Clarity & tone assessment
                </Text>
              </View>
            </View>

            {/* Camera simulation area */}
            <View style={styles.cameraSection}>
              <View style={styles.cameraPlaceholder}>
                <View style={styles.faceGuide} />
                <Text style={styles.guideText}>
                  Position your face within the oval
                </Text>
                <Text style={styles.guideSubtext}>
                  Ensure good lighting and look directly at the camera
                </Text>
              </View>

              <View style={styles.captureContainer}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={startSkinAnalysis}
                >
                  <View style={styles.captureButtonInner}>
                    <SFSymbol
                      name="camera.fill"
                      size={24}
                      color={colors.accent}
                      weight="medium"
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.captureText}>Tap to start AI analysis</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Scanning overlay */}
        {renderScanningOverlay()}

        {/* Results */}
        {scanResult && renderScanResults()}
      </View>
    </MainLayout>
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    instructionsContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    iconContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 24,
    },
    instructionsTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      letterSpacing: -0.41,
      textAlign: 'center',
    },
    instructionsText: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textSecondary,
      lineHeight: 24,
      textAlign: 'center',
      letterSpacing: -0.24,
      marginBottom: 32,
    },
    featuresContainer: {
      marginBottom: 32,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    featureText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginLeft: 16,
      letterSpacing: -0.24,
    },
    cameraSection: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 20,
      minHeight: 400,
    },
    cameraPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      backgroundColor: isDark ? colors.surface : colors.background,
    },
    faceGuide: {
      width: width * 0.5,
      height: width * 0.65,
      borderRadius: width * 0.25,
      borderWidth: 3,
      borderColor: colors.accent,
      borderStyle: 'dashed',
      marginBottom: 32,
    },
    guideText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.24,
    },
    guideSubtext: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
      textAlign: 'center',
      letterSpacing: -0.08,
    },
    captureContainer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 12,
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      letterSpacing: -0.08,
    },
    scanningOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    scanningContainer: {
      alignItems: 'center',
      padding: 40,
    },
    scanningIndicator: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    scanningTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
      letterSpacing: -0.41,
    },
    scanningSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 32,
      textAlign: 'center',
      letterSpacing: -0.24,
    },
    progressContainer: {
      width: width - 80,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 2,
      marginBottom: 16,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: -0.08,
    },
    resultsContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    resultsHeader: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 20,
    },
    resultsTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginTop: 12,
      marginBottom: 4,
      letterSpacing: -0.41,
    },
    confidenceText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.success,
      letterSpacing: -0.24,
    },
    scoresContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    scoreCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
    },
    scoreValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.accent,
      marginBottom: 4,
      letterSpacing: -0.41,
    },
    scoreLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      letterSpacing: -0.08,
    },
    skinTypeCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
    },
    skinTypeLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: 8,
      letterSpacing: -0.08,
    },
    skinTypeValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.41,
    },
    concernsCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
    },
    concernsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      letterSpacing: -0.24,
    },
    concernItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    concernText: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textSecondary,
      marginLeft: 12,
      letterSpacing: -0.24,
    },
    recommendationsCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 32,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
    },
    recommendationsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 20,
      letterSpacing: -0.24,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    recommendationNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    recommendationNumberText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primaryText,
    },
    recommendationText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '400',
      color: colors.text,
      lineHeight: 22,
      letterSpacing: -0.24,
    },
    actionsContainer: {
      gap: 16,
      paddingBottom: 40,
    },
    primaryButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primaryText,
      marginRight: 8,
      letterSpacing: -0.24,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      alignItems: 'center',
      borderWidth: isDark ? 0 : 1,
      borderColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: -0.24,
    },
  });

export default SkinScan;
