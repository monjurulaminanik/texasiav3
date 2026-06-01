# TexAsia International Fashion — Premium B2B Garment Manufacturing Portal & Admin CMS

This is a production-grade, highly optimized B2B web application for **Texasia International Fashion Co., Ltd.**, a leading custom garment manufacturer based in Dhaka, Bangladesh. Built with **Next.js 15**, **Tailwind CSS v4**, and **Prisma ORM**, this portal provides a stunning public-facing corporate catalog alongside a comprehensive glassmorphic Admin CRM Control Panel.

---

## 🌟 Core Features

### 1. B2B Public Catalog & Sourcing Platform
- **Comprehensive Product Catalog**: Supports 23 major ready-made garment (RMG) categories and 69 highly detailed products.
- **Dynamic Mega-Menu**: A sticky glassmorphic navigation header supporting visual megamenu overlays for B2B product categories.
- **Advanced Lightbox Gallery**: Product pages feature client-side aspect-ratio lightboxes with zoom capabilities.
- **Corporate Sourcing Profiles**: Modular side-navigated static company sections (Corporate Profile, Why Choose Us, Sustainability, Compliance Accreditations, and Trade Memberships).
- **Interactive multi-step RFQ Sourcing Wizard**: React Hook Form-powered wizard with a honeypot spam protection blocker allowing procurement managers to submit customized order quotes.
- **Structured Schema.org Data**: Injects JSON-LD micro-data into product detail pages (`Product`), news pages (`Article`), career positions (`JobPosting`), and FAQ pages (`FAQPage`) for flawless SEO ranking.

### 2. High-Performance Admin CRM Dashboard & CMS
- **Interactive Sourcing CRM**: RFQ inbox supporting real-time workflow status modifications (New, Contacted, Quoted, Closed), custom internal merched-notes, and custom CSV data exporters.
- **General Contacts Box**: Manages general communication inquiries.
- **Direct Category & Product CRUD Forms**: Slide-out drawer design featuring drag-and-drop local image uploading (integrated with local disk `/public/uploads/*` file storage).
- **Interactive Blog & News CMS**: Direct rich-text article editor backed by Tiptap, cover image uploader, tag filter controls, and read-views tracking.
- **FAQ Accordion & Job Openings Editor**: CRUD controls to manage recruiting and direct buyer questions.
- **Settings singleton control panel**: Configures general business phone, emails, and active SMTP server specifications. Includes a real-time Nodemailer transmission trigger to test configurations instantly.
- **User Credentials Manager**: Supports robust session handling with role control overrides (`admin` vs `editor`).

---

## 🛠️ Technological Architecture

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) utilizing React 19 and strict TypeScript.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) featuring dynamic glassmorphic backgrounds, premium HSL color tokens, and custom micro-animations.
- **Database**: [Prisma ORM](https://www.prisma.io/) defaulting locally to a SQLite file db (`dev.db`). The schema is fully compatible with production **PostgreSQL** providers.
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/) utilizing secure JWT cookie-based session protection.
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) dynamically binding to dynamic SMTP credentials configured in the site dashboard.

---

## 🚀 Getting Started

### 1. Installation & Environment Configuration
Clone the repository and install all dependencies:
```bash
npm install
```

Configure your environment variables by making a copy of `.env.example`:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-ultra-secure-random-nextauth-jwt-secret-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Migration & B2B Seed Population
Generate the local Prisma Client, run SQLite migrations, and populate the database with all 23 categories, 69 products, 15 FAQs, 5 static pages, 5 blogs, and 3 open jobs:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This will automatically create a secure admin profile with the following default credentials:
- **Email**: `admin@texasiabd.com`
- **Password**: `TexasiaAdmin2026!`

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal, or navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in.

---

## 📦 Production Deployment (PM2 & PostgreSQL)

### 1. Production PostgreSQL Portability
To deploy to a production cloud server using PostgreSQL, simply alter the provider inside your environment variables:
1. Update `prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Alter the `DATABASE_URL` in your production `.env` to point to your live PostgreSQL database.
3. Re-run migrations and seed:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 2. Managing Process via PM2
To keep the application running persistently:
```bash
# Build the production optimized distribution bundle
npm run build

# Launch server process via PM2 daemon
pm2 start npm --name "texasia-b2b-portal" -- start
```

---

## 🔒 Security & Middleware Details
NextAuth Edge middleware operates at the HTTP header layer matching session cookie tokens (`next-auth.session-token` / `__Secure-next-auth.session-token`). This bypasses local SQLite and bcrypt Node binary compilation conflicts during Edge environment setups, resulting in extremely fast route protective transitions.

---

## 📝 Document Ownership
Developed for **Texasia International Fashion Co., Ltd.** under strict B2B compliance. All imagery placeholders route to premium CC0/Unsplash sources optimized for apparel merchandising presentations.
