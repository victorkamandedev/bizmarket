// src/components/BusinessForm.jsx
import { useState, useRef } from 'react';
import { Overlay, CloseBtn, inputStyle, btnPrimaryStyle } from './ui';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const CATS = ['Café','Repair','Design','Food','Retail','Tech','Health','Other'];
const SHOP_TYPES = [
  { value: 'physical', label: '🏬 Physical Shop', desc: 'Brick & mortar location' },
  { value: 'online', label: '💻 Online Shop', desc: 'E-commerce/delivery only' },
  { value: 'both', label: '🔄 Both', desc: 'Physical + Online' },
];

export default function BusinessForm({ editBiz, onClose, onSaved }) {
  const { user } = useAuth();
  const ex = editBiz;
  
  const [form, setForm] = useState({
    name:      ex?.name      || '',
    cat:       ex?.cat       || 'Café',
    desc:      ex?.desc      || '',
    phone:     ex?.phone     || '',
    email:     ex?.email     || '',
    website:   ex?.website   || '',
    instagram: ex?.instagram || '',
    facebook:  ex?.facebook  || '',
    tier:      ex?.tier      || 'free',
    
    // NEW: Shop type fields
    shopType:       ex?.shopType       || 'physical',
    location:       ex?.location       || '',
    directions:     ex?.directions     || '',
    operatingHours: ex?.operatingHours || '',
    deliveryAreas:  ex?.deliveryAreas  || '',
    deliveryInfo:   ex?.deliveryInfo   || '',
    orderMethods:   ex?.orderMethods   || '',
  });
  
  const [imgs,     setImgs]     = useState(ex?.imgs || []);
  const [urlInput, setUrlInput] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const fileRef = useRef(null);

  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Image limit based on tier
  const imageLimit = form.tier === 'premium' ? 5 : 2;
  const canAddMore = imgs.length < imageLimit;

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    const remaining = imageLimit - imgs.length;
    
    if (files.length > remaining) {
      setError(`You can only add ${remaining} more image${remaining !== 1 ? 's' : ''}. ${form.tier === 'free' ? 'Upgrade to Premium for 5 images!' : ''}`);
      return;
    }
    
    files.forEach(file => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(`Image "${file.name}" is too large. Max 5MB per image.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = ev => {
        if (imgs.length < imageLimit) {
          setImgs(prev => [...prev, ev.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    
    if (imgs.length >= imageLimit) {
      setError(`Maximum ${imageLimit} images allowed. ${form.tier === 'free' ? 'Upgrade to Premium for 5 images!' : ''}`);
      return;
    }
    
    if (!imgs.includes(u)) {
      setImgs(prev => [...prev, u]);
      setUrlInput('');
    }
  };

  const removeImg = idx => setImgs(imgs.filter((_, i) => i !== idx));

  const submit = async () => {
    // Basic validation
    if (!form.name || !form.desc || !form.phone || !form.email)
      return setError('Please fill all required fields.');
    
    // Shop type validation
    if (form.shopType === 'physical' || form.shopType === 'both') {
      if (!form.location) return setError('Please enter your physical location.');
    }
    
    if (form.shopType === 'online' || form.shopType === 'both') {
      if (!form.deliveryAreas) return setError('Please specify delivery areas.');
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Separate new images from existing URLs
      const newImages = [];
      const existingUrls = [];
      
      imgs.forEach(img => {
        if (img.startsWith('data:')) {
          // Convert base64 to Blob
          const [meta, b64] = img.split(',');
          const mime = meta.match(/:(.*?);/)[1];
          const bytes = atob(b64);
          const arr = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
          newImages.push(new Blob([arr], { type: mime }));
        } else {
          // Existing URL - keep it
          existingUrls.push(img);
        }
      });

      // Send new image files
      newImages.forEach(blob => {
        fd.append('images', blob, `upload_${Date.now()}.jpg`);
      });

      // Send existing URLs to keep
      existingUrls.forEach(url => {
        fd.append('keptImgs', url);
      });

      const saved = ex
        ? await api.businesses.update(ex.id, fd)
        : await api.businesses.create(fd);

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const needsPhysical = form.shopType === 'physical' || form.shopType === 'both';
  const needsOnline = form.shopType === 'online' || form.shopType === 'both';

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, maxWidth: 680, width: '90vw', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <CloseBtn onClose={onClose} />

        <div style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{ex ? '✏️ Edit' : '➕ Add'} Business</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Fill in the details below</p>

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          {/* Basic Info */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Business Name *</label>
            <input name="name" value={form.name} onChange={h} placeholder="e.g. Joe's Café" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Category *</label>
              <select name="cat" value={form.cat} onChange={h} style={inputStyle}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tier</label>
              <select name="tier" value={form.tier} onChange={h} style={inputStyle} disabled={!user || user.role !== 'admin'}>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Description *</label>
            <textarea name="desc" value={form.desc} onChange={h} placeholder="Brief description of your business" rows={3} style={inputStyle} />
          </div>

          {/* Shop Type Selection */}
          <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#1e3a8a' }}>🏪 Shop Type *</label>
            <div style={{ display: 'grid', gap: 10 }}>
              {SHOP_TYPES.map(type => (
                <label key={type.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 10, background: form.shopType === type.value ? '#eff6ff' : '#fff', border: `2px solid ${form.shopType === type.value ? '#2563eb' : '#e5e7eb'}`, borderRadius: 8, transition: 'all 0.2s' }}>
                  <input type="radio" name="shopType" value={type.value} checked={form.shopType === type.value} onChange={h} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{type.label}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Physical Shop Details */}
          {needsPhysical && (
            <div style={{ marginBottom: 24, padding: 16, background: '#fef3c7', borderRadius: 8, border: '1px solid #fbbf24' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#92400e' }}>📍 Physical Location Details</h3>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Location/Area *</label>
                <input name="location" value={form.location} onChange={h} placeholder="e.g. Westlands, Nairobi" maxLength={100} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Directions/Landmarks</label>
                <textarea name="directions" value={form.directions} onChange={h} placeholder="e.g. Next to Sarit Center, 2nd floor, shop 24" maxLength={200} rows={2} style={inputStyle} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Operating Hours</label>
                <input name="operatingHours" value={form.operatingHours} onChange={h} placeholder="e.g. 9 AM - 6 PM, Mon-Sat" maxLength={50} style={inputStyle} />
              </div>
            </div>
          )}

          {/* Online Shop Details */}
          {needsOnline && (
            <div style={{ marginBottom: 24, padding: 16, background: '#ede9fe', borderRadius: 8, border: '1px solid #a78bfa' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#5b21b6' }}>🚚 Online/Delivery Details</h3>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Delivery Areas *</label>
                <input name="deliveryAreas" value={form.deliveryAreas} onChange={h} placeholder="e.g. Nairobi, Kiambu, Machakos" maxLength={150} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Delivery Information</label>
                <textarea name="deliveryInfo" value={form.deliveryInfo} onChange={h} placeholder="e.g. Free delivery above KES 1000. Same-day delivery in Nairobi." maxLength={300} rows={2} style={inputStyle} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>How to Order</label>
                <input name="orderMethods" value={form.orderMethods} onChange={h} placeholder="e.g. WhatsApp: 0712345678, Website, Instagram DM" maxLength={150} style={inputStyle} />
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Phone *</label>
              <input name="phone" value={form.phone} onChange={h} placeholder="0712345678" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={h} placeholder="contact@business.com" style={inputStyle} />
            </div>
          </div>

          {/* Social Media */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Website</label>
              <input name="website" value={form.website} onChange={h} placeholder="mybusiness.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Instagram</label>
              <input name="instagram" value={form.instagram} onChange={h} placeholder="@username" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Facebook</label>
              <input name="facebook" value={form.facebook} onChange={h} placeholder="Page name" style={inputStyle} />
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              Images ({imgs.length}/{imageLimit})
              {form.tier === 'free' && <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 400 }}> • Upgrade to Premium for 5 images</span>}
            </label>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {imgs.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 100, height: 100, borderRadius: 8, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImg(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 16, lineHeight: '20px' }}>×</button>
                </div>
              ))}
            </div>

            {canAddMore && (
              <>
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} style={{ display: 'none' }} />
                <button onClick={() => fileRef.current?.click()} style={{ ...btnPrimaryStyle, marginRight: 8, padding: '8px 14px', fontSize: 13 }}>Upload Images</button>
                
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addUrl()} placeholder="Or paste image URL" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                  <button onClick={addUrl} style={{ ...btnPrimaryStyle, padding: '8px 14px', fontSize: 13 }}>Add URL</button>
                </div>
              </>
            )}
            
            {!canAddMore && form.tier === 'free' && (
              <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 6, padding: 10, fontSize: 12, color: '#92400e' }}>
                ⭐ Upgrade to Premium to add up to 5 images + get top placement!
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
            <button onClick={onClose} disabled={loading} style={{ padding: '10px 20px', fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 8, background: '#f3f4f6', color: '#374151', cursor: loading ? 'not-allowed' : 'pointer' }}>Cancel</button>
            <button onClick={submit} disabled={loading} style={{ ...btnPrimaryStyle, padding: '10px 20px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : (ex ? 'Update' : 'Submit')}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
