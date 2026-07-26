// In-memory rate limiting. Deliberately not backed by Redis or a database:
// the site runs as a single container (see README), so process memory is the
// whole picture, and a limiter that needs its own infrastructure is exactly
// the kind of thing this project avoids. A restart clears the counters, which
// is an acceptable trade for endpoints where the limit is anti-abuse rather
// than a hard quota.

// Entries are pruned on write, so the map cannot grow without bound on
// attacker-controlled keys (unlike a plain Map keyed by IP).
type Entry = { count: number; resetAt: number };

export class RateLimiter {
  private hits = new Map<string, Entry>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    // Tak på antall samtidige nøkler. Nøkkelen er klientstyrt (x-forwarded-for
    // kan spoofes), så uten et tak kan én flom med unike verdier blåse opp
    // kartet selv om hver enkelt forespørsel avvises.
    private readonly maxKeys: number = 10_000,
  ) {}

  // True when the caller is allowed through; false when it is over the limit.
  // Calling this counts as a request.
  check(key: string, now: number = Date.now()): boolean {
    this.prune(now);
    const entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      // Fullt kart: slipp gjennom uten å registrere. Å avvise i stedet ville
      // gjort kartet til et våpen — en angriper kunne fylt det og dermed
      // stengt ute alle nye, legitime IP-er. Det globale taket er backstop.
      if (this.hits.size >= this.maxKeys) return true;
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.limit;
  }

  // Clears every bucket. Exists for tests: the limiters are module-level, so
  // without this one test file's requests would count against the next one's.
  reset(): void {
    this.hits.clear();
  }

  private prune(now: number): void {
    // forEach rather than for-of: the project targets ES5, where iterating a
    // Map directly needs downlevelIteration.
    const expired: string[] = [];
    this.hits.forEach((entry, key) => {
      if (now >= entry.resetAt) expired.push(key);
    });
    expired.forEach((key) => this.hits.delete(key));
  }
}

// The app sits behind a reverse proxy (Docker/systemd, see README), so the
// client address comes from x-forwarded-for. Only the first hop is trusted:
// the rest of the chain is attacker-supplied. Falls back to a single shared
// bucket when no header is present, which is the safe direction — unknown
// callers share a limit rather than each getting their own.
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}
