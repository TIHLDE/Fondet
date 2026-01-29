# Fondet – TIHLDE

Nettside for TIHLDE sitt investeringsfond. Bygget med Next.js 14 (App Router), TypeScript og Tailwind CSS.

## Teknologier

- **Next.js 14** – React-rammeverk med App Router
- **TypeScript** – Typesikkerhet
- **Tailwind CSS v4** – Styling
- **React Query** – Datahåndtering og caching
- **Recharts** – Grafer for portefølje og allokering
- **Firebase** – Database og lagring
- **Jose / Bcryptjs** – JWT-autentisering
- **Resend** – E-posttjeneste

## Kom i gang

### Forutsetninger

- Node.js (v18+)
- npm

### Installasjon

```bash
npm install
```

### Miljøvariabler

Opprett en `.env.local`-fil i rotmappen med følgende variabler:

```
NEXT_PUBLIC_SHEET_ID=<Google Sheets ID>
JWT_SECRET=<hemmelig nøkkel for JWT>
RESEND_API_KEY=<API-nøkkel for Resend>
```

### Kjøring

```bash
# Utviklingsserver (http://localhost:3000)
npm run dev

# Produksjonsbygg
npm run build

# Start produksjonsserver
npm start

# Kjør linting
npm run lint
```

## Prosjektstruktur

```
src/
├── app/                        # Sider og API-ruter (App Router)
│   ├── page.tsx                # Forsiden (porteføljeoversikt)
│   ├── about/                  # Om fondet
│   ├── apply/                  # Søk støtte
│   │   └── skjema/             # Søknadsskjema
│   ├── group/                  # Gruppemedlemmer
│   │   └── tidligere/          # Tidligere medlemmer
│   ├── reports/                # Rapporter
│   ├── admin/                  # Admin-panel (krever innlogging)
│   │   ├── login/              # Innlogging
│   │   ├── members/            # Medlemshåndtering
│   │   ├── applications/       # Søknadshåndtering
│   │   └── reports/            # Rapporthåndtering
│   └── api/                    # Backend API-ruter
│       ├── auth/               # Innlogging/utlogging
│       ├── members/            # Medlemsdata
│       ├── soknad/             # Søknader
│       ├── content/            # Innholdsdata
│       └── stocks/             # Aksjedata
├── components/                 # React-komponenter
│   ├── ui/                     # Gjenbrukbare UI-komponenter
│   ├── navigation/             # Navigasjon (TopBar, BottomBar, Footer)
│   ├── AllocationChart.tsx     # Allokeringsgraf
│   ├── PortfolioChart.tsx      # Porteføljegraf
│   ├── MemberCard.tsx          # Medlemskort
│   ├── ReportsList.tsx         # Rapportliste
│   └── SoknadSkjema.tsx        # Søknadsskjema
├── data/                       # Statiske data (JSON)
│   ├── content.json            # Innhold
│   └── members.json            # Medlemsdata
├── lib/                        # Hjelpefunksjoner
│   ├── auth.ts                 # Autentisering (JWT)
│   └── utils.ts                # Verktøyfunksjoner
├── hooks/                      # Custom React hooks
├── middleware.ts               # Beskyttelse av admin-ruter
└── styles/
    └── globals.css             # Globale stiler og Tailwind
```

## Autentisering

Admin-panelet (`/admin/*`) er beskyttet med JWT-tokens. Middleware sjekker at en gyldig token finnes i cookies før tilgang gis. Innlogging skjer via `/admin/login`.

## Tema

Appen støtter lys og mørk modus via en egen ThemeProvider. Temavalg lagres i `localStorage`.
