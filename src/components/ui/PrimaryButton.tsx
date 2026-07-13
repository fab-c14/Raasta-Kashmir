import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const content = loading ? (
    <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
  ) : (
    <Text
      style={[
        typography.buttonLarge,
        { color: variant === 'outline' ? colors.primary : '#FFFFFF' },
      ]}
    >
      {label}
    </Text>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity onPress={onPress} disabled={inactive} activeOpacity={0.85} style={style}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, { borderRadius: roundness.xl, opacity: inactive ? 0.6 : 1 }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inactive}
      activeOpacity={0.85}
      style={[
        styles.button,
        {
          borderRadius: roundness.xl,
          opacity: inactive ? 0.6 : 1,
          backgroundColor: variant === 'danger' ? colors.danger : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
