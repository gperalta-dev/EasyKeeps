# Easykeeps

## Website Design Standard

Before starting any website or page work, tell me in one line that the Website Design Standard is active.

Tools: use the web-builder-design-taste skill to build, web-builder-design-guidelines to review, and web-builder-playwright-cli to test before delivering.

Audience: small business owners who are not tech savvy and want the least effort possible. Every page MUST make the next step obvious within 3 seconds: one primary action per screen, plain words, no jargon.

Quality bar: the result MUST look designed by a professional studio, not generated. No emojis anywhere (text, buttons, icons, alt text). Typographic symbols and custom SVG icons are fine. No generic gradient blobs, no default Tailwind/shadcn look left unstyled, no stock "hero illustration of people at laptops".

Reference sites and what to take from each:
- osome.com (trust): real people, real phones, emails, receipts and paperwork in photos. "Talk to us" and "Get started" visible in the first screen. Reviews shown early and easy to find. A "verified human expertise" trust block naming the real people who review the books and their locations.
- evpin.com (first screen): hero fills 100% of the viewport on load, large full-bleed background, UI elements that respond on hover.
- finta.com (colour and motion): bright, confident palette that still reads as finance-grade professional. Money-related visuals (cards, invoices, balances, charts) with subtle continuous motion.
- glideapps.com/pricing (pricing): the top tier (Pro/Max) is visibly the premium choice through size, contrast, and finish. Every other tier still has its own distinct identity. Unlike Glide, feature lists MUST NOT be bare: use colour-coded text, accent markers, and small visual highlights per feature.
- saaslandingpage.com: general gallery for section patterns.

Polish phase (budget at least as much effort polishing as building):
- Custom SVG hover animations on icons and illustrations.
- A micro-interaction on every interactive element (hover, focus, press, loading states).
- Custom showcase components that demonstrate how the product works (for example an animated receipt turning into a categorised ledger entry).
- Respect prefers-reduced-motion: all motion has a static fallback.

Responsive: MUST work on phone (375px), laptop (1280px) and desktop (1920px). Build a separate mobile component for any section whose desktop layout does not collapse cleanly (hero, pricing, showcase). Tap targets at least 44px. Text at least 16px on mobile.

Honesty: never invent testimonials, client names, statistics, certifications, or office locations. Use clearly marked placeholders such as [CLIENT QUOTE] and ask me for the real content.

Easykeeps compliance for any public copy: Easykeeps is not a CPA firm. Never use the "CPA" title or claim certified accountants; positioning is "Bookkeeping by an accounting student" with a "not a CPA firm" disclaimer. No audit, review, compilation or tax-advice claims.
