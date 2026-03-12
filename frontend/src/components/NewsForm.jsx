// src/components/NewsForm.jsx
import { useState, useEffect } from 'react';
import { Overlay, CloseBtn } from './ui';
import { api } from '../api';

const CATEGORIES = ['Funding', 'Success Stories', 'Trends', 'Policy', 'Events', 'Resources', 'Other'];

export default function NewsForm({ editArticle, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Trends',
    summary: '',
    content: '',
    author: '',
    imageUrl: '',
    sourceUrl: '',
    sponsored: false,
    sponsorName: '',
    sponsorContact: '',
    sponsorAmount: '',
    featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editArticle) {
      setForm({
        title: editArticle.title || '',
        slug: editArticle.slug || '',
        category: editArticle.category || 'Trends',
        summary: editArticle.summary || '',
        content: editArticle.content || '',
        author: editArticle.author || '',
        imageUrl: editArticle.image || '',
        sourceUrl: editArticle.sourceUrl || '',
        sponsored: editArticle.sponsored || false,
        sponsorName: editArticle.sponsorName || '',
        sponsorContact: editArticle.sponsorContact || '',
        sponsorAmount: editArticle.sponsorAmount || '',
        featured: editArticle.featured || false,
      });
    }
  }, [editArticle]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageFile = e => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setForm(prev => ({ ...prev, imageUrl: '' })); // Clear URL if file selected
    }
  };

  const submit = async () => {
    if (!form.title || !form.summary || !form.content) {
      setError('Title, summary, and content are required');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('slug', form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('category', form.category);
      formData.append('summary', form.summary);
      formData.append('content', form.content);
      formData.append('author', form.author);
      formData.append('imageUrl', form.imageUrl);
      formData.append('sourceUrl', form.sourceUrl);
      formData.append('sponsored', form.sponsored);
      formData.append('sponsorName', form.sponsorName);
      formData.append('sponsorContact', form.sponsorContact);
      formData.append('sponsorAmount', form.sponsorAmount);
      formData.append('featured', form.featured);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editArticle) {
        await api.news.update(editArticle.id, formData);
      } else {
        await api.news.create(formData);
      }

      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to save article');
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    marginBottom: 12,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const sectionStyle = {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: '1px solid #e5e7eb',
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 700,
        width: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
      }}>
        <CloseBtn onClose={onClose} />

        <div style={{ padding: '24px 32px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: '#1e3a8a' }}>
            {editArticle ? '✏️ Edit Article' : '➕ New Article'}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
            {editArticle ? 'Update article details below' : 'Create a new news article'}
          </p>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              color: '#dc2626',
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
              📝 Basic Information
            </h3>

            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="Enter article title"
              style={inputStyle}
            />

            <label style={labelStyle}>URL Slug (optional)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handle}
              placeholder="auto-generated-from-title"
              style={inputStyle}
            />

            <label style={labelStyle}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handle}
              style={inputStyle}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label style={labelStyle}>Author Name</label>
            <input
              name="author"
              value={form.author}
              onChange={handle}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          {/* Content */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
              📄 Content
            </h3>

            <label style={labelStyle}>Summary *</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handle}
              placeholder="Brief summary (1-2 sentences)"
              rows={3}
              style={inputStyle}
            />

            <label style={labelStyle}>Full Content *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handle}
              placeholder="Full article content..."
              rows={10}
              style={inputStyle}
            />

            <label style={labelStyle}>Source URL (optional)</label>
            <input
              name="sourceUrl"
              value={form.sourceUrl}
              onChange={handle}
              placeholder="https://example.com/original-article"
              style={inputStyle}
            />
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: -8 }}>
              Link to the original article if from an external source
            </p>
          </div>

          {/* Image */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
              🖼️ Featured Image
            </h3>

            <label style={labelStyle}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              style={{ ...inputStyle, padding: '8px' }}
            />

            <label style={labelStyle}>Or Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
              disabled={!!imageFile}
            />

            {(form.imageUrl || imageFile) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.imageUrl}
                alt="Preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
              />
            )}
          </div>

          {/* Sponsorship */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
              💰 Premium Placement (Sponsored)
            </h3>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="sponsored"
                checked={form.sponsored}
                onChange={handle}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                This is a sponsored/paid article
              </span>
            </label>

            {form.sponsored && (
              <>
                <label style={labelStyle}>Sponsor Name</label>
                <input
                  name="sponsorName"
                  value={form.sponsorName}
                  onChange={handle}
                  placeholder="Company or organization name"
                  style={inputStyle}
                />

                <label style={labelStyle}>Sponsor Contact</label>
                <input
                  name="sponsorContact"
                  value={form.sponsorContact}
                  onChange={handle}
                  placeholder="Email or phone"
                  style={inputStyle}
                />

                <label style={labelStyle}>Amount Paid (KES)</label>
                <input
                  type="number"
                  name="sponsorAmount"
                  value={form.sponsorAmount}
                  onChange={handle}
                  placeholder="0"
                  style={inputStyle}
                />
              </>
            )}
          </div>

          {/* Options */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e3a8a' }}>
              ⚙️ Options
            </h3>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handle}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Mark as featured story
              </span>
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              disabled={busy}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
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
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Saving...' : editArticle ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
