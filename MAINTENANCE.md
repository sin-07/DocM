# Website Maintenance Mode Guide

This repository is currently configured in **Maintenance / Offline Mode**.

---

## Current Status: 🔴 OFFLINE / UNDER MAINTENANCE

All incoming traffic to the root domain and all page paths (via `vercel.json` and `index.html`) is rewritten to the branded **Under Maintenance** landing page (`html/maintenance.html`).

Patients and visitors can still access:
- **Emergency Call Desk**: `+91 79911 53348`
- **WhatsApp Chat Support**: Direct chat link
- **Clinic Address & OPD Timings**: Pillar No. 140, Bailey Rd, RPS More, Patna

---

## How to Deploy to Your Live Domain

To apply this change to your live domain, commit and push the changes to GitHub:

```bash
git add .
git commit -m "Activate website maintenance mode"
git push origin master
```
*Your hosting provider (e.g. Vercel) will automatically trigger a new deployment within seconds.*

---

## How to Toggle Website Status

### 🟢 Bring Website Back ONLINE (Live Mode)

1. Open [`vercel.json`](file:///c:/Users/anike/CODES/DocM/vercel.json) and revert rewrites to:
   ```json
   {
     "version": 2,
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api" }
     ]
   }
   ```

2. Open [`index.html`](file:///c:/Users/anike/CODES/DocM/index.html) and change:
   ```html
   <meta http-equiv="refresh" content="0; url=html/index.html">
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Deactivate maintenance mode (site live)"
   git push origin master
   ```

---

### 🔴 Put Website Back OFFLINE (Maintenance Mode)

1. Open [`vercel.json`](file:///c:/Users/anike/CODES/DocM/vercel.json) and set:
   ```json
   {
     "version": 2,
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api" },
       { "source": "/(.*)", "destination": "/html/maintenance.html" }
     ]
   }
   ```

2. Open [`index.html`](file:///c:/Users/anike/CODES/DocM/index.html) and set:
   ```html
   <meta http-equiv="refresh" content="0; url=html/maintenance.html">
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Activate website maintenance mode"
   git push origin master
   ```
