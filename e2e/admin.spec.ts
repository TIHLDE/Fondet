import { test, expect } from "@playwright/test";

test("anonymous visit to /admin redirects to the login page", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Logg inn" }),
  ).toBeVisible();
});

test("login form always answers with the generic confirmation", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-postadresse").fill("ukjent@tihlde.org");
  await page.getByRole("button", { name: "Send innloggingslenke" }).click();
  await expect(
    page.getByText("Hvis adressen er autorisert, er en innloggingslenke sendt."),
  ).toBeVisible();
});
