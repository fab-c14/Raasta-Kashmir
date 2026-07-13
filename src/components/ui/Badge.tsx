import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export const Badge: React.FC<BadgeProps> = ({ label, tone = 'neutral' }) => {
  const { colors } = useAppTheme();
  const toneColor: Record<BadgeTone, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.secondaryAccent,
    ai: colors.aiAccent,
    neutral: colors.textSecondary,
  };
  const color = toneColor[tone];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
      <Text style={[typography.caption, { color, fontFamily: 'Poppins-SemiBold' }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
