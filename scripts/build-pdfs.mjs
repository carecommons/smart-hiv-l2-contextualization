// Render the HTML artifacts to PDF with headless Chromium (Playwright).
// Run from the repo root; outputs PDFs next to the HTML.
import { chromium } from 'playwright';

const jobs = [
  { html: 'TUTORIAL-L2-adaptation-walkthrough.html', pdf: 'TUTORIAL-L2-adaptation-walkthrough.pdf',
    opts: { format: 'A4', printBackground: true,
            margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' } } },
  { html: 'CHEATSHEET-decision-table.html', pdf: 'CHEATSHEET-decision-table.pdf',
    opts: { preferCSSPageSize: true, printBackground: true } },   // @page A4 landscape
  { html: 'CHEATSHEET-indicator.html', pdf: 'CHEATSHEET-indicator.pdf',
    opts: { preferCSSPageSize: true, printBackground: true } },
];

const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage();
  await page.goto('file://' + process.cwd() + '/' + j.html, { waitUntil: 'networkidle' });
  await page.pdf({ path: j.pdf, ...j.opts });
  console.log('wrote', j.pdf);
  await page.close();
}
await browser.close();
