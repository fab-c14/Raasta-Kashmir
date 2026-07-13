import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { AppCard } from './AppCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, tint }) => {
  const { colors } = useAppTheme();
  const iconColor = tint ?? colors.primary;

  return (
    <AppCard style={styles.card}>
      <Icon size={18} color={iconColor} strokeWidth={1.8} />
      <Text
        style={[typography.h3, { color: colors.textPrimary, marginTop: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {value}
      </Text>
      <Text
        style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1 },
});
