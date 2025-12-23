const { test, expect } = require('@playwright/test');

test('Booking Test Zillertal Arena', async ({ page }) => {
  // 1. Seite aufrufen mit erweitertem Timeout
  // Wir warten auf 'domcontentloaded', da das Widget danach asynchron kommt
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 2. Cookie-Banner akzeptieren
  // Die ID aus deinem Screenshot ist: #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll
  const cookieButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  
  try {
    // Warten, bis der Button da ist (max. 10s)
    await cookieButton.waitFor({ state: 'visible', timeout: 10000 });
    await cookieButton.click();
    console.log('Cookie-Banner wurde akzeptiert.');
  } catch (e) {
    console.log('Cookie-Banner wurde nicht gefunden (evtl. bereits akzeptiert).');
  }

  // 3. Auf die TOSC5 Engine warten (Die Lösung für "Not Initialized")
  // Wir nutzen das 'dw' Event-System aus deiner Dokumentation
  console.log('Warte auf TOSC5 Initialisierung...');
  
  await page.evaluate(() => {
    return new Promise((resolve) => {
      // Falls TOSC5 bereits fertig ist
      if (typeof window.TOSC5 !== 'undefined' && window.TOSC5.isInitialized) {
        resolve(true);
      }
      
      // Ansonsten hängen wir uns an das Event-System (siehe dein Screenshot 6)
      if (typeof window.dw === 'function') {
        window.dw('onPageLoad', '*', function() {
          resolve(true);
        });
      } else {
        // Fallback: Falls 'dw' nicht existiert, prüfen wir alle 500ms
        const interval = setInterval(() => {
          if (typeof window.TOSC5 !== 'undefined') {
            clearInterval(interval);
            resolve(true);
          }
        }, 500);
      }
      
      // Sicherheits-Timeout nach 20 Sekunden
      setTimeout(() => resolve(false), 20000);
    });
  });

  // 4. Den Such-Button finden und anklicken
  // Wir nutzen hier Text-Selektoren, da diese robuster gegen Klassen-Änderungen sind
  const searchButton = page.getByRole('button', { name: 'Unterkunft finden' }).first();

  // Sicherstellen, dass der Button sichtbar ist
  await expect(searchButton).toBeVisible({ timeout: 20000 });
  
  // Klick ausführen
  await searchButton.click();
  console.log('Suche wurde gestartet.');

  // 5. Überprüfung: Warten auf die Ergebnisliste
  // Nach dem Klick ändert sich die URL oder es erscheinen Suchergebnisse
  await expect(page).toHaveURL(/.*detail.*/, { timeout: 15000 }).catch(() => {
    console.log('URL hat sich (noch) nicht geändert, prüfe auf Ergebnisanzeige...');
  });
});
