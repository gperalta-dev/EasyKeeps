# Easykeeps landing page

Plain HTML, CSS and JavaScript with no build step and no libraries. To preview it, open `index.html` in a browser. Fonts load best through a local server, for example `python3 -m http.server` in this folder.

Files:
- `index.html`: the page, all 8 sections
- `styles.css`: palette, type, layout, motion and the phone layouts
- `main.js`: the hero receipt card, the "How it works" showcase, the pricing toggle, the phone menu, scroll reveals and the form
- `assets/fonts/`: Schibsted Grotesk and Figtree (Google Fonts, Open Font License), self-hosted
- `assets/img/`: placeholder photos, named by what the real photo should show

## Placeholders to fill in

### Stock photos in use

Free photos from Unsplash under the [Unsplash License](https://unsplash.com/license): free for commercial use, no attribution required, no watermarks. They show generic owners, never the Easykeeps team, reviewers or clients. Replace any of them with your own photos later by keeping the file name.

| File | Source |
|---|---|
| `assets/img/hero-owner-with-receipts.jpg` | https://unsplash.com/photos/uk3ey_vhDKA |
| `assets/img/hero-owner-with-receipts-mobile.jpg` | https://unsplash.com/photos/oovoC0zQjxw |
| `assets/img/story-shop-owner.jpg` | https://unsplash.com/photos/-tJfonfU7Qc |
| `assets/img/story-receipt.jpg` | https://unsplash.com/photos/KnDM23QuRMI |
| `assets/img/story-owner-at-laptop.jpg` | https://unsplash.com/photos/4HhmpfsI5yk |
| `assets/img/story-cafe-owner.jpg` | https://unsplash.com/photos/QGg-vsPYbu8 |

### Photos still to supply (replace the file, keep the name)

These stay as labelled placeholders on purpose: they would show real people as the Easykeeps team or as clients, so they must be real photos.

| File | Size | What it should show |
|---|---|---|
| `assets/img/review-lead-checking-books.jpg` | 1600 x 1200 | The review lead at a desk, laptop open, checking a printed report. |
| `assets/img/portrait-review-lead.jpg` | 480 x 480 | Review lead, head and shoulders. |
| `assets/img/portrait-automation-lead.jpg` | 480 x 480 | Automation lead, head and shoulders. |
| `assets/img/review-client-1.jpg` to `-3.jpg` | 320 x 320 | Client photos, only with their written consent. |

### Text in `index.html`

- `[REVIEW LEAD NAME]` and `[AUTOMATION LEAD NAME]`: the name chips and the photo's alt text in "Checked by a real person".
- `[CLIENT QUOTE]`, `[CLIENT NAME]`, `[BUSINESS NAME]`, `[TYPE OF BUSINESS]`: three review cards. Remove the "Placeholder" tags and the "Placeholder cards" note when real reviews go in.
- WhatsApp (123-456-7890) is in "Rather talk first?" but hidden until launch. Remove the `hidden` attribute on that list item to show it.
- `[STREET ADDRESS]`: the footer.
- The "Works with the bank and software you already use" strip uses plain names, not official logos, with a not-affiliated note. Official logos would read as a partnership. Once you're a certified QuickBooks ProAdvisor, Intuit's ProAdvisor badge can be added there.
- `[ANNUAL PRICE]` (three plans): shown when someone picks "Annual". Also remove the "Annual price to be confirmed" notes.
- Hero rating line (`[RATING] from [N] Google reviews`): hidden for now. Fill it in and remove the `hidden` attribute once there are real Google reviews.

### Things to confirm before going live

- Prices ($350, $550, from $850) are provisional, so the "Prices are provisional" tag is still showing.
- "GST tracked every month" is listed on every plan. This comes from the original plan; check that it matches the partner's packages.
- "Your report by the 20th when receipts arrive by the 5th" is the proposed service standard.
- Established is marked "Opening soon", since the partner's guide says it's offered later.
- The partner agrees to be named and pictured on the site.
- The numbers in "How it works", the ledger ticker and the "See your whole year at a glance" chart are made up for illustration and are labelled "Example".

## How it behaves

- Primary action everywhere: "Get started", which goes to the short form at the bottom. The form opens a pre-filled email to hello@easykeeps.ca (no form service, so no new dependency).
- Secondary action: "Talk to us", which goes to the email, phone and WhatsApp options.
- Motion stops completely when the visitor's device asks for reduced motion, or when they choose "Stop moving parts" in the accessibility panel (the round blue button, bottom right). The panel also offers bigger text, higher contrast and underlined links, and remembers the choices on that device. The showcase also has a Pause button.
- The hero stays pinned while the page slides up over it, and the photo story holds its background while the words change as you scroll. Both turn off with reduced motion.
- Phone layouts: the hero, the showcase (tabs instead of the step list) and pricing (a plan picker showing one plan at a time) each have their own phone version.
