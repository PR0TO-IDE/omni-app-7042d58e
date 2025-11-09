PocketJobs Dark Remix - Summary of Changes

- Implemented a cohesive dark-mode experience with a purple/fuchsia accent palette and condensed layout tuned for small screens.
- Updated global theme tokens in app/globals.css (background, foreground, primary, secondary, accent, border, ring) and added compact base typography plus subtle custom scrollbars.
- Refined the root layout (app/layout.tsx) with a dark gradient backdrop, constrained centered mobile-width container, and Inter font variable.
- Restyled shared UI primitives:
  - components/ui/button.tsx: compact sizing, rounded-xl geometry, and gradient purple primary variant.
- Updated core feature components to match the new system:
  - app/components/JobSearchBar.tsx: dense header, purple gradient card, compact inputs/buttons.
  - app/components/JobFiltersBar.tsx: pill-style filters with purple gradients and reduced spacing.
  - app/components/JobCard.tsx: condensed card layout, dark gradient background, purple badges and save affordances.
  - app/components/JobDetailSheet.tsx: dark glassy sheet, purple accents, compact content and CTA row.
- Updated pages for consistency and mobile-first UX:
  - app/page.tsx: listing screen redesigned around the new components, tightened spacing, and a floating purple-accent saved-summary CTA.
  - app/saved/page.tsx: saved roles view aligned with dark theme, compact controls for marking applied/removing, and improved empty state.
  - app/profile/page.tsx: new activity dashboard showing saved count, applications count, and most recent application card, styled to match the remix.
- Tooling and build fixes:
  - Added @radix-ui/react-slot and tailwindcss-animate dependencies.
  - Cleaned next.config.js (removed deprecated swcMinify) for Next.js 15 compatibility.
  - Verified production readiness with `npm run build` (successful).
