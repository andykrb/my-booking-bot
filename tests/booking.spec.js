const { test, expect } = require('@playwright/test');

test('Booking Test', async ({ page }) => {
  // 1. URL anpassen! (Wichtig: Prüfe, ob das die Seite mit dem Formular ist)
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', { waitUntil: 'networkidle' });

  // Wir führen dein Skript aus und fangen die Konsolen-Ausgaben ab
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  // 2. Dein Original-JavaScript injizieren
  const result = await page.evaluate(async () => {
    return new Promise((resolve) => {
      // Wir definieren die completion-Funktion für dein Script
      window.completion = (msg) => resolve(msg);

      // --- DEIN ORIGINAL SCRIPT START ---
      (function () {
        // ... (Kopiere hier dein komplettes Script aus der ersten Nachricht rein) ...
        // Stelle sicher, dass am Ende finish(msg) aufgerufen wird!
      })();
      // --- DEIN ORIGINAL SCRIPT ENDE ---
    });
  });

  console.log("Endergebnis vom Script:", result);
  
  // Screenshot machen, egal ob Erfolg oder Fehler
  await page.screenshot({ path: 'final-view.png', fullPage: true });
});
