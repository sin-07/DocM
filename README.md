# DocM — Doctor Manish Website

This repository contains a static frontend and an Express + MongoDB backend for the Doctor Manish website.

Quick start

1. Backend

```powershell
cd backend
npm install
npm run dev
```

2. Frontend

Open `html/index.html` or use a static server to preview the site.

Security & setup

- Keep `.env` out of source control. Configure `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and any Cloudinary values in your deployment environment.
- Use the backend scripts only with environment variables; do not commit credentials or seed data files.

Need help? Ask me to run the seed or configure deployment steps.
