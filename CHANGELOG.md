# CHANGELOG

## Tegnforklaring

### ✨ - Ny funksjonalitet

### ⚡ - Forbedret funksjonalitet

### 🦟 - Fikset en bug

### 🎨 - Designendringer

---

## Neste versjon

## Versjon 2026.07.18
- ✨ **Adminpanel**. Forvaltere kan nå logge inn med engangslenke på e-post (kun @tihlde.org-adresser på adminlisten) og redigere medlemmer, portretter, gruppebilder, rapporter og søknadsoversikten direkte på siden, uten å gå via GitHub.
- ✨ **Filopplasting**. Portretter og gruppebilder komprimeres automatisk ved opplasting, og rapport-PDF-er lastes opp og serveres fra serverens datalager.
- ⚡ **Innhold uten deploy**. Endringer gjort i adminpanelet lagres på serverens datavolum og vises umiddelbart, uten ny bygging eller utrulling av siden.
- 🦟 **Rammeverk**. Oppgradert til Next.js 15 og React 19. Lukker alle gjenværende sikkerhetsvarsler, inkludert flere alvorlige DoS-sårbarheter som aldri får patch i Next.js 14.
- ⚡ **Søknadsskjema**. Skjemaet varsler nå når ønsket sum overstiger 100 000 kr, siden slike beløp må vedtas av generalforsamlingen. Søknaden kan fortsatt sendes inn.
- ⚡ **Tomme tilstander**. Avkastning per fond og siste handler viser nå en kort melding i stedet for å forsvinne når data mangler, og beholdningstabellen har fått en prøv igjen-knapp når Nordnet-data ikke kan hentes.
- 🎨 **Kontrast**. Slett-knappen i budsjettradene og verktøytipset i avkastningsgrafen følger nå temafargene, med god kontrast i både lyst og mørkt tema.
- 🎨 **Skjelettlasting**. Plassholderne under lasting speiler nå layouten til innholdet de venter på (profilkort, nøkkeltall, tabeller, donut), så siden ikke hopper når dataene kommer.
- ⚡ **Handelshistorikk**. Aktivitetsfeeden leses nå 30 sider dypt i stedet for 6, slik at fond kjøpt langt tilbake ikke faller ut av porteføljen.
- 🦟 **Avhengigheter**. Sikkerhetsoppdatert next, resend, js-yaml og verktøykjeden; 14 av 16 Dependabot-varsler lukket uten major-oppgradering.

## Versjon 2026.07.17
- ⚡ **Hurtigsøk**. Søket (⌘K / Ctrl+K) bruker nå fuzzy-matching med rangering og utheving av treff, grupperer sider og temavalg, og har et ugjennomsiktig panel som ikke lenger lekker sideinnholdet bak seg.
- ✨ **Kommandopalett**. Åpne søk med ⌘K / Ctrl+K for å hoppe mellom sider og bytte tema.
- ✨ **Beholdningstabell**. Radene kan sorteres på kolonne og utvides for detaljer om hvert fond.
- ✨ **Avkastningsmatrise**. Avkastning per fond og periode vises i egen tabell, farget etter fortegn i stedet for fargede bokser.
- ✨ **Porteføljebredde**. Ny stolpe i avkastningskortet viser hvor mange fond som er i pluss.
- ✨ **Fondsticker**. Rullende bånd øverst viser hvert fonds YTD-avkastning, pauser på hover.
- ✨ **Ferskhetsindikator**. Under toppseksjonen vises når dataene sist ble hentet fra Nordnet.
- ✨ **Treemap**. Sammensetningen kan ses som treemap farget etter årets avkastning.
- ✨ **Til toppen**. Knapp som ruller dashbordet tilbake til toppen.
- 🎨 **Nøkkeltall**. Tallene teller opp ved innlasting, seksjoner tones inn ved scroll, og gevinst/tap markeres med piler.
- 🎨 **Kort**. Dashbordkortene løftes et hakk ved hover.
- 🦟 **Temafarger**. Kort-, knapp- og input-bakgrunner ble borte fordi camelCase-fargeklassene ikke lagde CSS i Tailwind v4. Alias er lagt til så bakgrunnene rendrer igjen.
- 🦟 **Mobilmeny**. Menyen er nå ugjennomsiktig når den er åpen, så innholdet bak ikke skinner gjennom.
- 🎨 **Bidra-lenke**. Footeren lenker nå til kildekoden på GitHub.
- ⚡ **Dokumentasjon**. README er skrevet om for utviklere: arkitekturvalg med begrunnelse, datakilder, begrensninger og en Tailwind v4-felle.

## Versjon 2026.07.16
- ✨ **Sammenligningsgraf**. Utviklingsgrafen kan sammenlignes med verdensindekser, og har indikatorer og tegneverktøy.
- 🦟 **Bilder på Vercel**. Medlems- og gruppebilder rendrer nå også i serverless-miljø.
- ⚡ **Medlemsliste**. Oppdatert forvaltningsgruppe og nytt navn på søknadsseksjonen.

## Versjon 2026.07.15
- ✨ **Kvartalsrapporter 2025**. Publisert på /reports.
- ✨ **Grafverktøy**. La til analyseverktøy, indekser og «tøm alt» i grafen.
- ✨ **Tidligere medlemmer**. Årsmerket gruppekarusell og paginert liste.
- ✨ **Volumbilder**. Medlemsbilder serveres fra et montert volum i produksjon, ikke fra repoet.
- 🦟 **Portretter**. Rettet feilmerkede portretter fra fotoseansene.
- 🦟 **Graf**. Herdet forhåndsvisningen mot crosshair-rekursjon; beholder fullskjerm når Esc avbryter et tegneverktøy.

## Versjon 2026.07.14
- ✨ **Live portefølje**. Viser fondets beholdning direkte fra den offentlige Nordnet Shareville-profilen.
- ✨ **Søknadsskjema**. Egen side med validering i sanntid, sendt som e-post via Resend.
- ✨ **Rapportside**. /reports med årsrapport som PDF.
- ✨ **Medlemskort**. Portretter, studie og periode på hvert kort, med roterende gruppebilde.
- ✨ **Tidligere søknader**. Paginert liste med én rad per søknad og vedtak.
- 🎨 **Tilgjengelighet**. Kontrast, berøringsmål, fokusmarkering og sidetitler ryddet opp.
- 🦟 **Content-API**. Fjernet uautentisert PUT og PUT-basert innholdsredigering.
- ⚡ **Om fondet**. Omskrevet i enklere språk.
- ⚡ **Arkitektur**. Fjernet adminpanel, innlogging og Firebase-datalag til fordel for offentlig data og filer i repoet.
