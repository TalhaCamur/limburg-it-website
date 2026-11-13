# Verification — 12 November 2026

- `npm run build`: passed; all eight localized pages generated, plus sitemap, robots and dynamic contact API.
- `npm run typecheck`: passed.
- `npm test`: 7 tests passed. Covers message boundaries, header injection, invalid email/consent/options, sanitization, translation-key parity, same-origin protection, body bounds, malformed JSON, disabled email, rate limiting, bilingual mocked email delivery, Reply-To, ticket content, confirmation failure and owner-email failure.
- Desktop browser inspection at approximately 1363 CSS px: both homepage languages rendered; Dutch validation displayed inline, first invalid input received focus; privacy pages rendered with draft warnings; NL/EN switching preserved `/privacy`; localized HTML language, canonical and hreflang links were present. No horizontal overflow observed on the inspected legal page.
- Real Resend delivery, Upstash, Turnstile and analytics: not exercised; credentials were not provided.
- Chrome rendered both languages of the home and About pages at 360, 768, 1280 and 1920 px without horizontal overflow. The GitHub Pages export built successfully. Mobile menu interaction, dark mode, reduced-motion emulation and Lighthouse remain unverified for this redesign.
- WCAG 2.1 AA and Lighthouse 90+ are targets, not certified results.
- No production Vercel deployment was performed.
