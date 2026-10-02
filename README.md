# Pion Design Lindesberg

Färdig, fristående webbplats med Pions egna bilder och 215 produktposter i 15 kategorier. Underlaget hämtades från https://www.pionlindesberg.com den 2 oktober 2026. Vissa poster visar flera produkter eller olika varianter; antalet är inte ett lagersaldo.

## Publicera på GitHub Pages

1. Packa upp `pion-github.zip`.
2. Lägg samtliga filer och mappen `assets` direkt i GitHub-repots rot. `index.html` ska ligga överst, inte i en extra undermapp.
3. Öppna repots Settings → Pages. Välj Deploy from a branch, `main` och `/ (root)`.
4. Spara. GitHub visar adressen när sidan har publicerats.

Ingen installation eller byggprocess behövs. Öppna `index.html` lokalt för att se sidan. För webbfunktioner som att kopiera förfrågan rekommenderas en vanlig webbserver; sidan har en manuell kopieringsreserv om webbläsaren blockerar urklipp.

## Filer

- `index.html`: sidans innehåll och struktur.
- `styles.css`: utseende och anpassning till mobil, surfplatta och dator.
- `app.js`: sökning, sortering, produktdetaljer och förfrågningslista.
- `catalog.js`: samtliga produkter, bilder, beskrivningar, priser och källänkar.
- `fonts.css` och `assets/`: lokala typsnitt, licenser och bilder.
- `DESIGN.md`: designval och funktioner.

## Förfrågningar och priser

Besökaren kan samla produkter och öppna en färdig förfrågan i sitt eget mejlprogram. Inga mejl skickas automatiskt och sidan tar inte emot betalningar. Det finns också en länk till Christinas ursprungliga beställningsformulär. Valen sparas bara under det aktuella sidbesöket och försvinner vid omladdning.

Christina bekräftar alltid pris, tillgänglighet och frakt. Produktpriserna är ett underlag från originalwebbplatsen, inte en automatisk lager- eller prisanslutning. Uppdateringar behöver göras i `catalog.js`.

Kontakt: Christina Bertholdson, 070-540 84 49, bjorkagard711@telia.com.

## Kontrollerat

Alla 215 poster, 15 kategorier och tillhörande bildfiler. Sökning med och utan svenska tecken, prissortering, kategorifilter, fler produkter, tomma resultat, produktdialog, tangentbordsfokus, förfrågningslista, borttagning och antal i kopierad förfrågan. Layouten har granskats vid 320, 390, 820 och 1440 pixlars bredd.
