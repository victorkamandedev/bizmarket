// src/api.js – centralised API calls to the Express backend

const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('bm_token') || '';
}

function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${getToken()}`, ...extra };
}

async function request(method, path, body = null, isFormData = false) {
  const headers = isFormData
    ? authHeaders()
    : authHeaders({ 'Content-Type': 'application/json' });

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body
      ? isFormData ? body : JSON.stringify(body)
      : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login:    (email, password)      => request('POST', '/auth/login',    { email, password }),
    register: (name, email, password)=> request('POST', '/auth/register', { name, email, password }),
    me:       ()                     => request('GET',  '/auth/me'),
  },

  // ── Businesses ──────────────────────────────────────────────────────────────
  businesses: {
    list:       (params = {})  => request('GET',    '/businesses?' + new URLSearchParams(params)),
    adminAll:   ()             => request('GET',    '/businesses/admin/all'),
    get:        (id)           => request('GET',    `/businesses/${id}`),

    create: (formData)         => request('POST',   '/businesses', formData, true),
    update: (id, formData)     => request('PUT',    `/businesses/${id}`, formData, true),
    delete: (id)               => request('DELETE', `/businesses/${id}`),

    setStatus: (id, status)    => request('PATCH',  `/businesses/${id}/status`, { status }),
    setTier:   (id, tier)      => request('PATCH',  `/businesses/${id}/tier`,   { tier }),
  },

  // ── Users (admin) ────────────────────────────────────────────────────────────
  users: {
    list:       ()             => request('GET',    '/users'),
    delete:     (id)           => request('DELETE', `/users/${id}`),
    setRole:    (id, role)     => request('PATCH',  `/users/${id}/role`, { role }),
    myListings: ()             => request('GET',    '/users/my-listings'),
    invite:     (data)         => request('POST',   '/users/invite', data),
  },

  // ── News ─────────────────────────────────────────────────────────────────────
  news: {
    list:       ()             => request('GET',    '/news'),
    adminAll:   ()             => request('GET',    '/news/admin/all'),
    get:        (id)           => request('GET',    `/news/${id}`),
    
    create:     (formData)     => request('POST',   '/news', formData, true),
    update:     (id, formData) => request('PUT',    `/news/${id}`, formData, true),
    delete:     (id)           => request('DELETE', `/news/${id}`),
    
    setStatus:  (id, status)   => request('PATCH',  `/news/${id}/status`, { status }),
    setSponsor: (id, data)     => request('PATCH',  `/news/${id}/sponsor`, data),
  },
};
