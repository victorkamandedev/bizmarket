// routes/businesses.js – /api/businesses/*

const express  = require('express');
const { v4: uuidv4 }  = require('uuid');
const db       = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload, imgUrl } = require('../middleware/upload');

const router   = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────

// GET /api/businesses  – all approved listings (with optional search & category)
router.get('/', (req, res) => {
  const { search = '', cat = '', tier = '' } = req.query;
  let list = db.getBusinesses().filter(b => b.status === 'approved');

  if (cat)    list = list.filter(b => b.cat === cat);
  if (tier)   list = list.filter(b => b.tier === tier);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.desc.toLowerCase().includes(q) ||
      b.cat.toLowerCase().includes(q)
    );
  }
  // Premium listings always first
  list.sort((a, b) => (b.tier === 'premium') - (a.tier === 'premium'));
  res.json(list);
});

// ── Admin-only routes (MUST come before /:id route) ──────────────────────────

// GET /api/businesses/admin/all  – all listings regardless of status
router.get('/admin/all', requireAdmin, (_req, res) => {
  res.json(db.getBusinesses());
});

// ── Public routes ─────────────────────────────────────────────────────────────

// GET /api/businesses/:id  – single listing (public)
router.get('/:id', (req, res) => {
  const biz = db.getBizById(req.params.id);
  if (!biz || biz.status !== 'approved') return res.status(404).json({ error: 'Not found' });
  res.json(biz);
});

// ── Authenticated routes ──────────────────────────────────────────────────────

// POST /api/businesses  – create listing (must be logged in)
router.post('/', requireAuth, upload.array('images', 10), (req, res) => {
  const { 
    name, cat, desc, phone, email, website, instagram, facebook, tier,
    shopType, location, directions, operatingHours,
    deliveryAreas, deliveryInfo, orderMethods
  } = req.body;
  
  if (!name || !desc || !phone || !email)
    return res.status(400).json({ error: 'name, desc, phone and email are required' });
  
  // Validate shop type fields
  if (!shopType || !['physical', 'online', 'both'].includes(shopType))
    return res.status(400).json({ error: 'Invalid shop type' });
  
  if ((shopType === 'physical' || shopType === 'both') && !location)
    return res.status(400).json({ error: 'Physical location is required' });
  
  if ((shopType === 'online' || shopType === 'both') && !deliveryAreas)
    return res.status(400).json({ error: 'Delivery areas are required' });

  // Combine uploaded file paths with any URL strings passed in body
  const uploadedUrls = (req.files || []).map(f => imgUrl(req, f.filename));
  const keptImgs     = req.body.keptImgs ? [].concat(req.body.keptImgs) : [];
  const imgs         = [...keptImgs, ...uploadedUrls].filter(Boolean);
  
  // Enforce image limits
  const imageLimit = tier === 'premium' ? 5 : 2;
  if (imgs.length > imageLimit) {
    return res.status(400).json({ error: `Maximum ${imageLimit} images allowed for ${tier} tier` });
  }

  const biz = {
    id:        uuidv4(),
    name, cat, desc, phone, email,
    website:   website   || '',
    instagram: instagram || '',
    facebook:  facebook  || '',
    imgs,
    owner:  req.user.email,
    status: 'pending',
    tier:   tier === 'premium' ? 'premium' : 'free',
    date:   new Date().toISOString().slice(0, 10),
    
    // New shop type fields
    shopType,
    location:       location       || '',
    directions:     directions     || '',
    operatingHours: operatingHours || '',
    deliveryAreas:  deliveryAreas  || '',
    deliveryInfo:   deliveryInfo   || '',
    orderMethods:   orderMethods   || '',
  };

  db.saveBusinesses([...db.getBusinesses(), biz]);
  res.status(201).json(biz);
});

