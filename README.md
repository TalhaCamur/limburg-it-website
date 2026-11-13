# Limburg IT studio

A complete bilingual marketing-site source project for a three-person Dutch IT company. Next.js App Router, TypeScript, Tailwind CSS v4, next-intl, Zod, Resend, Lucide, and optional Upstash/Turnstile. Intended deployment: Vercel with the Node.js contact route.

The separate team profiles are at `/nl/about` and `/en/about`. The homepage, portfolio, services, process and contact are available in both languages. Limburg IT Studio is the editable working name. The project previews are original illustrative concepts.

## Local setup

Use Node.js 22 LTS or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. `/` negotiates the initial language from Accept-Language, falling back to Dutch. `/nl` and `/en` are explicit locales. Switching language preserves the current page and remembers the choice in a functional one-year cookie.

```sh
npm test
npm run typecheck
npm run build
npm start
```

The default contact form is intentionally disabled. Set credentials and `CONTACT_ENABLED=true` to enable delivery. A disabled form returns a clear localized message, never a simulated ticket. Use your own working email addresses in development. The deployment origin must exactly match `NEXT_PUBLIC_SITE_URL`; requests from other origins are rejected.

## Structure and editing

| Location | Purpose |
| --- | --- |
| `app/[locale]/page.tsx` | Homepage: work, services, process and contact |
| `app/[locale]/globals.css` | Design tokens, layouts, responsive and dark themes |
| `app/[locale]/privacy`, `terms` | Localized legal drafts; noindex until reviewed |
| `app/api/contact/route.ts` | Validation, spam protection, ticketing and emails |
| `components/chrome.tsx` | Header, mobile navigation, language switch and footer |
| `components/contact-form.tsx` | Accessible interactive contact form |
| `content/company.ts` | Company details, ordered project records and team IDs |
| `messages/nl.json`, `en.json` | UI copy, validation, email copy, legal drafts, SEO |
| `lib/env.ts` | Startup/build-time environment validation |
| `lib/validation.ts` | Shared client/server schema |
| `lib/rate-limit.ts` | Optional shared Redis limiter; local fallback |
| `tests/` | Validation, translation parity, delivery and API tests |

Edit both translation JSON files together. Project IDs in `content/company.ts` map to `work.<id>` text in each locale. Team IDs map to `about.<id>`. Technical project tags stay in the data file. There are no fabricated testimonials or clients: all three work examples visibly say concept. Team members appear as role descriptions on the About page; no bitmap images or stock photos are downloaded. When replacing these with real photos, use `next/image` with explicit dimensions, appropriate `sizes`, and translated alt text.

Colors live in CSS variables and Tailwind tokens: linen, petrol and apricot. Geist is loaded through `next/font`. Motion is limited to entry/hover transitions, with reduced-motion support. Dark mode follows the operating system. Components use semantic headings, labels, error descriptions, keyboard focus states and live status announcements.

## Email setup and domain verification

1. Create a Resend account and add a domain you own, preferably a transactional subdomain such as `mail.your-company.nl`.
2. In your DNS provider, add the exact SPF and DKIM records displayed by Resend, including the displayed record names, types and values. Add any required return-path/MX record shown by Resend. Do not replace existing mailbox records or guess values. Wait for propagation and use Resend's verification control until the domain is verified. Review DMARC for the domain as well.
3. Create a sending API key. Store it only as `RESEND_API_KEY` in `.env.local` or Vercel environment settings. Use `CONTACT_FROM_EMAIL` on the verified domain (a bare email address) and your actual destination as `CONTACT_TO_EMAIL`.
4. Set `CONTACT_ENABLED=true` and the exact `NEXT_PUBLIC_SITE_URL`. Restart locally or redeploy. Keep open/click tracking disabled for transactional correspondence unless you deliberately review the privacy consequences.
5. Test both locales using a real visitor mailbox. Verify owner delivery, visitor confirmation, ticket reference, timestamps and Reply-To. An API acceptance does not guarantee inbox delivery; check Resend delivery/bounce events.

The owner email includes all submitted fields, locale, timestamp and a cryptographically generated `TCK-YYYYMMDD-XXXXXXXX` reference. It uses a localized service name and visitor name in the subject and the visitor address as Reply-To. Confirmation emails use the visitor locale. Messages are plain text; user input cannot become HTML. Header fields reject CR/LF. If the owner email succeeds but the visitor confirmation fails, the UI keeps the ticket and explains the partial result, preventing a needless resubmission.

No live email was sent during development. Delivery tests mock the Resend HTTP response. To guarantee delivery through provider outages rather than allowing a retry, add a durable queue/outbox and webhook monitoring; no durable ticket database is included.

## Spam protection and production operations

