// src/styles/footerStyles.js
import { colors, spacing, gradientBlue } from './common';

export const footerContainer = {
  background: gradientBlue,
  color: colors.white,
  padding: '48px 24px 32px',
  marginTop: 48,
};

export const footerContent = {
  maxWidth: 1200,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 40,
};

export const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 16,
};

export const logoIcon = {
  fontSize: 32,
};

export const logoText = {
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1,
};

export const logoTagline = {
  fontSize: 11,
  opacity: .8,
  marginTop: 4,
};

export const description = {
  fontSize: 14,
  opacity: .9,
  lineHeight: 1.6,
};

export const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: .5,
};

export const contactList = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  fontSize: 14,
};

export const contactLink = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: colors.white,
  textDecoration: 'none',
  opacity: .9,
  transition: 'opacity .15s',
};

export const socialContainer = {
  display: 'flex',
  gap: 12,
};

export const socialButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  background: 'rgba(255,255,255,.1)',
  borderRadius: '50%',
  fontSize: 24,
  textDecoration: 'none',
  transition: 'all .2s',
  border: '2px solid rgba(255,255,255,.2)',
};

export const copyright = {
  maxWidth: 1200,
  margin: '32px auto 0',
  paddingTop: 24,
  borderTop: '1px solid rgba(255,255,255,.2)',
  textAlign: 'center',
  fontSize: 13,
  opacity: .8,
};
