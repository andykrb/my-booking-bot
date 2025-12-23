const { test, expect } = require('@playwright/test');

test('Booking Test', async ({ page }) => {
  // 1. Die Zielseite aufrufen
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/');

  // 2. Cookie-Banner akzeptieren
  // Wir verwenden die ID des "Alle zulassen"-Buttons aus deinem DOM-Screenshot
  const cookieButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  
  try {
    // Warten, bis der Button sichtbar ist (max. 5 Sekunden), um Timeouts zu vermeiden
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
    await cookieButton.click();
    console.log('Cookie-Banner erfolgreich akzeptiert.');
  } catch (e) {
    // Falls das Banner nicht erscheint (z.B. durch Cookies im Kontext), fährt der Test fort
    console.log('Cookie-Banner nicht erschienen oder bereits akzeptiert.');
  }

  // 3. Warten auf Initialisierung der Skripte
  // Da deine Console "TOSC5 is not initialized" anzeigte, warten wir hier explizit
  // Dies verhindert, dass das nachfolgende 'evaluate' in einen Timeout läuft.
  await page.waitForFunction(() => typeof window.TOSC5 !== 'undefined', { timeout: 10000 });

  // 4. Dein ursprünglicher Evaluate-Befehl (zuvor Zeile 11)
  // Ich habe hier einen Platzhalter eingefügt – setze hier deine spezifische Logik ein.
  const result = await page.evaluate(async () => {
    // FÜGE HIER DEINEN CODE AUS ZEILE 11 EIN
    // Beispiel: return document.querySelector('.some-class').innerText;
    return true; 
  });

  // 5. Beispielhafte Assertion, um den Erfolg zu prüfen
  // await expect(page).toHaveURL(/urlaub-buchen/);
  console.log('Test erfolgreich bis nach dem Evaluate-Schritt ausgeführt.');
});
