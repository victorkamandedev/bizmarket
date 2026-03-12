// src/components/ProfileModal.jsx
import { useState } from 'react';
import { Overlay, Stars, inputStyle, btnPrimaryStyle } from './ui';

function socialLink(handle, base) {
  if (!handle) return null;
  return handle.startsWith('http') ? handle : `${base}/${handle.replace(/^@/, '')}`;
}

export default function ProfileModal({ biz, onClose }) {
  const [tab,    setTab]    = useState('about');
  const [sent,   setSent]   = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [form,   setForm]   = useState({ name: '', email: '', msg: '' });
  const imgs = biz.imgs || [];
  const ig   = socialLink(biz.instagram, 'https://instagram.com');
  const fb   = socialLink(biz.facebook,  'https://facebook.com');

  const ActionBtn = ({ href, bg, icon, label }) => href ? (
    <a href={href} target={href.startsWith('tel:') || href.startsWith('mailto:') ? '_self' : '_blank'} rel="noopener noreferrer"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: bg, borderRadius: 12, padding: '10px 14px', textDecoration: 'none', flex: 1, minWidth: 56 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{label}</span>
    </a>
  ) : null;

  const ContactRow = ({ href, icon, label, value, color }) => href ? (
    <a href={href} target={href.startsWith('tel:') || href.startsWith('mailto:') ? '_self' : '_blank'} rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: '#f9fafb', borderRadius: 10, textDecoration: 'none', color: '#111', border: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: 12, color, fontWeight: 600 }}>Open →</span>
    </a>
  ) : null;

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Hero gallery */}
        <div style={{ position: 'relative', height: 220, background: '#1e293b', flexShrink: 0 }}>
          {imgs.length > 0
            ? <img src={imgs[imgIdx]} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.target.src = 'https://placehold.co/520x220/1e293b/fff?text=No+Image'} />
            : <div style={{ height: 220, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Images</div>
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.45)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          {biz.tier === 'premium' && <div style={{ position: 'absolute', top: 12, left: 12 }}><span style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>⭐ Premium</span></div>}

          {/* Gallery dots & arrows */}
          {imgs.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
              {imgs.map((_, i) => <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 22 : 7, height: 7, borderRadius: 4, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width .2s' }} />)}
            </div>
          )}
          {imgs.length > 1 && imgIdx > 0 && <button onClick={() => setImgIdx(i => i - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.4)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', fontSize: 16 }}>‹</button>}
          {imgs.length > 1 && imgIdx < imgs.length - 1 && <button onClick={() => setImgIdx(i => i + 1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.4)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', fontSize: 16 }}>›</button>}

          {/* Name overlay */}
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, textShadow: '0 1px 3px rgba(0,0,0,.5)' }}>{biz.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <Stars r={4} n={12} />
              <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 600 }}>{biz.cat}</span>
            </div>
          </div>
        </div>

        {/* Quick action row */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f3f4', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ActionBtn href={biz.phone ? `tel:${biz.phone}` : null}         bg="#f0fdf4" icon="📞" label="Call" />
          <ActionBtn href={biz.email ? `mailto:${biz.email}` : null}      bg="#eff6ff" icon="✉️" label="Email" />
          <ActionBtn href={biz.website || null}                            bg="#faf5ff" icon="🌐" label="Website" />
          <ActionBtn href={ig}                                             bg="linear-gradient(135deg,#fdf2f8,#fef3c7)" icon="📸" label="Instagram" />
          <ActionBtn href={fb}                                             bg="#eff6ff"  icon="📘" label="Facebook" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#fff', flexShrink: 0 }}>
          {['about', 'contact'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: 'none', border: 'none', padding: '12px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', color: tab === t ? '#2563eb' : '#6b7280',
              borderBottom: `2px solid ${tab === t ? '#2563eb' : 'transparent'}`, textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          {tab === 'about' && (
            <>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{biz.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ContactRow href={biz.phone ? `tel:${biz.phone}` : null}    icon="📞" label="Phone"     value={biz.phone}                                   color="#065f46" />
                <ContactRow href={biz.email ? `mailto:${biz.email}` : null} icon="✉️" label="Email"     value={biz.email}                                   color="#1e40af" />
                <ContactRow href={biz.website || null}                      icon="🌐" label="Website"   value={(biz.website||'').replace(/^https?:\/\//, '')} color="#6d28d9" />
                <ContactRow href={ig}                                        icon="📸" label="Instagram"  value={`@${(biz.instagram||'').replace(/^@/, '')}`}  color="#be185d" />
                <ContactRow href={fb}                                        icon="📘" label="Facebook"   value={(biz.facebook||'').replace(/^@/, '')}          color="#1d4ed8" />
              </div>
            </>
          )}

          {tab === 'contact' && (
            sent ? (
              <div style={{ background: '#f0fdf4', color: '#065f46', border: '1px solid #86efac', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Message Sent!</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>They'll be in touch soon.</div>
                <button onClick={() => setSent(false)} style={{ marginTop: 12, background: 'none', border: '1px solid #10b981', color: '#065f46', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Send Another</button>
              </div>
            ) : (
              <>
                <h4 style={{ fontSize: 15, marginBottom: 14, color: '#374151' }}>Send a Message to {biz.name}</h4>
                <input placeholder="Your name"  value={form.name}  onChange={e => setForm({ ...form, name:  e.target.value })} style={inputStyle} />
                <input placeholder="Your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                <textarea placeholder="Your message..." value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                <button onClick={() => { if (form.name && form.email && form.msg) setSent(true); }} style={{ ...btnPrimaryStyle, width: '100%' }}>Send Message</button>
              </>
            )
          )}
        </div>
      </div>
    </Overlay>
  );
}
