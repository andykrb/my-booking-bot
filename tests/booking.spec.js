const { test, expect } = require('@playwright/test');

test('Booking Test', async ({ page }) => {
  // 1. Die Seite mit einem großzügigen Timeout laden
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // 2. Cookie-Banner akzeptieren (ID aus deinem Screenshot)
  const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
    console.log('Cookie-Banner akzeptiert.');
  }

  // 3. Auf TOSC5 warten via JavaScript-Polling
  // Wir nutzen die 'dw'-Funktion oder prüfen die globale Variable
  console.log('Warte auf TOSC5 Initialisierung...');
  
  await page.waitForFunction(() => {
    // Prüfe ob TOSC5 existiert und initialisiert ist
    const isReady = window.TOSC5 && 
                    typeof window.TOSC5 === 'object' && 
                    document.querySelector('.tosc5-client, [id*="tosc5"], .be-widget-container');
    
    // Debugging-Hilfe: Falls TOSC5 noch "null" oder "undefined" ist, 
    // meldet die Konsole im Browser den aktuellen Status
    return !!isReady;
  }, { timeout: 30000 });

  // 4. Zusätzliche Sicherheit: Warte auf das Verschwinden von Lade-Spinnern
  // Feratel-Widgets zeigen oft eine Lade-Animation
  const loader = page.locator('.tosc5-loader, .be-loader');
  if (await loader.isVisible()) {
    await loader.waitFor({ state: 'hidden', timeout: 15000 });
  }

  // 5. Die eigentliche Interaktion (Beispiel: Verfügbarkeit prüfen Button)
  // Wir nutzen einen generischen Selektor, der oft in TOSC5 verwendet wird
  const searchButton = page.locator('button.tosc5-button-search, .tosc5-submit, #tosc5-search-btn').first();
  
  await expect(searchButton).toBeVisible({ timeout: 15000 });
  console.log('TOSC5 Widget erfolgreich geladen und Button ist sichtbar.');

  // Optional: Klick auf den Button, um den Buchungsprozess zu starten
  // await searchButton.click();
});
