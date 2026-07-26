# Sikkerhet

## Hva som støttes

Fondet er én kontinuerlig utrullet nettside, ikke et bibliotek med versjoner.
Det er alltid `main` som kjører i produksjon, og det er den eneste koden som
får sikkerhetsfikser. Gamle commits og brancher støttes ikke.

## Melde fra om en sårbarhet

Meld fra på **fondet@tihlde.org**, eller via
[GitHub Security Advisories](https://github.com/TIHLDE/Fondet/security/advisories/new)
hvis du vil ha en privat tråd med historikk.

Ikke åpne et vanlig issue for sikkerhetsfeil — issues er offentlige, og da
ligger detaljene ute mens hullet fortsatt er åpent.

Ta med det du har: hva du fant, hvordan man reproduserer det, og hva du tror
konsekvensen er. En URL og en beskrivelse holder langt; du trenger ikke en
ferdig exploit.

Forvaltningsgruppen drifter siden ved siden av studiene, så svartiden
varierer. Regn med noen dager, og purr gjerne hvis det blir stille.

## Hva du kan forvente

Vi bekrefter at meldingen er mottatt, sier fra om vi regner det som en
sårbarhet eller ikke, og gir beskjed når den er fikset. Si fra hvis du vil
krediteres — vi gjør det gjerne, men spør først.

## Omfang

Dette gjelder koden i dette repoet og siden på fondet.tihlde.org.

Siden henter porteføljedata fra Nordnets offentlige API-er. Feil i Nordnets
tjenester hører hjemme hos Nordnet, ikke her. Det samme gjelder Photon, som
eier e-postutsendingen.
