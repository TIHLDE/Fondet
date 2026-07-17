import { test, expect, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "TIHLDE sitt fond" },
  { path: "/about", heading: "Om fondet" },
  { path: "/group", heading: "Forvaltningsgruppen" },
  { path: "/group/tidligere", heading: "Tidligere medlemmer" },
  { path: "/apply", heading: "Søk om støtte" },
  { path: "/apply/skjema", heading: "Søknadsskjema" },
  { path: "/reports", heading: "Rapporter og dokumenter" },
];

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    // Nordnet API is external and may be unreachable in test runs;
    // network failures are not app bugs.
    if (msg.type() === "error" && !/fetch|network|Failed to load/i.test(msg.text())) {
      errors.push(msg.text());
    }
  });
  return errors;
}

for (const { path, heading } of PAGES) {
  test(`${path} renders with heading and no page errors`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("homepage has no Følgere or Vurdering stats", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Følgere")).toHaveCount(0);
  await expect(page.getByText("Vurdering")).toHaveCount(0);
});

test("mobile menu opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile project only");
  await page.goto("/");
  await page.getByRole("button", { name: "Åpne meny" }).click();
  await page.getByRole("link", { name: "Om fondet" }).first().click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Om fondet" }),
  ).toBeVisible();
});

test("theme toggle switches dark class", async ({ page }) => {
  await page.goto("/about");
  const toggle = page.getByRole("button", { name: "Bytt fargetema" }).first();
  const isDark = () =>
    page.evaluate(() => document.documentElement.classList.contains("dark"));
  const before = await isDark();
  // theme cycles light -> dark -> system, so the class may need
  // up to three clicks to flip
  let flipped = false;
  for (let i = 0; i < 3 && !flipped; i++) {
    await toggle.click();
    flipped = (await isDark()) !== before;
  }
  expect(flipped).toBe(true);
});

test.describe("group carousel", () => {
  test("shows carousel with controls and advances on Neste", async ({
    page,
  }) => {
    await page.goto("/group");
    const carousel = page.getByTestId("group-carousel");
    await expect(carousel).toBeVisible();

    const status = carousel.locator("p.sr-only");
    await expect(status).toHaveText("Bilde 1 av 3");

    await carousel.getByRole("button", { name: "Neste bilde" }).click();
    await expect(status).toHaveText("Bilde 2 av 3");

    await carousel.getByRole("button", { name: "Forrige bilde" }).click();
    await expect(status).toHaveText("Bilde 1 av 3");
  });

  test("dot buttons jump to a slide", async ({ page }) => {
    await page.goto("/group");
    const carousel = page.getByTestId("group-carousel");
    await carousel.getByRole("button", { name: "Vis bilde 3 av 3" }).click();
    await expect(carousel.locator("p.sr-only")).toHaveText("Bilde 3 av 3");
  });

  test("auto-advances without interaction", async ({ page }) => {
    await page.goto("/group");
    const carousel = page.getByTestId("group-carousel");
    const status = carousel.locator("p.sr-only");
    await expect(status).toHaveText("Bilde 1 av 3");
    // mouse hover pauses rotation, so park the pointer off the carousel
    await page.mouse.move(0, 0);
    await expect(status).toHaveText("Bilde 2 av 3", { timeout: 10_000 });
  });

  test("does not auto-advance with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/group");
    const status = page.getByTestId("group-carousel").locator("p.sr-only");
    await expect(status).toHaveText("Bilde 1 av 3");
    await page.waitForTimeout(7000);
    await expect(status).toHaveText("Bilde 1 av 3");
  });
});

test.describe("søknader pagination", () => {
  for (const path of ["/apply", "/reports"]) {
    test(`${path} paginates the table`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText("Side 1 av 2").first()).toBeVisible();

      const neste = page.getByRole("button", { name: "Neste" }).first();
      await neste.click();
      await expect(page.getByText("Side 2 av 2").first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Neste" }).first(),
      ).toBeDisabled();

      const forrige = page.getByRole("button", { name: "Forrige" }).first();
      await forrige.click();
      await expect(page.getByText("Side 1 av 2").first()).toBeVisible();
    });
  }
});

test("no horizontal page overflow on mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile project only");
  for (const { path } of PAGES) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow on ${path}`).toBe(false);
  }
});
