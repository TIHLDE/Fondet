// Grensene for søknadsskjemaet bor her, ikke i selve route-fila: Next godtar
// bare HTTP-handlere som eksport fra en route.ts, så testene kan ikke hente
// limiterne derfra for å nullstille dem mellom tester.

import { RateLimiter } from "@/lib/rate-limit";

// To lag, fordi de stopper hver sin ting. Taket per IP stopper én avsender som
// hamrer på skjemaet; det globale taket stopper en spredt flom som fyller
// fondet@tihlde.org (og brenner Photon-kvoten) selv når ingen enkelt-IP ser
// mistenkelig ut. Begge ligger godt over normal bruk — skjemaet får en håndfull
// ekte søknader i semesteret.
export const perIp = new RateLimiter(3, 60 * 60 * 1000);
export const globalt = new RateLimiter(30, 60 * 60 * 1000);

export function resetSoknadLimits(): void {
  perIp.reset();
  globalt.reset();
}
