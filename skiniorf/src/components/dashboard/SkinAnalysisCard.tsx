import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { useTheme } from '../../contexts/ThemeContext';

interface SkinAnalysis {
  score: number;
  concerns: string[];
  skinType: string;
  lastUpdated: string;
}

interface SkinAnalysisCardProps {
  skinAnalysis: SkinAnalysis;
  onUpdatePress?: () => void;
}

const SkinAnalysisCard: React.FC<SkinAnalysisCardProps> = ({
  skinAnalysis,
  onUpdatePress = () => {},
}) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  return (
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
        <TouchableOpacity style={styles.updateButton} onPress={onUpdatePress}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{skinAnalysis.score}</Text>
          <Text style={styles.scoreSubtext}>Skin Score</Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={styles.skinType}>
            Skin Type: {skinAnalysis.skinType}
          </Text>
          <Text style={styles.lastUpdated}>
            Last updated: {skinAnalysis.lastUpdated}
          </Text>
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
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
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
  });

export default SkinAnalysisCard;
