
# 🌹 Rose Store

**A full-stack, bilingual e-commerce platform** — customer storefront + admin dashboard, built with Next.js 16 (App Router).


---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture — How It Works](#-architecture--how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Internationalization](#-internationalization)
- [API Layer](#-api-layer)
- [Security Highlights](#-security-highlights)
- [Roadmap Ideas](#️-roadmap-ideas)
- [Contributing](#-contributing)

---

## 📖 Overview

**Rose Store** is a production-grade e-commerce application — think of it as two apps sharing one codebase:

1. A **customer storefront** where people browse products by category/occasion, add to cart or wishlist, check out with a map-based address picker, and track their orders.
2. An **admin dashboard**, gated by role, where staff manage the product catalog, categories, occasions, and orders.

Everything is built on the **Next.js App Router**, using **route groups** to cleanly separate the storefront, auth pages, and dashboard without them leaking into each other's layouts. Every route is locale-prefixed (`/en/...`, `/ar/...`) via `next-intl`, giving the app a real bilingual **English / Arabic** experience with automatic **RTL** layout switching — not just translated strings.

> 🧠 **New to this codebase and short on time?** Read [Architecture — How It Works](#-architecture--how-it-works) below — it walks through auth, routing, and data-fetching so you understand the *why*, not just the folder names.

## ✨ Features

### 🛍️ Storefront
- Browse products by **category** and **occasion**, with search and filters
- Product detail pages with reviews and testimonials
- **Cart** with a persistent order summary panel
- **Wishlist** for saved products
- Multi-step **checkout** flow with an integrated **Google Maps** address picker
- **Order history** and order tracking
- User **profile** management, including password change
- Guest cart support (add to cart before signing in)

### 🔐 Authentication
- Email/password auth powered by **NextAuth.js**
- Register, login, forgot password, and reset password flows
- Protected routes with a dedicated *"not authorized"* page

### 📊 Admin Dashboard
- Manage **products** (create, update, list)
- Manage **categories** (create, update, list)
- Manage **occasions** (create, update, list)
- Order management and statistics
- Account settings for admin users

### 🌍 Internationalization
- Full **English / Arabic** support via `next-intl`
- Locale-based routing with automatic RTL layout switching
- Centralized translation files (`src/i18n/messages`)

### 🎨 UI/UX
- Built with **Radix UI** primitives + **shadcn/ui**-style components
- **Tailwind CSS 4** for styling, with `tailwind-merge` for clean class composition
- Dark/light theme support via `next-themes`
- Toasts, dialogs, dropdowns, tooltips, tabs, carousels (Embla), and more
- Fully responsive, mobile-first layouts

## 🏗️ Architecture — How It Works

This section is the "lazy-but-curious" shortcut: read this and you'll understand how the app actually behaves without opening a single file.

### 1. Routing: locale-first, then route groups

Every page lives under `src/app/[locale]/...`, so the **locale is always the first URL segment** (`/en/products`, `/ar/checkout`). Below that, three **route groups** split the app into isolated sections that each get their own layout, without affecting the URL:

| Route group | URL example | Purpose |
|---|---|---|
| `(website)` | `/en/products`, `/en/cart` | The public storefront |
| `(auth)` | `/en/login`, `/en/register` | Authentication pages (no shop chrome) |
| `dashboard` | `/en/dashboard/products` | Admin panel (own sidebar layout) |

### 2. Authentication & authorization

Auth is handled by **NextAuth.js** using the **Credentials provider** (`src/auth.ts`):

- On login, credentials are sent to the backend's `/api/auth/login` endpoint; the response (`user` + `token`) is stored in a **JWT session** (no database session lookups).
- The JWT carries the user's `id`, name, `role` (`USER` | `ADMIN`), verification flags, and the backend `accesstoken` — which is what every subsequent API call authenticates with.
- Sessions are stored in an `httpOnly`, `secure` (in production) cookie.

Route protection happens in **`src/proxy.ts`** (the app's middleware), which combines `next-intl`'s locale middleware with `next-auth`'s `withAuth`:

- **Public pages** (home, product listing, auth pages) — accessible to everyone.
- **Everything else in `(website)`** — requires a logged-in session; unauthenticated users are redirected to `/login`.
- **`/dashboard/*`** — requires a logged-in session **and** is intended for `ADMIN` role users; unauthorized users are sent to `/not-authorized`.
- Already-logged-in users are redirected away from auth pages like `/login`.

### 3. Data flow: Server-side fetch + client-side cache

The app talks to an external backend API (configured via `API` / `NEXT_PUBLIC_API`). Two patterns are used side by side:

- **Server Components / Route Handlers** (`src/app/api/**/route.ts`) fetch data server-side and act as a thin **proxy/BFF layer** between the browser and the real backend — this keeps the backend URL and auth token off the client where it isn't needed, and lets responses be normalized before reaching the UI.
- **Client Components** use **TanStack Query** (`useQuery` / `useMutation`) via custom hooks in `src/hooks/` (e.g. `use-categories.ts`, `use-checkout.ts`, `use-single-product.ts`) for caching, background refetching, and optimistic UI (like instant wishlist toggling).

Raw API responses are passed through **normalizer utilities** in `src/lib/utils/` (`normalize-product.ts`, `normalize-cart.ts`, `normalize-order.ts`, …) so components always work with a clean, consistent shape regardless of backend quirks.

### 4. Forms & validation

Every form (login, register, checkout, product creation, etc.) follows the same pattern: **React Hook Form** for form state + **Zod** schemas for validation, wired together with `@hookform/resolvers`. Reusable field components live in `src/components/ui/` (`field.tsx`, `form.tsx`, `password-input.tsx`, `phone-input.tsx`, `input-image.tsx`…).

### 5. Guest cart → account merge

Users can add items to their cart **before logging in**. `src/lib/utils/guest-add-to-cart.ts` and the `use-sync-guest-cart.ts` hook persist that cart locally and merge it into the user's real cart once they authenticate — so nothing gets lost between anonymous browsing and sign-in.

### 6. Checkout & address selection

The checkout flow (`(website)/checkout`) uses `@vis.gl/react-google-maps` to let users **pick a delivery address visually on a map** rather than typing coordinates, backed by its own `hooks/` and `_components/` for step-by-step state management.

## 🧰 Tech Stack

| Layer            | Technology |
|-------------------|------------|
| Framework          | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language           | TypeScript |
| UI                 | React 19, Radix UI, shadcn/ui, Tailwind CSS 4 |
| Forms & Validation | React Hook Form + Zod |
| Data Fetching      | TanStack Query (React Query) |
| Auth               | NextAuth.js |
| i18n               | next-intl |
| Maps               | @vis.gl/react-google-maps |
| Charts             | Recharts |
| Package Manager    | Yarn |

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (website)/                # 🛍️ Storefront route group
│   │   │   ├── (homepage)/             #   Landing page + its sections
│   │   │   ├── products/[id]/          #   Product listing + detail page
│   │   │   ├── cart/@summary/          #   Cart page (with a parallel route
│   │   │   │                           #   for the live order summary panel)
│   │   │   ├── checkout/hooks/         #   Checkout flow + Google Maps address step
│   │   │   ├── wishlist/               #   Saved products
│   │   │   ├── orders/                 #   Order history for the logged-in user
│   │   │   ├── profile/change-password/#   Account settings
│   │   │   └── about/                  #   Static content page
│   │   │
│   │   ├── (auth)/                   # 🔐 Auth route group (no shop chrome)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── dashboard/                # 📊 Admin route group
│   │   │   ├── products/[update]/create-product/
│   │   │   ├── categories/{add,update}-category/
│   │   │   ├── occasions/{add,update}-occasion/
│   │   │   ├── account-settings/change-password/
│   │   │   └── _components/{sidebar,bread-crumb}/
│   │   │
│   │   ├── not-authorized/           # Shown when a non-admin hits /dashboard
│   │   └── [...not-found]/           # Localized 404
│   │
│   └── api/                          # Route handlers = BFF layer to the backend
│       ├── auth/[...nextauth]/         # NextAuth handler
│       ├── login/, cart/, checkout/    # Storefront endpoints
│       ├── categories/, occasions/     # Catalog endpoints
│       ├── search/, personal-product/  # Search & recommendations
│       ├── addresses/, account/        # User profile & addresses
│       └── dashboard/{orders,products}/# Admin-only endpoints
│
├── components/
│   ├── ui/                           # Design-system primitives (button, dialog,
│   │                                 # form, table, pagination, rating, sidebar…)
│   ├── features/                     # Feature-specific composite components
│   ├── shared/                       # Cross-page shared components (navbar, footer…)
│   ├── skeletons/                    # Loading-state placeholders
│   └── providers/                    # App-wide context/providers (theme, query client…)
│
├── context/                          # React Context providers (e.g. cart state)
├── hooks/                            # Data-fetching & UI hooks (see table below)
├── i18n/
│   ├── routing.ts                    # Locale list + default locale
│   ├── navigation.ts                 # Locale-aware Link/router helpers
│   ├── request.ts                    # next-intl server config
│   └── messages/{en,ar}.json         # Translation dictionaries
│
├── lib/
│   ├── types/                        # Shared TypeScript types (product, order,
│   │                                 # cart, dashboard/*, user, review…)
│   └── utils/                        # normalize-*.ts, auth.ts, api-response.ts,
│                                     # manage-token.ts, upload-image.ts, url.ts…
│
├── auth.ts                           # NextAuth options (Credentials provider, JWT)
└── proxy.ts                          # Middleware: i18n routing + route protection
```

### 🪝 Key custom hooks

| Hook | What it does |
|---|---|
| `use-categories.ts` / `use-occasions.ts` | Fetch & cache catalog taxonomies |
| `use-single-product.ts` | Fetch a single product's details |
| `use-checkout.ts` | Drives the multi-step checkout flow |
| `use-address.ts` | Manages saved delivery addresses |
| `use-toggle-wishlist.tsx` / `use-locale-wishlist.ts` | Add/remove wishlist items with locale-aware state |
| `use-sync-guest-cart.ts` | Merges a guest's local cart into their account on login |
| `use-create-product.ts` / `use-update-product.ts` | Admin product create/update mutations |
| `use-toast.ts` | App-wide toast notifications |
| `use-mobile.tsx` | Responsive breakpoint detection |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18 or later
- **Yarn** (recommended — the project ships with `yarn.lock`)

### 1. Clone & install

```bash
git clone <repository-url>
cd my-app
yarn install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
# Base URL of the frontend app
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Backend API endpoints
API=https://your-api-domain.com
NEXT_PUBLIC_API=https://your-api-domain.com

# NextAuth
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# Google Maps (used in checkout's address picker)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id
```

> 💡 Generate a secure `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to your default locale (`/en`).

### 4. Build for production

```bash
yarn build
yarn start
```

## 📜 Available Scripts

| Command       | Description                          |
|---------------|---------------------------------------|
| `yarn dev`    | Start the development server (Turbopack) |
| `yarn build`  | Build the app for production          |
| `yarn start`  | Start the production server           |
| `yarn lint`   | Run ESLint                            |

## 🌐 Internationalization

The app supports **English (`en`)** and **Arabic (`ar`)**, with Arabic rendered right-to-left automatically. Locale is baked into the URL structure (`/en/products`, `/ar/products`), and translations live in:

```
src/i18n/messages/en.json
src/i18n/messages/ar.json
```

To add a new string, add the key to both files and reference it with the `useTranslations` / `getTranslations` hooks from `next-intl`.

## 🔌 API Layer

The app doesn't call the backend directly from client components. Instead, `src/app/api/**` exposes local Next.js route handlers that act as a **BFF (Backend-for-Frontend)** — attaching auth tokens, hiding the real backend URL, and normalizing responses.

| Route | Area | Notes |
|---|---|---|
| `/api/auth/[...nextauth]` | Auth | NextAuth session handling |
| `/api/login` | Auth | Credentials login |
| `/api/account` | Profile | Get/update the current user |
| `/api/addresses` | Profile | CRUD for saved delivery addresses |
| `/api/cart` | Storefront | Cart read/update |
| `/api/checkout` | Storefront | Places an order |
| `/api/categories` | Catalog | List product categories |
| `/api/occasions` | Catalog | List product occasions |
| `/api/personal-product` | Catalog | Personalized product recommendations |
| `/api/search` | Catalog | Product search |
| `/api/dashboard/products` | Admin | Product CRUD (admin only) |
| `/api/dashboard/orders` | Admin | Order management (admin only) |
| `/api/[[...statistics]]` | Admin | Dashboard statistics/analytics feed |

> Server-only calls that need the backend base URL use `getServerApiBase()` / `parseApiEnvelope()` from `src/lib/utils/api-response.ts`, which centralizes how the raw backend envelope (`{ success, data, message }`-style responses) is parsed and unwrapped.

## 🗺️ Roadmap Ideas

- [ ] Payment gateway integration
- [ ] Product reviews moderation in the dashboard
- [ ] Advanced analytics/reporting for admins
- [ ] Push/email order notifications

## 🔒 Security Highlights

- **httpOnly, secure session cookies** — the NextAuth JWT session cookie is `httpOnly` always, and `secure` in production, so it's inaccessible to client-side JavaScript and never sent over plain HTTP.
- **Backend token never exposed unnecessarily** — the backend `accesstoken` lives inside the server-side session; the browser only holds the NextAuth session cookie, not raw credentials.
- **Middleware-enforced route protection** — every request to `(website)` protected pages and the entire `dashboard` group is checked in `proxy.ts` *before* the page ever renders, not after.
- **Role-aware access control** — `USER` and `ADMIN` roles are distinguished at the session level, keeping admin-only actions out of reach for regular customers.
- **Schema-validated input** — every form submission is validated with **Zod** on the client, and API route handlers re-validate/normalize data before it reaches the backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


**🌹 Rose Store** — built with Next.js, React & TypeScript

⭐ If this project helped you, consider giving it a star!

