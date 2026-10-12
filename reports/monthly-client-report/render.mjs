// Fill the monthly report template with one client's data and print it.
//   node render.mjs <data.json> [out-basename]
// Writes <out>.html (self-contained, fonts embedded) and <out>.pdf (one Letter page).
// Exits non-zero if a value is missing, cash does not balance, or the page overflows.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const [dataPath = join(here, 'sample-data.json'), outBase = join(here, 'sample', 'easykeeps-monthly-report-sample')] = process.argv.slice(2);

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
let html = readFileSync(join(here, 'template.html'), 'utf8');

// Embed fonts so the HTML works when emailed or moved.
html = html.replace(/url\("(assets\/fonts\/[^"]+\.woff2)"\)/g, (_, p) =>
  `url("data:font/woff2;base64,${readFileSync(join(here, p)).toString('base64')}")`);

// Inject data ahead of the fill script. Escape "<" so data can't close the script tag.
const json = JSON.stringify(data).replace(/</g, '\\u003c');
html = html.replace('<script>\n(function', `<script>window.REPORT_DATA = ${json};</script>\n<script>\n(function`);

const outHtml = resolve(`${outBase}.html`);
const outPdf = resolve(`${outBase}.pdf`);
writeFileSync(outHtml, html);

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('file://' + outHtml);
  await page.waitForSelector('body[data-ready="1"]');
  const errors = await page.evaluate(() => window.REPORT_ERRORS);
  if (errors.length) {
    console.error('Report not printed:\n- ' + errors.join('\n- '));
    process.exitCode = 1;
  } else {
    await page.pdf({ path: outPdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
    console.log(`Wrote ${outHtml}\nWrote ${outPdf}`);
  }
} finally {
  await browser.close();
}
