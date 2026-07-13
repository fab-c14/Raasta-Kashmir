import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { AppCard } from './ui/AppCard';
import { useAppTheme } from '../hooks/useAppTheme';
import { typography } from '../theme/typography';

interface AiInsightCardProps {
  title: string;
  children: React.ReactNode;
}

/** Purple-accented card used for every AI Safety Copilot output. */
export const AiInsightCard: React.FC<AiInsightCardProps> = ({ title, children }) => {
  const { colors, spacing } = useAppTheme();

  return (
    <AppCard accent="ai" style={{ marginBottom: spacing.md }}>
      <View style={styles.header}>
        <Sparkles size={16} color={colors.aiAccent} strokeWidth={2} />
        <Text style={[typography.titleMedium, { color: colors.aiAccent, marginLeft: 8 }]}>
          {title}
        </Text>
      </View>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
});
