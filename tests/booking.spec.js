const { test, expect } = require('@playwright/test');

test('Strukturierter Booking-Test (Actionability-Solution)', async ({ page }) => {
  await page.goto('https://www.zillertalarena.com/urlaub-buchen/', { waitUntil: 'networkidle' });

  // 1. Cookie-Banner entfernen
  const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  await cookieBtn.click();

  // 2. Das korrekte Ankunfts-Feld finden
  // Wir suchen nach dem Platzhalter "Ankunft", aber NUR wenn das Element sichtbar ist.
  // Playwright ignoriert so automatisch das versteckte #searchArrival.
  const arrivalVisible = page.locator('input[placeholder="Ankunft"]').filter({ visible: true });
  const departureVisible = page.locator('input[placeholder="Abreise"]').filter({ visible: true });

  // 3. Interaktion mit dem Kalender
  // Da es oft ein Datepicker ist, reicht einfaches 'fill' manchmal nicht. 
  // Wir klicken erst, um den Fokus zu setzen.
  await arrivalVisible.click();
  
  // Wir versuchen das Datum zu tippen. 
  // Falls das Script hier wieder hängt, ist es ein reiner Kalender-Picker ohne Tipp-Funktion.
  await arrivalVisible.fill('27.12.2025');
  await departureVisible.fill('03.01.2026');

  // 4. Submit-Button (Ebenfalls gefiltert auf Sichtbarkeit)
  const submitBtn = page.locator('button.submit-search').filter({ visible: true });
  await submitBtn.click();

  // 5. Erfolgskontrolle
  await expect(page).toHaveURL(/.*doSearch=1.*/);
});
