# Viluva

**A one-stop hub for personal finance decisions** — calculators, decision tools, and (growing) guidance for everyday money questions: retirement planning, investing, loans, and smart purchase decisions.

Live at [viluva.app](https://www.viluva.app).

## What's here today

### Retirement (FIRE) calculators
- **FIRE Calculator** (`/fire-calculator`) — standard FIRE corpus/timeline planning
- **Barista FIRE** (`/barista-fire-calculator`) — semi-retirement with part-time work
- **Coast FIRE** (`/coast-fire-calculator`) — invest early, coast to retirement
- **Fat FIRE** (`/fat-fire-calculator`) — higher-spend retirement planning

### Investment calculators
- **SIP Calculator** (`/sip-calculator`) — monthly investing growth projection
- **Lumpsum Calculator** (`/lumpsum-calculator`) — one-time investment growth projection
- **SIP + Lumpsum** (`/sip-lumpsum-calculator`) — combined strategy
- **SWP Calculator** (`/swp-calculator`) — retirement withdrawal sustainability

### Decision tools
- **Smart Purchase Advisor** (`/smart-score`) — 0–100 "Smart Score" on any purchase, weighing affordability, value, and goal impact
- **EMI True Cost** (`/emi-calculator`) — the real cost of an EMI or "0% EMI" offer
- **Buy vs Invest** (`/buy-vs-invest`) — opportunity cost of buying vs. compounding
- **True Cost / Time Converter** (`/time-converter`) — spending translated into hours of work

### Homepage hook
A 30-second "Financial Velocity Score" quiz (drag/fuel/runway/leak sliders) that gives visitors an instant money-habits score and routes them to a waitlist for deeper insights.

All calculation logic lives in tested, framework-free modules under `src/lib/` (`fireMath.ts`, `investmentMath.ts`, `emiMath.ts`, `smartScore.ts`, `financialVelocity.ts`), including property-based tests via `fast-check` for the FIRE math.

## Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **UI**: React 19
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Backend**: Supabase (waitlist emails only — no user accounts yet)
- **Testing**: Jest + Testing Library + fast-check

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # run the test suite
npm run build     # production build
npm run lint      # eslint
```

## Project Structure

```
├── src/
│   ├── app/                        # Next.js app router — one folder per calculator/route
│   │   ├── api/subscribe/          # Waitlist signup endpoint
│   │   ├── <calculator>/           # page.tsx + layout.tsx (metadata/SEO) per tool
│   │   ├── investment-calculators/ # Investment tools hub
│   │   ├── retirement-calculators/ # Retirement/FIRE tools hub
│   │   ├── layout.tsx              # Root layout
│   │   ├── sitemap.ts / robots.ts  # SEO routes, driven by src/lib/siteLinks.ts
│   │   └── page.tsx                # Homepage (velocity quiz + tool directory)
│   ├── components/                 # Navigation, footer, shared UI
│   └── lib/
│       ├── siteLinks.ts            # Single source of truth for nav/footer/sitemap entries
│       ├── currency.ts             # Shared currency formatting
│       ├── *Math.ts                # Pure calculation modules (one per tool family)
│       └── supabase.ts             # Supabase client for the waitlist
├── public/                         # Static assets (logo, icons)
```

## Adding a new calculator

1. Add the pure math to `src/lib/<name>Math.ts` with a matching `.test.ts`.
2. Add a route under `src/app/<name>/` with `page.tsx` (UI) and `layout.tsx` (metadata).
3. Register it in `src/lib/siteLinks.ts` — this alone wires it into nav, footer, and the sitemap.

## Disclaimer

Viluva is an independent tool for informational and educational purposes only. It does not constitute financial advice. Consult a qualified professional before making financial decisions.

## License

MIT
