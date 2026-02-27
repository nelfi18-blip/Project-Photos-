# Project Photos

A full-stack photo management application with a Node.js/Express backend and a React/Vite PWA frontend.

## Features

- JWT authentication (register & login)
- Create projects and upload photos
- Watermark applied on upload via Cloudinary
- Download all project photos as a ZIP
- Generate shareable links (expire after 7 days)
- Progressive Web App (PWA) with service worker

## Structure

```
photo-project-app/
├── backend/          # Express API
│   ├── server.js
│   ├── .env.example
│   ├── models/
│   ├── middleware/
│   └── routes/
└── frontend/         # Vite + React PWA
    ├── index.html
    ├── vite.config.js
    ├── public/
    └── src/
```

## Getting Started

### Backend

```bash
cd backend
cp ../.env.example .env   # fill in your values
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
# create frontend/.env with VITE_API_URL=http://localhost:4000
npm run dev
```

## Environment Variables

See `backend/.env.example` for required variables:
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – secret for signing tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – Cloudinary credentials
