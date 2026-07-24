// ============================================================
//  TIHLDE Fondet — Kvartalsrapport Q2 2026
//  Layout inspirert av InFi Kvartalsoppdatering
//  Compile: typst compile kvartalsrapport-q2-2026.typ
// ============================================================

#import "@preview/cetz:0.3.4": canvas, draw

// ── Fargepalett (minimal) ────────────────────────────────────
#let ink      = rgb("#161616")
#let sub      = rgb("#555555")
#let dim      = rgb("#aaaaaa")
#let rule-col = rgb("#d4d4d4")
#let pos-col  = rgb("#1a7a4a")
#let neg-col  = rgb("#c0392b")

// Sektorfarger for kakediagram
#let c-tech    = rgb("#2c6e9e")
#let c-health  = rgb("#3ca065")
#let c-ind     = rgb("#7b5ea7")
#let c-fin     = rgb("#e07b2a")
#let c-cons    = rgb("#c94050")
#let c-renew   = rgb("#5ab4a0")
#let c-energy  = rgb("#888888")

// ── Sideoppsett ──────────────────────────────────────────────
#set document(
  title: "TIHLDE Fondet – Kvartalsrapport Q2 2026",
  author: "TIHLDE Fondet",
)
#set page(
  paper: "a4",
  margin: (top: 3.6cm, bottom: 2.0cm, left: 2.5cm, right: 2.5cm),
  header: {
    set text(
      font: ("Calibri", "Helvetica Neue", "Libertinus Sans"),
      size: 9pt,
      fill: ink,
    )
    grid(
      columns: (1fr, auto),
      align: (left + bottom, right + top),
      {
        v(1.4em)
        text(weight: "bold")[Kvartalsoppdatering]
      },
      text(size: 24pt, weight: "bold")[Q2 #h(0.35em) 2026],
    )
    v(0.5em)
    line(length: 100%, stroke: 0.6pt + rule-col)
  },
  footer: context {
    set text(
      font: ("Calibri", "Helvetica Neue", "Libertinus Sans"),
      size: 7pt,
      fill: dim,
    )
    line(length: 100%, stroke: 0.4pt + rule-col)
    v(-0.4em)
    grid(
      columns: (1fr, auto),
      text(fill: dim)[TIHLDE Fondet · NTNU Trondheim · Rapporten er utarbeidet per 30.06.2026],
      counter(page).display(),
    )
  },
)
#set text(
  font: ("Calibri", "Helvetica Neue", "Libertinus Sans"),
  size: 10pt,
  fill: ink,
)
#set par(justify: true, leading: 0.72em, spacing: 0.85em)
#set heading(numbering: none)

// ── Overskriftsstiler ────────────────────────────────────────
#show heading.where(level: 1): it => {
  v(0.9em)
  text(size: 11pt, weight: "bold")[#it.body]
  v(0.25em)
}
#show heading.where(level: 2): it => {
  v(0.6em)
  text(size: 10pt, weight: "bold")[#it.body]
  v(0.1em)
}

// ── Hjelpekomponenter ────────────────────────────────────────

// Nøkkeldataboks
#let keydata(title, entries) = block(
  stroke: 0.5pt + rule-col,
  inset: (x: 10pt, y: 9pt),
  radius: 2pt,
  width: 100%,
)[
  #text(size: 8.5pt, weight: "bold")[#title]
  #v(0.35em)
  #line(length: 100%, stroke: 0.4pt + rule-col)
  #v(0.3em)
  #for (label, value) in entries {
    grid(
      columns: (1fr, auto),
      text(size: 8pt, fill: sub)[#label],
      text(size: 8pt, weight: "bold")[#value],
    )
    v(0.18em)
  }
]

// Farget avkastningstall
#let ret(v) = {
  let pos = not v.starts-with("−") and not v.starts-with("-")
  text(fill: if pos { pos-col } else { neg-col }, weight: "bold")[#v]
}

// Kakediagram (donut)
#let donut-chart(segs) = canvas(length: 1cm, {
  import draw: *
  let r = 1.75
  let hole = 1.02
  let cx = 2.0
  let cy = 0.0
  let start = 90deg
  for (pct, col) in segs {
    let sweep = pct / 100.0 * 360deg
    arc(
      (cx, cy),
      start: start,
      stop: start - sweep,
      radius: r,
      mode: "PIE",
      fill: col,
      stroke: white + 0.8pt,
    )
    start = start - sweep
  }
  circle((cx, cy), radius: hole, fill: white, stroke: none)
})

