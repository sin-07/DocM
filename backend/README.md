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

The backend includes convenience tools to create or seed admin and sample data.

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

- Run full seed (admin + sample appointments + gallery):

```powershell
cd backend
npm run seed
```

Notes about seeding

- If your configured `MONGODB_URI` in `.env` is unreachable, the seed runner will fall back to an in-memory MongoDB (for local testing). That in-memory database is ephemeral and will not persist after the process exits.
- To seed your real database, make sure:
  - `.env` `MONGODB_URI` is correct
  - Your current IP is whitelisted in MongoDB Atlas Network Access
  - DNS/SRV lookups are allowed from your network

Security

- Do NOT commit `.env` or seed JSON files to a public repository. The `backend/.gitignore` ignores `.env` and `*-seed.json` files by default.
- The admin password stored in `admin-seed.json` is hashed using `bcrypt`. Still, treat that file as sensitive.

Removing seed files

After importing or seeding data into your persistent DB, remove or move the seed files out of the repository:

```powershell
# from project root
Remove-Item backend\admin-seed.json -Force
Remove-Item backend\appointments-seed.json -Force
Remove-Item backend\gallery-seed.json -Force
```

Support

If you want me to insert the seeds into your Atlas DB here, update `.env` with a reachable `MONGODB_URI` (or whitelist this machine's IP) and I can run `npm run seed` again.