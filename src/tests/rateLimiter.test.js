import { enforceRateLimit } from "../rateLimiter.js";

describe("rate limiter", () => {

    test("allows under limit", async () => {

        const request = new Request(
            "https://example.com/api/chat",
            {
                headers: {
                    "CF-Connecting-IP": "1.2.3.4"
                }
            }
        );

        const env = {
            RATE_LIMITER: {
                idFromName: jest.fn(() => "id"),
                get: jest.fn(() => ({
                    fetch: jest.fn(async () =>
                        new Response(
                            JSON.stringify({
                                allowed: true
                            })
                        )
                    )
                }))
            }
        };

        const result = await enforceRateLimit(
            request,
            env,
            "chat",
            20,
            3600
        );

        expect(result).toBeNull();
    });

    test("blocks after limit", async () => {

        const request = new Request(
            "https://example.com/api/chat",
            {
                headers: {
                    "CF-Connecting-IP": "1.2.3.4"
                }
            }
        );

        const env = {
            RATE_LIMITER: {
                idFromName: jest.fn(() => "id"),
                get: jest.fn(() => ({
                    fetch: jest.fn(async () =>
                        new Response(
                            JSON.stringify({
                                allowed: false
                            })
                        )
                    )
                }))
            }
        };

        const result = await enforceRateLimit(
            request,
            env,
            "chat",
            20,
            3600
        );

        expect(result.status).toBe(429);
    });

});