// Stolpediagram
#let bar-chart(data, max-abs: 25.0) = canvas(length: 1cm, {
  import draw: *
  let n = data.len()
  let w = 14.0
  let h = 5.0
  let gap = w / n
  let bw = gap * 0.58
  let ys = h / 2.0 / max-abs

  // Horisontale rutenettlinjer
  for pct in (-20, -10, 0, 10, 20) {
    let y = pct * ys
    line((0, y), (w, y), stroke: if pct == 0 { 0.6pt + luma(160) } else { 0.3pt + luma(210) })
    content(
      (-0.2, y),
      text(size: 5.5pt, fill: luma(150))[#if pct > 0 { "+" + str(pct) } else { str(pct) }%],
      anchor: "east",
    )
  }

  for (i, (name, val)) in data.enumerate() {
    let x0 = i * gap + (gap - bw) / 2.0
    let bh = val * ys
    let col = if val >= 0 { c-tech } else { neg-col }
    rect((x0, 0.0), (x0 + bw, bh), fill: col, stroke: none)

    // Verdimerke over/under stolpe
    let val-str = if val >= 0 { "+" + str(val) } else { str(val) }
    content(
      (x0 + bw / 2.0, if val >= 0 { bh + 0.22 } else { bh - 0.22 }),
      text(size: 5pt, fill: col, weight: "bold")[#val-str %],
      anchor: if val >= 0 { "south" } else { "north" },
    )
    // Ticker-etikett under
    content(
      (x0 + bw / 2.0, -0.9),
      text(size: 5.5pt, fill: sub)[#name],
      anchor: "center",
    )
  }
})

// Linjediagram
#let line-chart(tihlde, osebx, y-max: 80) = canvas(length: 1cm, {
  import draw: *
  let w = 14.0
  let h = 5.0
  let n = tihlde.len()
  let xs = w / (n - 1)
  let ys = h / y-max

  // Rutenett
  for pct in (0, 20, 40, 60, 80) {
    let y = pct * ys
    line((0, y), (w, y), stroke: 0.3pt + luma(210))
    content((-0.25, y), text(size: 6pt, fill: luma(150))[#pct %], anchor: "east")
  }

  // X-akse merker
  line((0, 0), (w, 0), stroke: 0.5pt + luma(160))
  let year-labels = ("jan/22", "jul/22", "jan/23", "jul/23", "jan/24",
                     "jul/24", "jan/25", "jul/25", "jan/26", "jun/26")
  let step = (n - 1) / (year-labels.len() - 1)
  for (i, lbl) in year-labels.enumerate() {
    let x = i * step * xs
    content((x, -0.45), text(size: 5.5pt, fill: luma(150))[#lbl], anchor: "center")
  }

  // OSEBX (grå)
  for i in range(n - 1) {
    line(
      (i * xs, osebx.at(i) * ys),
      ((i + 1) * xs, osebx.at(i + 1) * ys),
      stroke: 1.2pt + luma(180),
    )
  }
  // TIHLDE (blå)
  for i in range(n - 1) {
    line(
      (i * xs, tihlde.at(i) * ys),
      ((i + 1) * xs, tihlde.at(i + 1) * ys),
      stroke: 1.8pt + c-tech,
    )
  }

  // Forklaring
  let lx = w - 4.5
  let ly = h + 0.5
  line((lx, ly), (lx + 0.6, ly), stroke: 1.8pt + c-tech)
  content((lx + 0.8, ly), text(size: 7pt)[TIHLDE Fondet], anchor: "west")
  line((lx + 3.0, ly), (lx + 3.6, ly), stroke: 1.2pt + luma(180))
  content((lx + 3.8, ly), text(size: 7pt)[OSEBX], anchor: "west")
})

// ════════════════════════════════════════════════════════════
//  SIDE 1 — SAMMENDRAG
// ════════════════════════════════════════════════════════════

// Stor overskrift
#text(size: 15pt, weight: "bold")[
  Teknologiboomen driver TIHLDE Fondet,\ solid meravkastning i Q2
]
#v(0.75em)

// To-kolonne layout
#grid(
  columns: (2fr, 1fr),
  column-gutter: 18pt,

  // ── Venstre: narrativ ────────────────────────────────────
  [
    Fondet fikk i Q2 en avkastning på *4,1 %*, mot
    *1,8 %* for OSEBX i samme periode. Dette gir oss
    en samlet avkastning på *18,6 %* hittil i år mot
    børsens *9,2 %* siden nyttår.

    Kvartalets vinnere ble NVIDIA (+18,2 %) og ASML
    (+18,9 %), med avkastning drevet av sterk resultat­
    rapportering og AI-relatert etterspørsel. Kvartalets
    taper ble Equinor (−6,2 %), tynget av fall i olje­
    prisen mot slutten av perioden.

    #v(0.5em)

    = Teknologiboomen fortsetter

    Kvartalet ble preget av fortsatt styrke i teknologi­
    aksjer drevet av kunstig intelligens-relatert etter­
    spørsel. NVIDIA steg kraftig etter resultater der
    datacenter-inntektene overgikk konsensus­estimater
    markant. Microsoft Azure-veksten akselererte til
    33 % YoY, og Alphabet kommuniserte økt satsing
    på AI-assistenter i søk og skytjenester.

    Halvlederleverandøren ASML satte ny rekord i
    ordreinngang for EUV-maskiner, noe som reflekterer
    at chipprodusentene TSMC, Samsung og Intel planleg­
    ger kraftig kapasitetsutbygging de neste tre til fem
    årene.

    #v(0.5em)

    = Norsk energi trekker ned

    Equinor ASA (EQNR) var porteføljens klare taper
    med −6,2 %. Nedgangen ble utløst av fall i Brent­
    oljen fra rundt USD 82 per fat ved kvartalets start
    til under USD 71 ved utgangen av juni, i kjølvannet
    av økt OPEC+-produksjon og svakere kinesisk etter­
    spørsel. Styret vurderer posisjonsstørrelsen.
  ],

  // ── Høyre: nøkkeldata + kakediagram ─────────────────────
  [
    #keydata(
      "Nøkkeldata per 30.06.2026",
      (
        ("Total forvaltningskapital", "NOK 3 840 000"),
        ("TIHLDE avk. i Q2",          "4,1 %"),
        ("OSEBX avk. i Q2",           "1,8 %"),
        ("TIHLDE avk. YTD",           "18,6 %"),
        ("OSEBX avk. YTD",            "9,2 %"),
        ("Avk. siden oppstart",        "78,3 %"),
        ("Kvartalets vinner",          "ASML"),
        ("Kvartalets taper",           "EQNR"),
      ),
    )

    #v(0.75em)
    #text(size: 8.5pt, weight: "bold")[Porteføljevekting per 30.06.2026]
    #v(0.3em)

    #donut-chart((
      (38, c-tech),
      (14, c-health),
      (12, c-ind),
      (10, c-fin),
      (10, c-cons),
      (8,  c-renew),
      (8,  c-energy),
    ))

    #v(0.4em)

    // Forklaring
    #let leg(col, lbl, pct) = grid(
      columns: (7pt, 1fr, auto),
      column-gutter: 4pt,
      block(width: 7pt, height: 7pt, fill: col, radius: 1pt),
      text(size: 7.5pt)[#lbl],
      text(size: 7.5pt)[#pct],
    )
    #leg(c-tech,   "Teknologi",      "38 %")
    #leg(c-health, "Helse",          "14 %")
    #leg(c-ind,    "Industri",       "12 %")
    #leg(c-fin,    "Finans",         "10 %")
    #leg(c-cons,   "Forbruksvarer",  "10 %")
    #leg(c-renew,  "Fornybar",        "8 %")
    #leg(c-energy, "Energi",          "8 %")
  ],
)

