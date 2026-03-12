// src/styles/headerStyles.js
import { colors, radius, spacing } from './common';

export const headerContainer = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: colors.white,
  boxShadow: '0 2px 8px rgba(0,0,0,.08)',
};

export const topBar = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  minHeight: 64,
  gap: 16,
  flexWrap: 'wrap',
};

export const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

export const logoIcon = {
  fontSize: 32,
  color: colors.primary,
};

export const logoText = {
  fontSize: 20,
  fontWeight: 800,
  color: '#1e3a8a',
  lineHeight: 1,
};

export const logoTagline = {
  fontSize: 11,
  color: colors.gray600,
  marginTop: 2,
};

export const navContainer = {
  display: 'flex',
  gap: 4,
};

export const navButton = (isActive) => ({
  background: isActive ? colors.primaryLight : 'transparent',
  color: isActive ? colors.primary : colors.gray600,
  border: `2px solid ${isActive ? colors.primary : 'transparent'}`,
  borderRadius: radius.sm,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .15s',
});

export const authContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
};

export const adminButton = {
  background: colors.secondary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.full,
  padding: '7px 14px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const myListingsButton = {
  background: 'none',
  border: `1.5px solid ${colors.primary}`,
  color: colors.primary,
  borderRadius: radius.full,
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const logoutButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  color: colors.gray600,
};

export const loginButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  color: colors.gray700,
};

export const signupButton = {
  background: colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.full,
  padding: '7px 16px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const searchSection = {
  padding: '0 20px 12px',
  borderTop: `1px solid ${colors.gray100}`,
};

export const searchContainer = {
  maxWidth: 800,
  margin: '12px auto 0',
  position: 'relative',
};

export const searchInput = (hasChips, focused) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.gray100,
  borderRadius: hasChips || focused ? '12px 12px 0 0' : '24px',
  padding: '0 14px',
  height: 42,
  gap: 8,
  border: '2px solid transparent',
  transition: 'border-radius .15s',
});

export const searchInputField = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  outline: 'none',
  fontSize: 14,
};

export const searchClearButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#888',
  fontSize: 13,
};

export const chipsContainer = {
  background: colors.gray100,
  padding: '6px 14px 8px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  borderRadius: '0 0 12px 12px',
  borderTop: `1px solid ${colors.gray200}`,
};

export const chip = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: colors.primary,
  color: colors.white,
  borderRadius: radius.full,
  padding: '2px 8px 2px 10px',
  fontSize: 12,
  fontWeight: 600,
};

export const chipCloseButton = {
  background: 'rgba(255,255,255,.3)',
  border: 'none',
  borderRadius: '50%',
  width: 14,
  height: 14,
  cursor: 'pointer',
  color: colors.white,
  fontSize: 10,
  padding: 0,
};

export const suggestionDropdown = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: colors.white,
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 8px 24px rgba(0,0,0,.12)',
  zIndex: 200,
  border: `1px solid ${colors.gray200}`,
  borderTop: 'none',
  overflow: 'hidden',
};

export const suggestionHeader = {
  padding: '8px 14px 4px',
  fontSize: 11,
  fontWeight: 700,
  color: colors.gray400,
  textTransform: 'uppercase',
  letterSpacing: .5,
};

export const suggestionItem = {
  padding: '9px 14px',
  cursor: 'pointer',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};
