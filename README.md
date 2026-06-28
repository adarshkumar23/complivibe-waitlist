# CompliVibe — Waitlist Landing Page

A production-ready waitlist landing page for **CompliVibe**, an AI Trust Infrastructure startup. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion, with a **Liquid Glass** (Apple Vision Pro) aesthetic. Deployable to **Cloudflare Pages** at `waitlist.complivibe.in`.

Visitors complete a 3-step intake form and instantly receive a personalized **AI compliance risk score** (HIGH / MEDIUM / LOW) with their three most critical gaps — saved to Supabase and emailed via Resend. A password-protected admin dashboard lets the team browse, filter, search, and export signups.

---

## ✨ Features

- **Liquid glass design system** — frosted glass cards, animated gradient mesh background, brand gradient text treatment.
- **8 animated sections** — Hero, The Stakes, What We Do, Framework Grid, Social Proof, Pricing Teaser, Early Benefits, Waitlist Form.
- **3-step waitlist form** with progress bar and validation.
- **Risk-score engine** (`lib/riskScore.ts`) — deterministic HIGH/MEDIUM/LOW scoring + 3 personalized gaps.
- **Animated risk reveal** — score meter, count-up, confetti on LOW, pulse on HIGH.
- **Transactional email** via Resend with an inline-styled HTML template.
- **Admin dashboard** (`/admin`) — stats, search, role/risk filters, CSV export, click-to-copy email, relative dates.
- **Live countdown** to launch (July 15, 2026) and animated waitlist counter.
- **Edge runtime** API routes — Cloudflare Pages compatible.
- **Fully responsive** — mobile-first across every section.

---

## 🧱 Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Database | Supabase (`@supabase/supabase-js`) |
| Email | Resend |
| Icons | lucide-react |
| Font | Inter (`next/font/google`) |
| Hosting | Cloudflare Pages |

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

`.env.local` is already created. For a fresh environment, copy the template and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key — used for form inserts |
| `SUPABASE_SERVICE_KEY` | Supabase service role key — admin reads only, **server-only** |
| `RESEND_API_KEY` | Resend API key for sending confirmation emails |
| `ADMIN_PASSWORD` | Password gate for the `/admin` dashboard |

### 3. Create the Supabase table

Open the Supabase dashboard → **SQL Editor** → paste the contents of [`supabase-setup.sql`](./supabase-setup.sql) and run it. This creates the `waitlist_signups` table, enables RLS, and adds the insert/select policies.

> ⚠️ Resend requires a verified sending domain. Verify `complivibe.in` in the Resend dashboard so emails from `hello@complivibe.in` deliver.

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🔐 Admin Panel

- URL: `/admin`
- Password: value of `ADMIN_PASSWORD` (set in `.env.local`)
- The password is verified against the protected API and cached in `localStorage` so you stay signed in.
- Features: total/HIGH/MEDIUM/LOW stat cards, full-text search, role & risk filters, CSV export, click-to-copy emails, relative timestamps, horizontal scroll on mobile.

---

## ☁️ Deploy to Cloudflare Pages

API routes use the **Edge runtime**, so the app runs on Cloudflare's network via `@cloudflare/next-on-pages`.

### Option A — Dashboard (recommended)

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Build settings:
   - **Build command:** `npx @cloudflare/next-on-pages@1`
   - **Build output directory:** `.vercel/output/static`
4. Add the environment variables (all 5 above) under **Settings → Environment variables**.
5. Under **Settings → Functions**, set the **Compatibility flag** `nodejs_compat` (also in `wrangler.toml`).
6. Add the custom domain `waitlist.complivibe.in` under **Custom domains**.

### Option B — Wrangler CLI

```bash
npm run pages:build      # builds with @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static
```

`wrangler.toml` is preconfigured with `compatibility_flags = ["nodejs_compat"]` and the output directory.

---

## 📁 Project Structure

```
complivibe-waitlist/
├── app/
│   ├── layout.tsx              # root layout, Inter font, metadata
│   ├── page.tsx                # assembles all 8 sections
│   ├── globals.css             # glass system, gradient mesh, inputs
│   ├── admin/page.tsx          # password-gated dashboard
│   └── api/
│       ├── waitlist/route.ts   # POST: save + email (edge)
│       └── admin/signups/route.ts  # GET: admin reads (edge)
├── components/
│   ├── sections/               # Hero, Stakes, WhatWeDo, FrameworkGrid,
│   │                           #   SocialProof, PricingTeaser, EarlyBenefits, WaitlistForm
│   ├── RiskScore.tsx           # animated score reveal
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CountdownTimer.tsx
│   ├── Counter.tsx             # animated count-up
│   └── Reveal.tsx              # scroll-reveal wrapper
├── lib/
│   ├── supabase.ts             # anon + service clients
│   ├── resend.ts               # email template + send
│   ├── riskScore.ts            # scoring algorithm
│   └── types.ts                # shared types + option lists
├── supabase-setup.sql
├── .env.local / .env.example
├── next.config.js
├── wrangler.toml
├── tailwind.config.ts
└── package.json
```

---

## 🧮 Risk Score Algorithm

`lib/riskScore.ts` assigns points based on missing frameworks, model count, and stated challenges:

- **HIGH** — `riskPoints >= 4`
- **MEDIUM** — `riskPoints >= 2`
- **LOW** — otherwise

It always returns exactly **3 gaps**, padding with sensible defaults when fewer are triggered.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint |
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run pages:deploy` | Build + deploy to Cloudflare Pages |

---

Built by Adarsh Sharma · [complivibe.in](https://complivibe.in)
