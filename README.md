# TaxPilot — Indian Finance Calculators

A modern, full-featured Indian tax and finance calculator suite built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, and **NextAuth.js**.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Auth | NextAuth.js (Google + GitHub OAuth) |
| Charts | Recharts |
| Language | TypeScript |
| Theme | next-themes (dark/light mode) |

---

## 📊 Calculators (16 total)

### Income Tax
- **Old vs New Regime Comparator** — Side-by-side comparison with recommendation
- **Income Tax Calculator** — FY 2025-26 & FY 2024-25, slab breakdown, 87A rebate
- **HRA Calculator** — Metro/non-metro, all three conditions shown
- **CTC to In-Hand** — Full salary breakup with pie chart
- **Capital Gains Tax** — LTCG/STCG for equity, property, gold, debt
- **Advance Tax** — Quarterly schedule with due dates highlighted

### Tax Planning
- **80C Tax Saver Planner** — Interactive instrument selector with allocation slider
- **Freelancer Tax (44ADA)** — Presumptive vs actual comparison

### Investments
- **SIP Calculator** — Area chart showing compounding growth
- **FD Calculator** — Compounding frequency, effective yield

### Loans & Decisions
- **Home Loan EMI** — Amortization bar chart
- **Prepay vs SIP** — Crossover chart showing when each wins
- **Rent vs Buy** — Net worth comparison over time

### Property
- **Stamp Duty Calculator** — All 10 states, male/female/joint rates table

### Employment
- **Gratuity Calculator** — Act/non-Act formula, tax exemption

### GST
- **GST Calculator** — Add/remove GST, all 5 slabs, quick-reference grid

---

## 🛠 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd taxpilot
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Google OAuth — https://console.developers.google.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth — https://github.com/settings/applications/new
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Set Up OAuth Providers

**Google:**
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a project → Enable Google+ API
3. OAuth 2.0 → Authorised redirect URIs: `http://localhost:3000/api/auth/callback/google`

**GitHub:**
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with calculator grid
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + CSS variables
│   ├── auth/login/page.tsx         # Login page (Google + GitHub)
│   ├── api/auth/[...nextauth]/     # NextAuth handler
│   └── calculators/
│       ├── income-tax/
│       ├── tax-regime-comparator/
│       ├── hra/
│       ├── ctc-to-inhand/
│       ├── capital-gains/
│       ├── advance-tax/
│       ├── planner-80c/
│       ├── freelancer-tax/
│       ├── sip/
│       ├── fd/
│       ├── home-loan-emi/
│       ├── prepay-vs-sip/
│       ├── rent-vs-buy/
│       ├── stamp-duty/
│       ├── gratuity/
│       └── gst/
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   └── index.tsx               # Label, Input, Select, Tabs, Badge, etc.
│   ├── layout/
│   │   ├── navbar.tsx              # Sticky navbar with auth + theme toggle
│   │   ├── footer.tsx
│   │   ├── calculator-layout.tsx   # Shared calculator page wrapper
│   │   ├── theme-provider.tsx
│   │   └── session-provider.tsx
│   └── calculators/
│       ├── slider-field.tsx        # Reusable slider with label + value badge
│       ├── result-card.tsx         # Result display card + grid
│       └── faq.tsx                 # Accordion FAQ component
└── lib/
    ├── auth.ts                     # NextAuth config
    ├── calculators.ts              # All 16 calculator logic functions
    ├── calculators-meta.ts         # Calculator registry (icons, slugs, categories)
    └── utils.ts                    # cn(), formatCurrency(), etc.
```

---

## 🚢 Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add the same environment variables in Vercel dashboard under **Settings → Environment Variables**. Update OAuth redirect URIs to your production domain.

---

## 📝 Notes

- All calculations are for **informational purposes only**
- Tax rules are updated for **FY 2025-26**
- Authentication is optional — all calculators work without login
- No database required — uses JWT sessions via NextAuth
- Dark/light mode works out of the box

---

## 🧩 Adding More Calculators

1. Add metadata to `src/lib/calculators-meta.ts`
2. Add calculation logic to `src/lib/calculators.ts`
3. Create `src/app/calculators/your-calculator/page.tsx`
4. Use `<CalculatorLayout>`, `<SliderField>`, `<ResultCard>`, and `<FAQ>` components
