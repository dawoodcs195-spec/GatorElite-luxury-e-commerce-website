<div align="center">

# GatorÉlite: Luxury E-Commerce Platform

**A full-stack Next.js and TypeScript store for handcrafted crocodile-leather belts, with a cinematic storefront, JWT auth with roles, and an admin dashboard.**

[**Live demo →**](https://gatorelite.vercel.app)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://gatorelite.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand-443E38)
![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1?logo=zod&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-animations-0055FF?logo=framer&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-images-3448C5?logo=cloudinary&logoColor=white)

</div>

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Author](#author)

## Features

**Storefront**
- Product catalogue and product pages with a 360° image viewer, size selector, size guide and spec accordions
- Scroll-driven canvas frame animation on the home page, Framer Motion page transitions and Lenis smooth scrolling
- Dark luxury theme with gold accents, fully responsive
- Brand story, contact, privacy and terms pages; WhatsApp support button

**Shopping**
- Slide-out cart drawer backed by a Zustand store
- Wishlist persisted in `localStorage`
- Checkout that validates the order with Zod and records it in MongoDB, followed by an order-success page
- Order history with status tracking (pending → confirmed → shipped → delivered / cancelled)
- Product reviews with star ratings

**Accounts and security**
- Register, login and logout with JWT in an HTTP-only cookie; passwords hashed with bcrypt
- Role-based access control (`admin` / `user`) enforced in API middleware
- Profile editing, forgot-password and reset-password by email (Nodemailer)
- Zod validation on API input
- Configurable rate limiting per IP and per account, with exponential backoff (in-memory store)

**Admin dashboard** (`/admin`)
- Product create / edit / delete with Cloudinary image uploads
- Order management and status updates
- Order exports to PDF (jsPDF + autotable) and Excel (SheetJS)
- Users, reviews and contact-message views
- Email notifications for new orders and contact-form submissions

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15 (App Router, Route Handlers), React 18, TypeScript 5 |
| Styling and motion | Tailwind CSS 3, Framer Motion, Lenis, lucide-react |
| State | Zustand (cart), React Context (auth, wishlist, theme) |
| Backend | Next.js API routes, Mongoose (MongoDB) |
| Auth and security | JSON Web Tokens, bcryptjs, Zod, custom rate limiter |
| Media and email | Cloudinary, Nodemailer (SMTP) |
| Exports | jsPDF, jspdf-autotable, SheetJS (xlsx) |
| Hosting | Vercel |

## Architecture

```text
Browser (React, Zustand, Framer Motion)
   │
   ▼
Next.js 15 App Router ── pages: /, /shop, /product/[slug], /checkout, /orders, /profile, /admin, ...
   │
   └── Route Handlers (src/app/api/*)
          ├─ lib/apiMiddleware.ts  → JWT auth, role checks, rate limiting
          ├─ lib/validation.ts     → Zod schemas
          ├─ models/*              → Mongoose: User, Product, Order, Review, ContactMessage, PasswordReset
          ├─ lib/cloudinary.ts     → image uploads
          └─ Nodemailer            → order, contact and password-reset emails
                 │
                 ▼
              MongoDB
```

```text
src/
├── app/
│   ├── api/            # auth, products, orders, reviews, contact, upload, seed, admin
│   ├── admin/          # admin dashboard
│   ├── product/[slug]/ # product page
│   └── ...             # shop, checkout, orders, profile, login, signup, story, legal pages
├── components/         # layout, product, common and UI components
├── context/            # auth, cart, wishlist, theme
├── hooks/              # useDebounce, useLocalStorage, useMediaQuery
├── lib/                # auth, API middleware, rate limit, validation, MongoDB, Cloudinary
├── models/             # Mongoose models
├── services/           # client-side API helpers
└── store/              # Zustand cart store
middleware.ts           # optional legacy admin-token guard for product/upload/seed APIs
```

## Getting started

**Prerequisites:** Node.js 18+ (20 LTS recommended), npm, MongoDB (local or Atlas).

```bash
git clone https://github.com/dawoodcs195-spec/GatorElite-luxury-e-commerce-website.git
cd GatorElite-luxury-e-commerce-website
npm install
cp .env.example .env.local     # fill in your values
npm run dev                    # http://localhost:3000
```

Seed the product catalogue (replaces existing products). The endpoint needs either a signed-in admin session or the `SEED_SECRET` header:

```bash
curl -X POST http://localhost:3000/api/seed -H "x-seed-secret: $SEED_SECRET"
```

Production build:

```bash
npm run build && npm start
```

## Environment variables

See `.env.example`. Names only; never commit real values.

| Variable | Purpose |
| :--- | :--- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs auth tokens |
| `SEED_SECRET` | Shared secret for `POST /api/seed` (sent as the `x-seed-secret` header). In production the seed endpoint returns 403 unless this is set |
| `SESSION_SECRET`, `ADMIN_PASSWORD`, `VIEWER_PASSWORD` | Optional legacy admin-token guard in `middleware.ts` (active only when all three are set) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outgoing email |
| `CONTACT_EMAIL` | Receives contact-form notifications |
| `ORDER_EMAIL` | Receives new-order notifications |
| `NEXT_PUBLIC_SITE_URL` | Public URL used in email links |
| `NEXT_PUBLIC_API_URL` | Optional API base for client services (defaults to same origin) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `UPLOAD_MAX_SIZE_MB` | Max upload size (default 5) |
| `RATE_LIMIT_*` | Rate-limit windows, limits and backoff (see `.env.example`) |

## API overview

| Area | Endpoints |
| :--- | :--- |
| Auth | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `GET/PUT /api/auth/profile` · `POST /api/auth/forgot-password` · `POST /api/auth/reset-password` |
| Products | `GET /api/products` · `POST /api/products` (admin) · `GET /api/products/[id]` · `PUT/DELETE /api/products/[id]` (admin) |
| Orders | `GET /api/orders` (own orders; all for admin) · `POST /api/orders` · `PUT /api/orders` (admin status update) |
| Reviews | `GET /api/reviews` · `POST /api/reviews` |
| Contact | `POST /api/contact` · `GET /api/contact` (admin) |
| Admin | `GET /api/admin/users` (admin) · `GET /api/admin/reviews` (admin) |
| Media | `POST /api/upload` (admin, Cloudinary) |
| Data | `POST /api/seed` (resets the product catalogue; admin session or `x-seed-secret` header) |

## Deployment

Deployed on **Vercel** with **MongoDB Atlas**.

1. Import the repository in Vercel (framework preset: Next.js).
2. Add the environment variables above in Project Settings.
3. Allow Vercel to reach your Atlas cluster.
4. Deploy. To seed products, set `SEED_SECRET` in Vercel, redeploy, call `POST /api/seed` with the `x-seed-secret` header, then remove or rotate the secret.

## Roadmap

- [ ] Persist the cart across page reloads (Zustand `persist`)
- [ ] Online payment gateway at checkout (orders are currently placed without card payment)
- [ ] Shared rate-limit store (e.g. Redis) for multi-instance deployments
- [ ] Unit and end-to-end tests with a CI workflow

## Author

**Muhammad Dawood**, Full-Stack Developer

- Email: [dawood.cs195@gmail.com](mailto:dawood.cs195@gmail.com)
- GitHub: [@dawoodcs195-spec](https://github.com/dawoodcs195-spec)

## License

Released under the [MIT License](LICENSE).
