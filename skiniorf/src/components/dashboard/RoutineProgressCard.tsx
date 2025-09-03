import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { useTheme } from '../../contexts/ThemeContext';

interface RoutineStep {
  id: string;
  name: string;
  timeOfDay: 'morning' | 'evening';
  completed: boolean;
  product: string;
}

interface RoutineProgressCardProps {
  todayRoutine: RoutineStep[];
  onStepToggle: (stepId: string) => void;
}

const RoutineProgressCard: React.FC<RoutineProgressCardProps> = ({
  todayRoutine,
  onStepToggle,
}) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const completedSteps = todayRoutine.filter(step => step.completed).length;
  const totalSteps = todayRoutine.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
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
        <Text style={styles.progressText}>
          {completedSteps}/{totalSteps}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>

      <View style={styles.routineSteps}>
        {todayRoutine.map(step => (
          <TouchableOpacity
            key={step.id}
            style={[
              styles.routineStep,
              step.completed && styles.routineStepCompleted,
            ]}
            onPress={() => onStepToggle(step.id)}
          >
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.stepCheckbox,
                  step.completed && styles.stepCheckboxCompleted,
                ]}
              >
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
                <Text
                  style={[
                    styles.stepName,
                    step.completed && styles.stepNameCompleted,
                  ]}
                >
                  {step.name}
                </Text>
                <Text style={styles.stepProduct}>{step.product}</Text>
              </View>
            </View>
            <SFSymbol
              name={step.timeOfDay === 'morning' ? 'sun.max' : 'moon'}
              size={16}
              color={
                step.timeOfDay === 'morning' ? colors.warning : colors.primary
              }
              weight="medium"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
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
  });

export default RoutineProgressCard;
