import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const url = 'https://quotes.toscrape.com/scroll';
const output = '/app/out/result.json';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.locator('.quote').first().waitFor({ timeout: 30_000 });

  // The page appends quotes after each scroll; stop when a scroll adds none.
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const previousCount = await page.locator('.quote').count();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    try {
      await page.waitForFunction(
        count => document.querySelectorAll('.quote').length > count,
        previousCount,
        { timeout: 5_000 },
      );
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      break;
    }
  }

  const quotes = await page.locator('.quote').evaluateAll(elements =>
    elements.map(element => ({
      text: element.querySelector('.text')?.textContent?.trim() ?? '',
      author: element.querySelector('.author')?.textContent?.trim() ?? '',
      tags: [...element.querySelectorAll('.tag')].map(tag => tag.textContent.trim()),
    })),
  );

  if (quotes.length === 0 || quotes.some(quote => !quote.text || !quote.author)) {
    throw new Error('No complete quotes were loaded from the page');
  }

  await mkdir('/app/out', { recursive: true });
  await writeFile(output, `${JSON.stringify(quotes, null, 2)}\n`, 'utf8');
  console.log(`Saved ${quotes.length} quotes to ${output}`);
} finally {
  await browser.close();
}
