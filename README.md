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

## Running the App

### Option 1 — Docker Compose (recommended, all-in-one)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. Copy the env example and fill in your Cloudinary credentials:
   ```bash
   cp backend/.env.example .env
   # edit .env: set JWT_SECRET and Cloudinary credentials
   ```
2. Start everything (MongoDB + backend + frontend):
   ```bash
   docker compose up --build
   ```
3. Open **http://localhost:3000** in your browser.  
   The API runs on **http://localhost:4000**.

### Option 2 — Deploy to Render (free cloud hosting)

1. Push this repo to GitHub (already done).
2. Go to [render.com](https://render.com), create a free account, and click **New > Blueprint**.
3. Select this repository — Render will read `render.yaml` and create both services automatically.
4. Set the required environment variables in the Render dashboard:
   - **photo-backend**: `MONGO_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (`JWT_SECRET` is auto-generated)
   - **photo-frontend**: `VITE_API_URL` — set this to the URL of your deployed `photo-backend` service (e.g. `https://photo-backend.onrender.com`)
5. Click **Deploy**. Render will give you a public URL for the frontend.

### Option 3 — Local development (manual)

#### Backend

```bash
cd backend
cp ../.env.example .env   # fill in your values
npm install
node server.js
```

#### Frontend

```bash
cd frontend
npm install
# create frontend/.env with VITE_API_URL=http://localhost:4000
npm run dev
```

Open **http://localhost:5173** in your browser.

## Environment Variables

See `backend/.env.example` for required variables:
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – secret for signing tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – Cloudinary credentials
