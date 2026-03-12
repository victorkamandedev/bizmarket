// src/components/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { Overlay, CloseBtn } from './ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import BusinessForm from './BusinessForm';

export default function UserDashboard({ onClose }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBiz,  setEditBiz]  = useState(null);

  const load = () => {
    setLoading(true);
    api.users.myListings()
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async id => {
    if (!window.confirm('Remove this listing?')) return;
    await api.businesses.delete(id);
    setListings(listings.filter(b => b.id !== id));
  };

  const statusColor = s => s === 'approved' ? { bg: '#d1fae5', color: '#065f46' } : s === 'pending' ? { bg: '#fef3c7', color: '#92400e' } : { bg: '#fee2e2', color: '#991b1b' };

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <CloseBtn onClose={onClose} />
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>My Dashboard</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Hello, {user?.name} 👋</p>

        <button onClick={() => { setEditBiz(null); setShowForm(true); }} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
          + Add New Listing
        </button>

        {showForm && (
          <BusinessForm
            editBiz={editBiz}
            onClose={() => setShowForm(false)}
            onSaved={load}
          />
        )}

        {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>Loading…</p>}
        {!loading && listings.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>No listings yet. Add one above!</p>}

        {listings.map(biz => {
          const sc = statusColor(biz.status);
          return (
            <div key={biz.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#f9fafb', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              {biz.imgs?.[0] && (
                <img src={biz.imgs[0]} alt={biz.name} style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
              )}
              <div style={{ flex: 1 }}>
                <strong>{biz.name}</strong>
                <span style={{ display: 'block', fontSize: 12, color: '#9ca3af', margin: '2px 0 5px' }}>{biz.cat} · {biz.date}</span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
                  <span style={{ background: sc.bg, color: sc.color, borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{biz.status}</span>
                  <span style={{ background: biz.tier === 'premium' ? '#fef3c7' : '#f3f4f6', color: biz.tier === 'premium' ? '#92400e' : '#6b7280', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{biz.tier}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#6b7280', flexWrap: 'wrap' }}>
                  {biz.phone     && <span>📞 {biz.phone}</span>}
                  {biz.website   && <span>🌐 {biz.website.replace(/^https?:\/\//, '')}</span>}
                  {biz.instagram && <span>📸 @{biz.instagram}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setEditBiz(biz); setShowForm(true); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏ Edit</button>
                <button onClick={() => remove(biz.id)} style={{ background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>
    </Overlay>
  );
}