- Hidden honeypot, exact Origin check, 16 KiB streamed body limit, server validation and five attempts/hour per IP.
- In-memory limits are per process, can reset on restart and cannot coordinate serverless instances. Configure both Upstash variables for effective Vercel-wide limits. Redis errors fail closed. Store only hashed IP keys; review provider retention and processor agreements.
- The Vercel deployment uses `x-vercel-forwarded-for`, which must be supplied by the trusted platform. Non-Vercel/local mode shares one `local` bucket. For another host, explicitly adapt the trusted proxy handling rather than trusting arbitrary client headers.
- Turnstile: set `NEXT_PUBLIC_TURNSTILE_ENABLED=true`, the public site key and server secret, configure your production hostname in Cloudflare, and rebuild. Tokens and hostname are checked server-side. Add localhost in Cloudflare for local testing. Tokens reset after attempts. The secret never enters client code.
- Analytics is off. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` only after confirming the domain and privacy disclosure. No advertising or analytics cookies are shipped by default. Review any enabled external integrations before deciding whether consent is required.
- CSP, frame restrictions, MIME protection, referrer policy, permissions policy and production HSTS are configured in `next.config.ts`. Static Next rendering requires inline framework bootstrap scripts in this implementation, so CSP permits `unsafe-inline`; it disallows eval in production, external framing and objects. A nonce-based strict CSP would require a dynamic-rendering architecture change. Review the HSTS includeSubDomains setting for your own domain.
- Environment configuration is validated when Next loads configuration and when the route imports server settings. Missing enabled integrations fail validation. No secrets are exported by client components. Never prefix secrets with `NEXT_PUBLIC_`.

## Vercel deployment

1. Push the source to your own Git repository, excluding `.env.local`, `.next` and `node_modules`.
2. Import the repository in Vercel. Select the Next.js preset, `npm ci` for install and `npm run build` for build. Use the directory containing `package.json` as the root.
3. Set all relevant `.env.example` variables in Vercel. Set the final HTTPS origin before building. For a preview deployment, give it its own exact origin or leave contact disabled. `NEXT_PUBLIC_` values are embedded at build time and require a rebuild after changes.
4. Add your domain, complete DNS configuration, deploy and verify `/nl`, `/en`, both legal routes, `/robots.txt`, `/sitemap.xml`, HTTPS and both email flows.
5. Enable shared Upstash limits before accepting public traffic. Verify Turnstile if enabled. Configure Resend event monitoring and a support mailbox.

The included GitHub Pages workflow creates a static edition with direct email contact. Use the full Next.js build on your custom domain to enable the server contact endpoint. The project has not been deployed to Vercel from this workspace; no Vercel account or production secrets were supplied. The available preview host expects a different runtime, so no incompatible deployment was substituted.

Official references:
- https://resend.com/docs/dashboard/domains/introduction
- https://nextjs.org/docs/app/guides/environment-variables
- https://nextjs.org/docs/app/getting-started/deploying

## Required replacements before launch

- `[COMPANY NAME]`, `[CITY]`, `[PUBLIC EMAIL]`, `[KVK NUMBER]`, `[VAT NUMBER]` in `content/company.ts`.
- Company positioning/tagline, SEO titles/descriptions and both language versions of copy as needed. Current copy uses the supplied service brief; no final brand name was invented.
- Confirm the team descriptions and add approved names and portraits when available.
- Three illustrative projects with authorized case-study content; retain concept labels until real projects exist.
- `NEXT_PUBLIC_SITE_URL`, receiving address, verified sending address and Resend key; optional Upstash, Turnstile and analytics settings.
- Legal identity, registered address, data processors, retention periods, actual legal bases, fees, service commitments, liability terms and every bracketed legal placeholder. Get professional review, then remove draft banners and `robots: {index:false}` on legal pages.
- Dutch native-speaker brand review: particularly “Uw volgende stap begint met hallo”, “Van idee tot livegang”, and the English loanwords “support”, “designer” and “full-stack”. They are deliberate conversational/business wording; the prose uses the professional u-form.

## Verification and remaining launch checks

Production build and automated tests are run in the delivery environment; see `VERIFICATION.md` for recorded results. No Lighthouse score or WCAG conformance certification is claimed. The preview launcher initially supplied Vite-style flags; `scripts/dev.mjs` now translates them for Next.js. Desktop browser QA verified both homepages, Dutch inline validation with first-error focus, privacy pages and language switching that preserves the legal page. The available browser did not expose viewport resizing, so the four exact target widths remain unverified.

Before launch, test both languages at **360, 768, 1280 and 1920 px**, including mobile navigation, language switching on legal pages, long Dutch text, dark mode, reduced motion, keyboard navigation, validation focus, 2000-character messages, success/error states, zoom/reflow and screen-reader announcements. Run Lighthouse on the deployed production build in each locale, targeting 90+ for performance, accessibility, best practices and SEO. Legal drafts intentionally remain noindex. Check real email delivery and shared rate limits using production services.
