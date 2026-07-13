import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gradient' | 'danger' | 'outline';
  style?: ViewStyle;
}

/**
 * Flat, minimal button. The 'gradient' variant renders as solid brand green
 * (kept as a name for backwards compatibility across screens).
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'gradient',
  style,
}) => {
  const { colors, roundness } = useAppTheme();
  const inactive = disabled || loading;

  const backgroundColor =
    variant === 'danger' ? colors.danger : variant === 'outline' ? 'transparent' : colors.primary;
  const contentColor = variant === 'outline' ? colors.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inactive}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderRadius: roundness.lg,
          opacity: inactive ? 0.6 : 1,
          backgroundColor,
          borderWidth: variant === 'outline' ? 1.2 : 0,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <Text style={[typography.buttonLarge, { color: contentColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
