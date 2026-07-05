const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff", //Stops browsers guessing file types.without it image.jpg could actually execute as js
    "X-Frame-Options": "DENY", //Protects against Clickjacking. ex: Click Free iPhone [but your 'post delelte' button in <iframe>]
    "Referrer-Policy": "strict-origin-when-cross-origin", //Stops leaking full URLs.
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",//Disables browser features.
    "Strict-Transport-Security":
    "max-age=31536000; includeSubDomains", //Browser refuses HTTP forever.
    // Content Security Policy reduces the impact of XSS by allowing the
    // browser to load resources only from trusted origins.
    "Content-Security-Policy": [ //CSP tells browser which resources are allowed.Instead of protecting one thing, it controls almost everything the browser loads.1 header many proctions
        "default-src 'self'", //Everything must come from your domain.
        "script-src 'self' https://challenges.cloudflare.com", //only self turnstile norandom scripts like <script src='evil.com/hack.js'>
        "style-src 'self' 'unsafe-inline'", //Allows my CSS.
        "img-src 'self' data:",//allows my imgs and data: for base64 icons
        "connect-src 'self' https://challenges.cloudflare.com",//only sends js to my worker&turnstile sot js sending data to evil.com
        "frame-src https://challenges.cloudflare.com",//Allows only Turnstile iframe.
        "object-src 'none'",//Disables Flash and old plugins.
        "base-uri 'self'",//Stops attackers changing <base> and breaking links
        "form-action 'self'", //Forms only submit to my Worker.can't submit to evil.com
        "frame-ancestors 'none'" //Extra clickjacking protection.now other can't add <iframe src="https://abubakarportf.com"></iframe>
        // why both? Modern browsers use csp:frame-ancecstor & old browsers know: x-frame-opt
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