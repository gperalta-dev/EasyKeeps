# Easykeeps landing page

Plain HTML, CSS and JavaScript with no build step and no libraries. To preview it, open `index.html` in a browser. Fonts load best through a local server, for example `python3 -m http.server` in this folder.

Files:
- `index.html`: the page, all 8 sections
- `styles.css`: palette, type, layout, motion and the phone layouts
- `main.js`: the hero receipt card, the "How it works" showcase, the pricing toggle, the phone menu, scroll reveals and the form
- `assets/fonts/`: Schibsted Grotesk and Figtree (Google Fonts, Open Font License), self-hosted
- `assets/img/`: placeholder photos, named by what the real photo should show

## Placeholders to fill in

### Photos (replace the file, keep the name)

| File | Size | What it should show |
|---|---|---|
| `assets/img/hero-owner-with-receipts.jpg` | 2400 x 1500 | An Edmonton owner (trades, salon or cleaner) at a kitchen table or van, photographing receipts with their phone. Bright, natural light. Keep the right half calm, the receipt card sits there. |
| `assets/img/hero-owner-with-receipts-mobile.jpg` | 1080 x 1920 | The same scene as a portrait crop, subject in the top half (the text sits at the bottom on phones). |
| `assets/img/review-lead-checking-books.jpg` | 1600 x 1200 | The review lead at a desk, laptop open, checking a printed report. |
| `assets/img/portrait-review-lead.jpg` | 480 x 480 | Review lead, head and shoulders. |
| `assets/img/portrait-automation-lead.jpg` | 480 x 480 | Automation lead, head and shoulders. |
| `assets/img/review-client-1.jpg` to `-3.jpg` | 320 x 320 | Client photos, only with their written consent. |

### Text in `index.html`

- `[REVIEW LEAD NAME]` and `[AUTOMATION LEAD NAME]`: the name chips and the photo's alt text in "Checked by a real person".
- `[CLIENT QUOTE]`, `[CLIENT NAME]`, `[BUSINESS NAME]`, `[TYPE OF BUSINESS]`: three review cards. Remove the "Placeholder" tags and the "Placeholder cards" note when real reviews go in.
- `[WHATSAPP NUMBER]`: "Rather talk first?". When it's real, turn it into a `https://wa.me/1780XXXXXXX` link.
- `[STREET ADDRESS]`: the footer.
- `[LOGO]` (four slots): press or partner logos under the trust bar. Delete the row if there are none.
- `[ANNUAL PRICE]` (three plans): shown when someone picks "Annual". Also remove the "Annual price to be confirmed" notes.
- Hero rating line (`[RATING] from [N] Google reviews`): hidden for now. Fill it in and remove the `hidden` attribute once there are real Google reviews.

### Things to confirm before going live

- Prices ($350, $550, from $850) are provisional, so the "Prices are provisional" tag is still showing.
- "GST tracked every month" is listed on every plan. This comes from the original plan; check that it matches the partner's packages.
- "Your report by the 20th when receipts arrive by the 5th" is the proposed service standard.
- Established is marked "Opening soon", since the partner's guide says it's offered later.
- The partner agrees to be named and pictured on the site.
- The numbers in "How it works" are made up for illustration and are labelled "Example".

## How it behaves

- Primary action everywhere: "Get started", which goes to the short form at the bottom. The form opens a pre-filled email to hello@easykeeps.ca (no form service, so no new dependency).
- Secondary action: "Talk to us", which goes to the email, phone and WhatsApp options.
- Motion stops completely when the visitor's device asks for reduced motion. The showcase also has a Pause button.
- Phone layouts: the hero, the showcase (tabs instead of the step list) and pricing (a plan picker showing one plan at a time) each have their own phone version.
