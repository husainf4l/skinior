import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Platform,
  StatusBar,
  Image,
  PermissionsAndroid,
} from 'react-native';
import { launchImagePicker, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';
import MainLayout from '../components/MainLayout';

const { width, height } = Dimensions.get('window');

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

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';
import MainLayout from '../components/MainLayout';

const { width, height } = Dimensions.get('window');

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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
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
      ])
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
        'Don\'t forget SPF 30+ daily'
      ],
      confidence: 94
    };
    
    setScanResult(mockResult);
    setIsScanning(false);
    setScanProgress(0);
    
    // Reset animations
    pulseAnimation.setValue(0);
    progressAnimation.setValue(0);
  }, [startScanAnimation, pulseAnimation, progressAnimation]);

  // Simulate taking a photo and start analysis
  const startSkinAnalysis = useCallback(async () => {
    // In a real app, this would open the camera
    // For now, we'll simulate with a stock image
    setCapturedImage('https://via.placeholder.com/400x500/f0f0f0/999999?text=Face+Scan');
    await performSkinAnalysis();
  }, [performSkinAnalysis]);

  // Reset scan
  const resetScan = useCallback(() => {
    setScanResult(null);
    setCapturedImage(null);
    setScanProgress(0);
    setIsScanning(false);
    pulseAnimation.setValue(0);
    progressAnimation.setValue(0);
  }, [pulseAnimation, progressAnimation]);

  // Navigate to detailed results
  const viewDetailedResults = useCallback(() => {
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
              }
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
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
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
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
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
            onPress={viewDetailedResults}
          >
            <Text style={styles.primaryButtonText}>View Dashboard</Text>
            <SFSymbol
              name="arrow.right"
              size={16}
              color={colors.primaryText}
              weight="medium"
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={resetScan}
          >
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
          <View style={styles.instructionsContainer}>
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
              Our AI will analyze your skin's texture, hydration, and clarity to provide 
              personalized recommendations for your skincare routine.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="eye.fill"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>Advanced texture analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="drop.fill"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>Hydration level detection</Text>
              </View>
              <View style={styles.featureItem}>
                <SFSymbol
                  name="sparkles"
                  size={20}
                  color={colors.accent}
                  weight="medium"
                />
                <Text style={styles.featureText}>Clarity & tone assessment</Text>
              </View>
            </View>
          </View>
        )}

        {/* Scanning overlay */}
        {renderScanningOverlay()}

        {/* Results */}
        {scanResult && renderScanResults()}

        {/* Camera simulation area */}
        {!scanResult && !isScanning && (
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
            </View>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

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
              }
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
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
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
      <View style={styles.resultsContainer}>
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

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={viewDetailedResults}
          >
            <Text style={styles.primaryButtonText}>View Detailed Results</Text>
            <SFSymbol
              name="arrow.right"
              size={16}
              color={colors.primaryText}
              weight="medium"
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={resetScan}
          >
            <Text style={styles.secondaryButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render camera view
  const renderCameraView = () => {
    if (cameraPermission !== 'granted' || !device) {
      return (
        <View style={styles.permissionContainer}>
          <SFSymbol
            name="camera.fill"
            size={64}
            color={colors.textTertiary}
            weight="medium"
          />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            To analyze your skin, we need access to your front-facing camera.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={!isScanning && !scanResult}
          photo={true}
        />
        
        {/* Face guide overlay */}
        {!isScanning && !scanResult && (
          <View style={styles.guideOverlay}>
            <View style={styles.faceGuide} />
            <Text style={styles.guideText}>
              Position your face within the oval
            </Text>
            <Text style={styles.guideSubtext}>
              Ensure good lighting and look directly at the camera
            </Text>
          </View>
        )}
        
        {/* Scanning overlay */}
        {renderScanningOverlay()}
        
        {/* Capture button */}
        {!isScanning && !scanResult && (
          <View style={styles.captureContainer}>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takeSkinPhoto}
            >
              <View style={styles.captureButtonInner}>
                <SFSymbol
                  name="camera.fill"
                  size={24}
                  color={colors.primaryText}
                  weight="medium"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <MainLayout>
      <StatusBar 
        barStyle={colors.statusBarStyle} 
        backgroundColor={colors.background} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <SFSymbol
              name="chevron.left"
              size={20}
              color={colors.text}
              weight="semibold"
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>AI Skin Scan</Text>
          
          <TouchableOpacity style={styles.helpButton}>
            <SFSymbol
              name="questionmark.circle"
              size={20}
              color={colors.textSecondary}
              weight="medium"
            />
          </TouchableOpacity>
        </View>

        {/* Instructions or results */}
        {!scanResult ? (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Get personalized skin insights
            </Text>
            <Text style={styles.instructionsText}>
              Our AI will analyze your skin's texture, hydration, and clarity to provide 
              personalized recommendations.
            </Text>
          </View>
        ) : (
          renderScanResults()
        )}

        {/* Camera view */}
        <View style={styles.cameraSection}>
          {renderCameraView()}
        </View>
      </View>
    </MainLayout>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.41,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
  },
  cameraSection: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.41,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.24,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    letterSpacing: -0.24,
  },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  faceGuide: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: width * 0.3,
    borderWidth: 3,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  guideText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 32,
    textAlign: 'center',
    letterSpacing: -0.24,
  },
  guideSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: -0.08,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
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
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: -0.41,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    letterSpacing: -0.08,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: isDark ? 0 : 0.5,
    borderColor: colors.border,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
    letterSpacing: -0.41,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: -0.08,
  },
  skinTypeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: isDark ? 0 : 0.5,
    borderColor: colors.border,
  },
  skinTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.08,
  },
  skinTypeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.24,
  },
  concernsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: isDark ? 0 : 0.5,
    borderColor: colors.border,
  },
  concernsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.24,
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  concernText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginLeft: 8,
    letterSpacing: -0.08,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: isDark ? 0 : 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.24,
  },
});

export default SkinScan;
