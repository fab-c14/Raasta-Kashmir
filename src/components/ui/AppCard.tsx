import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'default' | 'ai' | 'danger';
}

/** Rounded, softly shadowed card — the base surface of every screen. */
export const AppCard: React.FC<AppCardProps> = ({ children, style, accent = 'default' }) => {
  const { colors, roundness, shadows, spacing } = useAppTheme();
  const borderColor =
    accent === 'ai' ? colors.aiAccent : accent === 'danger' ? colors.danger : colors.border;

  return (
    <View
      style={[
        styles.card,
        shadows.md,
        {
          backgroundColor: colors.card,
          borderRadius: roundness.lg,
          borderColor,
          padding: spacing.md,
          borderLeftWidth: accent === 'default' ? StyleSheet.hairlineWidth : 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
});
