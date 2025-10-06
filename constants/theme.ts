import { Dimensions, Platform } from 'react-native';

// Get device dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Typography scale optimized for mobile
export const typography = {
  // Font sizes with line heights optimized for mobile readability
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 32 },
  xxl: { fontSize: 24, lineHeight: 36 },
  xxxl: { fontSize: 32, lineHeight: 48 },
} as const;

// Font weights optimized for mobile
export const fontWeights = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// Shadows optimized for mobile (iOS/Android specific)
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Animation durations optimized for mobile
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// Easing functions for smooth animations
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

// Color palette optimized for mobile accessibility
const colors = {
  // Primary palette
  primary: {
    50: '#f3f0ff',
    100: '#e9e5ff',
    200: '#d6ceff',
    300: '#b8a6ff',
    400: '#9575ff',
    500: '#8b5cf6', // Main primary
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Neutral palette
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Theme interface optimized for mobile
export interface MobileTheme {
  colors: {
    // Primary colors
    primary: string;
    primaryForeground: string;
    primaryMuted: string;
    
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // Border colors
    border: string;
    borderSecondary: string;
    
    // Interactive colors
    interactive: string;
    interactiveForeground: string;
    interactiveMuted: string;
    
    // Status colors
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;
    
    // Overlay colors
    overlay: string;
    overlaySecondary: string;
  };
  
  // Typography
  typography: typeof typography;
  fontWeights: typeof fontWeights;
  
  // Spacing
  spacing: typeof spacing;
  
  // Layout
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  
  // Animation
  animations: typeof animations;
  easing: typeof easing;
  
  // Responsive
  breakpoints: typeof breakpoints;
  screenWidth: number;
  screenHeight: number;
  
  // Platform specific
  platform: typeof Platform.OS;
  isIOS: boolean;
  isAndroid: boolean;
}

// Light theme
export const lightTheme: MobileTheme = {
  colors: {
    primary: colors.primary[500],
    primaryForeground: '#ffffff',
    primaryMuted: colors.primary[100],
    
    background: '#ffffff',
    backgroundSecondary: colors.neutral[50],
    backgroundTertiary: colors.neutral[100],
    
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[400],
    textInverse: '#ffffff',
    
    border: colors.neutral[200],
    borderSecondary: colors.neutral[100],
    
    interactive: colors.primary[500],
    interactiveForeground: '#ffffff',
    interactiveMuted: colors.primary[100],
    
    success: colors.success,
    successForeground: '#ffffff',
    warning: colors.warning,
    warningForeground: '#ffffff',
    error: colors.error,
    errorForeground: '#ffffff',
    info: colors.info,
    infoForeground: '#ffffff',
    
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlaySecondary: 'rgba(0, 0, 0, 0.25)',
  },
  
  typography,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  animations,
  easing,
  breakpoints,
  screenWidth,
  screenHeight,
  platform: Platform.OS,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

// Dark theme
export const darkTheme: MobileTheme = {
  colors: {
    primary: colors.primary[400],
    primaryForeground: colors.neutral[900],
    primaryMuted: colors.primary[900],
    
    background: colors.neutral[900],
    backgroundSecondary: colors.neutral[800],
    backgroundTertiary: colors.neutral[700],
    
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[400],
    textInverse: colors.neutral[900],
    
    border: colors.neutral[700],
    borderSecondary: colors.neutral[600],
    
    interactive: colors.primary[400],
    interactiveForeground: colors.neutral[900],
    interactiveMuted: colors.primary[900],
    
    success: colors.success,
    successForeground: '#ffffff',
    warning: colors.warning,
    warningForeground: '#ffffff',
    error: colors.error,
    errorForeground: '#ffffff',
    info: colors.info,
    infoForeground: '#ffffff',
    
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlaySecondary: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  animations,
  easing,
  breakpoints,
  screenWidth,
  screenHeight,
  platform: Platform.OS,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

// Utility functions for responsive design
export const isSmallScreen = (width: number) => width < breakpoints.sm;
export const isMediumScreen = (width: number) => width >= breakpoints.sm && width < breakpoints.md;
export const isLargeScreen = (width: number) => width >= breakpoints.md;

// Utility function to get responsive spacing
export const getResponsiveSpacing = (base: number, scale: number = 1.2) => {
  if (isSmallScreen(screenWidth)) return base;
  if (isMediumScreen(screenWidth)) return base * scale;
  return base * scale * scale;
};

// Utility function to get responsive font size
export const getResponsiveFontSize = (base: number) => {
  if (isSmallScreen(screenWidth)) return base;
  if (isMediumScreen(screenWidth)) return base * 1.1;
  return base * 1.2;
};
