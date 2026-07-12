export async function verifyTurnstile(
    token,
    request, //request is the HTTP request sent by the browser. it contains like -> url,method(get/post etc),headers,body,cookies
    env
) {
    if (env.BYPASS_TURNSTILE === "true") {
        return true;
    }
    if (!token) {
        return false;
    }

    const ip =
        request.headers.get(
            "CF-Connecting-IP"
        );

    const formData = new FormData();

    formData.append(
        "secret",
        env.TURNSTILE_SECRET
    );

    formData.append(
        "response",
        token
    );

    if (ip) {
        formData.append(
            "remoteip",
            ip
        );
    }

    // Turnstile tokens are verified with Cloudflare because the Worker cannot
    // trust tokens received directly from the browser.
    const response =
        await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body: formData
            }
        );

    const result =
        await response.json();

    return result.success === true;
}