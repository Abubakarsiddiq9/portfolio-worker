const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' https://challenges.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "connect-src 'self' https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ].join("; ")
};

export function secureResponse(body, init = {}) {

    const headers = new Headers(init.headers || {});

    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        headers.set(key, value);
    }

    return new Response(body, {
        ...init,
        headers
    });
}

export function secureJson(data, init = {}) {

    const headers = new Headers(init.headers || {});
    headers.set("Content-Type", "application/json");

    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        headers.set(key, value);
    }

    return new Response(
        JSON.stringify(data),
        {
            ...init,
            headers
        }
    );
}