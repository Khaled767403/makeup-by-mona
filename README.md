# Make up by mona

A full-stack e-commerce app for skincare, makeup boxes, and beauty accessories, with WhatsApp-based checkout and an admin dashboard.

- **Frontend:** React (Vite) + Tailwind CSS v4 + React Router + Recharts
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL (built for Neon's free tier)
- **Auth:** JWT (Bearer token), admin-only

---

## 1. Local Setup

### Prerequisites
- Node.js 18+ (you have v22 ✔)
- A PostgreSQL database — easiest free option is [Neon](https://neon.tech): create a project and copy the connection string.

### Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
JWT_SECRET="generate one with: openssl rand -hex 32"
ADMIN_USERNAME="mona"
ADMIN_PASSWORD="pick-a-real-password"
CLIENT_ORIGIN="http://localhost:5173"
PORT=5000
```

Then:
```bash
npm install
npx prisma migrate dev --name init   # creates tables in your database
npm run seed                          # creates the admin user + demo products + initial WhatsApp number
npm run dev                           # starts the API on http://localhost:5000
```

### Frontend

In a second terminal:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` — set `VITE_WHATSAPP_NUMBER` to Mona's WhatsApp number, country code first, digits only (e.g. `201234567890` for an Egyptian number, no `+` and no spaces):
```
VITE_API_URL="http://localhost:5000/api"
VITE_WHATSAPP_NUMBER="201234567890"
```

Then:
```bash
npm install
npm run dev      # starts the storefront on http://localhost:5173
```

Visit:
- **Storefront:** http://localhost:5173
- **Admin login:** http://localhost:5173/admin/login — sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set above.

---

## 2. How Checkout Works

1. Customer adds products to the cart (kept in `localStorage`, no login required).
2. At checkout, they enter name, phone, governorate, address, and notes.
3. The backend **recalculates every price and the shipping fee from the database** — it never trusts totals sent by the browser. This is what keeps the admin dashboard's sales figures accurate even if someone tampers with the client.
4. The order is saved to the database (so it shows up in the admin dashboard/orders), and the browser opens a pre-filled WhatsApp chat with Mona's number so she can confirm payment (InstaPay, Vodafone Cash, card, etc.) directly with the customer.

Shipping fees per governorate are defined in `server/src/utils/shipping.js` — edit that file to adjust rates.

---

## 3. Deploying for Free

### Database — Neon
1. Create a free project at neon.tech.
2. Copy the pooled connection string into your production `DATABASE_URL`.

### Backend — Render
1. New **Web Service**, connect your GitHub repo.
2. **Root directory:** `server`
3. **Build command:** `npm install && npx prisma migrate deploy`
4. **Start command:** `npm start`
5. Add all the same environment variables from `server/.env`, but set `CLIENT_ORIGIN` to your deployed Vercel URL (comma-separate multiple origins if needed).
6. Run `npm run seed` once via Render's shell (or locally against the production `DATABASE_URL`) to create the admin user.

> Render's free tier sleeps after 15 minutes of inactivity and takes ~50s to wake up on the next request. For a storefront driven by QR codes/social links, that first-load delay is worth knowing about.

### Frontend — Vercel
1. New Project, import the repo.
2. **Root directory:** `client`
3. Framework preset: **Vite**
4. Environment variables: `VITE_API_URL` (your Render backend URL + `/api`), `VITE_WHATSAPP_NUMBER`
5. `vercel.json` is already included so client-side routing (React Router) doesn't 404 on refresh.

### Images
Render's free tier has no persistent disk, so all image fields (`mainImage`, `galleryImages`, banner/category images) are plain URLs. Upload images to a free host like [Cloudinary](https://cloudinary.com) or [ImgBB](https://imgbb.com) and paste the URL into the admin panel.

---

## 4. Project Structure

```
server/     Express API, Prisma schema, seed script
client/     React storefront + admin dashboard
```

See inline comments in `server/src/app.js` and `client/src/routes/AppRouter.jsx` for the full route map.

---

## 5. Changing the WhatsApp Number Later

The number orders are sent to is stored in the database, not in any `.env` file or frontend build — change it anytime from **Admin → Settings → Store Settings**, no redeploy needed. `STORE_WHATSAPP_NUMBER` in `server/.env` only sets the *initial* value the one time you run `npm run seed`.

## 6. Default Admin Credentials (from seed)

Set via `server/.env` before running `npm run seed`:
- Username: value of `ADMIN_USERNAME` (default `mona`)
- Password: value of `ADMIN_PASSWORD`

**Change the password from the Admin → Settings page after your first login**, and never commit `.env` files (already covered by `.gitignore`).
