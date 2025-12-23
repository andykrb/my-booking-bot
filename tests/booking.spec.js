const { test, expect } = require('@playwright/test');

test('Strukturierter Booking-Test via Network-Interception', async ({ page }) => {
  // 1. Definition der Netzwerk-Erwartung
  // Wir warten auf die Konfigurations-Datei oder das Haupt-Script von Feratel/Deskline
  const toscResponsePromise = page.waitForResponse(response => 
    response.url().includes('feratel.com') || response.url().includes('deskline')
  );

  // 2. Seite laden
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/');

  // 3. Cookie-Banner (Actionability nutzen)
  // Playwright prüft automatisch: Visible, Stable, Enabled, Not Obscured.
  const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  await cookieBtn.click();

  // 4. Synchronisation mit der Engine (Kein Try & Error mehr)
  // Wir warten darauf, dass die Netzwerk-Antwort von Feratel eintrifft.
  // Erst dann ist die Engine technisch in der Lage, Befehle zu verarbeiten.
  await toscResponsePromise;
  console.log('Netzwerk-Check: Buchungs-Engine geladen.');

  // 5. Interaktion mit Actionability
  // Wir definieren Locators basierend auf deinem HTML
  const arrivalInput = page.locator('#searchArrival');
  const adultsSelect = page.locator('#searchAdults-1');
  const submitButton = page.locator('button.submit-search');

  // Playwright wartet hier AUTOMATISCH, bis das Feld:
  // - Attached ist
  // - Visible ist
  // - Stable ist
  // - Enabled ist
  // - Nicht mehr vom Cookie-Banner verdeckt wird (da wir es oben geklickt haben)
  await arrivalInput.fill('27.12.2025');
  await adultsSelect.selectOption('2');

  // 6. Aktion ausführen
  await submitButton.click();

  // 7. Ergebnis prüfen
  await expect(page).toHaveURL(/.*doSearch=1.*/);
});
