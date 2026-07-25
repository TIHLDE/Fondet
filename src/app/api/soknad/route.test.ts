import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "./route";
import { MIN_WORDS } from "@/lib/soknad-validation";

const longText = Array.from({ length: MIN_WORDS }, (_, i) => `ord${i}`).join(
  " ",
);

const valid = {
  sokerNavn: "Sosialen",
  kontaktperson: "Kari Nordmann",
  telefon: "12345678",
  epost: "kari@tihlde.org",
  onsketSum: "10000",
  hvaStotte: longText,
  begrunnelse: longText,
  konsekvenser: "Da blir det ikke noe av",
  andreSoknader: "Søkt hos Hovedstyret, fikk avslag",
  budsjett: [{ utgift: "Leie av lokale", sum: "10000" }],
  tillegg: "",
};

function post(body: unknown) {
  return POST(
    new Request("http://localhost:3000/api/soknad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Ruten leser bare request.json(), så en vanlig Request holder.
    }) as NextRequest,
  );
}

beforeEach(() => {
  process.env.PHOTON_API_URL = "https://photon.example.org/";
  process.env.PHOTON_EMAIL_API_KEY = "test-key";
});

afterEach(() => {
  delete process.env.PHOTON_API_URL;
  delete process.env.PHOTON_EMAIL_API_KEY;
  vi.restoreAllMocks();
});

describe("POST /api/soknad", () => {
  it("sends the application to Photon with every answer included", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    const res = await post(valid);
    expect(res.status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0];
    // Trailing slash on PHOTON_API_URL must not produce a double slash.
    expect(url).toBe("https://photon.example.org/api/email/send");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-key");

    const body = JSON.parse((init as RequestInit).body as string);
    const text = body.content
      .map((b: { content?: string }) => b.content ?? "")
      .join("\n");
    expect(text).toContain("Søkt hos Hovedstyret, fikk avslag");
    expect(text).toContain("Kari Nordmann");
    expect(text).toContain("Leie av lokale");
  });

  it("rejects invalid applications before contacting Photon", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const res = await post({ ...valid, onsketSum: "1000" });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails with 503 when Photon is not configured", async () => {
    delete process.env.PHOTON_EMAIL_API_KEY;
    const res = await post(valid);
    expect(res.status).toBe(503);
  });

  it("returns 500 when Photon rejects the request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 502 }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post(valid);
    expect(res.status).toBe(500);
  });
});
