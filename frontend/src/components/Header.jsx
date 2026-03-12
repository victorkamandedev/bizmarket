// src/components/Header.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import { CATEGORIES, CATEGORY_ICONS, NAVIGATION_TABS } from '../constants';
import * as styles from '../styles/headerStyles';
import UserDashboard from './UserDashboard';

export default function Header({ 
  currentTab, 
  onTabChange, 
  search, 
  onSearch, 
  selCats, 
  toggleCat, 
  clearCats, 
  onLoginClick, 
  onAdminClick 
}) {
  const { user, logout } = useAuth();
  const [focused, setFocused] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const searchRef = useRef(null);

  // Close search suggestions when clicking outside
  useClickOutside(searchRef, () => setFocused(false));

  // Filter suggestions based on search
  const suggestions = search.length > 0
    ? CATEGORIES.filter(c => c.toLowerCase().includes(search.toLowerCase()) && !selCats.includes(c))
    : [];

  const hasChips = selCats.length > 0;
  const showSearch = currentTab === 'marketplace';

  const handleSuggestionClick = (category) => {
    toggleCat(category);
    onSearch('');
    setFocused(false);
  };

  return (
    <>
      <header style={styles.headerContainer}>
        {/* Top bar with logo, tabs, and auth */}
        <div style={styles.topBar}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🏢</span>
            <div>
              <div style={styles.logoText}>Youth Market Place</div>
              <div style={styles.logoTagline}>Connecting Young Entrepreneurs</div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav style={styles.navContainer}>
            {NAVIGATION_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={styles.navButton(currentTab === tab.id)}
                onMouseEnter={e => { 
                  if (currentTab !== tab.id) e.currentTarget.style.background = '#f3f4f6'; 
                }}
                onMouseLeave={e => { 
                  if (currentTab !== tab.id) e.currentTarget.style.background = 'transparent'; 
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Auth buttons */}
          <div style={styles.authContainer}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button onClick={onAdminClick} style={styles.adminButton}>
                    🛠 Admin
                  </button>
                )}
                <button onClick={() => setShowDash(true)} style={styles.myListingsButton}>
                  My Listings
                </button>
                <button onClick={logout} style={styles.logoutButton}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={onLoginClick} style={styles.loginButton}>
                  Log In
                </button>
                <button onClick={onLoginClick} style={styles.signupButton}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search bar (only on marketplace page) */}
        {showSearch && (
          <div style={styles.searchSection}>
            <div style={styles.searchContainer} ref={searchRef}>
              <div style={styles.searchInput(hasChips, focused)}>
                <span style={{ fontSize: 16 }}>🔍</span>
                <input
                  placeholder="Search businesses, services..."
                  value={search}
                  onChange={e => onSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  style={styles.searchInputField}
                />
                {search && (
                  <button onClick={() => onSearch('')} style={styles.searchClearButton}>
                    ✕
                  </button>
                )}
              </div>

              {/* Active category chips */}
              {hasChips && (
                <div style={styles.chipsContainer}>
                  {selCats.map(c => (
                    <span key={c} style={styles.chip}>
                      {c}
                      <button onClick={() => toggleCat(c)} style={styles.chipCloseButton}>
                        ✕
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearCats}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      fontSize: 11,
                      cursor: 'pointer',
                      padding: '2px 4px',
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Category suggestions */}
              {focused && search.length > 0 && suggestions.length > 0 && (
                <div style={styles.suggestionDropdown}>
                  <div style={styles.suggestionHeader}>Categories</div>
                  {suggestions.map(c => (
                    <div
                      key={c}
                      onClick={() => handleSuggestionClick(c)}
                      style={styles.suggestionItem}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[c]}</span>
                      <span>{c}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>
                        Filter by category
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {showDash && <UserDashboard onClose={() => setShowDash(false)} />}
    </>
  );
}
