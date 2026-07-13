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

// Papery palette: warm paper surfaces and stone-toned text so the brand
// green reads like ink on paper rather than pixels on glass.
export const lightColors: ThemeColors = {
  primary: '#16A34A',
  primaryDark: '#15803D',
  aiAccent: '#7C3AED',
  secondaryAccent: '#0EA5E9',
  background: '#FAF7F1',
  card: '#FFFFFF',
  surface: '#F1EDE3',
  border: '#E5DFD1',
  textPrimary: '#221F1A',
  textSecondary: '#7A7263',
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
  background: '#181512',
  card: '#231F1A',
  surface: '#2E2923',
  border: '#413A31',
  textPrimary: '#F5F1E8',
  textSecondary: '#A69E8E',
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

// Warm, low shadows — paper casts soft shadows, not glassy ones.
export const shadows = {
  sm: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },
  lg: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
};
