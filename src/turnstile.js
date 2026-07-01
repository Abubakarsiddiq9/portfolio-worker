export async function verifyTurnstile(
    token,
    request,
    env
) {
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