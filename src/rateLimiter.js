export async function enforceRateLimit(
    request,
    env,
    route,
    limit,
    windowSeconds
) {
    const ip =
        request.headers.get("CF-Connecting-IP") || 
        "unknown"; 

    const id =
        env.RATE_LIMITER.idFromName( 
            `${route}:${ip}`
        ); //That creates (or finds) the Durable Object for that IP.

    const stub =
        env.RATE_LIMITER.get(id); //gives us a connection to it(that got id).

    const response = await stub.fetch(
        "https://ratelimiter/check",
        {
            method: "POST",
            body: JSON.stringify({
                limit,
                windowSeconds
            })
        }
    );

    const result =
        await response.json();

    if (!result.allowed) {

        return new Response(
            JSON.stringify({
                success: false,
                error: "Too many requests"
            }),
            {
                status: 429,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    }

    return null;
}