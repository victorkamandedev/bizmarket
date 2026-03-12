// src/styles/landingPageStyles.js
import { colors, spacing, radius, shadows, gradientPrimary } from './common';

export const heroSection = {
  background: gradientPrimary,
  padding: '64px 24px',
  color: colors.white,
};

export const heroContainer = {
  maxWidth: 1200,
  margin: '0 auto',
  textAlign: 'center',
};

export const heroTitle = {
  fontSize: 48,
  fontWeight: 900,
  marginBottom: 16,
  lineHeight: 1.2,
  textShadow: '0 2px 10px rgba(0,0,0,.2)',
};

export const heroDescription = {
  fontSize: 20,
  marginBottom: 32,
  opacity: .95,
  maxWidth: 600,
  margin: '0 auto 32px',
  lineHeight: 1.6,
};

export const heroButton = {
  background: colors.white,
  color: colors.primary,
  border: 'none',
  borderRadius: radius.md,
  padding: '16px 40px',
  fontSize: 18,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: shadows.md,
  transition: 'transform .2s, box-shadow .2s',
};

export const descriptionSection = {
  background: colors.white,
  padding: '48px 24px',
  borderBottom: `1px solid ${colors.gray200}`,
};

export const descriptionContainer = {
  maxWidth: 1000,
  margin: '0 auto',
};

export const descriptionTitle = {
  fontSize: 32,
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: 24,
  color: '#1e3a8a',
};

export const descriptionText = {
  fontSize: 16,
  lineHeight: 1.8,
  color: colors.gray700,
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto',
};

export const featuresSection = {
  padding: '56px 24px',
};

export const featuresContainer = {
  maxWidth: 1200,
  margin: '0 auto',
};

export const featuresGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 32,
};

export const featureCard = {
  background: colors.white,
  borderRadius: radius.lg,
  padding: 32,
  textAlign: 'center',
  boxShadow: shadows.sm,
  transition: 'transform .25s, box-shadow .25s, border-color .25s',
  border: '2px solid transparent',
};

export const featureIcon = {
  fontSize: 56,
  marginBottom: 16,
  display: 'inline-block',
  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
  padding: 20,
  borderRadius: radius.xl,
};

export const featureTitle = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 12,
  color: '#1e3a8a',
};

export const featureDescription = {
  fontSize: 15,
  lineHeight: 1.6,
  color: colors.gray600,
};

export const examplesSection = {
  background: colors.white,
  padding: '56px 24px',
};

export const examplesContainer = {
  maxWidth: 1200,
  margin: '0 auto',
};

export const examplesTitle = {
  fontSize: 28,
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: 40,
  color: '#1e3a8a',
};

export const examplesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 24,
};

export const exampleCard = {
  borderRadius: radius.lg,
  overflow: 'hidden',
  boxShadow: shadows.sm,
  transition: 'transform .25s, box-shadow .25s',
  position: 'relative',
  height: 240,
};

export const exampleImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

export const exampleOverlay = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)',
  padding: '40px 20px 16px',
};

export const exampleLabel = {
  color: colors.white,
  fontSize: 18,
  fontWeight: 700,
  textShadow: '0 2px 8px rgba(0,0,0,.5)',
};
