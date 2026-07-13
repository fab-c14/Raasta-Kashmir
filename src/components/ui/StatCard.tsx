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
      <View style={[styles.iconWrap, { backgroundColor: `${iconColor}1A` }]}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </View>
      <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 10 }]}>{value}</Text>
      <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
        {label}
      </Text>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
