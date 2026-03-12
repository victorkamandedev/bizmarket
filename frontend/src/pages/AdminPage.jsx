// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import BusinessForm from '../components/BusinessForm';
import NewsForm from '../components/NewsForm';

const SB = ({ label, bg, onClick }) => (
  <button onClick={onClick} style={{ background: bg, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
    {label}
  </button>
);

const Badge = ({ text, bg, color }) => (
  <span style={{ background: bg, color, borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700, marginRight: 4 }}>{text}</span>
);

export default function AdminPage({ onBack }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('pending');
  const [bizList, setBizList] = useState([]);
  const [users, setUsers] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBiz, setEditBiz] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [biz, usr, news] = await Promise.all([
        api.businesses.adminAll(),
        api.users.list(),
        api.news.adminAll()
      ]);
      console.log('Loaded businesses:', biz);
      console.log('Loaded users:', usr);
      console.log('Loaded news:', news);
      setBizList(biz || []);
      setUsers(usr || []);
      setNewsList(news || []);
    } catch (e) {
      console.error('Admin load error:', e);
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AdminPage mounted, user:', user);
    loadAll();
  }, []);

  // Access control
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Admin only.</p>
        <button onClick={onBack} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Error Loading Admin Panel</h2>
        <p style={{ color: '#ef4444', marginTop: 16 }}>{error}</p>
        <button onClick={loadAll} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>
          Retry
        </button>
        <button onClick={onBack} style={{ marginTop: 16, marginLeft: 8, padding: '8px 16px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  // Filter businesses
  const pending = bizList.filter(b => b.status === 'pending');
  const approved = bizList.filter(b => b.status === 'approved');
  const rejected = bizList.filter(b => b.status === 'rejected');

  // Business actions
  const setStatus = async (id, status) => {
    try {
      await api.businesses.setStatus(id, status);
      setBizList(bizList.map(b => b.id === id ? { ...b, status } : b));
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  const flipTier = async (id, current) => {
    try {
      const tier = current === 'premium' ? 'free' : 'premium';
      await api.businesses.setTier(id, tier);
      setBizList(bizList.map(b => b.id === id ? { ...b, tier } : b));
    } catch (e) {
      alert('Failed to update tier: ' + e.message);
    }
  };

  const deleteBiz = async id => {
    if (!window.confirm('Remove listing?')) return;
    try {
      await api.businesses.delete(id);
      setBizList(bizList.filter(b => b.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  // User actions
  const deleteUser = async id => {
    if (!window.confirm('Remove this user?')) return;
    try {
      await api.users.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      alert('Failed to delete user: ' + e.message);
    }
  };

  const setRole = async (id, role) => {
    try {
      const updated = await api.users.setRole(id, role);
      setUsers(users.map(u => u.id === id ? updated : u));
    } catch (e) {
      alert('Failed to update role: ' + e.message);
    }
  };

  const inviteTeamMember = async (name, email, password) => {
    try {
      const newUser = await api.users.invite({ name, email, password });
      setUsers([...users, newUser]);
      setShowInviteForm(false);
      return true;
    } catch (e) {
      alert('Failed to invite: ' + e.message);
      return false;
    }
  };

  // News actions
  const deleteNews = async id => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.news.delete(id);
      setNewsList(newsList.filter(n => n.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  const publishNews = async (id, status) => {
    try {
      await api.news.setStatus(id, status);
      setNewsList(newsList.map(n => n.id === id ? { ...n, status } : n));
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  const toggleSponsor = async (id, current) => {
    try {
      await api.news.setSponsor(id, { sponsored: !current });
      setNewsList(newsList.map(n => n.id === id ? { ...n, sponsored: !current } : n));
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  };

  // Styles
  const statusColors = {
    approved: { bg: '#d1fae5', color: '#065f46' },
    pending: { bg: '#fef3c7', color: '#92400e' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
  };

  // Business Row Component
  const BizRow = ({ biz }) => {
    const sc = statusColors[biz.status] || statusColors.pending;
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
          {biz.imgs?.[0] && (
            <img
              src={biz.imgs[0]}
              alt={biz.name}
              style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
          <div>
            <strong style={{ fontSize: 15 }}>{biz.name}</strong>
            <span style={{ display: 'block', fontSize: 12, color: '#9ca3af', margin: '2px 0 4px' }}>
              {biz.cat} · {biz.owner} · {biz.date}
            </span>
            <p style={{ fontSize: 13, color: '#6b7280' }}>{biz.desc?.slice(0, 90)}…</p>
            <div style={{ marginTop: 5 }}>
              <Badge text={biz.status} bg={sc.bg} color={sc.color} />
              <Badge
                text={biz.tier}
                bg={biz.tier === 'premium' ? '#fef3c7' : '#f3f4f6'}
                color={biz.tier === 'premium' ? '#92400e' : '#6b7280'}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {biz.status === 'pending' && (
            <>
              <SB label="✓ Approve" bg="#10b981" onClick={() => setStatus(biz.id, 'approved')} />
              <SB label="✕ Reject" bg="#ef4444" onClick={() => setStatus(biz.id, 'rejected')} />
            </>
          )}
          {biz.status === 'approved' && (
            <SB label="Suspend" bg="#ef4444" onClick={() => setStatus(biz.id, 'rejected')} />
          )}
          {biz.status === 'rejected' && (
            <SB label="Restore" bg="#10b981" onClick={() => setStatus(biz.id, 'approved')} />
          )}
          <SB
            label={biz.tier === 'premium' ? '⬇ Downgrade' : '⬆ Upgrade'}
            bg="#f59e0b"
            onClick={() => flipTier(biz.id, biz.tier)}
          />
          <SB label="✏ Edit" bg="#3b82f6" onClick={() => setEditBiz(biz)} />
          <SB label="🗑" bg="#6b7280" onClick={() => deleteBiz(biz.id)} />
        </div>
      </div>
    );
  };

  // Calculate revenue
  const premiumBiz = bizList.filter(b => b.tier === 'premium' && b.status === 'approved');
  const sponsoredArticles = newsList.filter(n => n.sponsored);
  const marketplaceRevenue = premiumBiz.length * 1000; // KES 1000/month avg
  const newsRevenue = sponsoredArticles.reduce((sum, n) => sum + (n.sponsorAmount || 0), 0);
  const totalRevenue = marketplaceRevenue + newsRevenue;

  // Tabs configuration
  const tabs = [
    { id: 'pending', label: `Pending (${pending.length})` },
    { id: 'approved', label: `Approved (${approved.length})` },
    { id: 'rejected', label: `Rejected (${rejected.length})` },
    { id: 'team', label: `Team (${users.filter(u => u.role === 'admin').length})` },
    { id: 'news', label: `News (${newsList.length})` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7' }}>
      {/* Modals */}
      {editBiz && (
        <BusinessForm
          editBiz={editBiz}
          onClose={() => setEditBiz(null)}
          onSaved={() => {
            loadAll();
            setEditBiz(null);
          }}
        />
      )}

      {showNewsForm && (
        <NewsForm
          editArticle={editNews}
          onClose={() => {
            setShowNewsForm(false);
            setEditNews(null);
          }}
          onSaved={() => {
            loadAll();
            setShowNewsForm(false);
            setEditNews(null);
          }}
        />
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)', color: '#fff', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 2 }}>🛠 Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 14 }}>Manage listings, users, and platform</p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.3)',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Marketplace
        </button>
      </div>

      {/* Stats with Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16, padding: '20px 32px' }}>
        {[
          {
            label: 'Total Revenue',
            val: `KES ${totalRevenue.toLocaleString()}`,
            icon: '💰',
            subtitle: 'This month',
            highlight: true,
          },
          {
            label: 'Marketplace',
            val: `KES ${marketplaceRevenue.toLocaleString()}`,
            icon: '🏪',
            subtitle: `${premiumBiz.length} premium`,
          },
          {
            label: 'News Sponsors',
            val: `KES ${newsRevenue.toLocaleString()}`,
            icon: '📰',
            subtitle: `${sponsoredArticles.length} articles`,
          },
          { label: 'Total Listings', val: bizList.length, icon: '📋', subtitle: `${pending.length} pending` },
          { label: 'Team Members', val: users.filter(u => u.role === 'admin').length, icon: '👥' },
          {
            label: 'News Articles',
            val: newsList.length,
            icon: '📝',
            subtitle: `${newsList.filter(n => n.status === 'published').length} published`,
          },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: s.highlight ? 'linear-gradient(135deg, #1e3a8a, #7c3aed)' : '#fff',
              color: s.highlight ? '#fff' : '#1e3a8a',
              borderRadius: 12,
              padding: 18,
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,.07)',
              border: s.highlight ? '2px solid #f59e0b' : 'none',
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: s.highlight ? 28 : 26, fontWeight: 800 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: s.highlight ? 'rgba(255,255,255,.8)' : '#6b7280', marginTop: 2 }}>
              {s.label}
            </div>
            {s.subtitle && (
              <div style={{ fontSize: 11, color: s.highlight ? 'rgba(255,255,255,.7)' : '#9ca3af', marginTop: 4 }}>
                {s.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '0 32px', borderBottom: '2px solid #e5e7eb', background: '#fff', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 18px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              color: tab === t.id ? '#2563eb' : '#6b7280',
              borderBottom: `3px solid ${tab === t.id ? '#2563eb' : 'transparent'}`,
              marginBottom: -2,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '20px 32px' }}>
        {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>Loading…</p>}

        {/* Pending Tab */}
        {!loading && tab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>No pending listings.</p>
            ) : (
              pending.map(b => <BizRow key={b.id} biz={b} />)
            )}
          </div>
        )}

        {/* Approved Tab */}
        {!loading && tab === 'approved' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {approved.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>No approved listings.</p>
            ) : (
              approved.map(b => <BizRow key={b.id} biz={b} />)
            )}
          </div>
        )}

        {/* Rejected Tab */}
        {!loading && tab === 'rejected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rejected.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>No rejected listings.</p>
            ) : (
              rejected.map(b => <BizRow key={b.id} biz={b} />)
            )}
          </div>
        )}

        {/* Team Tab */}
        {!loading && tab === 'team' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  Team Members ({users.filter(u => u.role === 'admin').length})
                </h2>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                  Team members have full admin access to manage the platform
                </p>
              </div>
              <button
                onClick={() => setShowInviteForm(true)}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Invite Team Member
              </button>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
              <InviteForm 
                onInvite={inviteTeamMember} 
                onCancel={() => setShowInviteForm(false)} 
              />
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {users.filter(u => u.role === 'admin').map(u => (
                <div
                  key={u.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {u.name[0]}
                    </div>
                    <div>
                      <strong style={{ fontSize: 15 }}>{u.name}</strong>
                      <span style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>{u.email}</span>
                      <div style={{ marginTop: 3 }}>
                        <Badge
                          text="Admin"
                          bg='#ede9fe'
                          color='#6d28d9'
                        />
                        <span style={{ fontSize: 12, color: '#6b7280' }}>
                          Listings: {bizList.filter(b => b.owner === u.email).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  {u.email === user.email ? (
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>(You - Super Admin)</span>
                  ) : (
                    <SB label="🗑 Remove" bg="#ef4444" onClick={() => deleteUser(u.id)} />
                  )}
                </div>
              ))}
              
              {users.filter(u => u.role === 'admin').length === 0 && (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
                  No team members yet. Click "Invite Team Member" to add someone.
                </p>
              )}
            </div>
          </div>
        )}

        {/* News Tab */}
        {!loading && tab === 'news' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>News Articles ({newsList.length})</h2>
              <button
                onClick={() => setShowNewsForm(true)}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + New Article
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {newsList.map(article => (
                <div
                  key={article.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 16 }}>
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
                        onError={e => (e.target.style.display = 'none')}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a8a' }}>
                          {article.title}
                          {article.sponsored && (
                            <span
                              style={{
                                marginLeft: 8,
                                fontSize: 12,
                                background: '#fef3c7',
                                color: '#92400e',
                                padding: '2px 8px',
                                borderRadius: 10,
                              }}
                            >
                              💰 SPONSORED
                            </span>
                          )}
                          {article.featured && (
                            <span
                              style={{
                                marginLeft: 4,
                                fontSize: 12,
                                background: '#ede9fe',
                                color: '#6d28d9',
                                padding: '2px 8px',
                                borderRadius: 10,
                              }}
                            >
                              ⭐ Featured
                            </span>
                          )}
                        </h3>
                      </div>

                      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{article.summary}</p>

                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
                        <span>{article.category}</span> • <span> {article.author}</span> •{' '}
                        <span> {article.status}</span>
                        {article.sponsored && <span> • KES {article.sponsorAmount?.toLocaleString()}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {article.status === 'draft' && (
                          <SB label="✓ Publish" bg="#10b981" onClick={() => publishNews(article.id, 'published')} />
                        )}
                        {article.status === 'published' && (
                          <SB label="Archive" bg="#6b7280" onClick={() => publishNews(article.id, 'archived')} />
                        )}
                        {article.status === 'archived' && (
                          <SB label="Restore" bg="#10b981" onClick={() => publishNews(article.id, 'published')} />
                        )}
                        <SB
                          label={article.sponsored ? 'Remove Sponsor' : 'Mark Sponsored'}
                          bg="#f59e0b"
                          onClick={() => toggleSponsor(article.id, article.sponsored)}
                        />
                        <SB
                          label="✏ Edit"
                          bg="#3b82f6"
                          onClick={() => {
                            setEditNews(article);
                            setShowNewsForm(true);
                          }}
                        />
                        <SB label="🗑" bg="#ef4444" onClick={() => deleteNews(article.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {newsList.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
                  No articles yet. Click "New Article" to create one.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Invite Team Member Form Component
function InviteForm({ onInvite, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert('All fields are required');
      return;
    }
    
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setBusy(true);
    const success = await onInvite(form.name, form.email, form.password);
    setBusy(false);
    
    if (success) {
      setForm({ name: '', email: '', password: '' });
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 14,
    marginBottom: 12,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      border: '2px solid #2563eb',
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
        👥 Invite New Team Member
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Full Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handle}
            placeholder="John Doe"
            style={inputStyle}
            disabled={busy}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handle}
            placeholder="john@example.com"
            style={inputStyle}
            disabled={busy}
          />
        </div>
      </div>

      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        Password *
      </label>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handle}
          placeholder="Minimum 6 characters"
          style={inputStyle}
          disabled={busy}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            color: '#6b7280',
            fontWeight: 600,
          }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, background: '#eff6ff', padding: 10, borderRadius: 6 }}>
        💡 This person will have full admin access. They can manage businesses, users, news, and all platform features.
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={busy}
          style={{
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={busy}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Inviting...' : '✓ Send Invite'}
        </button>
      </div>
    </div>
  );
}

