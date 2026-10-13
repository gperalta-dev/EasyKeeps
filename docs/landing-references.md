# Easykeeps landing page: references and proposal

_Written Oct 12, 2026 for the research-first step. Status: waiting for Jan's approval of palette, typefaces and section order before any page code._

**Design read:** a trust-first local-service landing page for Edmonton small business owners who are not tech savvy, in a warm, direct, bright-but-finance-grade language, leaning toward plain HTML/CSS/vanilla JS with real photography, one strong accent and purposeful motion.

**Dials:** variance 6 (asymmetric but calm, the audience needs clarity over art), motion 6 (money visuals move, everything else stays still), density 4 (airy, big type, one idea per screen).

## How the references were read

The text of all four sites was fetched. A real browser could not open them from this environment (the network blocks direct page loads), so the visual notes below come from Jan's eight screenshots plus the fetched page structure. Where something is an inference, it says so.

## osome.com (trust)

1. **Hero order is headline, one paragraph, two pill buttons, then a single proof line.** "Get started" is a solid cobalt pill and "Talk to us" is the same size as an outlined pill, side by side and centred. The proof line directly under them is a Google "G", 4.2 with five stars, the review count, and a founders stat. The rating is the first thing after the buttons, which is exactly the "reviews upfront" Jan liked.
2. **Real people carry the emotion, UI carries the proof.** The large photo under the hero shows four people at a table with a laptop, and a white floating card over the photo shows names with a green "Signed" status. Every big photo on the page has one small floating UI card on top of it, linking the human to the product.
3. **"Verified human expertise" is a split block.** Short headline and three-line paragraph on the left, a big rounded photo on the right (a hand on a laptop), with three floating name chips (photo, name, "Senior Accountant", country flag) pinned at different corners. The people are the evidence.
4. **Type and colour:** a high-contrast serif display (very large, tight leading) over a warm off-white page (theme colour `#FFFDFA`), dark slate text, one cobalt accent used only for actions and links. Sections alternate warm off-white and a slightly darker warm tone; one full-width dark slate band holds the phone mockups.
5. **CTAs repeat in a floating pill bar** ("Get started" + "Talk to us") that follows the user down the page, and again in the closing section.

**Take for Easykeeps:** both buttons in the first screen, rating line straight under them, real-person photos with small floating "proof" cards, a named-person trust block. **Leave:** the serif display, the cream page colour, and the "certified accountants" claim (we must not make it).

## evpin.com (first screen)

1. **The hero is the whole viewport.** In Jan's screenshot the bright sky-blue panel and a full-bleed map run edge to edge with no visible section below on load.
2. **Content sits left, image bleeds right.** Copy block is left-aligned, starting around 25% from the left, vertically centred: small pill badge, a three-line bold sans headline (roughly 56 to 64px, tight tracking), a short two-line subhead, two compact pill buttons (white solid and translucent), then three check-marked one-liners.
3. **The background is alive.** The map carries pins that change colour (grey and red), and a floating "Evaluate / Find" segmented control sits at the bottom centre. The other screenshot shows the same idea below the fold: a data card with labelled callout lines pointing at its parts and a pill tab switcher above it.
4. **Navigation is light:** logo plus five text links on the left, "Log In" and "Create Account" pills on the right, all sitting on top of the hero colour without a bar.

**Take:** 100dvh hero, full-bleed real photo, a floating interactive card that reacts on hover, annotated-card storytelling for "How it works". **Leave:** the three check bullets in the hero (too much text for our audience).

## finta.com (colour and motion)

1. **One bright blue does all the work** on a near-white page: the accent word in the headline ("zero stress"), the small uppercase feature labels with icons, the check circles and the "Completed" pills. Everything else is near-black and grey.
2. **Money objects, not abstract graphics.** A treasury cheque, a checklist of filings with "Completed" status pills, a chat bubble and an IRS notice PDF preview. Each sits on white with a soft shadow, like a real document on a desk.
3. **Status motion:** in Jan's screenshot the third "Completed" pill is mid-animation (text cross-fading), so the items tick to "Completed" in sequence. The hero is a looping dashboard video and the logo and testimonial rows repeat, which suggests marquees (inference from the page text).
4. **Layout:** centred section headline, then a 2 x 2 grid of visual over label over two-line caption, generous white space between cells.

**Take:** bright confident accent on a clean neutral base, real-looking money documents (receipt, ledger line, report) with small continuous status motion. **Leave:** the plain blue (every fintech has it) and the 2 x 2 equal grid.

## glideapps.com/pricing (pricing)

