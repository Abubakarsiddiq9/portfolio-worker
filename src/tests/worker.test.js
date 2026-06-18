// Worker API tests — mocks Resend and Gemini so no real API calls are made

// ── Mock Resend ───────────────────────────────────────────────
jest.mock("resend", () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: {
                send: jest.fn().mockResolvedValue({ id: "mock-email-id" })
            }
        }))
    };
});

// ── Mock fetch (Gemini API call & GitHub) ──────────────────────────────
global.fetch = jest.fn((url) => {

    // Gemini API

    if (
        typeof url === "string" &&
        url.includes(
            "generativelanguage.googleapis.com"
        )
    ) {

        return Promise.resolve({
            ok: true,
            json: async () => ({
                candidates: [{
                    content: {
                        parts: [{
                            text:
                                "I am Abubakar's portfolio assistant."
                        }]
                    }
                }]
            })
        });
    }

    // GitHub API

    if (
        typeof url === "string" &&
        url.includes("api.github.com")
    ) {

        return Promise.resolve({
            ok: true,
            json: async () => ([
                {
                    name: "portfolio-worker",
                    description:
                        "Portfolio project",
                    stargazers_count: 5,
                    language: "JavaScript",
                    html_url:
                        "https://github.com/test/repo"
                }
            ])
        });
    }

    return Promise.reject(
        new Error("Unknown fetch")
    );

});

// Mock Cloudflare Cache API
const mockCache = {
    match: jest.fn().mockResolvedValue(null), // cache miss by default
    put: jest.fn().mockResolvedValue(undefined)
};

global.caches = {
    default: mockCache
};

// ── Import worker after mocks are set up ──────────────────────
const worker = require("../index.js");

// Helper — builds a mock Request like Cloudflare Workers receive
function makeRequest(path, method = "GET", body = null) {
    const url = `https://portfolio-worker.workers.dev${path}`;
    const init = { method };
    if (body) {
        init.body = JSON.stringify(body);
        init.headers = { "Content-Type": "application/json" };
    }
    return new Request(url, init);
}

// Mock env — simulates Cloudflare secrets
const mockEnv = {
    RESEND_API_KEY: "mock-resend-key",
    EMAIL: "test@example.com",
    GEMINI_API_KEY: "mock-gemini-key",

    RATE_LIMITS: {
        get: jest.fn().mockResolvedValue(null),
        put: jest.fn().mockResolvedValue(undefined)
    },

    portfolio_db: {
        prepare: jest.fn().mockReturnValue({
            bind: jest.fn().mockReturnValue({
                run: jest.fn().mockResolvedValue({})
            })
        })
    }
};

// ── /api/test ─────────────────────────────────────────────────
describe("GET /api/test", () => {
    test("returns success true", async () => {
        const req = makeRequest("/api/test");
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
    });
});

// ── /api/contact ──────────────────────────────────────────────
describe("POST /api/contact", () => {
    test("sends email and returns success", async () => {
        const req = makeRequest("/api/contact", "POST", {
            name: "Test User",
            email: "test@example.com",
            message: "Hello from test"
        });
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
    });

    test("returns 400 when fields are missing", async () => {
        const req = makeRequest("/api/contact", "POST", {
            name: "Test User"
            // email and message missing
        });
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
    });
});

// ── /api/chat ─────────────────────────────────────────────────
describe("POST /api/chat", () => {
    test("returns AI reply", async () => {
        const req = makeRequest("/api/chat", "POST", {
            history: [{ role: "user", parts: [{ text: "What are your skills?" }] }]
        });
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(typeof data.reply).toBe("string");
    });

    test("returns 400 when history is missing", async () => {
        const req = makeRequest("/api/chat", "POST", {});
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
    });

    test("returns 400 when history is empty array", async () => {
        const req = makeRequest("/api/chat", "POST", { history: [] });
        const res = await worker.default.fetch(req, mockEnv);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
    });
});

// ── unknown route ─────────────────────────────────────────────
describe("Unknown route", () => {
    test("returns 404", async () => {
        const req = makeRequest("/api/unknown");
        const res = await worker.default.fetch(req, mockEnv);

        expect(res.status).toBe(404);
    });
});

// ── /api/posts ─────────────────────────────────────────────

describe("GET /api/posts", () => {

    test("returns all blog posts", async () => {

        const req = makeRequest("/api/posts");

        const res =
            await worker.default.fetch(
                req,
                mockEnv
            );

        const data =
            await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
    });

});


// ── /api/posts/:slug ───────────────────────────────────────

describe("GET /api/posts/:slug", () => {

    test("returns one blog post", async () => {

        const req =
            makeRequest(
                "/api/posts/abubakar-portfolio"
            );

        const res =
            await worker.default.fetch(
                req,
                mockEnv
            );

        const data =
            await res.json();

        expect(res.status).toBe(200);
        expect(data.slug)
            .toBe("abubakar-portfolio");
    });

    test("returns 404 for invalid slug", async () => {

        const req =
            makeRequest(
                "/api/posts/not-found"
            );

        const res =
            await worker.default.fetch(
                req,
                mockEnv
            );

        expect(res.status).toBe(404);
    });

});

// ── /api/github/repos ─────────────────────────────────────

describe("GET /api/github/repos", () => {

    test("returns GitHub repositories", async () => {

        const req =
            makeRequest(
                "/api/github/repos"
            );

        const res =
            await worker.default.fetch(
                req,
                mockEnv
            );

        const data =
            await res.json();

        expect(res.status).toBe(200);

        expect(data.success)
            .toBe(true);

        expect(
            Array.isArray(data.repos)
        ).toBe(true);
    });

});

// Note to Abubakar: this is already fixed above