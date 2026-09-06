<div align="center">

# 🐊 GatorÉlite

### The Apex of Luxury

**Premium Crocodile Leather Belts — Handcrafted Excellence**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)](#contributing)

---

*A sophisticated e-commerce platform for handcrafted premium crocodile leather belts, built with Next.js 15, MongoDB, and modern web technologies.*

[Website](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Reference](#api-reference)

</div>

---

## ✨ Features

### 🛍️ **E-Commerce Core**
- **Product Catalog** — Rich product listings with 360° image viewer, size guides, and detailed specifications
- **Shopping Cart** — Persistent cart with Zustand state management
- **Wishlist** — Save and manage favorite items
- **Checkout Flow** — Streamlined checkout with order confirmation
- **Order Management** — Track order history and status

### 👤 **User Management**
- **Authentication** — Secure JWT-based authentication with bcrypt password hashing
- **User Profiles** — Manage personal information, addresses, and preferences
- **Role-Based Access** — Admin and customer roles with appropriate permissions
- **Password Recovery** — Secure password reset via email

### 📧 **Communication**
- **Contact Form** — Direct messaging with SMTP email notifications
- **Email Integration** — Nodemailer for transactional emails
- **WhatsApp Integration** — Direct customer support link

### 🔒 **Security**
- **Rate Limiting** — IP + account-based rate limiting with exponential backoff
- **JWT Authentication** — Secure token-based session management
- **Input Validation** — Zod schema validation for all inputs
- **CORS Protection** — Configurable cross-origin resource sharing

### 🎨 **Design & UX**
- **Luxury Aesthetic** — Dark theme with gold accents and premium typography
- **Smooth Animations** — GSAP and Framer Motion for fluid interactions
- **Scroll-Driven Effects** — Canvas-based scroll animations
- **Responsive Design** — Optimized for all devices
- **Page Transitions** — Smooth route transitions with Lenis smooth scroll

### 📊 **Admin Dashboard**
- **Analytics Overview** — Sales and performance metrics
- **Product Management** — CRUD operations for products
- **Order Management** — View and process customer orders
- **Contact Messages** — Manage incoming inquiries
- **User Management** — Customer administration

### 🔧 **Developer Experience**
- **TypeScript** — Full type safety across the codebase
- **API Routes** — RESTful API with Next.js App Router
- **Database Seeding** — Automated product data seeding
- **Environment Configuration** — Comprehensive `.env` setup

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | Animation library |
| [GSAP](https://greensock.com/gsap/) | Professional animations |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scrolling |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [Lucide React](https://lucide.dev/) | Icon library |

### **Backend**
| Technology | Purpose |
|------------|---------|
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | Serverless API endpoints |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [JWT](https://jwt.io/) | Authentication tokens |
| [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) | Password hashing |
| [Zod](https://zod.dev/) | Schema validation |
| [Nodemailer](https://nodemailer.com/) | Email service |

### **Tools & Utilities**
| Technology | Purpose |
|------------|---------|
| [Multer](https://github.com/expressjs/multer) | File upload handling |
| [Formidable](https://github.com/node-formidable/formidable) | Form parsing |
| [jsPDF](https://parall.ax/products/jspdf) | PDF generation |
| [SheetJS](https://sheetjs.com/) | Excel file handling |

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+ (recommended: 20 LTS)
- **MongoDB** 6+ (local or Atlas)
- **npm**, **yarn**, or **pnpm**

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/gatorelite.git
   cd gatorelite
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Database
   MONGODB_URI=mongodb://127.0.0.1:27017/gatorelite

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   SESSION_SECRET=your-session-secret-here

   # Admin Credentials
   ADMIN_PASSWORD=your-admin-password
   VIEWER_PASSWORD=your-viewer-password

   # Email (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Seed the database**

   ```bash
   curl -X GET http://localhost:3000/api/seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
gatorelite/
├── public/                    # Static assets (images, logos)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── contact/           # Contact page
│   │   ├── product/           # Product pages
│   │   ├── shop/              # Shop/catalog
│   │   └── ...                # Other pages
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── common/            # Shared components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   ├── products/          # Product components
│   │   └── ui/                # UI primitives
│   ├── context/               # React contexts
│   │   ├── AuthContext.js     # Authentication state
│   │   ├── CartContext.js     # Cart state
│   │   ├── ThemeContext.tsx   # Theme management
│   │   └── WishlistContext.js # Wishlist state
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & middleware
│   │   ├── apiMiddleware.ts   # API middleware
│   │   ├── auth.ts           # Auth utilities
│   │   ├── errors.ts         # Error handling
│   │   ├── mongodb.ts        # Database connection
│   │   ├── rateLimit.ts      # Rate limiting
│   │   └── validation.ts     # Input validation
│   ├── models/                # MongoDB models
│   │   ├── Order.ts          # Order schema
│   │   ├── Product.ts        # Product schema
│   │   ├── Review.ts         # Review schema
│   │   └── User.ts           # User schema
│   ├── services/              # Business logic
│   │   ├── authService.js    # Auth operations
│   │   ├── cartService.js    # Cart operations
│   │   ├── orderService.js   # Order operations
│   │   └── productService.js # Product operations
│   ├── store/                 # Zustand stores
│   │   └── cartStore.ts      # Cart state
│   └── utils/                 # Utility functions
├── .env.example               # Environment template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🔌 API Reference

### **Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### **Products**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/[id]` | Get product by ID |
| `POST` | `/api/products` | Create product *(admin)* |
| `PUT` | `/api/products/[id]` | Update product *(admin)* |
| `DELETE` | `/api/products/[id]` | Delete product *(admin)* |

### **Orders**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List user orders |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/[id]` | Get order details |

### **Contact**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Send contact message |

### **Admin**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | List all users |
| `GET` | `/api/admin/reviews` | List all reviews |
| `GET` | `/api/admin/messages` | List contact messages |

### **Database**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/seed` | Seed database with products |

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/gatorelite` |
| `JWT_SECRET` | Secret for JWT tokens | *Required* |
| `SESSION_SECRET` | Session encryption key | *Required* |
| `ADMIN_PASSWORD` | Admin account password | *Required* |
| `VIEWER_PASSWORD` | Viewer account password | *Required* |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username/email | *Required* |
| `SMTP_PASS` | SMTP password/app password | *Required* |
| `CONTACT_EMAIL` | Contact form recipient | `SMTP_USER` |
| `ORDER_EMAIL` | Order notification recipient | `SMTP_USER` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `http://localhost:3000` |

### **Rate Limiting**

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_AUTH_WINDOW_MS` | Auth rate limit window | `900000` (15 min) |
| `RATE_LIMIT_AUTH_MAX_IP` | Max auth requests per IP | `5` |
| `RATE_LIMIT_AUTH_MAX_ACCOUNT` | Max auth requests per account | `3` |
| `RATE_LIMIT_PUBLIC_WINDOW_MS` | Public rate limit window | `60000` (1 min) |
| `RATE_LIMIT_PUBLIC_MAX` | Max public requests | `60` |
| `RATE_LIMIT_AUTHENTICATED_WINDOW_MS` | Authenticated rate limit window | `60000` (1 min) |
| `RATE_LIMIT_AUTHENTICATED_MAX` | Max authenticated requests | `120` |
| `RATE_LIMIT_BACKOFF_BASE_MS` | Base backoff time | `60000` (1 min) |
| `RATE_LIMIT_BACKOFF_MAX_MS` | Maximum backoff time | `3600000` (1 hr) |

---

## 🎨 Design System

### **Color Palette**

| Color | Hex | Usage |
|-------|-----|-------|
| **Obsidian** | `#0A0A0A` | Primary background |
| **Navy** | `#080D1A` | Gradient background |
| **Gold** | `#C9A96E` | Accent color |
| **Gold Light** | `#D4BA85` | Hover states |
| **Gold Dark** | `#B89B5A` | Active states |
| **Bronze** | `#B87333` | Secondary accent |
| **Cream** | `#F5F0E8` | Primary text |
| **Espresso** | `#120A07` | Dark accent |
| **Cognac** | `#181008` | Warm accent |

### **Typography**

| Font | Usage |
|------|-------|
| **Cormorant Garamond** | Headings, hero text, luxury feel |
| **Inter** | Body text, UI elements, readability |

### **Custom Utilities**

```css
/* Gradient backgrounds */
bg-gradient-navy    /* Navy gradient background */
bg-gradient-radial  /* Radial gradient */

/* Shadows */
shadow-glow-gold    /* Gold glow effect */
shadow-glow-navy    /* Navy glow effect */
```

---

## 🚢 Deployment

### **Vercel (Recommended)**

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

```bash
# Or using Vercel CLI
npm i -g vercel
vercel
```

### **Docker**

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is proprietary software. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission.

---

## 📞 Support

For support, email support@gatorelite.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React framework
- [Vercel](https://vercel.com/) — Deployment platform
- [MongoDB](https://www.mongodb.com/) — Database
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework

---

<div align="center">

**Built with ❤️ by GatorÉlite**

*"The Apex of Luxury"*

</div>
