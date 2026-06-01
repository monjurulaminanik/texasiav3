# MASTER PROMPT — Texasia Clone (Full-Stack B2B Garment Manufacturer Site)

Copy everything below this line and paste it as your first message in a new Google Antigravity project.

---

# ROLE & GOAL

You are a senior full-stack engineer. Build a production-grade, SEO-optimized B2B corporate website for a Bangladesh-based garment manufacturing & sourcing company, modeled on the structure of texasia.com (but with all original content, no copyrighted assets). The site must include a complete admin CMS so a non-technical staff member can add products, blog posts, FAQs, jobs, and edit static pages without touching code.

Work in **Planning mode first** — present a step-by-step plan with file structure and milestones. After I approve, execute autonomously with dynamic sub-agents in parallel where possible. Use the **browser sub-agent** to verify rendered pages at the end of each milestone.

---

# 1. MANDATORY TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL (use SQLite for local dev fallback) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v5 (Credentials provider, bcryptjs, JWT sessions) |
| Forms | React Hook Form + Zod validation |
| Rich Text | Tiptap (with image, link, list, heading, table extensions) |
| Image Optimization | Next/Image + Sharp |
| File Upload | Local disk to `/public/uploads`, organized by `/products`, `/blog`, `/pages` |
| Email | Nodemailer + SMTP |
| Icons | lucide-react |
| State (admin) | React Query (TanStack Query) |
| Notifications | sonner (toast) |
| Date utils | date-fns |
| Slug generation | slugify |
| SEO | next-sitemap (auto sitemap.xml + robots.txt) |

No Firebase, no external CMS. Everything self-hostable on a standard Node.js + PostgreSQL VPS (cPanel/PM2 compatible).

---

# 2. PROJECT BUSINESS CONTEXT (use for tone & copy)

The company is **"Texasia International Fashion Co., Ltd."** — a Dhaka-based readymade garment manufacturer & sourcing partner. Use these brand facts when generating sample content (rewrite, do not copy from texasia.com):

- Founded 2010, based in Mirpur DOHS, Dhaka, Bangladesh
- BSCI, SEDEX, WRAP, OEKO-TEX, ISO 9001:2015 certified, LEED Gold facility
- 800–1,000 workers, ~2 million pieces/month capacity
- Services: OEM, ODM, private label, sourcing-to-delivery
- Differentiator: Low MOQ (from 500 pcs) + mass production capability under one roof
- Clients: importers, wholesalers, retailers, private labels, boutiques, e-commerce sellers in USA, UK, EU, Asia
- Tone: Professional, B2B, trust-focused, compliance-forward

---

# 3. COMPLETE DATABASE SCHEMA

Create `prisma/schema.prisma` exactly as below:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  role      String     @default("admin") // admin | editor
  posts     BlogPost[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  heroImage   String?
  metaTitle   String?
  metaDesc    String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  categoryId  String
  category    Category       @relation(fields: [categoryId], references: [id])
  shortDesc   String?        @db.Text
  description String         @db.Text
  features    Json?          // string array of feature bullets
  moq         String?
  leadTime    String?
  fabric      String?
  sizes       String?        // comma-separated
  colors      String?        // comma-separated
  metaTitle   String?
  metaDesc    String?
  isFeatured  Boolean        @default(false)
  isActive    Boolean        @default(true)
  images      ProductImage[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([categoryId])
  @@index([isActive, isFeatured])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  order     Int     @default(0)
}

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?   @db.Text
  content     String    @db.Text
  coverImage  String?
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  tags        String?   // comma-separated
  metaTitle   String?
  metaDesc    String?
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([isPublished, publishedAt])
}

model RFQ {
  id          String   @id @default(cuid())
  companyName String
  contactName String
  email       String
  phone       String?
  country     String?
  productType String?
  quantity    String?
  targetPrice String?
  message     String   @db.Text
  status      String   @default("new") // new | contacted | quoted | closed
  notes       String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status, createdAt])
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String   @db.Text
  status    String   @default("new") // new | read | replied
  createdAt DateTime @default(now())
}

