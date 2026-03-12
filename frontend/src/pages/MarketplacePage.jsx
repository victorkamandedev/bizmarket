// src/pages/MarketplacePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { PremiumCard, BasicCard } from '../components/BusinessCard';
import ProfileModal from '../components/ProfileModal';
import BusinessForm from '../components/BusinessForm';

export default function MarketplacePage({ search, selCats, onLoginClick }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [profile,    setProfile]    = useState(null);   // biz being viewed
  const [showAdd,    setShowAdd]    = useState(false);

  const load = () => {
    setLoading(true);
    api.businesses.list()
      .then(setBusinesses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Client-side filter (search + categories)
  const filtered = businesses.filter(biz => {
    const matchCat = selCats.length === 0 || selCats.includes(biz.cat);
    const q = search.toLowerCase();
    const matchSearch = !q || biz.name.toLowerCase().includes(q) || biz.desc.toLowerCase().includes(q) || biz.cat.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const premium = filtered.filter(b => b.tier === 'premium');
  const basic   = filtered.filter(b => b.tier !== 'premium');

  return (
    <main>
      {/* ── Premium section ─────────────────────────────────────────────── */}
      {premium.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #ec4899 100%)', padding: '28px 24px 36px' }}>
          <h2 style={{ color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 16 }}>
            ⭐ Premium
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {premium.map(biz => <PremiumCard key={biz.id} biz={biz} onClick={() => setProfile(biz)} />)}
          </div>
        </section>
      )}

      {/* ── Basic section ────────────────────────────────────────────────── */}
      <section style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: '#1a1a2e' }}>
            All Businesses (Basic)
          </h2>
          {user
            ? <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: '8px 16px' }}>+ List Your Business</button>
            : <button onClick={onLoginClick} className="btn-outline">+ List Your Business</button>
          }
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: 32 }}>⏳</div>
            <p>Loading businesses…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3 style={{ fontSize: 20, color: '#374151', margin: '8px 0 4px' }}>No businesses found</h3>
            <p>Try a different search term or category</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(205px, 1fr))', gap: 16 }}>
          {basic.map(biz => <BasicCard key={biz.id} biz={biz} onClick={() => setProfile(biz)} />)}
        </div>
      </section>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {profile && <ProfileModal biz={profile} onClose={() => setProfile(null)} />}
      {showAdd && user && (
        <BusinessForm
          editBiz={null}
          onClose={() => setShowAdd(false)}
          onSaved={() => { load(); setShowAdd(false); }}
        />
      )}
    </main>
  );
}
