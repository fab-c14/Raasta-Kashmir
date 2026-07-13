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

// Minimal, near-flat elevation: hairline borders do the separating work,
// shadows only whisper.
export const shadows = {
  sm: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0,
  },
  md: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  lg: {
    shadowColor: '#3D3426',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