#v(0.65em)

// Full bredde: vinneranalyse
= NVIDIA og ASML bykser på halvlederbølgen

NVIDIA Corporation (NVDA) ble kvartalets beste aksje med en avkastning på +18,2 %. Selskapet nøt godt av kraftig etterspørsel etter GPU-er til AI-trening og inferens. Datacenter­segmentet vokste 427 % YoY og overgikk alle konsensusestimater. Fondets posisjon i NVDA på 9,8 % av porteføljen bidro med 1,4 prosentpoeng til kvartalsavkastningen.

#pagebreak()

// ════════════════════════════════════════════════════════════
//  SIDE 2 — AKSJEANALYSER OG PORTEFØLJEENDRINGER
// ════════════════════════════════════════════════════════════

ASML Holding (ASML) ble tatt inn i porteføljen i begynnelsen av april og leverte umiddelbart en avkastning på +18,9 %. Selskapet har et tilnærmet monopol på EUV-litografimaskiner og kommuniserte på sin investor-dag sterk ordre­inngang fra samtlige store chipfabrikanter. Vi mener ASML er attraktivt priset relativt til den strukturelle veksten i halvledersektoren.

= Novo Nordisk fortsetter vekstreisen

Novo Nordisk (NVO) leverte nok et sterkt kvartal med +11,4 %. GLP-1-legemidlene Ozempic og Wegovy fortsetter å vokse kraftig, og selskapet kommuniserte ambisiøse mål for produksjonskapasiteten fremover på sin kapital­markedsdag i mai. Med voksende omsetning, høye marginer og en sterk pipeline av neste generasjons vektlegemidler er Novo Nordisk fortsatt en kjerneposisjon i fondet.

