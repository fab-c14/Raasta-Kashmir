import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'default' | 'danger';
}

/**
 * Rounded, softly shadowed card — the base surface of every screen.
 * Accented cards get a uniform tinted border all the way around (never a
 * single colored edge).
 */
export const AppCard: React.FC<AppCardProps> = ({ children, style, accent = 'default' }) => {
  const { colors, roundness, shadows, spacing } = useAppTheme();
  const borderColor = accent === 'danger' ? `${colors.danger}66` : colors.border;

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
          borderWidth: accent === 'default' ? StyleSheet.hairlineWidth : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
});
