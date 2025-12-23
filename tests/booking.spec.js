const { test, expect } = require('@playwright/test');

test('Booking Test', async ({ page }) => {
  // 1. Die Seite aufrufen
  // Wir warten, bis der grundlegende HTML-Load abgeschlossen ist
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', {
    waitUntil: 'domcontentloaded'
  });

  // 2. Cookie-Banner akzeptieren
  // ID aus deinem Screenshot: #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll
  const cookieButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');

  try {
    // Warten, bis der Button sichtbar ist (Timeout 10s)
    await cookieButton.waitFor({ state: 'visible', timeout: 10000 });
    await cookieButton.click();
    console.log('Cookie-Banner wurde geklickt.');
  } catch (e) {
    console.log('Cookie-Banner nicht gefunden oder bereits akzeptiert.');
  }

  // 3. Warten auf das Laden der Scripte
  // Nach dem Cookie-Klick laden oft viele Tracking- und Funktions-Scripte nach.
  // Wir warten, bis das Netzwerk für einen Moment zur Ruhe kommt.
  await page.waitForLoadState('networkidle');

  // 4. Auf die Buchungs-Engine (TOSC5) warten
  // Dein Screenshot zeigt einen Timeout bei "Wait for function". 
  // Wir prüfen hier explizit, ob das Objekt auf dem Window existiert.
  await page.waitForFunction(() => {
    // Wir prüfen auf TOSC5, da deine Konsole "TOSC5 is not initialized" meldete
    return typeof window.TOSC5 !== 'undefined';
  }, { timeout: 30000 });

  // 5. Die eigentliche Test-Logik (vorher Zeile 24)
  // Hier führen wir den Code aus, der zuvor den Timeout verursacht hat.
  const setupStatus = await page.evaluate(() => {
    // Debug-Info in die Playwright-Konsole zurückgeben
    return {
      toscExists: typeof window.TOSC5 !== 'undefined',
      url: window.location.href
    };
  });

  console.log('Setup Status:', setupStatus);

  // Beispiel: Überprüfen, ob ein bestimmtes Element der Buchungsmaske nun da ist
  // Ersetze '.search-button' durch einen echten Selector deiner Seite
  // await expect(page.locator('.search-button')).toBeVisible();
});
