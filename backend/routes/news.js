// backend/routes/news.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload, imgUrl } = require('../middleware/upload');

// GET /api/news - public published articles
router.get('/', (req, res) => {
  const allNews = db.getNews();
  const published = allNews.filter(n => n.status === 'published');
  const sorted = published.sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1;
    if (!a.sponsored && b.sponsored) return 1;
    if (a.sponsored && b.sponsored) {
      return new Date(b.sponsoredDate) - new Date(a.sponsoredDate);
    }
    return new Date(b.publishDate) - new Date(a.publishDate);
  });
  res.json(sorted);
});

// GET /api/news/admin/all - all articles (admin)
router.get('/admin/all', requireAdmin, (_req, res) => {
  const allNews = db.getNews();
  const sorted = allNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// GET /api/news/:id - single article
router.get('/:id', (req, res) => {
  const article = db.getNewsById(req.params.id);
  if (!article || article.status !== 'published') {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

// POST /api/news - create article (admin)
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  const { title, slug, category, summary, content, author, sponsored, sponsorName, sponsorContact, sponsorAmount, featured, sourceUrl } = req.body;
  
  if (!title || !category || !summary || !content) {
    return res.status(400).json({ error: 'title, category, summary, and content are required' });
  }

  let imageUrl = req.body.imageUrl || '';
  if (req.file) {
    imageUrl = imgUrl(req, req.file.filename);
  }

  const article = {
    id: uuidv4(),
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    summary,
    content,
    author: author || req.user.name,
    image: imageUrl,
    sourceUrl: sourceUrl || '',
    sponsored: sponsored === 'true' || sponsored === true,
    sponsorName: sponsorName || '',
    sponsorContact: sponsorContact || '',
    sponsorAmount: sponsorAmount ? parseFloat(sponsorAmount) : 0,
    sponsoredDate: (sponsored === 'true' || sponsored === true) ? new Date().toISOString() : null,
    featured: featured === 'true' || featured === true,
    status: 'draft',
    publishDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };

  const allNews = db.getNews();
  allNews.push(article);
  db.saveNews(allNews);
  res.status(201).json(article);
});

// PUT /api/news/:id - update article (admin)
router.put('/:id', requireAdmin, upload.single('image'), (req, res) => {
  const allNews = db.getNews();
  const idx = allNews.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  
  const existing = allNews[idx];
  let imageUrl = existing.image;
  if (req.file) imageUrl = imgUrl(req, req.file.filename);
  else if (req.body.imageUrl) imageUrl = req.body.imageUrl;

  allNews[idx] = {
    ...existing,
    title: req.body.title || existing.title,
    slug: req.body.slug || existing.slug,
    category: req.body.category || existing.category,
    summary: req.body.summary || existing.summary,
    content: req.body.content || existing.content,
    author: req.body.author || existing.author,
    image: imageUrl,
    sourceUrl: req.body.sourceUrl !== undefined ? req.body.sourceUrl : existing.sourceUrl,
    sponsored: req.body.sponsored !== undefined ? (req.body.sponsored === 'true' || req.body.sponsored === true) : existing.sponsored,
    sponsorName: req.body.sponsorName || existing.sponsorName,
    sponsorContact: req.body.sponsorContact || existing.sponsorContact,
    sponsorAmount: req.body.sponsorAmount ? parseFloat(req.body.sponsorAmount) : existing.sponsorAmount,
    featured: req.body.featured !== undefined ? (req.body.featured === 'true' || req.body.featured === true) : existing.featured,
    updatedAt: new Date().toISOString(),
  };
  
  db.saveNews(allNews);
  res.json(allNews[idx]);
});

// DELETE /api/news/:id - delete article (admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const allNews = db.getNews();
  const filtered = allNews.filter(n => n.id !== req.params.id);
  if (filtered.length === allNews.length) return res.status(404).json({ error: 'Article not found' });
  db.saveNews(filtered);
  res.json({ success: true });
});

// PATCH /api/news/:id/status - change status (admin)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['draft', 'published', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const allNews = db.getNews();
  const idx = allNews.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  
  allNews[idx].status = status;
  if (status === 'published' && !allNews[idx].publishDate) {
    allNews[idx].publishDate = new Date().toISOString();
  }
  allNews[idx].updatedAt = new Date().toISOString();
  db.saveNews(allNews);
  res.json(allNews[idx]);
});

// PATCH /api/news/:id/sponsor - update sponsorship (admin)
router.patch('/:id/sponsor', requireAdmin, (req, res) => {
  const { sponsored, sponsorName, sponsorContact, sponsorAmount } = req.body;
  const allNews = db.getNews();
  const idx = allNews.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  
  allNews[idx].sponsored = sponsored;
  allNews[idx].sponsorName = sponsorName || '';
  allNews[idx].sponsorContact = sponsorContact || '';
  allNews[idx].sponsorAmount = sponsorAmount || 0;
  allNews[idx].sponsoredDate = sponsored ? new Date().toISOString() : null;
  allNews[idx].updatedAt = new Date().toISOString();
  db.saveNews(allNews);
  res.json(allNews[idx]);
});

module.exports = router;
