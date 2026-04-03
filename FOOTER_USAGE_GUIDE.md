# ToolsFooter Component - Usage Guide

## Overview

The `ToolsFooter` component is a professional, modern, and fully responsive footer designed for use throughout your application. It features a classic dark theme, organized link sections, and extensive customization options.

## Features

✅ **Professional Design**: Dark theme with light text and premium aesthetics  
✅ **Fully Responsive**: Optimized for mobile, tablet, and desktop  
✅ **Accessible**: Semantic HTML and ARIA labels  
✅ **Customizable**: Accept props for complete flexibility  
✅ **Modern Effects**: Smooth hover transitions and animations  
✅ **Back to Top**: Optional scroll-to-top button  
✅ **SEO Friendly**: Proper link structure and copyright information  

---

## Basic Usage

### Default Implementation (Current)

The footer is already implemented across all pages with default settings:

```tsx
import ToolsFooter from "@/components/ToolsFooter";

export default function MyPage() {
  return (
    <main>
      {/* Your page content */}
      <ToolsFooter />
    </main>
  );
}
```

This displays:
- 4 default sections: Calculators, Tools, Company, Legal
- Viluva branding
- Back to top button
- Copyright notice

---

## Advanced Usage

### Custom Company Information

```tsx
<ToolsFooter 
  companyName="My Company"
  tagline="Your custom tagline here"
/>
```

### Disable Back to Top Button

```tsx
<ToolsFooter showBackToTop={false} />
```

### Add Social Media Links

```tsx
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/yourcompany",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/yourcompany",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/yourcompany",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/yourcompany",
    icon: <Instagram className="w-5 h-5" />,
  },
];

<ToolsFooter socialLinks={socialLinks} />
```

### Custom Link Sections

```tsx
const customSections = [
  {
    title: "Products",
    links: [
      { label: "Feature 1", href: "/feature1" },
      { label: "Feature 2", href: "/feature2" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Documentation", href: "/docs" },
      { label: "API", href: "/api" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

<ToolsFooter customSections={customSections} />
```

### Full Customization Example

```tsx
import ToolsFooter from "@/components/ToolsFooter";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function MyPage() {
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/viluva",
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/viluva",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: "GitHub",
      href: "https://github.com/viluva",
      icon: <Github className="w-5 h-5" />,
    },
  ];

  const customSections = [
    {
      title: "FIRE Calculators",
      links: [
        { label: "Standard FIRE", href: "/fire-calculator" },
        { label: "Barista FIRE", href: "/barista-fire-calculator" },
        { label: "Coast FIRE", href: "/coast-fire-calculator" },
        { label: "Fat FIRE", href: "/fat-fire-calculator" },
      ],
    },
    {
      title: "Other Tools",
      links: [
        { label: "CGHS BillCheck", href: "/cghs-billcheck" },
        { label: "True Cost Calculator", href: "/time-converter" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
        { label: "Guides", href: "/guides" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  return (
    <main>
      {/* Your page content */}
      
      <ToolsFooter
        companyName="Viluva"
        tagline="Building tools for smarter financial decisions."
        showBackToTop={true}
        customSections={customSections}
        socialLinks={socialLinks}
      />
    </main>
  );
}
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | `"Viluva"` | Company name displayed in the footer |
| `tagline` | `string` | `"Building tools..."` | Tagline or description text |
| `showBackToTop` | `boolean` | `true` | Show/hide the back to top button |
| `customSections` | `FooterSection[]` | Default sections | Override default link sections |
| `socialLinks` | `SocialLink[]` | `undefined` | Add social media links with icons |

---

## TypeScript Interfaces

```typescript
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}
```

---

## Design Features

### Color Scheme
- **Background**: `slate-900` (dark professional)
- **Text Primary**: `slate-300` (light, readable)
- **Text Secondary**: `slate-400` and `slate-500`
- **Accent**: `cyan-400` to `blue-500` gradient
- **Borders**: `slate-800` (subtle separation)

### Responsive Breakpoints
- **Mobile**: Single column layout
- **Tablet (md)**: 2-column grid
- **Desktop (lg)**: 5-column grid (brand + 4 sections)

### Accessibility
- Semantic HTML (`<footer>`, `<nav>`, `<ul>`)
- ARIA labels for icon-only elements
- Keyboard navigation support
- High contrast ratios (WCAG AA compliant)

### Hover Effects
- Smooth color transitions (200ms)
- Link hover: text changes to cyan-400
- Back to top button: icon animates upward
- Brand logo: gradient shift on hover

---

## Current Pages Using ToolsFooter

The footer is already integrated across:
- ✅ Homepage (`/`)
- ✅ FIRE Calculator
- ✅ Barista FIRE Calculator
- ✅ Coast FIRE Calculator
- ✅ Fat FIRE Calculator
- ✅ CGHS BillCheck
- ✅ Time Converter

---

## Future Enhancements (Optional)

Consider adding:
- Newsletter subscription form
- Language selector
- Dark/light mode toggle
- Sitemap link
- Accessibility statement link
- RSS feed link
- Partner/sponsor logos

---

## Notes

- The footer uses `"use client"` directive for the scroll-to-top functionality
- All external links open in new tabs with `rel="noopener noreferrer"`
- Copyright year is dynamically generated using `new Date().getFullYear()`
- The component is fully tree-shakeable - unused props won't bloat your bundle
