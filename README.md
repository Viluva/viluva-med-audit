# MedClarity - CGHS Price Cap Compliance Validator

**Professional medical bill auditing tool** for verifying CGHS compliance, checking for overcharges, and ensuring fair pricing using official 2026 MoHFW guidelines.

## Overview

MedClarity helps patients and healthcare beneficiaries verify whether their hospital bills comply with CGHS (Central Government Health Scheme) approved rates. The tool uses official government data to calculate the maximum permissible charges for medical procedures across different hospital types, tiers, and ward categories.

## Features

- ✅ **21 CGHS Cities**: Complete hospital empanelment data for all major metros
- ✅ **53,947+ Procedures**: Comprehensive CGHS rate database
- ✅ **Intelligent Calculations**: Automatic tier adjustments, NABH multipliers, ward differentials
- ✅ **Instant Audits**: Real-time compliance checking
- ✅ **Modern UI**: Professional, mobile-responsive interface
- ✅ **Privacy First**: No data storage, client-side processing
- ✅ **Security Hardened**: Rate limiting, input sanitization, security headers

## Data Sources

All data is sourced from official government documents:

### Hospital Empanelment Data
- **Source**: CGHS 2026 Empanelment Lists
- **Coverage**: 21 metro cities across India
- **Location**: `/src/lib/data/hospitals/`
- **Format**: City-wise Excel files converted to JSON

### Price Data
- **Source**: MoHFW CGHS Rate Guidelines
- **Document**: New CGHS rates applicable to empanelled HCOs
- **Location**: `/src/lib/data/prices.json`
- **Format**: Structured JSON with procedure codes, NABH/Non-NABH rates, tier classifications

## Security

MedClarity implements enterprise-grade security features:

- 🔒 **Rate Limiting**: 100 requests/min per IP
- 🛡️ **Input Sanitization**: XSS prevention on all inputs
- 🔐 **Security Headers**: HSTS, X-Frame-Options, CSP-ready
- 🌐 **CORS Configured**: Controlled cross-origin access
- 🔍 **No Data Collection**: Complete privacy

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **UI**: React 19 with optimizations
- **Build**: Turbopack for fast builds

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   └── audit/search/  # Procedure search endpoint
│   │   ├── page.tsx           # Main application page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── CitySelect.tsx     # City selection
│   │   ├── HospitalSelect.tsx # Hospital selection
│   │   ├── ProcedureSearch.tsx# Procedure search
│   │   └── Verdict.tsx        # Audit results
│   └── lib/
│       └── data/              # Data files
│           ├── hospitals/     # City-wise hospital data
│           ├── hospitals.json # Compiled hospital data
│           ├── prices.json    # CGHS rate data
│           └── types.ts       # TypeScript interfaces
├── public/                    # Static assets
├── SECURITY.md               # Security documentation
└── UI_REDESIGN_SUMMARY.md    # Design documentation
```

## How It Works

1. **Select City**: Choose from 21 CGHS-empaneled cities
2. **Select Hospital**: Pick from verified CGHS hospitals
3. **Choose Ward Type**: General, Semi-Private, or Private
4. **Search Procedure**: Find the medical procedure or test
5. **Enter Bill Amount**: Input what the hospital charged
6. **Get Verdict**: Instant compliance check with detailed breakdown

### Calculation Methodology

The tool calculates CGHS-approved rates using:
- Base rate (NABH/Non-NABH accredited)
- Super Speciality multiplier (15% for eligible hospitals)
- City tier adjustment (Tier 1: 100%, Tier 2: 90%, Tier 3: 80%)
- Ward differential (General: 95%, Semi-Private: 100%, Private: 105%)
- Special handling for uniform-rate procedures (consultations, investigations)

## Legal Disclaimer

**MedClarity is an independent tool for informational purposes only.** 

- This tool does **not** constitute legal or medical advice
- Results should be verified independently
- Consult qualified professionals before taking action
- Hospital pricing may vary due to case complexity
- Not liable for decisions made using this information

See the comprehensive disclaimer in the application footer for full details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- Security considerations are maintained
- Data sources are verified and cited
- Tests pass (when implemented)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests, please open an issue on the project repository.

---

**Built for healthcare transparency** | © 2026 MedClarity