model FAQ {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  category  String?  // Production | Shipping | MOQ | Quality | General
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Job {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  department   String?
  location     String?
  type         String?  // Full-time | Part-time | Contract | Internship
  description  String   @db.Text
  requirements String   @db.Text
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Page {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  content   String   @db.Text
  metaTitle String?
  metaDesc  String?
  updatedAt DateTime @updatedAt
}

model SiteSettings {
  id           String  @id @default("singleton")
  siteName     String  @default("Texasia Clone")
  tagline      String?
  logo         String?
  favicon      String?
  email        String?
  phone        String?
  whatsapp     String?
  address      String? @db.Text
  facebook     String?
  linkedin     String?
  instagram    String?
  youtube      String?
  footerText   String? @db.Text
  smtpHost     String?
  smtpPort     Int?
  smtpUser     String?
  smtpPass     String?
  smtpFromName String?
  smtpFromAddr String?
  updatedAt    DateTime @updatedAt
}
```

---

# 4. PUBLIC SITE — ALL PAGES

Every page must include: proper `<title>`, meta description, OG tags, structured data (Schema.org) where applicable, mobile-responsive layout, sticky header, footer.

## 4.1 Header (global)
- Logo (left) + horizontal nav (center-right) + "Get Quote" CTA button (right)
- Nav items: **Home, About** (dropdown: Profile, Why Choose Us, Sustainability, Accreditation, Membership), **Products** (mega-menu showing all categories grouped), **News, Careers, Contact**
- Sticky on scroll, transparent over hero on home, solid white elsewhere
- Mobile: hamburger drawer

## 4.2 Footer (global)
- 4 columns: About blurb + certifications row | Quick Links | Product Categories | Contact (address, phone, email, WhatsApp, social icons)
- Bottom strip: copyright + "Privacy Policy" + "Terms"

## 4.3 Pages

### `/` — Home
1. **Hero**: Full-width, factory/workers background image (use placeholder), headline ("World-Class Garment Manufacturing from Bangladesh"), sub-headline, two CTAs ("Request Quote" + "Explore Products")
2. **Trust strip**: Logos row — BSCI · SEDEX · WRAP · OEKO-TEX · ISO 9001 · LEED Gold
3. **About snippet**: 2-column — image left, text right with "Read More" → /profile
4. **Capabilities grid**: 6 cards (OEM, ODM, Private Label, Sampling, Quality Control, Logistics)
5. **Product Categories**: Grid of 12 featured categories, each card → /products/[slug]
6. **Why Choose Us**: 4 stats (15+ Years, 2M pcs/month, 500+ MOQ, 50+ Countries) + 4 feature blocks
7. **Featured Products**: Carousel of `isFeatured=true` products
8. **Latest News**: 3 most recent published blog cards
9. **CTA Banner**: Full-width "Start Your Project Today" → /request-for-quotation
10. **Newsletter signup** (optional — store email in a simple `Newsletter` model if you add one)

### `/profile`, `/why-choose-us`, `/sustainability`, `/accreditation`, `/membership`
- Driven by `Page` table — render `title` + `content` (rich HTML)
- Sidebar with links to sibling about pages
- These pages must be editable from admin

### `/products` — All Categories
- Grid of all active categories (3 cols desktop, 2 tablet, 1 mobile)
- Each card: hero image, name, short description, "View Products →" link
- Page-level intro section with H1 + descriptive paragraph (SEO-rich)

### `/products/[category]` — Category Page
- Breadcrumb (Home > Products > Category)
- Hero with category image + name + description
- Filter/sort bar (by name, newest)
- Grid of products in that category (4 cols desktop)
- Long-form SEO content section below (300+ words pulled from `Category.description`)
- "Request Quote for [Category]" CTA section

### `/products/[category]/[slug]` — Product Detail
- Breadcrumb
- 2-column layout: Image gallery (main + thumbnails, lightbox) | Product info
- Right column: H1 name, short description, features bullets, MOQ, lead time, fabric, sizes, colors, "Request Quote" button (opens modal or jumps to RFQ form with product pre-filled)
- Tabs below: Description (full rich text) | Specifications | Inquiry
- "Related Products" carousel (same category, 4 items)
- Schema.org Product markup

### `/news` — Blog Listing
- Hero with H1 + intro
- Filter by tags
- Grid of blog cards (3 cols desktop): cover image, title, excerpt, date, tags
- Pagination (12 per page)

### `/news/[slug]` — Blog Detail
- Cover image at top, title, author, date, tags
- Reading-width article body (max 720px)
- Tiptap rendered HTML with prose styling
- Author bio card at bottom
- "Related Posts" section (3 cards by tag overlap or recency)
- Social share buttons (LinkedIn, Facebook, WhatsApp, copy link)
- Schema.org Article markup
- Increment `views` on visit (server action)

### `/career` — Careers
- Hero: "Join Our Team"
- "Why work at us" section (4 perks)
- Open positions list (cards from `Job` table)
- Click → `/career/[slug]` showing full job description + "Apply" mailto link to careers@ email from settings

### `/faq` — FAQ
- Hero with H1
- Accordion grouped by `FAQ.category`
- Search bar at top (client-side filter)

### `/request-for-quotation` — RFQ
- Multi-step form (use React Hook Form):
  - Step 1: Company info (companyName, contactName, country)
  - Step 2: Contact details (email, phone)
  - Step 3: Product needs (productType dropdown from categories, quantity, targetPrice, message)
- On submit: POST to `/api/rfq`, save to DB, send email to `SiteSettings.email`, show success page
- Show success/error toast
- Spam protection: honeypot field + rate limit by IP

### `/contact` — Contact
- 2-column: Form (left) | Info card with map embed (right)
- Form: name, email, phone, subject, message
- POST to `/api/contact`, save + email
- Office address (from SiteSettings), phone, email, WhatsApp, social links

### Additional SEO Landing Pages (treat as BlogPost type entries with custom URL prefix `/insights/`)
Generate 5 sample articles in seed:
1. "Clothing Factory in Bangladesh: Complete Guide for 2026"
2. "Why Bangladesh is the Top Apparel Manufacturing Hub"
3. "OEM vs ODM vs Private Label: Which is Right for Your Brand?"
4. "Sustainable Garment Manufacturing: A 2026 Outlook"
5. "Low MOQ Manufacturing: How Startups Can Compete with Big Brands"

---

# 5. ADMIN PANEL — `/admin`

Protected by NextAuth middleware. All routes under `/admin` redirect to `/admin/login` if not authenticated.

## 5.1 Layout
- Left sidebar (collapsible on mobile): Logo, nav items, user dropdown with Logout
- Top bar: page title, breadcrumb, notifications bell (shows new RFQ/contact count)
- Main content area with shadcn `Card` containers

## 5.2 Routes & Functionality

### `/admin/login`
- Email + password form, NextAuth credentials, redirect to `/admin/dashboard` on success

### `/admin/dashboard`
- 4 stat cards: Total Products, Published Posts, New RFQs (30d), New Contacts (30d)
- Recent RFQs table (last 5, clickable rows)
- Recent contacts table (last 5)
- Recent blog posts list

### `/admin/products` — list view
- DataTable with: image thumb, name, category, featured toggle (inline), status toggle (inline), updatedAt, actions (Edit, Delete with confirm modal)
- Search by name, filter by category, sort columns
- "Add Product" button → `/admin/products/new`

### `/admin/products/new` and `/admin/products/[id]/edit`
- Form fields:
  - Name (auto-generate slug, editable)
  - Category (dropdown from DB)
  - Short Description (textarea, 200 char max)
  - Description (Tiptap rich editor with image upload)
  - Features (tag input — array)
  - MOQ, Lead Time, Fabric, Sizes, Colors (text inputs)
  - Images (drag-drop upload, multiple, reorderable, set alt text, mark cover)
  - SEO: Meta Title, Meta Description (with character count)
  - Toggles: Featured, Active
- Save / Save & Add Another / Cancel
- Validation with Zod

### `/admin/categories` — list & CRUD
- Same DataTable pattern
- Form: name, slug, description (Tiptap), hero image upload, SEO meta, order, active toggle

### `/admin/blog` — list view
- DataTable: cover thumb, title, author, status (Published/Draft), publishedAt, views, actions

### `/admin/blog/new` and `/admin/blog/[id]/edit`
- Title (auto-slug)
- Cover image upload
- Excerpt (textarea)
- Content (Tiptap with image upload, headings, links, lists, blockquote, code)
- Tags (tag input)
- SEO meta
- Status: Draft / Publish (with `publishedAt` set when toggled to published)
- "Preview" button opens new tab with draft preview (token-secured)

### `/admin/pages` — list of static pages
- Shows: Profile, Why Choose Us, Sustainability, Accreditation, Membership
- Edit form: title, content (Tiptap), SEO meta

### `/admin/faqs` — list & CRUD
- Inline-editable table OR modal form
- Drag-to-reorder within category

### `/admin/jobs` — list & CRUD
- Form: title (auto-slug), department, location, type (dropdown), description (Tiptap), requirements (Tiptap), active toggle

### `/admin/rfqs` — RFQ inbox
- DataTable: createdAt, companyName, contactName, country, productType, status badge (colored), actions
- Filter by status
- Click row → drawer/modal showing full details + status dropdown + notes textarea + "Send Email Reply" button (opens mailto with pre-filled)
- Bulk actions: mark as contacted, export CSV

### `/admin/contacts` — same pattern as RFQs

### `/admin/media` — Media Library
- Grid view of all uploaded files in `/public/uploads`
- Show: thumbnail, filename, size, uploaded date, used-by count
- Delete unused files (with confirmation)
- Copy URL button

### `/admin/users` — only visible to role=admin
- List users, add new admin/editor, change password, delete

### `/admin/settings`
- Tabbed form:
  - **General**: Site name, tagline, logo upload, favicon upload, footer text
  - **Contact**: email, phone, whatsapp, address
  - **Social**: facebook, linkedin, instagram, youtube URLs
  - **Email/SMTP**: host, port, user, pass, fromName, fromAddr, "Send Test Email" button

---

# 6. DESIGN SYSTEM

## Colors (Tailwind config)
```js
colors: {
  primary: {
    DEFAULT: '#0B2545',  // Deep navy
    50: '#E8ECF2', 100: '#C5CFDE', 500: '#0B2545', 700: '#081A33', 900: '#040D1A'
  },
  accent: {
    DEFAULT: '#D4A574',  // Warm gold
    500: '#D4A574'
  },
  neutral: { /* gray scale */ }
}
```

## Typography
- Headings: `Inter` (or `Plus Jakarta Sans`), bold, tight tracking
- Body: `Inter`, regular
- H1: 48-60px desktop, 32-40px mobile
- Use `font-display` for hero headlines

## Components (shadcn/ui — install these)
button, input, textarea, label, card, dialog, dropdown-menu, select, checkbox, switch, table, tabs, badge, separator, sheet, toast (sonner), accordion, breadcrumb, navigation-menu, form, calendar (for date filters)

## Imagery
- Use placeholder images from `https://images.unsplash.com` with query params for garment/factory/textile themes
- All product images: 4:5 aspect ratio
- Hero images: 16:9 or 21:9
- Lazy load with blur placeholder

---

# 7. API ROUTES (Next.js Route Handlers)

```
/api/auth/[...nextauth]      — NextAuth
/api/products
  GET     — list (with filters)
  POST    — create (auth required)
/api/products/[id]
  GET, PATCH, DELETE
/api/categories
  GET, POST, PATCH, DELETE
/api/blog
  GET, POST, PATCH, DELETE
/api/rfq
  POST   — public (with rate limit + honeypot)
  GET    — admin only
/api/rfq/[id]   — PATCH status
/api/contact
  POST, GET, PATCH
/api/upload
  POST   — multipart, returns URL
/api/faqs       — CRUD
/api/jobs       — CRUD
/api/pages      — GET, PATCH
/api/settings   — GET, PATCH
/api/sitemap    — dynamic sitemap
```

All admin endpoints check session role. RFQ/Contact POST endpoints are public but rate-limited (10 req/hour per IP using in-memory or Redis if available).

---

# 8. SEED DATA (`prisma/seed.ts`)

Create on first run:

1. **One admin user**: email `admin@texasia.local`, password `ChangeMe123!` (bcrypt hashed), name "Admin User", role "admin"
2. **Site settings singleton** with sample contact info
3. **23 categories** with original 150-word descriptions each, slugs and order:
   - t-shirts, polos, hoodies-sweatshirts, dresses, pajamas, trousers, circular-knit-jersey, flat-knit-sweater, denim-jeans, woven, headwear, swimwear, underwear, nightwear, sportswear, formalwear, casualwear, activewear, workwear, outerwear, uniform, jute-textile, handicraft
4. **3 sample products per category** (69 total) with:
   - Realistic name (e.g., "Premium Cotton Crew Neck T-Shirt")
   - 2 placeholder Unsplash image URLs each
   - Full description (200-300 words, B2B tone)
   - 5-7 feature bullets
   - MOQ "500 pieces", lead time "30-45 days", fabric/sizes/colors
5. **5 static pages** seeded with original content for: profile, why-choose-us, sustainability, accreditation, membership (300-500 words each)
6. **5 blog posts** (titles listed in section 4.3, "Additional SEO Landing Pages"), each 800-1200 words with realistic content
7. **15 FAQs** spread across categories: General (5), Production (4), Shipping (3), MOQ (3)
8. **3 sample jobs**: "Merchandiser", "Quality Control Inspector", "Sales Executive — Europe Market"

All seed content must be **original** — do not copy from texasia.com. Use the brand context from Section 2 to write authentic B2B garment-industry copy.

---

# 9. FOLDER STRUCTURE

```
texasia-clone/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── uploads/
│   │   ├── products/
│   │   ├── blog/
│   │   └── pages/
│   └── images/
│       └── certifications/   (BSCI, SEDEX, etc. SVG placeholders)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  (root with fonts, providers)
│   │   ├── globals.css
│   │   ├── (public)/
│   │   │   ├── layout.tsx              (public header + footer)
│   │   │   ├── page.tsx                (home)
│   │   │   ├── profile/page.tsx
│   │   │   ├── why-choose-us/page.tsx
│   │   │   ├── sustainability/page.tsx
│   │   │   ├── accreditation/page.tsx
│   │   │   ├── membership/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [category]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [slug]/page.tsx
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── career/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── request-for-quotation/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx              (admin shell, sidebar, auth gate)
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── pages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/edit/page.tsx
│   │   │   ├── faqs/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   ├── rfqs/page.tsx
│   │   │   ├── contacts/page.tsx
│   │   │   ├── media/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── products/[id]/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── blog/route.ts
│   │   │   ├── blog/[id]/route.ts
│   │   │   ├── rfq/route.ts
│   │   │   ├── rfq/[id]/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── faqs/route.ts
│   │   │   ├── jobs/route.ts
│   │   │   ├── pages/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── users/route.ts
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── public/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── CertStrip.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── RFQForm.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── TiptapEditor.tsx
│   │   │   ├── TagInput.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── BlogForm.tsx
│   │   │   └── ...
│   │   ├── ui/                         (shadcn components)
│   │   └── providers/
│   │       ├── QueryProvider.tsx
│   │       └── ToastProvider.tsx
│   ├── lib/
│   │   ├── prisma.ts                   (singleton)
│   │   ├── auth.ts                     (NextAuth config)
│   │   ├── email.ts                    (Nodemailer wrapper)
│   │   ├── upload.ts                   (file save utility)
│   │   ├── slugify.ts
│   │   ├── rate-limit.ts
│   │   └── utils.ts                    (cn, formatDate, etc.)
│   ├── hooks/
│   │   ├── useUpload.ts
│   │   └── useDebounce.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts                   (admin route protection)
├── .env.example
├── .env.local                          (gitignored)
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── next-sitemap.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

# 10. ENVIRONMENT VARIABLES (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/texasia"

# NextAuth
NEXTAUTH_SECRET="generate-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@email.com"
SMTP_PASS="app-password"
SMTP_FROM_NAME="Texasia"
SMTP_FROM_ADDR="noreply@texasia.com"

# Upload (optional Cloudinary fallback)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

# 11. DELIVERABLES & ACCEPTANCE CRITERIA

When done, the project must:

- [ ] `npm install && npx prisma migrate dev && npx prisma db seed && npm run dev` works without manual intervention beyond setting up `.env`
- [ ] All 13+ public pages render without errors
- [ ] All 17+ admin pages render and CRUD operations work end-to-end
- [ ] Admin login works with seeded credentials
- [ ] Adding a new product from admin makes it appear on the public site immediately (use `revalidatePath`)
- [ ] Adding/publishing a new blog post makes it appear on `/news` immediately
- [ ] RFQ form submission saves to DB + sends email + appears in admin inbox
- [ ] Contact form same behavior
- [ ] Image uploads work and images render correctly on public site
- [ ] Tiptap editor saves rich content and renders correctly on public pages
- [ ] Sitemap.xml and robots.txt generate dynamically
- [ ] Mobile-responsive across all pages (test at 375px, 768px, 1280px viewports)
- [ ] Lighthouse score ≥ 85 on Performance, SEO, Accessibility on the home page
- [ ] No TypeScript errors, no ESLint errors
- [ ] README.md includes: setup steps, deployment to VPS via PM2, default admin credentials, how to add a product, how to add a blog post

---

# 12. EXECUTION PLAN (your suggested milestones)

Propose milestones in this order, get my approval, then execute:

1. **Bootstrap**: Next.js + TypeScript + Tailwind + shadcn install, folder structure, env setup, Prisma init
2. **Database**: schema, migration, seed script with all categories + sample data
3. **Auth + Admin shell**: NextAuth, admin layout, sidebar, login page, middleware
4. **Admin CRUD — Phase 1**: Products, Categories, Media uploader, Tiptap editor component
5. **Admin CRUD — Phase 2**: Blog, Pages, FAQs, Jobs
6. **Admin CRUD — Phase 3**: RFQs inbox, Contacts inbox, Settings, Users
7. **Public site — Phase 1**: Header, Footer, Home, Products list, Product detail, Category page
8. **Public site — Phase 2**: Blog list + detail, About-family pages, FAQ, Careers
9. **Public site — Phase 3**: RFQ form, Contact form, Email integration
10. **SEO + Polish**: Sitemap, robots, Schema.org markup, OG images, performance audit
11. **Testing & verification**: Browser sub-agent walks every page, verifies CRUD flows, generates evidence artifacts
12. **README + Handoff**: Documentation, deployment guide

After each milestone, produce an Artifact summarizing what was built, screenshots from the browser sub-agent, and any decisions made.

---

# 13. RULES OF ENGAGEMENT

- **Original content only** — write all sample copy yourself in B2B garment-industry tone. Do not copy text from texasia.com.
- **No copyrighted logos or images** — use neutral SVG placeholders for certification badges, Unsplash for photos.
- **Production-grade code**: error boundaries, loading states, optimistic UI on admin mutations, proper TypeScript types (no `any`), reusable components.
- **Security**: hash passwords with bcrypt (12 rounds), CSRF protection on mutations, input sanitization on Tiptap output before rendering, file type/size validation on uploads (max 5MB, images only).
- **Performance**: ISR with `revalidate: 3600` for product/blog list pages, on-demand revalidation when admin creates/updates content, Next/Image everywhere, dynamic imports for Tiptap.
- **Accessibility**: Semantic HTML, ARIA labels, keyboard nav, focus states, alt text required on image uploads.
- **Commit often**: Logical git commits per milestone with clear messages.

---

Now propose your execution plan with milestone breakdown and estimated artifacts. Wait for my approval before writing code.
