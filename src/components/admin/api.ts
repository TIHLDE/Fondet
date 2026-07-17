// Small fetch wrapper for the admin sections: throws the server's Norwegian
// error message so callers can toast it directly.
export async function api<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Noe gikk galt. Prøv igjen.",
    );
  }
  return data as T;
}

export function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.";
}
