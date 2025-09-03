import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsFloatingButtonProps {
  onPress: () => void;
}

const SettingsFloatingButton: React.FC<SettingsFloatingButtonProps> = ({
  onPress,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={styles.settingsFab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <SFSymbol
        name="gearshape.fill"
        size={24}
        color="#FFFFFF"
        weight="medium"
      />
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
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

export default SettingsFloatingButton;
