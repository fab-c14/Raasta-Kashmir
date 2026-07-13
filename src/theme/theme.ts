export interface ThemeColors {
  primary: string;
  primaryDark: string;
  aiAccent: string;
  secondaryAccent: string;
  background: string;
  card: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  gradientStart: string;
  gradientEnd: string;
}

export const lightColors: ThemeColors = {
  primary: '#16A34A',
  primaryDark: '#15803D',
  aiAccent: '#7C3AED',
  secondaryAccent: '#0EA5E9',
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  gradientStart: '#16A34A',
  gradientEnd: '#22C55E',
};

export const darkColors: ThemeColors = {
  primary: '#22C55E',
  primaryDark: '#16A34A',
  aiAccent: '#A78BFA',
  secondaryAccent: '#38BDF8',
  background: '#0F172A',
  card: '#1E293B',
  surface: '#334155',
  border: '#475569',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  gradientStart: '#22C55E',
  gradientEnd: '#4ADE80',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const roundness = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
