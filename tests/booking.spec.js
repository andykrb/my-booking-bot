const { test, expect } = require('@playwright/test');

test('Stabilisierter Buchungs-Test Zillertal Arena', async ({ page }) => {
  // --- PHASE 1: Navigation & Consent ---
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', { waitUntil: 'networkidle' });

  // Cookie-Banner entfernen (ID aus deinem Screenshot)
  const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
    // Kurz warten, bis das Overlay-Animation verschwunden ist
    await page.waitForTimeout(500); 
  }

  // --- PHASE 2: API-Synchronisation ---
  // Wir warten explizit, bis das TOSC5 Objekt initialisiert ist.
  // Dies löst den "TOSC5 is not initialized" Fehler dauerhaft.
  await page.waitForFunction(() => {
    return typeof window.TOSC5 !== 'undefined' && document.readyState === 'complete';
  }, { timeout: 20000 });

  // --- PHASE 3: Formular befüllen ---
  // Wir nutzen die IDs direkt aus deinem HTML-Auszug
  await page.fill('#searchArrival', '27.12.2025');
  await page.fill('#searchDeparture', '03.01.2026');
  
  // Zimmer & Personen (IDs: searchRooms, searchAdults-1)
  await page.selectOption('#searchRooms', '1');
  await page.selectOption('#searchAdults-1', '2');

  // --- PHASE 4: Suche ausführen ---
  // Selektor für den Submit-Button aus deinem HTML [cite: 1045]
  const submitBtn = page.locator('button.submit-search:has-text("Unterkunft finden")');
  
  // Sicherstellen, dass der Button klickbar ist (nicht verdeckt)
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();

  // --- PHASE 5: Validierung ---
  // Warten auf die Ergebnisse (URL-Wechsel oder Erscheinen der Ergebnisliste)
  await expect(page).toHaveURL(/.*doSearch=1.*/);
  console.log('Test erfolgreich: Suche wurde mit TOSC5-Initialisierung gestartet.');
});
