import { test, expect } from "@playwright/test";

test("message character counter updates while typing", async ({ page }) => {

    await page.goto("/Contact/contactpg.html");

    const counter = page.locator("#messageCounter");

    await expect(counter).toHaveText("0 / 1200");

    await page.fill("#message", "Hello");

    await expect(counter).toHaveText("5 / 1200");

});