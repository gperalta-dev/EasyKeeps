# Easykeeps landing page

Plain HTML, CSS and JavaScript with no build step and no libraries. To preview it, open `index.html` in a browser. Fonts load best through a local server, for example `python3 -m http.server` in this folder.

Files:
- `index.html`: the page, all 8 sections
- `styles.css`: palette, type, layout, motion and the phone layouts
- `main.js`: the hero card and money chips, the pinned "How it works" scroll, the pinned photo story, the sample charts, the pricing toggle, the phone menu, the accessibility panel, scroll reveals and the form
- `assets/fonts/`: Schibsted Grotesk and Figtree (Google Fonts, Open Font License), self-hosted
- `assets/img/`: stock photos (hero and photo story) and placeholder photos for the team and client slots

## Placeholders to fill in

### Stock photos in use

The hero has no photo: its background is a designed, slowly moving wall of charts, a pie, receipts and bank matches (example data, built in HTML and CSS).

The photo story uses stock photos, free under the Unsplash License (no attribution required, no watermarks). They show generic small business owners only. They are never used as the Easykeeps team, reviewers or clients.

| File | Where | Source |
|---|---|---|
| `story-cafe-owner.jpg` | Photo story, first panel | https://images.unsplash.com/photo-1753351052363-53ce102830eb |
| `story-owner-at-laptop.jpg` | Photo story, second panel | https://images.unsplash.com/photo-1687293233471-187c8df1beef |
| `story-shop-owner.jpg` | Photo story, third panel | https://images.unsplash.com/photo-1758887261865-a2b89c0f7ac5 |
| `story-receipt.jpg` | Not used yet (spare) | https://images.unsplash.com/photo-1654263736203-a289f57c0d82 |

### Placeholder photos (replace the file, keep the name)

| File | Size | What it should show |
|---|---|---|
| `assets/img/review-lead-checking-books.jpg` | 1600 x 1200 | The review lead at a desk, laptop open, checking a printed report. |
| `assets/img/portrait-review-lead.jpg` | 480 x 480 | Review lead, head and shoulders. |
| `assets/img/portrait-automation-lead.jpg` | 480 x 480 | Automation lead, head and shoulders. |
| `assets/img/review-client-1.jpg` to `-3.jpg` | 320 x 320 | Client photos, only with their written consent. |

### Text in `index.html`

- `[REVIEW LEAD NAME]` and `[AUTOMATION LEAD NAME]`: the name chips and the photo's alt text in "Checked by a real person".
- `[CLIENT QUOTE]`, `[CLIENT NAME]`, `[BUSINESS NAME]`, `[TYPE OF BUSINESS]`: three review cards. Remove the "Placeholder" tags and the "Placeholder cards" note when real reviews go in.
- Phone: shows the placeholder 123-456-7890 (not tappable) until the business line is ready. Swap in the real number in "Rather talk first?" and the footer, as a `tel:` link.
- WhatsApp ("Rather talk first?"): hidden until launch, with the placeholder number. Put the real number in the `wa.me` link and text, then remove the `hidden` attribute on the `data-whatsapp` line.
- Email row has a Copy button for visitors who have no email app set up.
- `[STREET ADDRESS]`: the footer.
- "Works with your bank and software" strip: QuickBooks and Xero show their official marks, unaltered, in their own brand colour (the single-colour versions from Simple Icons, which takes them from design.intuit.com/quickbooks/brand and xero.com/uk/about/media/downloads). The banks still show a generic bank icon with their name until their official logo files are added. Under the strip: "Logos are trademarks of their owners. Easykeeps is not affiliated with or endorsed by them."
- `[ANNUAL PRICE]` (three plans): shown when someone picks "Annual". Also remove the "Annual price to be confirmed" notes.
- Hero rating line (`[RATING] from [N] Google reviews`): hidden for now. Fill it in and remove the `hidden` attribute once there are real Google reviews.

### Things to confirm before going live

- Prices ($350, $550, from $850) are provisional, so the "Prices are provisional" tag is still showing.
- "GST tracked every month" is listed on every plan. This comes from the original plan; check that it matches the partner's packages.
- "Your report by the 20th when receipts arrive by the 5th" is the proposed service standard.
- Established is marked "Opening soon", since the partner's guide says it's offered later.
- The partner agrees to be named and pictured on the site.
- The numbers in "How it works", the hero chips and the "See where your money goes" charts are made up for illustration and are labelled "Example" or "Sample numbers".

## How it behaves

- Primary action everywhere: "Get started", which goes to the short form at the bottom. The form opens a pre-filled email to hello@easykeeps.ca (no form service, so no new dependency).
- Secondary action: "Talk to us", which goes to the email, phone and WhatsApp options.
- Motion stops completely when the visitor's device asks for reduced motion, or when they pick "Stop moving parts" in the accessibility panel (bottom left). That panel also offers bigger text, stronger contrast, underlined links and more line spacing, and remembers the choice on that device.
- "How it works" and the photo story pin to the screen while you scroll: the background stays put and the content changes.
- Phone layouts: the hero, "How it works" (tabs on top, caption under the stage), the photo story and pricing (a plan picker showing one plan at a time) each have their own phone version.
