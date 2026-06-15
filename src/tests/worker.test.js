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

// ── Mock fetch (Gemini API call) ──────────────────────────────
global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
        candidates: [{
            content: {
                parts: [{ text: "I am Abubakar's portfolio assistant." }]
            }
        }]
    })
});

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
// Note to Abubakar: this is already fixed above