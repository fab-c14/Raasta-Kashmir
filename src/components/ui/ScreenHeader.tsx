import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showLogout = false,
}) => {
  const { colors, spacing } = useAppTheme();
  const { logout } = useAuth();

  return (
    <View style={[styles.row, { paddingVertical: spacing.lg }]}>
      <View style={styles.titles}>
        <Text style={[typography.h2, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showLogout ? (
        <TouchableOpacity
          accessibilityLabel="Log out"
          onPress={logout}
          style={[styles.logout, { backgroundColor: colors.surface }]}
        >
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titles: { flex: 1, paddingRight: 12 },
  logout: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
