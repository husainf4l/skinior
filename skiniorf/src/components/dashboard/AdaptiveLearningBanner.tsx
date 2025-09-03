import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../../contexts/ThemeContext';

const AdaptiveLearningBanner: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
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
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
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
  });

export default AdaptiveLearningBanner;
