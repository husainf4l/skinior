import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string | null;
}

interface SkinAnalysis {
  score: number;
  concerns: string[];
  skinType: string;
  lastUpdated: string;
}

interface RoutineStep {
  id: string;
  name: string;
  timeOfDay: 'morning' | 'evening';
  completed: boolean;
  product: string;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis>({
    score: 85,
    concerns: ['Hydration', 'Fine Lines', 'Sun Protection'],
    skinType: 'Combination',
    lastUpdated: 'Today'
  });
  const [todayRoutine, setTodayRoutine] = useState<RoutineStep[]>([
    { id: '1', name: 'Gentle Cleanser', timeOfDay: 'morning', completed: true, product: 'CeraVe Foaming Cleanser' },
    { id: '2', name: 'Vitamin C Serum', timeOfDay: 'morning', completed: true, product: 'Skinceuticals CE Ferulic' },
    { id: '3', name: 'Moisturizer', timeOfDay: 'morning', completed: false, product: 'Neutrogena Hydra Boost' },
    { id: '4', name: 'SPF Protection', timeOfDay: 'morning', completed: false, product: 'EltaMD UV Clear' },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    navigation.replace('Login');
  };

  const completedSteps = todayRoutine.filter(step => step.completed).length;
  const totalSteps = todayRoutine.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  if (loading) {
    return (
      <MainLayout title="Skinior" navigation={navigation} currentRoute="Dashboard">
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { marginTop: 10 }]}>Loading your skincare journey...</Text>
        </View>
      </MainLayout>
    );
  }

  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'Beautiful';

  return (
    <MainLayout title="Skinior" navigation={navigation} currentRoute="Dashboard">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.userName}>{displayName}! ✨</Text>
            <Text style={styles.subtitle}>Your skin is evolving beautifully</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
            <View style={styles.avatarContainer}>
              <SFSymbol
                name="person.crop.circle.fill"
                size={32}
                color={colors.accent}
                weight="medium"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* AI Skin Analysis Card */}
        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <SFSymbol
                name="brain.head.profile"
                size={20}
                color={colors.accent}
                weight="medium"
              />
              <Text style={styles.cardTitle}>AI Skin Analysis</Text>
            </View>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{skinAnalysis.score}</Text>
              <Text style={styles.scoreSubtext}>Skin Score</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.skinType}>Skin Type: {skinAnalysis.skinType}</Text>
              <Text style={styles.lastUpdated}>Last updated: {skinAnalysis.lastUpdated}</Text>
              <View style={styles.concernsContainer}>
                {skinAnalysis.concerns.map((concern, index) => (
                  <View key={index} style={styles.concernChip}>
                    <Text style={styles.concernText}>{concern}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Today's Routine Progress */}
        <View style={styles.routineCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <SFSymbol
                name="clock.arrow.circlepath"
                size={20}
                color={colors.success}
                weight="medium"
              />
              <Text style={styles.cardTitle}>Today's Routine</Text>
            </View>
            <Text style={styles.progressText}>{completedSteps}/{totalSteps}</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          
          <View style={styles.routineSteps}>
            {todayRoutine.map((step) => (
              <TouchableOpacity
                key={step.id}
                style={[styles.routineStep, step.completed && styles.routineStepCompleted]}
                onPress={() => {
                  setTodayRoutine(prev => 
                    prev.map(s => s.id === step.id ? { ...s, completed: !s.completed } : s)
                  );
                }}
              >
                <View style={styles.stepLeft}>
                  <View style={[styles.stepCheckbox, step.completed && styles.stepCheckboxCompleted]}>
                    {step.completed && (
                      <SFSymbol
                        name="checkmark"
                        size={12}
                        color="#FFFFFF"
                        weight="bold"
                      />
                    )}
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepName, step.completed && styles.stepNameCompleted]}>
                      {step.name}
                    </Text>
                    <Text style={styles.stepProduct}>{step.product}</Text>
                  </View>
                </View>
                <SFSymbol
                  name={step.timeOfDay === 'morning' ? "sun.max" : "moon"}
                  size={16}
                  color={step.timeOfDay === 'morning' ? colors.warning : colors.primary}
                  weight="medium"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Intelligent Features</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Chat')}>
              <View style={[styles.actionIcon, { backgroundColor: colors.accent + '20' }]}>
                <SFSymbol
                  name="brain.head.profile"
                  size={24}
                  color={colors.accent}
                  weight="medium"
                />
              </View>
              <Text style={styles.actionTitle}>AI Consultant</Text>
              <Text style={styles.actionSubtitle}>Get personalized advice</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                <SFSymbol
                  name="camera.viewfinder"
                  size={24}
                  color={colors.success}
                  weight="medium"
                />
              </View>
              <Text style={styles.actionTitle}>Skin Scan</Text>
              <Text style={styles.actionSubtitle}>Analyze your skin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
                <SFSymbol
                  name="chart.line.uptrend.xyaxis"
                  size={24}
                  color={colors.warning}
                  weight="medium"
                />
              </View>
              <Text style={styles.actionTitle}>Progress</Text>
              <Text style={styles.actionSubtitle}>Track improvements</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <SFSymbol
                  name="sparkles"
                  size={24}
                  color={colors.primary}
                  weight="medium"
                />
              </View>
              <Text style={styles.actionTitle}>Recommendations</Text>
              <Text style={styles.actionSubtitle}>Discover products</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Adaptive Learning Banner */}
        <View style={styles.learningBanner}>
          <View style={styles.bannerContent}>
            <SFSymbol
              name="brain.head.profile"
              size={32}
              color={colors.accent}
              weight="medium"
            />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Adaptive AI Learning</Text>
              <Text style={styles.bannerSubtitle}>
                Your routine evolves as we learn more about your skin's unique needs
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Settings FAB */}
      <TouchableOpacity
        style={styles.settingsFab}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <SFSymbol
          name="gearshape.fill"
          size={24}
          color="#FFFFFF"
          weight="medium"
        />
      </TouchableOpacity>
    </MainLayout>
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 17,
      fontWeight: '400',
      color: colors.textSecondary,
      textAlign: 'center',
      letterSpacing: -0.24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    headerContent: {
      flex: 1,
    },
    greeting: {
      fontSize: 17,
      fontWeight: '400',
      color: colors.textSecondary,
      marginBottom: 2,
      letterSpacing: -0.24,
    },
    userName: {
      fontSize: 34,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.41,
      lineHeight: 41,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textTertiary,
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    profileButton: {
      padding: 4,
    },
    avatarContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
    },
    analysisCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.4 : 0.04,
      shadowRadius: isDark ? 12 : 8,
      elevation: isDark ? 8 : 2,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
      letterSpacing: -0.24,
    },
    updateButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 22,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    updateButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: -0.24,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scoreCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.accent + '12',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 24,
      borderWidth: 2,
      borderColor: colors.accent + '20',
    },
    scoreText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.accent,
      letterSpacing: -0.41,
    },
    scoreSubtext: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textTertiary,
      marginTop: 2,
      letterSpacing: -0.08,
    },
    scoreDetails: {
      flex: 1,
    },
    skinType: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
      letterSpacing: -0.24,
    },
    lastUpdated: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textSecondary,
      marginBottom: 16,
      letterSpacing: -0.24,
    },
    concernsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    concernChip: {
      backgroundColor: colors.warning + '15',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: colors.warning + '30',
    },
    concernText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.warning,
      letterSpacing: -0.08,
    },
    routineCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.4 : 0.04,
      shadowRadius: isDark ? 12 : 8,
      elevation: isDark ? 8 : 2,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
    },
    progressText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.success,
      letterSpacing: -0.24,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border + '60',
      borderRadius: 2,
      marginVertical: 20,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 2,
    },
    routineSteps: {
      gap: 8,
    },
    routineStep: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      borderRadius: 12,
      opacity: 0.9,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border + '40',
    },
    routineStepCompleted: {
      opacity: 1,
      backgroundColor: colors.success + '08',
      borderColor: colors.success + '20',
    },
    stepLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    stepCheckbox: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border + '80',
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepCheckboxCompleted: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    stepInfo: {
      flex: 1,
    },
    stepName: {
      fontSize: 17,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.24,
    },
    stepNameCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    stepProduct: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textTertiary,
      letterSpacing: -0.24,
    },
    actionsContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 20,
      letterSpacing: -0.41,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    actionCard: {
      width: (width - 60) / 2,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      alignItems: 'center',
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 6 : 1,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    actionTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
      letterSpacing: -0.24,
    },
    actionSubtitle: {
      fontSize: 13,
      fontWeight: '400',
      color: colors.textTertiary,
      textAlign: 'center',
      letterSpacing: -0.08,
    },
    learningBanner: {
      marginHorizontal: 20,
      backgroundColor: colors.accent + '08',
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.accent + '15',
    },
    bannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bannerText: {
      flex: 1,
      marginLeft: 16,
    },
    bannerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.24,
    },
    bannerSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
      letterSpacing: -0.08,
    },
    settingsFab: {
      position: 'absolute',
      bottom: 34,
      right: 20,
      width: 56,
      height: 56,
      backgroundColor: colors.accent,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
  });

export default Dashboard;
