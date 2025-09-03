import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { useTheme } from '../../contexts/ThemeContext';

interface DashboardHeaderProps {
  displayName: string;
  onProfilePress?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  onProfilePress = () => {},
}) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.userName}>{displayName}! ✨</Text>
        <Text style={styles.subtitle}>Your skin is evolving beautifully</Text>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
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
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
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
  });

export default DashboardHeader;
