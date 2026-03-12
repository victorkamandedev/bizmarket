// src/components/ui.jsx – shared primitive components
import { colors, radius, shadows, inputStyle as inputStyleBase, buttonPrimary } from '../styles/common';

// ── Modal overlay ─────────────────────────────────────────────────────────────
export function Overlay({ children, onClose }) {
  return (
    <div 
      onClick={onClose} 
      style={{
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,.5)', 
        zIndex: 300,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 20, 
        backdropFilter: 'blur(3px)',
      }}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// ── Close button ──────────────────────────────────────────────────────────────
export function CloseBtn({ onClose }) {
  return (
    <button 
      onClick={onClose} 
      style={{
        position: 'absolute', 
        top: 14, 
        right: 14,
        background: colors.gray100, 
        border: 'none', 
        borderRadius: '50%',
        width: 30, 
        height: 30, 
        cursor: 'pointer', 
        fontSize: 15,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      ✕
    </button>
  );
}

// ── Star rating ───────────────────────────────────────────────────────────────
export function Stars({ r = 4, n = 12 }) {
  return (
    <span style={{ color: colors.warning, fontSize: 13 }}>
      {'★'.repeat(r)}{'☆'.repeat(5 - r)}
      <span style={{ color: colors.gray400, fontSize: 11, marginLeft: 4 }}>({n})</span>
    </span>
  );
}

// ── Image grid ────────────────────────────────────────────────────────────────
const PLACEHOLDER = 'https://placehold.co/400x200/e5e7eb/9ca3af?text=Photo';

export function ImageGrid({ imgs, height = 160 }) {
  const onErr = e => { e.target.src = PLACEHOLDER; };

  if (!imgs || imgs.length === 0) {
    return (
      <div style={{ 
        height, 
        background: colors.gray200, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: colors.gray400, 
        fontSize: 13 
      }}>
        No Image
      </div>
    );
  }

  if (imgs.length === 1) {
    return (
      <img 
        src={imgs[0]} 
        onError={onErr} 
        alt="business" 
        style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} 
      />
    );
  }

  return (
    <div>
      <img 
        src={imgs[0]} 
        onError={onErr} 
        alt="main" 
        style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} 
      />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${Math.min(imgs.length - 1, 3)}, 1fr)`, 
        gap: 2, 
        marginTop: 2 
      }}>
        {imgs.slice(1, 4).map((img, i) => (
          <img 
            key={i} 
            src={img} 
            onError={onErr} 
            alt={`thumb ${i}`} 
            style={{ width: '100%', height: 65, objectFit: 'cover', display: 'block' }} 
          />
        ))}
      </div>
    </div>
  );
}

// ── Export shared style objects ──────────────────────────────────────────────
export const inputStyle = inputStyleBase;
export const btnPrimaryStyle = buttonPrimary;
