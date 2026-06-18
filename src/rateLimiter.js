export async function checkRateLimit(
  env,
  key,
  limit,
  windowSeconds
) {
  const record = await env.RATE_LIMITS.get(key);

  let count = 0;

  if (record) {
    count = Number(record);
  }

  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0
    };
  }

  count++;

  await env.RATE_LIMITS.put(
    key,
    String(count),
    {
      expirationTtl: windowSeconds //Fixed Window Because the counter exists for a fixed period, System DON'T remembers timestamps!! like Request 1 at 2:01,Request 2 at 2:15

    }
  );

  return {
    allowed: true,
    remaining: limit - count
  };
}
export async function enforceRateLimit(
  request,
  env,
  route,
  limit,
  windowSeconds
) {
  const ip =
    request.headers.get("CF-Connecting-IP")
    || "unknown";

  const key = `${route}:${ip}`; //chat:192.168.1.1 = 19

  const result =
    await checkRateLimit(
      env,
      key,
      limit,
      windowSeconds
    );

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