// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from './UserDashboard';

const CATS = ['Café','Repair','Design','Food','Retail','Tech','Health','Other'];
const CAT_ICONS = { Café:'☕', Repair:'🔧', Design:'🎨', Food:'🍽️', Retail:'🛍️', Tech:'💻', Health:'❤️', Other:'📦' };

export default function Navbar({ search, onSearch, selCats, toggleCat, clearCats, onLoginClick, onAdminClick }) {
  const { user, logout }        = useAuth();
  const [focused, setFocused]   = useState(false);
  const [showDash, setShowDash] = useState(false);
  const searchRef               = useRef(null);

  const suggestions = search.length > 0
    ? CATS.filter(c => c.toLowerCase().includes(search.toLowerCase()) && !selCats.includes(c))
    : [];

  useEffect(() => {
    const handler = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasChips = selCats.length > 0;

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 60, boxShadow: '0 2px 8px rgba(0,0,0,.08)', gap: 12,
      }}>
        {/* Logo + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 26, color: '#2563eb' }}>🏢</span>
          <strong style={{ fontSize: 16, color: '#1e3a8a', whiteSpace: 'nowrap' }}>BizMarket</strong>

          {/* Search wrapper */}
          <div style={{ flex: 1, maxWidth: 540, position: 'relative' }} ref={searchRef}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#f1f3f4',
              borderRadius: hasChips || focused ? '12px 12px 0 0' : '24px',
              padding: '0 14px', height: 40, gap: 8,
              border: '2px solid transparent', transition: 'border-radius .15s',
            }}>
              <span style={{ fontSize: 15 }}>🔍</span>
              <input
                placeholder="Search businesses, services..."
                value={search}
                onChange={e => onSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14 }}
              />
              {search && (
                <button onClick={() => onSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}>✕</button>
              )}
            </div>

            {/* Active category chips inside search box */}
            {hasChips && (
              <div style={{
                background: '#f1f3f4', padding: '6px 14px 8px',
                display: 'flex', flexWrap: 'wrap', gap: 5,
                borderRadius: '0 0 12px 12px', borderTop: '1px solid #e5e7eb',
              }}>
                {selCats.map(c => (
                  <span key={c} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#2563eb', color: '#fff', borderRadius: 20,
                    padding: '2px 8px 2px 10px', fontSize: 12, fontWeight: 600,
                  }}>
                    {c}
                    <button onClick={() => toggleCat(c)} style={{
                      background: 'rgba(255,255,255,.3)', border: 'none', borderRadius: '50%',
                      width: 14, height: 14, cursor: 'pointer', color: '#fff', fontSize: 10, padding: 0,
                    }}>✕</button>
                  </span>
                ))}
                <button onClick={clearCats}
                  style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Category suggestions dropdown */}
            {focused && search.length > 0 && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', borderRadius: '0 0 12px 12px',
                boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 200,
                border: '1px solid #e5e7eb', borderTop: 'none', overflow: 'hidden',
              }}>
                <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: .5 }}>
                  Categories
                </div>
                {suggestions.map(c => (
                  <div key={c}
                    onClick={() => { toggleCat(c); onSearch(''); setFocused(false); }}
                    style={{ padding: '9px 14px', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 16 }}>{CAT_ICONS[c]}</span>
                    <span>{c}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>Filter by category</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right-side auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: '#555' }}>👤 {user.name}</span>
              {user.role === 'admin' && (
                <button onClick={onAdminClick} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  🛠 Admin
                </button>
              )}
              <button onClick={() => setShowDash(true)} style={{ background: 'none', border: '1.5px solid #2563eb', color: '#2563eb', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                My Listings
              </button>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6b7280' }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#374151' }}>Log In</button>
              <button onClick={onLoginClick} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {showDash && <UserDashboard onClose={() => setShowDash(false)} />}
    </>
  );
}
