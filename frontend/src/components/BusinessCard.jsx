// src/components/BusinessCard.jsx
import { ImageGrid, Stars } from './ui';

function socialLink(handle, base) {
  if (!handle) return null;
  return handle.startsWith('http') ? handle : `${base}/${handle.replace(/^@/, '')}`;
}

// ── Premium card ──────────────────────────────────────────────────────────────
export function PremiumCard({ biz, onClick }) {
  const ig = socialLink(biz.instagram, 'https://instagram.com');
  const fb = socialLink(biz.facebook,  'https://facebook.com');

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,.18)', cursor: 'pointer',
      transition: 'transform .18s, box-shadow .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,.22)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.18)'; }}
    >
      <ImageGrid imgs={biz.imgs} height={170} />
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{biz.name}</span>
          <span style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
            ⭐ Premium
          </span>
        </div>
        <Stars />
        <p style={{ color: '#6b7280', fontSize: 13, margin: '8px 0 12px', lineHeight: 1.5 }}>{biz.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {biz.phone   && <a href={`tel:${biz.phone}`}   onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: 'none' }} title={`Call ${biz.phone}`}>📞</a>}
          {biz.email   && <a href={`mailto:${biz.email}`} onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: 'none' }} title="Email">✉️</a>}
          {biz.website && <a href={biz.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: 'none' }} title="Website">🌐</a>}
          {ig          && <a href={ig}           target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: 'none' }} title="Instagram">📸</a>}
          {fb          && <a href={fb}           target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: 'none' }} title="Facebook">📘</a>}
          <span style={{ marginLeft: 'auto', background: '#eff6ff', color: '#2563eb', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{biz.cat}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Tap to view full profile</div>
      </div>
    </div>
  );
}

// ── Basic (free) card ─────────────────────────────────────────────────────────
export function BasicCard({ biz, onClick }) {
  const ig = socialLink(biz.instagram, 'https://instagram.com');

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,.07)', display: 'flex', flexDirection: 'column', cursor: 'pointer',
      transition: 'transform .18s, box-shadow .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.07)'; }}
    >
      <div style={{ position: 'relative' }}>
        <ImageGrid imgs={biz.imgs} height={110} />
        <span style={{ position: 'absolute', top: 8, right: 8, background: '#10b981', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Free</span>
      </div>
      <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{biz.name}</span>
          <span style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>{biz.cat}</span>
        </div>
        <Stars r={4} n={7} />
        <p style={{ color: '#6b7280', fontSize: 12, margin: '5px 0 10px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {biz.desc}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {biz.phone && <a href={`tel:${biz.phone}`} onClick={e => e.stopPropagation()} style={{ fontSize: 16, textDecoration: 'none' }} title="Call">📞</a>}
            {ig        && <a href={ig} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 16, textDecoration: 'none' }} title="Instagram">📸</a>}
          </div>
          <button onClick={e => { e.stopPropagation(); onClick(); }} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
