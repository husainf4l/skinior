import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface QuickActionsGridProps {
  navigation: any;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const actions = [
    {
      title: 'AI Consultant',
      subtitle: 'Get personalized advice',
      icon: 'brain.head.profile',
      backgroundColor: colors.accent + '20',
      iconColor: colors.accent,
      onPress: () => navigation.navigate('Chat'),
    },
    {
      title: 'Skin Scan',
      subtitle: 'Analyze your skin',
      icon: 'camera.viewfinder',
      backgroundColor: colors.success + '20',
      iconColor: colors.success,
      onPress: () => navigation.navigate('SkinScan'),
    },
    {
      title: 'Progress',
      subtitle: 'Track improvements',
      icon: 'chart.line.uptrend.xyaxis',
      backgroundColor: colors.warning + '20',
      iconColor: colors.warning,
      onPress: () => {},
    },
    {
      title: 'Recommendations',
      subtitle: 'Discover products',
      icon: 'sparkles',
      backgroundColor: colors.primary + '20',
      iconColor: colors.primary,
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Intelligent Features</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={action.onPress}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: action.backgroundColor },
              ]}
            >
              <SFSymbol
                name={action.icon}
                size={24}
                color={action.iconColor}
                weight="medium"
              />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
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
  });

export default QuickActionsGrid;
