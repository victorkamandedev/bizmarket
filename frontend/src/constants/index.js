// src/constants/index.js - App-wide constants

export const CATEGORIES = [
  'Café',
  'Repair',
  'Design',
  'Food',
  'Retail',
  'Tech',
  'Health',
  'Other',
];

export const CATEGORY_ICONS = {
  Café: '☕',
  Repair: '🔧',
  Design: '🎨',
  Food: '🍽️',
  Retail: '🛍️',
  Tech: '💻',
  Health: '❤️',
  Other: '📦',
};

export const NAVIGATION_TABS = [
  { id: 'landing', label: 'Home' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'news', label: 'Business News' },
];

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@marketplace.com',
    password: 'admin123',
  },
  user: {
    email: 'cafe@example.com',
    password: 'pass123',
  },
};

export const CONTACT_INFO = {
  email: 'info@youthmarketplace.com',
  phone: '+254 700 000 000',
  social: {
    facebook: 'https://facebook.com/youthmarketplace',
    instagram: 'https://instagram.com/youthmarketplace',
    twitter: 'https://twitter.com/youthmarket',
    linkedin: 'https://linkedin.com/company/youthmarketplace',
  },
};

export const BUSINESS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const BUSINESS_TIER = {
  FREE: 'free',
  PREMIUM: 'premium',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
