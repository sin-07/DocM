# Backend — Doctor Manish

This folder contains the Express + MongoDB backend for the Doctor Manish site.

Getting started (development)

1. Install dependencies

```powershell
cd backend
npm install
```

2. Run the server (dev)

```powershell
npm run dev
```

Seeding data

The backend includes convenience tools to create or seed admin and sample data. Provide data through environment variables only.

- Create admin interactively:

```powershell
cd backend
node create-admin.js
# follow prompts for email and password
```

- Create admin non-interactively (environment variables):

```powershell
$env:ADMIN_EMAIL='you@example.com'; $env:ADMIN_PASSWORD='s3cret'; node create-admin-noninteractive.js
```

- Run full seed (admin + optional appointments + gallery):

```powershell
cd backend
npm run seed
```

Notes about seeding

- If your configured `MONGODB_URI` is unreachable, the backend cannot seed or authenticate.
- To seed your real database, make sure:
  - `MONGODB_URI` is correct
  - Your current IP is whitelisted in MongoDB Atlas Network Access
  - DNS/SRV lookups are allowed from your network

Security

- Do NOT commit `.env` or any credential-bearing files to a public repository.
- The backend is configured to read secrets from environment variables only.

Support

If you want me to insert the seeds into your Atlas DB here, update `.env` with a reachable `MONGODB_URI` (or whitelist this machine's IP) and I can run `npm run seed` again.