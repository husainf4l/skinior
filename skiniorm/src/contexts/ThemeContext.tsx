import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  card: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Primary colors
  primary: string;
  primaryText: string;

  // Accent colors
  accent: string;
  error: string;
  success: string;
  warning: string;

  // Border colors
  border: string;
  borderLight: string;

  // Shadow colors
  shadow: string;

  // Status bar
  statusBarStyle: 'light-content' | 'dark-content';
}

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#1C1C1E',
  textSecondary: '#3C3C43',
  textTertiary: '#6D6D70',

  primary: '#007AFF',
  primaryText: '#FFFFFF',

  accent: '#FF3B30',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',

  border: '#C6C6C8',
  borderLight: '#E5E5EA',

  shadow: '#000000',

  statusBarStyle: 'dark-content',
};

const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1C1C1E',
  card: '#1C1C1E',

  text: '#FFFFFF',
  textSecondary: '#F2F2F7',
  textTertiary: '#8E8E93',

  primary: '#0A84FF',
  primaryText: '#FFFFFF',

  accent: '#FF453A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',

  border: '#38383A',
  borderLight: '#38383A',

  shadow: '#000000',

  statusBarStyle: 'light-content',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Determine the actual theme to use
  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference whenever it changes
  useEffect(() => {
    saveThemePreference(themeMode);
  }, [themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_preference', mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    // Cycle through: system -> light -> dark -> system
    if (themeMode === 'system') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('system');
    }
  };

  const contextValue: ThemeContextType = {
    themeMode,
    isDark,
    colors,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper function to get theme display text
export const getThemeDisplayText = (
  themeMode: ThemeMode,
  isDark: boolean,
): string => {
  if (themeMode === 'system') {
    return `Theme: Auto (${isDark ? 'Dark' : 'Light'})`;
  }
  return `Theme: ${themeMode === 'dark' ? 'Dark' : 'Light'}`;
};

