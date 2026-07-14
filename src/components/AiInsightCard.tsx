import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from './ui/AppCard';
import { Badge } from './ui/Badge';
import { useAppTheme } from '../hooks/useAppTheme';
import { typography } from '../theme/typography';

interface AiInsightCardProps {
  title: string;
  children: React.ReactNode;
}

/** Plain card for AI-generated content, marked with a small neutral tag. */
export const AiInsightCard: React.FC<AiInsightCardProps> = ({ title, children }) => {
  const { colors, spacing } = useAppTheme();

  return (
    <AppCard style={{ marginBottom: spacing.md }}>
      <View style={styles.header}>
        <Text style={[typography.titleMedium, styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
        <Badge label="AI" tone="neutral" />
      </View>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, marginRight: 8 },
});
