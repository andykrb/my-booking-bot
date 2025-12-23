const { test, expect } = require('@playwright/test');

test('Booking Test', async ({ page }) => {
  // 1. Seite laden
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/');

  // 2. Cookie-Banner akzeptieren (Basierend auf deinem Screenshot)
  const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  try {
    await cookieBtn.waitFor({ state: 'visible', timeout: 10000 });
    await cookieBtn.click();
    console.log('Cookies akzeptiert');
  } catch (e) {
    console.log('Kein Cookie-Banner erschienen');
  }

  // 3. Warten auf TOSC5 Initialisierung
  // Da "window.TOSC5" fehlschlägt, nutzen wir das 'dw' Event-System
  // oder warten auf die Existenz des Buchungs-Containers im DOM.
  console.log('Warte auf TOSC5 Engine...');

  await Promise.all([
    // Warten, bis das Netzwerk zur Ruhe kommt, damit Scripte laden können
    page.waitForLoadState('networkidle'),
    
    // Wir warten auf ein Element, das typischerweise von TOSC5 generiert wird
    // Oft ist dies ein div mit der ID "tosc5" oder ein iframe
    page.waitForSelector('.tosc5-client, #tosc5-container, .be-widget-container', { 
      state: 'attached', 
      timeout: 30000 
    })
  ]);

  // 4. Robuste Prüfung der Initialisierung (Alternative zu window.TOSC5)
  // Wir nutzen die dw-Funktion aus deiner Dokumentation
  const isInitialized = await page.evaluate(async () => {
    return new Promise((resolve) => {
      // Prüfen, ob das System bereits bereit ist
      if (window.TOSC5 && typeof window.TOSC5.isInitialized === 'function' && window.TOSC5.isInitialized()) {
        resolve(true);
      }

      // Falls nicht, hängen wir uns an das Event-System aus der Doku
      if (typeof window.dw === 'function') {
        window.dw('onPageLoad', '*', function(e) {
          console.log('TOSC5 onPageLoad Event gefeuert', e);
          resolve(true);
        });
      }

      // Sicherheits-Fallback: Nach 10 Sekunden auflösen, falls das Event verpasst wurde
      setTimeout(() => resolve(false), 10000);
    });
  });

  console.log('TOSC5 Status:', isInitialized ? 'Bereit' : 'Timeout/Unbekannt');

  // 5. Interaktion: Prüfen, ob die Unterkunft-Suche geladen ist
  // Ersetze '.search-button' durch einen echten Selector aus der Buchungsmaske
  const searchMask = page.locator('.tosc5-search-button, button[type="submit"]');
  await expect(searchMask.first()).toBeVisible({ timeout: 15000 });
  
  console.log('Buchungsmaske ist bereit zur Interaktion.');
});
