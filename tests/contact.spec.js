import { test, expect } from "@playwright/test";

test("user can submit the contact form", async ({ page }) => {

    // Fake the browser Turnstile API before any page scripts run.
    await page.addInitScript(() => {

        Object.defineProperty(window, "turnstile", {
            configurable: true,
            value: {
                getResponse: () => "playwright-test-token",
                reset: () => {}
            }
        });

    });

    // Capture the success alert.
    let alertMessage = "";

    page.on("dialog", async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
    });

    await page.setExtraHTTPHeaders({
        "CF-Connecting-IP": "203.0.113.10"
    });
    await page.goto("/Contact/contactpg.html");

    await page.fill("#name", "Playwright Test");

    await page.fill(
        "#email",
        "playwright@example.com"
    );

    await page.fill(
        "#message",
        "This is an automated E2E test."
    );

    const responsePromise = page.waitForResponse(
        response =>
            response.url().includes("/api/contact") &&
            response.request().method() === "POST"
    );

    await page.click("#sendBtn");
    const response = await responsePromise;


    expect(response.status()).toBe(200);

    await expect.poll(() => alertMessage)
        .toBe("Message sent successfully!");
});