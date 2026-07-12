import { test, expect } from "@playwright/test";

test("dark mode persists after page reload", async ({ page }) => {

    await page.goto("/");

    // Light mode initially
    await expect(page.locator("body"))
        .not.toHaveClass(/dark-mode/);

    // Enable dark mode
    await page.locator(".theme-toggle").click();

    // Body should now have dark-mode
    await expect(page.locator("body"))
        .toHaveClass(/dark-mode/);

    // localStorage should be updated
    await expect
        .poll(() =>
            page.evaluate(() =>
                localStorage.getItem("portfolio-theme")
            )
        )
        .toBe("dark");

    // Reload page
    await page.reload();

    await expect
    .poll(() =>
        page.evaluate(() =>
            localStorage.getItem("portfolio-theme")
        )
    )
    .toBe("dark");

    // Theme should still be dark
    await expect(page.locator("body"))
        .toHaveClass(/dark-mode/);

});