= Equinor kollapser på oljeprisfall

Equinor ASA (EQNR) var porteføljens svakeste aksje med −6,2 %. Nedgangen ble utløst av Brent-oljefall fra USD 82 til under USD 71 per fat i kjølvannet av økt OPEC+-produksjon og svakere kinesisk etterspørsel. Kursfallet reflekterer markedets bekymring for etterspørselsutsiktene på kort sikt. Styret vil ta en beslutning om posisjonsstørrelsen i neste styremøte.

= Endringer i porteføljen

I løpet av Q2 har fondet initiert to nye posisjoner og avviklet to eksisterende.

ASML Holding (ASML) ble tatt inn i porteføljen i begynnelsen av april med en innledende vekting på 6,1 %. Selskapet utvikler og leverer EUV-litografimaskiner som er kritiske i produksjonen av avanserte halvledere. Rasjonalet er ASMLs dominerende markedsposisjon, høye byttekostnader for kundene og den strukturelle etterspørselen fra AI-capex-syklusen.

Aker Solutions (AKSO) ble tatt inn mot slutten av april med en innledende vekting på 4,2 %. Selskapet er godt posisjonert mot vekst i havvind­segmentet og er attraktivt priset relativt til jevnaldrende selskaper. AKSO steg +9,4 % fra kjøpstidspunktet og i løpet av kvartalet.

Posisjonene i Constellation Energy (CEG) og Hexagon Composites (HEX) ble avviklet i løpet av kvartalet. CEG ble solgt etter at kursen nærmet seg fondets intrinsic value-estimat, med en realisert avkastning på +38,4 % fra kjøpstidspunktet. HEX ble stoppet ut med −12,1 % etter forsinkede kontrakter og nedjustering av selskapets vekstprofil.

#pagebreak()

// ════════════════════════════════════════════════════════════
//  SIDE 3 — DETALJERT PORTEFØLJEOVERSIKT
// ════════════════════════════════════════════════════════════

= Detaljert porteføljeoversikt

#set text(size: 9pt)

#table(
  columns: (2.0fr, 0.7fr, 1.1fr, 1.1fr, 1.0fr, 1.0fr, 0.75fr),
  align: (left, center, center, center, center, center, center),
  stroke: none,
  fill: (x, y) => {
    if y == 0 { luma(230) }
    else if calc.odd(y) { white }
    else { luma(247) }
  },
  table.header(
    [*Selskap*],
    [*Ticker*],
    [*Kjøpsdato*],
    [*Kostpris*],
    [*Kurs 30.06*],
    [*Avk. Q2*],
    [*Vekt*],
  ),
  [Microsoft Corp.],     [MSFT],  [15.03.2023], [USD 285],  [USD 453],  [+8,4 %],   [11,2 %],
  [NVIDIA Corp.],        [NVDA],  [10.01.2024], [USD 497],  [USD 922],  [+18,2 %],  [9,8 %],
  [Apple Inc.],          [AAPL],  [02.09.2022], [USD 155],  [USD 180],  [+5,1 %],   [8,4 %],
  [ASML Holding],        [ASML],  [03.04.2026], [EUR 782],  [EUR 930],  [+18,9 %],  [6,1 %],
  [Equinor ASA],         [EQNR],  [14.06.2023], [kr 295],   [kr 266],   [−6,2 %],   [5,9 %],
  [Novo Nordisk],        [NVO],   [22.11.2023], [USD 63],   [USD 98],   [+11,4 %],  [5,7 %],
  [Alphabet Inc. Cl A],  [GOOGL], [10.05.2023], [USD 108],  [USD 201],  [+7,8 %],   [5,3 %],
  [Aker Solutions],      [AKSO],  [28.04.2026], [kr 44,20], [kr 48,35], [+9,4 %],   [4,2 %],
  [JPMorgan Chase],      [JPM],   [03.08.2023], [USD 154],  [USD 214],  [+3,2 %],   [4,0 %],
  [Vestas Wind Systems], [VWS],   [17.02.2024], [kr 140],   [kr 144],   [+1,2 %],   [3,8 %],
  [Schneider Electric],  [SU],    [11.04.2024], [EUR 192],  [EUR 202],  [+4,1 %],   [3,6 %],
  [UnitedHealth Group],  [UNH],   [30.10.2023], [USD 546],  [USD 510],  [−2,1 %],   [3,4 %],
  [LVMH Moët Hennessy],  [MC],    [05.12.2023], [EUR 626],  [EUR 671],  [+6,8 %],   [3,2 %],
  [DNB Bank ASA],        [DNB],   [19.09.2024], [kr 215],   [kr 221],   [+2,8 %],   [3,0 %],
  [*Kontanter*],         [—],     [—],           [—],        [—],        [—],         [*22,4 %*],
  [*Total*],             [*—*],   [*—*],         [*—*],      [*—*],      [*+4,1 %*], [*100,0 %*],
)

