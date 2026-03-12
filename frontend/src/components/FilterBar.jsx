// src/components/FilterBar.jsx
import { useState, useRef, useEffect } from 'react';

const CATS = ['Café','Repair','Design','Food','Retail','Tech','Health','Other'];
const ICONS = { Café:'☕', Repair:'🔧', Design:'🎨', Food:'🍽️', Retail:'🛍️', Tech:'💻', Health:'❤️‍🩹', Other:'📦' };

export default function FilterBar({ selCats, toggleCat, clearCats }) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = selCats.length > 0;

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>

      {/* All button */}
      <button onClick={clearCats} style={{
        background: !active ? '#2563eb' : 'none',
        color: !active ? '#fff' : '#374151',
        border: `1.5px solid ${!active ? '#2563eb' : '#e5e7eb'}`,
        borderRadius: 20, padding: '5px 16px', fontSize: 13, cursor: 'pointer',
        fontWeight: !active ? 600 : 400, whiteSpace: 'nowrap', margin: '10px 0',
      }}>
        All
      </button>

      {/* Filter dropdown */}
      <div style={{ position: 'relative' }} ref={filterRef}>
        <button onClick={() => setShowFilter(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: showFilter || active ? '#eff6ff' : 'none',
          color: showFilter || active ? '#2563eb' : '#374151',
          border: `1.5px solid ${showFilter || active ? '#2563eb' : '#e5e7eb'}`,
          borderRadius: 20, padding: '5px 16px', fontSize: 13, cursor: 'pointer',
          fontWeight: 600, whiteSpace: 'nowrap', margin: '10px 0', transition: 'all .15s',
        }}>
          <span>⚙ Filter</span>
          {active && (
            <span style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
              {selCats.length}
            </span>
          )}
          <span style={{ fontSize: 10 }}>{showFilter ? '▲' : '▼'}</span>
        </button>

        {showFilter && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.14)',
            zIndex: 200, minWidth: 240, border: '1px solid #e5e7eb', overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Filter by Category</span>
              {active && <button onClick={clearCats} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Clear all</button>}
            </div>

            <div style={{ padding: '0 8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CATS.map(c => {
                const isActive = selCats.includes(c);
                return (
                  <div key={c} onClick={() => toggleCat(c)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                    borderRadius: 8, cursor: 'pointer',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1e40af' : '#374151', transition: 'background .12s',
                  }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 16 }}>{ICONS[c]}</span>
                    <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, flex: 1 }}>{c}</span>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5,
                      border: `2px solid ${isActive ? '#2563eb' : '#d1d5db'}`,
                      background: isActive ? '#2563eb' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isActive && <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', padding: '10px 16px' }}>
              <button onClick={() => setShowFilter(false)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                {selCats.length === 0 ? 'Show All Results' : `Show results for ${selCats.join(', ')}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active chips in bar */}
      {active && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
          {selCats.map(c => (
            <span key={c} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#dbeafe', color: '#1e40af', borderRadius: 20,
              padding: '3px 10px 3px 12px', fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {c}
              <button onClick={() => toggleCat(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', fontSize: 13, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
