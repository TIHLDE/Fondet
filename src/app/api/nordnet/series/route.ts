import { NextRequest, NextResponse } from "next/server";
import {
  getSeries,
  isValidIdentifier,
  resolveIndexIdentifier,
  SERIES_PERIODS,
  type SeriesPeriod,
} from "@/lib/nordnet";
import { RateLimiter, clientIp } from "@/lib/rate-limit";

export const revalidate = 1800;

const MAX_INDEX_NAME = 64;

// Ett innkommende kall kan utløse mange utgående kall til Nordnet (ett per
// fond, to per indeks), og angriperen velger identifikatorene selv, så
// revalidate hjelper ikke — hver nye verdi er en cache-miss. Uten et tak kan
// ruten brukes til å hamre på et tredjeparts-API vi er helt avhengige av.
//
// Bevisst bare per IP, ikke et globalt tak: dette er et endepunkt vanlige
// sidevisninger treffer, og et globalt tak ville tatt grafen ned for alle
// under en flom. Taket er satt godt over reell bruk — grafen cacher 30 min i
// React Query, så en nysgjerrig bruker gjør titalls kall, ikke hundrevis.
const perIp = new RateLimiter(120, 60 * 60 * 1000);

// GET /api/nordnet/series?period=YEAR_1&funds=uuid:Label,...&indexes=OSEBX,...
export async function GET(request: NextRequest) {
  if (!perIp.check(clientIp(request))) {
    return NextResponse.json(
      { error: "For mange forespørsler. Prøv igjen senere." },
      { status: 429 },
    );
  }

  const params = request.nextUrl.searchParams;

  const periodParam = params.get("period") ?? "YEAR_1";
  const period: SeriesPeriod = SERIES_PERIODS.includes(
    periodParam as SeriesPeriod,
  )
    ? (periodParam as SeriesPeriod)
    : "YEAR_1";

  const funds = (params.get("funds") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 12)
    .map((pair) => {
      const [identifier, ...label] = pair.split(":");
      return { identifier, label: label.join(":") || identifier };
    });

  // Identifikatoren går inn i en URL mot Nordnet, så den må se ut som noe vi
  // selv har sendt ut. Vår egen klient bygger den av orderBookId (UUID), så
  // avvik betyr at kallet ikke kommer derfra.
  if (!funds.every((f) => isValidIdentifier(f.identifier))) {
    return NextResponse.json({ error: "Ugyldig fond-id" }, { status: 400 });
  }

  const indexes = (params.get("indexes") ?? "")
    .split(",")
    .filter(Boolean)
    .slice(0, 12);

  // Indeksnavn slås opp via søk (allerede URL-enkodet), så her holder det å
  // hindre absurd lange søkestrenger.
  if (indexes.some((n) => n.length > MAX_INDEX_NAME)) {
    return NextResponse.json({ error: "Ugyldig indeksnavn" }, { status: 400 });
  }

  const fundSeries = await Promise.all(
    funds.map(async (f) => ({
      label: f.label,
      kind: "fund" as const,
      points: await getSeries(f.identifier, period, true),
    })),
  );

  const indexSeries = await Promise.all(
    indexes.map(async (name) => {
      const identifier = await resolveIndexIdentifier(name);
      return {
        label: name,
        kind: "index" as const,
        points: identifier ? await getSeries(identifier, period, false) : [],
      };
    }),
  );

  return NextResponse.json({
    period,
    series: [...fundSeries, ...indexSeries].filter((s) => s.points.length > 0),
  });
}
