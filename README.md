# BizMarket – Business Marketplace

A full-stack business marketplace with user auth, admin panel, image upload, and social links.

## Project Structure

```
bizmarket/
├── frontend/          # React app (Vite)
│   ├── public/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Full page views
│       ├── main.jsx      # Entry point
│       └── App.jsx       # Root component + routing
├── backend/           # Node.js / Express API
│   ├── data/             # JSON seed data (acts as DB)
│   ├── middleware/       # Auth middleware
│   ├── routes/           # API route handlers
│   └── server.js         # Express server entry
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev       # starts on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

## Demo Credentials
| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | admin@marketplace.com        | admin123   |
| User  | cafe@example.com             | pass123    |

## Tech Stack
- **Frontend**: React 18, Vite, CSS Modules
- **Backend**: Node.js, Express, JWT auth, Multer (image upload)
- **Storage**: JSON flat-file (swap for MongoDB/PostgreSQL in production)
