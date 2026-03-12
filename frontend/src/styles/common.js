// src/styles/common.js - Shared style objects

export const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#eff6ff',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#6b7280',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
  black: '#000000',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

export const shadows = {
  sm: '0 2px 10px rgba(0,0,0,.07)',
  md: '0 8px 32px rgba(0,0,0,.14)',
  lg: '0 20px 60px rgba(0,0,0,.2)',
};

// Common reusable styles
export const inputStyle = {
  display: 'block',
  width: '100%',
  border: `1.5px solid ${colors.gray200}`,
  borderRadius: radius.sm,
  padding: '9px 12px',
  fontSize: '14px',
  marginBottom: '10px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

export const buttonPrimary = {
  background: colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.sm,
  padding: '10px 18px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .15s',
};

export const buttonOutline = {
  background: 'none',
  border: `1.5px solid ${colors.primary}`,
  color: colors.primary,
  borderRadius: radius.sm,
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .15s',
};

export const card = {
  background: colors.white,
  borderRadius: radius.lg,
  padding: spacing.xl,
  boxShadow: shadows.sm,
};

export const gradientPrimary = 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #ec4899 100%)';
export const gradientBlue = 'linear-gradient(135deg, #1e3a8a, #7c3aed)';