// PUT /api/businesses/:id  – update listing (owner or admin)
router.put('/:id', requireAuth, upload.array('images', 10), (req, res) => {
  const list = db.getBusinesses();
  const idx  = list.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const biz = list[idx];
  if (biz.owner !== req.user.email && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  const uploadedUrls = (req.files || []).map(f => imgUrl(req, f.filename));
  const keptImgs     = req.body.keptImgs ? [].concat(req.body.keptImgs) : [];
  const newImgs      = [...keptImgs, ...uploadedUrls].filter(Boolean);
  
  // Enforce image limits based on tier
  const newTier = req.body.tier || biz.tier;
  const imageLimit = newTier === 'premium' ? 5 : 2;
  if (newImgs.length > imageLimit) {
    return res.status(400).json({ error: `Maximum ${imageLimit} images allowed for ${newTier} tier` });
  }

  // Check if images changed (new uploads or different kept images)
  const oldImgSet = new Set(biz.imgs || []);
  const newImgSet = new Set(newImgs);
  const imagesChanged = uploadedUrls.length > 0 || 
                        oldImgSet.size !== newImgSet.size ||
                        ![...oldImgSet].every(img => newImgSet.has(img));

  // If images changed and user is not admin, require re-approval
  let newStatus = biz.status;
  if (imagesChanged && req.user.role !== 'admin') {
    newStatus = 'pending';
  }
  
  // Validate shop type if changed
  const newShopType = req.body.shopType || biz.shopType;
  if (newShopType && !['physical', 'online', 'both'].includes(newShopType)) {
    return res.status(400).json({ error: 'Invalid shop type' });
  }
  
  if ((newShopType === 'physical' || newShopType === 'both') && !req.body.location && !biz.location) {
    return res.status(400).json({ error: 'Physical location is required' });
  }
  
  if ((newShopType === 'online' || newShopType === 'both') && !req.body.deliveryAreas && !biz.deliveryAreas) {
    return res.status(400).json({ error: 'Delivery areas are required' });
  }

  const updated = {
    ...biz,
    name:      req.body.name      ?? biz.name,
    cat:       req.body.cat       ?? biz.cat,
    desc:      req.body.desc      ?? biz.desc,
    phone:     req.body.phone     ?? biz.phone,
    email:     req.body.email     ?? biz.email,
    website:   req.body.website   ?? biz.website,
    instagram: req.body.instagram ?? biz.instagram,
    facebook:  req.body.facebook  ?? biz.facebook,
    tier:      req.body.tier      ?? biz.tier,
    imgs:      newImgs,
    status:    newStatus,
    
    // Shop type fields
    shopType:       req.body.shopType       ?? biz.shopType,
    location:       req.body.location       ?? biz.location,
    directions:     req.body.directions     ?? biz.directions,
    operatingHours: req.body.operatingHours ?? biz.operatingHours,
    deliveryAreas:  req.body.deliveryAreas  ?? biz.deliveryAreas,
    deliveryInfo:   req.body.deliveryInfo   ?? biz.deliveryInfo,
    orderMethods:   req.body.orderMethods   ?? biz.orderMethods,
  };

  list[idx] = updated;
  db.saveBusinesses(list);
  res.json(updated);
});

// DELETE /api/businesses/:id  – delete listing (owner or admin)
router.delete('/:id', requireAuth, (req, res) => {
  const list = db.getBusinesses();
  const biz  = list.find(b => b.id === req.params.id);
  if (!biz) return res.status(404).json({ error: 'Not found' });

  if (biz.owner !== req.user.email && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  db.saveBusinesses(list.filter(b => b.id !== req.params.id));
  res.json({ success: true });
});

// ── Admin PATCH routes (status and tier changes) ─────────────────────────────

// PATCH /api/businesses/:id/status  – approve / reject / restore
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const list = db.getBusinesses();
  const idx  = list.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  list[idx].status = status;
  db.saveBusinesses(list);
  res.json(list[idx]);
});

// PATCH /api/businesses/:id/tier  – upgrade / downgrade
router.patch('/:id/tier', requireAdmin, (req, res) => {
  const { tier } = req.body;
  if (!['free', 'premium'].includes(tier))
    return res.status(400).json({ error: 'Invalid tier' });

  const list = db.getBusinesses();
  const idx  = list.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  list[idx].tier = tier;
  db.saveBusinesses(list);
  res.json(list[idx]);
});

module.exports = router;