1. **Five cards on one row, all the same size;** Pro wins through finish, not size: a near-black card with a soft grey light-leak image, white text, a "Recommended" chip, and an inverted white "Get Started" button while the others are black.
2. **Each card follows the same stack:** name, one-line tagline, large price with "/ month", a credits pill or dropdown, a full-width pill button.
3. **Features sit below the cards** as grey text with a tiny tick, each list starting "Everything in [previous], plus:". This is the bare part Jan wants fixed.
4. **The non-Pro cards are identical warm grey,** so they have no identity of their own.
5. No monthly/annual toggle on the page today.

**Take:** the dark, finished premium card with an inverted button and a chip. **Fix:** make the premium card also physically larger, give every tier its own colour identity, and colour-code every feature line.

## Proposal for approval

A rendered preview of the palette and type is in [palette-preview.png](palette-preview.png) (source: palette-preview.html).

### Palette (light page only, no dark mode)

| Role | Name | Hex | Notes |
|---|---|---|---|
| Text, premium tier, footer | Ink | `#0E1C2B` | 16:1 on Paper |
| Page background | Paper | `#F5F7F6` | cool neutral, not cream |
| Cards | Card | `#FDFEFE` | |
| Primary action, links | Ledger green | `#087A56` | white text 5.4:1 |
| Bright highlight, charts, motion | Fresh mint | `#2FD08F` | used on Ink (8.6:1) or as a fill, never as text on light |
| Feature code: reports, calls | Report blue | `#2457F5` | text-safe on white (5.6:1) |
| Feature code: GST, tax set aside | Tax amber | `#F2A516` fill, `#9A5B00` text | |
| Feature code: flagged items, human review | Review coral | `#EF5A3C` fill, `#C2391C` text | |
| Secondary text | Slate | `#4A5A68` | 6.6:1 on Paper |

Green is the one brand accent (money, "balanced"). Blue, amber and coral appear only as category colours in the showcase and the pricing feature lists, so each colour always means the same thing: green is done and matched, amber is tax, coral is something a person checks, blue is your report.

### Typefaces (self-hosted, Google Fonts licence)

- **Schibsted Grotesk** for headlines and prices. Sturdy and newspaper-like, reads as serious money without looking corporate, and is not one of the overused AI-default fonts.
- **Figtree** for body, buttons and forms. Open letter shapes and a tall x-height keep 16 to 18px easy to read on a phone.

### Section order

0. **Top bar:** logo, How it works, Pricing, Reviews, FAQ, then "Talk to us" and "Get started". Collapses to logo + "Get started" + menu on phones.
1. **Hero (100dvh):** full-bleed photo of an owner with a phone and receipts, left-aligned headline and one-line subhead on a scrim, both buttons, rating line linking to Reviews. A floating receipt card on the photo flips to "Matched" on hover. Separate mobile layout.
2. **Trust bar:** placeholder logo slots for press or partners, with a plain promise row until we have logos (Edmonton based, a person checks every month, report by the 20th).
3. **How it works:** the animated showcase. Receipt photo, then a categorised ledger line, then the one-page monthly report. Three steps: snap it, we sort and check it, you read one page. Separate mobile layout.
4. **Checked by a real person (our "verified human expertise"):** review lead photo and name chip (placeholders), "accounting student with dealership accounting experience", Edmonton, how the monthly sign-off works, and the "not a CPA firm" disclaimer.
5. **Reviews:** three placeholder cards (name, business, photo slot, quote), clearly marked.
6. **Pricing:** Essentials, Standard, Established (premium: larger, Ink with a mint finish). Monthly/annual toggle, colour-coded feature lists, "Provisional" label, and a fine-print line (plus GST, setup $400 to $800, GST filing priced separately, software subscription paid by you). Separate mobile layout.
7. **FAQ:** six plain-language questions.
8. **Final call to action and footer:** short "Get started" form, email, phone, WhatsApp and address (placeholders except the email), disclaimer.

### Defaults picked where the brief forks

- **"Get started"** scrolls to a short form in the last section (name, type of business, email or phone, rough number of transactions). With no backend, it opens a pre-filled email to hello@easykeeps.ca. A form service would be a new dependency, so ask first.
- **"Talk to us"** opens WhatsApp once a number exists. Until then it opens email.
- **Hero rating** is built as `[RATING] from [N] Google reviews`. Easykeeps has no reviews yet, so this line stays hidden until real ones exist, rather than showing a number.
- **Stack:** plain HTML, CSS and vanilla JS in `landing/`, custom inline SVG icons, no libraries.

### Honesty and compliance notes

- No "CPA" or "certified" anywhere. The trust block says "bookkeeping by an accounting student" and carries the "not a CPA firm" disclaimer.
- No audit, review, compilation or tax-advice claims. GST is "tracked and set aside", not "filed" unless the GST filing add-on is bought.
- The partner's real name, photo and background need his OK before going public (internship and CPA Alberta questions are still open in the context file). The internship employer is not named.
