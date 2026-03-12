// src/pages/BusinessNews.jsx
import { useState, useEffect } from 'react';
import { api } from '../api';
import '../styles/businessNews.css';

export default function BusinessNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    api.news.list()
      .then(articles => {
        setArticles(articles);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load news:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  // Separate sponsored from regular
  const sponsoredArticles = filteredArticles.filter(a => a.sponsored);
  const regularArticles = filteredArticles.filter(a => !a.sponsored);
  const featuredArticles = regularArticles.filter(a => a.featured).slice(0, 3);
  const normalArticles = regularArticles.filter(a => !a.featured);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p>Loading news articles...</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 400px)', background: '#f4f5f7' }}>
      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

      {/* Hero */}
      <section className="news-hero">
        <div className="news-hero-container">
          <h1>Business News</h1>
          <p>Stay updated with the latest in youth entrepreneurship</p>
        </div>
      </section>

      {/* Sponsored Stories Section */}
      {sponsoredArticles.length > 0 && (
        <section style={{ padding: '40px 24px', background: 'linear-gradient(135deg, #eff6ff, #fef3c7)', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ fontSize: 28 }}>💰</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e3a8a', margin: 0 }}>
                Sponsored Stories
              </h2>
            </div>
            <div style={{ display: 'grid', gap: 24 }}>
              {sponsoredArticles.map(article => (
                <SponsoredArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={() => setSelectedArticle(article)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section style={{ padding: '32px 24px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🌟</span> Featured Stories
            </h2>
            <div className="news-grid">
              {featuredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  featured 
                  onClick={() => setSelectedArticle(article)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section style={{ padding: '24px 24px 0', background: '#f4f5f7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-filter ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Articles */}
      <section style={{ padding: '24px 24px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="news-grid">
            {normalArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
                onClick={() => setSelectedArticle(article)}
                formatDate={formatDate}
              />
            ))}
          </div>

          {normalArticles.length === 0 && sponsoredArticles.length === 0 && featuredArticles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
              <h3 style={{ fontSize: 20, color: '#374151' }}>No articles found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// Sponsored Article Card (Large, Premium Style)
function SponsoredArticleCard({ article, onClick, formatDate }) {
  return (
    <article 
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: '3px solid #f59e0b',
        display: 'grid',
        gridTemplateColumns: article.image ? '400px 1fr' : '1fr',
        minHeight: 240,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
      }}
    >
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => e.target.src = 'https://placehold.co/800x400/e5e7eb/6b7280?text=Sponsored+Content'}
        />
      )}
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
          }}>
            💰 SPONSORED
          </span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{formatDate(article.publishDate || article.createdAt)}</span>
        </div>
        
        <h3 style={{ 
          fontSize: 26, 
          fontWeight: 800, 
          marginBottom: 16, 
          color: '#1e3a8a',
          lineHeight: 1.3,
        }}>
          {article.title}
        </h3>
        
        <p style={{ 
          fontSize: 16, 
          lineHeight: 1.7, 
          color: '#374151',
          marginBottom: 20,
        }}>
          {article.summary}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ 
              background: '#eff6ff', 
              color: '#2563eb', 
              padding: '4px 12px', 
              borderRadius: 12, 
              fontSize: 12, 
              fontWeight: 600 
            }}>
              {article.category}
            </span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>By {article.author}</span>
          </div>
          <span style={{ 
            color: '#2563eb', 
            fontSize: 15, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Read full article →
          </span>
        </div>
      </div>
    </article>
  );
}

// Regular Article Card
function ArticleCard({ article, featured = false, onClick, formatDate }) {
  return (
    <article 
      className={`article-card ${featured ? 'featured' : ''}`}
      onClick={onClick}
    >
      <img
        src={article.image}
        alt={article.title}
        onError={e => e.target.src = 'https://placehold.co/800x400/e5e7eb/6b7280?text=Business+News'}
      />
      <div className="article-content">
        <div className="article-meta">
          <span className="article-category">{article.category}</span>
          <span className="article-date">{formatDate(article.publishDate || article.createdAt)}</span>
        </div>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-summary">{article.summary}</p>
        <div className="article-footer">
          <span className="article-author">By {article.author}</span>
          <button className="read-more-btn">Read more →</button>
        </div>
      </div>
    </article>
  );
}

// Article Modal (Full Content)
function ArticleModal({ article, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: 20,
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            fontSize: 24,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* Article Image */}
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: '20px 20px 0 0' }}
            onError={e => e.target.src = 'https://placehold.co/800x400/e5e7eb/6b7280?text=Article+Image'}
          />
        )}

        {/* Article Content */}
        <div style={{ padding: 40 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {article.sponsored && (
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
              }}>
                💰 SPONSORED
              </span>
            )}
            {article.featured && (
              <span style={{
                background: '#ede9fe',
                color: '#6d28d9',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
              }}>
                ⭐ Featured
              </span>
            )}
            <span style={{
              background: '#eff6ff',
              color: '#2563eb',
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: '#1e3a8a', lineHeight: 1.3 }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{ 
            fontSize: 14, 
            color: '#6b7280', 
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <span>By <strong>{article.author}</strong></span>
            <span>•</span>
            <span>{formatDate(article.publishDate || article.createdAt)}</span>
          </div>

          {/* Summary */}
          <p style={{ 
            fontSize: 18, 
            lineHeight: 1.8, 
            color: '#374151', 
            fontWeight: 500,
            marginBottom: 32,
            fontStyle: 'italic',
          }}>
            {article.summary}
          </p>

          {/* Full Content */}
          <div style={{ 
            fontSize: 16, 
            lineHeight: 1.8, 
            color: '#374151',
            whiteSpace: 'pre-wrap',
          }}>
            {article.content}
          </div>

          {/* Source Link */}
          {article.sourceUrl && (
            <div style={{ 
              marginTop: 40,
              padding: 20,
              background: '#f9fafb',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
            }}>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
                Read the original article:
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#2563eb',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Visit Source Website →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
