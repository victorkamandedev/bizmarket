// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { inputStyle, btnPrimaryStyle } from '../components/ui';

export default function AuthPage({ onDone }) {
  const { login, register } = useAuth();
  const [mode,  setMode]  = useState('login');
  const [form,  setForm]  = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name || !form.email || !form.password) throw new Error('All fields are required.');
        if (form.password !== form.confirm) throw new Error("Passwords don't match.");
        await register(form.name, form.email, form.password);
      }
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      {/* Back Button */}
      <button
        onClick={onDone}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
      >
        ← Back
      </button>
      
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
        <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 8 }}>🏢</div>
        <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 4 }}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
          {mode === 'login' ? 'Sign in to manage your listing' : 'Join our marketplace community'}
        </p>

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {mode === 'register' && <input name="name"     placeholder="Full Name"        value={form.name}     onChange={h} style={inputStyle} />}
        <input name="email"    placeholder="Email address"    value={form.email}    onChange={h} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={h} onKeyDown={e => e.key === 'Enter' && submit()} style={inputStyle} />
        {mode === 'register' && <input name="confirm" type="password" placeholder="Confirm Password" value={form.confirm} onChange={h} style={inputStyle} />}

        <button onClick={submit} disabled={busy} style={{ ...btnPrimaryStyle, width: '100%', padding: '12px', opacity: busy ? .7 : 1 }}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 14 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </span>
        </p>

        <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#065f46', border: '1px solid #a7f3d0' }}>
          <strong>Demo Admin:</strong> admin@marketplace.com / admin123<br />
          <strong>Demo User:</strong> cafe@example.com / pass123
        </div>
      </div>
    </div>
  );
}
