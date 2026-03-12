// src/utils/helpers.js - Utility helper functions

/**
 * Convert social media handle to full URL
 */
export function socialLink(handle, platform) {
  if (!handle) return null;
  
  const baseUrls = {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    linkedin: 'https://linkedin.com/company/',
  };
  
  if (handle.startsWith('http')) return handle;
  
  const cleanHandle = handle.replace(/^@/, '');
  return baseUrls[platform] ? `${baseUrls[platform]}${cleanHandle}` : null;
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Filter businesses by search query and categories
 */
export function filterBusinesses(businesses, searchQuery, selectedCategories) {
  return businesses.filter(biz => {
    // Category match
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(biz.cat);
    
    // Search match
    const query = searchQuery.toLowerCase();
    const matchSearch = !query || 
      biz.name.toLowerCase().includes(query) ||
      biz.desc.toLowerCase().includes(query) ||
      biz.cat.toLowerCase().includes(query);
    
    return matchCategory && matchSearch;
  });
}

/**
 * Separate businesses by tier
 */
export function separateByTier(businesses) {
  const premium = businesses.filter(b => b.tier === 'premium');
  const basic = businesses.filter(b => b.tier !== 'premium');
  return { premium, basic };
}

/**
 * Get status badge colors
 */
export function getStatusColors(status) {
  const colors = {
    approved: { bg: '#d1fae5', color: '#065f46' },
    pending: { bg: '#fef3c7', color: '#92400e' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
  };
  return colors[status] || colors.pending;
}

/**
 * Format date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate text to specified length
 */
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure URL has protocol
 */
export function ensureHttps(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