#text(size: 7.5pt, fill: sub)[
  \* Alle avkastningstall inkluderer mottatt utbytte.\
  \*\* For aksjer kjøpt i løpet av kvartalet er avkastningen i Q2 målt fra kostpris.
]

#set text(size: 10pt)
#v(0.9em)

= Avkastning siden oppstart

#v(0.3em)

// Månedlige akkumulerte avkastningsdata jan 2022 – jun 2026 (54 obs.)
// TIHLDE: 78,3 % totalt, OSEBX: ~42 % totalt
#line-chart(
  (  0.0,  1.2,  3.1,  1.8,  4.2,  6.4,  8.1,  8.8, 11.4, 13.2,
    14.1, 14.9, 17.2, 19.1, 20.4, 21.9, 22.4, 23.8, 25.2,
    26.8, 28.3, 29.0, 31.1, 32.6, 33.5, 35.1, 36.7,
    38.5, 40.3, 42.0, 43.8, 46.1, 47.2, 49.4, 51.1, 52.8,
    53.7, 55.9, 57.6, 59.4, 61.0, 62.9, 64.2, 66.0, 67.8,
    68.3, 70.2, 72.5, 73.9, 75.2, 76.7, 77.2, 77.9, 78.3),
  (  0.0,  0.7,  2.1,  1.1,  2.8,  4.5,  6.0,  6.7,  9.1, 10.3,
    11.2, 11.9, 13.5, 15.0, 15.8, 17.0, 17.8, 19.1, 20.4,
    21.8, 23.1, 23.8, 25.1, 26.4, 27.0, 28.2, 29.5,
    31.0, 32.5, 33.8, 35.1, 36.8, 37.5, 38.9, 40.2, 41.5,
    42.1, 43.5, 44.8, 45.9, 47.1, 48.4, 49.0, 50.3, 51.4,
    51.9, 53.1, 54.3, 55.0, 56.5, 57.1, 58.3, 59.5, 60.7),
  y-max: 80,
)

#pagebreak()

// ════════════════════════════════════════════════════════════
//  SIDE 4 — AVKASTNINGSOVERSIKT PER AKSJE
// ════════════════════════════════════════════════════════════

= Avkastning i Q2 2026

#v(0.3em)

#bar-chart(
  (
    ("MSFT",  8.4),
    ("NVDA", 18.2),
    ("AAPL",  5.1),
    ("ASML", 18.9),
    ("EQNR", -6.2),
    ("NVO",  11.4),
    ("GOOGL", 7.8),
    ("AKSO",  9.4),
    ("JPM",   3.2),
    ("VWS",   1.2),
    ("SU",    4.1),
    ("UNH",  -2.1),
    ("MC",    6.8),
    ("DNB",   2.8),
  ),
  max-abs: 22.0,
)

#text(size: 7.5pt, fill: sub)[
  _\* For aksjer kjøpt i løpet av kvartalet er avkastningen målt fra kostpris._
]

#v(1.6em)

= Avkastning siden kjøp

#v(0.3em)

#bar-chart(
  (
    ("MSFT",  59.0),
    ("NVDA",  85.5),
    ("AAPL",  16.1),
    ("ASML",  18.9),
    ("EQNR",  -9.8),
    ("NVO",   55.6),
    ("GOOGL", 86.1),
    ("AKSO",   9.4),
    ("JPM",   38.9),
    ("VWS",    2.9),
    ("SU",    5.2),
    ("UNH",   -6.6),
    ("MC",     7.2),
    ("DNB",    2.8),
  ),
  max-abs: 95.0,
)
