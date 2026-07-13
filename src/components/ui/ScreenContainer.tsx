import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  contentStyle,
}) => {
  const { colors, spacing } = useAppTheme();
  const padded = { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[padded, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, padded, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
});
