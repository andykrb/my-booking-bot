const { test, expect } = require('@playwright/test');

test('Booking Script', async ({ page }) => {
  // 1. Seite laden
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/');

  // 2. Felder ausfüllen (Playwright wartet automatisch, bis sie da sind)
  await page.fill('#searchArrival', '27.12.2025');
  await page.fill('#searchDeparture', '03.01.2026');
  
  // 3. Dropdowns auswählen
  await page.selectOption('#searchRooms', { label: '1 Zimmer' });
  await page.selectOption('#searchAdults-1', { label: '2 Erwachsene' });
  await page.selectOption('#searchChildren-1', { label: '0 Kinder' });

  // 4. Online-buchbar Checkbox (falls vorhanden)
  const checkbox = page.locator('label:has-text("online buchbar") input');
  if (await checkbox.isVisible()) {
      await checkbox.uncheck();
  }

  // 5. Screenshot vor dem Abschicken
  await page.screenshot({ path: 'vor-submit.png' });

  // 6. Klick auf den Button
  await page.click('button:has-text("Unterkunft finden"), a:has-text("Unterkunft finden")');

  // 7. Kurz warten und Ergebnis-Screenshot
  await page.waitForTimeout(3000); 
  await page.screenshot({ path: 'ergebnis.png', fullPage: true });
});
