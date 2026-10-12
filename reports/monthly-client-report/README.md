# Monthly client report

A one-page, plain-language report each client gets once their month is reviewed: profit, cash, what's owed, tax to set aside, what we noticed, and one next step, with the review lead's sign-off.

- `template.html`: the design. Every value sits in a `data-field="path"` element.
- `sample-data.json`: the data shape, filled with a fictional cleaning business.
- `render.mjs`: fills the template and prints it.
- `sample/`: the rendered sample (HTML with fonts embedded, and the PDF).

## Make a report

```
npm install
node render.mjs path/to/client-month.json out/bright-corner-2026-09
```

This writes `out/bright-corner-2026-09.html` and `.pdf` (one Letter page). `npm run sample` rebuilds the sample.

## What the automation provides

Only ledger figures. The template works out profit (`money_in - money_out`), the change from last month, net GST (`gst_collected - gst_paid`), the income tax savings (`profit x income_set_aside_rate`) and the total to set aside.

`noticed` takes up to three items, and `next_step` is one action. Keep titles short enough for one line.

## Checks before printing

`render.mjs` stops and prints the reason, without making a PDF, when:

- any field is missing,
- opening cash + received - paid out - owner draw does not equal closing cash,
- the content runs past one page.

Placeholder text in square brackets, such as `[REVIEW LEAD NAME]`, prints highlighted in yellow so it can't go out unnoticed.

## Wording rules

The footer carries the "not a CPA firm" and "not an audit, review or compilation, not tax advice" disclaimer. The income tax line is a savings reminder at a rate the client picked, never a tax estimate. Nothing goes to a client before the review lead approves it.
