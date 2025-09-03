import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainLayout } from '../components/layout';
import {
  DashboardHeader,
  SkinAnalysisCard,
  RoutineProgressCard,
  QuickActionsGrid,
  AdaptiveLearningBanner,
} from '../components/dashboard';
import { SettingsFloatingButton } from '../components/common';
import { useTheme } from '../contexts/ThemeContext';


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
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis>({
    score: 85,
    concerns: ['Hydration', 'Fine Lines', 'Sun Protection'],
    skinType: 'Combination',
    lastUpdated: 'Today',
  });
  const [todayRoutine, setTodayRoutine] = useState<RoutineStep[]>([
    {
      id: '1',
      name: 'Gentle Cleanser',
      timeOfDay: 'morning',
      completed: true,
      product: 'CeraVe Foaming Cleanser',
    },
    {
      id: '2',
      name: 'Vitamin C Serum',
      timeOfDay: 'morning',
      completed: true,
      product: 'Skinceuticals CE Ferulic',
    },
    {
      id: '3',
      name: 'Moisturizer',
      timeOfDay: 'morning',
      completed: false,
      product: 'Neutrogena Hydra Boost',
    },
    {
      id: '4',
      name: 'SPF Protection',
      timeOfDay: 'morning',
      completed: false,
      product: 'EltaMD UV Clear',
    },
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

  const handleStepToggle = (stepId: string) => {
    setTodayRoutine(prev =>
      prev.map(s =>
        s.id === stepId ? { ...s, completed: !s.completed } : s,
      ),
    );
  };

  if (loading) {
    return (
      <MainLayout
        title="Skinior"
        navigation={navigation}
        currentRoute="Dashboard"
      >
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { marginTop: 10 }]}>
            Loading your skincare journey...
          </Text>
        </View>
      </MainLayout>
    );
  }

  const displayName =
    user?.firstName || user?.name?.split(' ')[0] || 'Beautiful';

  return (
    <MainLayout
      title="Skinior"
      navigation={navigation}
      currentRoute="Dashboard"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <DashboardHeader displayName={displayName} />
        <SkinAnalysisCard skinAnalysis={skinAnalysis} />
        <RoutineProgressCard 
          todayRoutine={todayRoutine} 
          onStepToggle={handleStepToggle} 
        />
        <QuickActionsGrid navigation={navigation} />
        <AdaptiveLearningBanner />
        <View style={{ height: 100 }} />
      </ScrollView>

      <SettingsFloatingButton onPress={handleLogout} />
    </MainLayout>
  );
};

const getStyles = (colors: any) =>
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
  });

export default Dashboard;
