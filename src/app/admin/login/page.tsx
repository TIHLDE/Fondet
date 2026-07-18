"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full px-4 py-3 bg-background border border-cardBorder rounded-lg text-foreground-primary placeholder:text-foreground-secondary focus:outline-none focus:border-blue-500 transition";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    setLinkError(
      new URLSearchParams(window.location.search).get("feil") === "ugyldig",
    );
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setLinkError(false);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Noe gikk galt. Prøv igjen.");
    }
    setSending(false);
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-foreground-primary mb-2">
          Logg inn
        </h1>
        <p className="text-foreground-secondary mb-6">
          Kun for forvaltere. Du får en innloggingslenke på e-post.
        </p>
        {linkError && (
          <p role="alert" className="text-red-500 mb-4">
            Lenken er ugyldig eller utløpt. Be om en ny.
          </p>
        )}
        {message ? (
          <p role="status" className="text-foreground-primary">
            {message}
          </p>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-foreground-primary mb-1"
            >
              E-postadresse
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              placeholder="navn@tihlde.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={sending}
              className="mt-4 w-full min-h-[44px] px-4 py-3 rounded-lg bg-button-background text-button-foreground border border-button-border font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition disabled:opacity-40"
            >
              {sending ? "Sender ..." : "Send innloggingslenke"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
