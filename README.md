# DocM — Doctor Manish Website

A professional medical website for Dr. Manish featuring orthopedic services, patient appointments, and an admin dashboard.

## Features

- Service pages for orthopedic treatments
- Online appointment booking
- Admin dashboard for managing appointments
- Image gallery management
- Responsive design

## Quick Start

### Backend

```powershell
cd backend
npm install
npm run dev
```

### Frontend

Open `html/index.html` or use a static server to preview the site.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Security & Setup

- Keep `.env` out of source control. Configure `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and any Cloudinary values in your deployment environment.
- Use the backend scripts only with environment variables; do not commit credentials or seed data files.

Need help? Ask me to run the seed or configure deployment steps.
