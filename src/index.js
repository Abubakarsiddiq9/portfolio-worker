import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { posts } from "./data/posts";
import { enforceRateLimit } from "./rateLimiter.js";
import { getGithubRepos } from "./github.js";
import {  generateReplyStream } from "./chatbot.js";
import { verifyTurnstile } from "./turnstile.js";
import { validateContact } from "./validation.js";








function verifyAdmin(request, jwtSecret) {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const token = cookieHeader
    .split("; ")
    .find(cookie => cookie.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

// THis Is BackenddD

const worker = {
    
  async fetch(request, env) {
    const url = new URL(request.url);

    // Test route
    if (url.pathname === "/api/test") {
      return Response.json({
        success: true,
        message: "Worker API is working"
      });
    }

    // Contact route
    if (
        url.pathname === "/api/contact" &&
        request.method === "POST"
        ) {
        try {
            const limited =
                await enforceRateLimit(
                    request,
                    env,
                    "contact",
                    5,
                    3600
                );

            if (limited) return limited;
            
            const body = await request.json();

            const { turnstileToken } = body;

            const verified =
                await verifyTurnstile(
                    turnstileToken,
                    request,
                    env
                );

            if (!verified) {

                return Response.json(
                    {
                        success: false,
                        message:
                            "Turnstile verification failed."
                    },
                    {
                        status: 403
                    }
                );
            }

            const validation =
                validateContact(body);

            if (!validation.valid) {
                return Response.json(
                    {
                        success: false,
                        message: validation.message
                    },
                    { status: 400 }
                );
            }

            const {
                name,
                email,
                message
            } = validation.data; //These are the trimmed, validated values.So Resend and D1 will receive clean input.

            const resend = new Resend(env.RESEND_API_KEY);

            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: env.EMAIL,
                subject: `Portfolio Contact from ${name}`,
                text: `Name: ${name}
                Email: ${email}
                Message: ${message}`
            });
            await env.portfolio_db
                .prepare(`
                    INSERT INTO contacts (name, email, message)
                    VALUES (?, ?, ?)
                `)
                .bind(name, email, message)  //This protects against SQL Injection. as ! USING `INSERT INTO contacts VALUES ('${name}')`
                .run();

            return Response.json({
            success: true
            });

        } catch (err) {
            return Response.json(
            {
                success: false,
                message: err.message
            },
            { status: 500 }
            );
        }
        }
        // /login route comes here
        //  Creates JWT cookie
    if (
        url.pathname === "/api/admin/login" &&
        request.method === "POST"
        ) {
        try {

            const limited =
                await enforceRateLimit(
                    request,
                    env,
                    "login",
                    5,
                    960
                );

            if (limited) return limited;

            const { password } = await request.json();

            if (password !== env.ADMIN_PASSWORD) {
            return Response.json(
                {
                success: false,
                message: "Invalid password"
                },
                { status: 401 }
            );
            }
            

            const token = jwt.sign(
            { role: "admin" },
            env.JWT_SECRET,
            { expiresIn: "7d" }
            );

            return Response.json(
            {
                success: true
            },
            {
                headers: {
                "Set-Cookie":
                    `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`
                }
            }
            );
        } catch (err) {
            return Response.json(
            {
                success: false,
                message: err.message
            },
            { status: 500 }
            );
        }
        }

        // Logout Route

    if (
        url.pathname === "/api/admin/logout" &&
        request.method === "POST"
    ) {

        const limited =
            await enforceRateLimit(
                request,
                env,
                "logout",
                20,
                3600
            );

        if (limited) return limited;
        return Response.json(
            {
                success: true
            },
            {
                headers: {
                    "Set-Cookie":
                        "token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
                }
            }
        );
    }

    // Check Route
    if (
        url.pathname === "/api/admin/check" &&
        request.method === "GET"
    ) {
        const limited =
            await enforceRateLimit(
                request,
                env,
                "admin-check",
                60,
                60
            );

        if (limited) return limited;
        const admin = verifyAdmin(
            request,
            env.JWT_SECRET
        );

        return Response.json({
            loggedIn: !!admin
        });
    }


    // message route
    if (
        url.pathname === "/api/admin/messages" &&
        request.method === "GET"
        ) {
        try {
            const limited =
                await enforceRateLimit(
                    request,
                    env,
                    "messages",
                    60,
                    60
                );

            if (limited) return limited;
            const admin = verifyAdmin(
            request,
            env.JWT_SECRET
            );

            if (!admin) {
            return Response.json(
                {
                success: false,
                message: "Unauthorized"
                },
                { status: 401 }
            );
            }

            const result = await env.portfolio_db
            .prepare(`
                SELECT *
                FROM contacts
                ORDER BY submitted_at DESC
            `)
            .all();

            return Response.json({
            success: true,
            messages: result.results
            });

        } catch (err) {
            return Response.json(
            {
                success: false,
                message: err.message
            },
            { status: 500 }
            );
        }
        }

    // delete message route
    if (
        url.pathname.startsWith("/api/admin/messages/") &&
        request.method === "DELETE"
    ) {
        try {
            const limited =
                await enforceRateLimit(
                    request,
                    env,
                    "delete-message",
                    30,
                    60
                );

            if (limited) return limited;

            const admin = verifyAdmin(
                request,
                env.JWT_SECRET
            );

            if (!admin) {
                return Response.json(
                    {
                        success: false,
                        message: "Unauthorized"
                    },
                    { status: 401 }
                );
            }

            const id =
                url.pathname.split("/").pop();

            await env.portfolio_db
                .prepare(`
                    DELETE FROM contacts
                    WHERE id = ?
                `)
                .bind(id)
                .run();

            return Response.json({
                success: true
            });

        } catch (err) {
            return Response.json(
                {
                    success: false,
                    message: err.message
                },
                { status: 500 }
            );
        }
    }

        if (
            url.pathname === "/api/chat-stream"  &&
            request.method === "POST"
        ){
            const limited =
            await enforceRateLimit(
                request,
                env,
                "chat",
                20,
                3600
            );

            if (limited) return limited;
            const { history } = await request.json();
            if (
                !history ||
                !Array.isArray(history) ||
                history.length === 0
                ) {
                return Response.json(
                    {
                    success: false,
                    message: "Invalid request body."
                    },
                    { status: 400 }
                );
                }
            const response =
                await generateReplyStream(
                    history,
                    env
                );
            

            if (!response.ok) {
                const errorText =
                    await response.text();

                return Response.json(
                    {
                        success: false,
                        message: errorText
                    },
                    {
                        status: response.status
                    }
                );
            }

            return new Response(
                response.body,
                {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache"
                    }
                }
            );
        }
        
    
        // Get all posts

        if (
        url.pathname === "/api/posts" &&
        request.method === "GET"
        ) {
        return Response.json(posts);
        }
        
        // Get one post GET /api/posts/:slug slug is replaced with a var (stored in data/posts.js)
        if (
            url.pathname.startsWith("/api/posts/") &&
            request.method === "GET"
        ) {
            const slug =
                url.pathname.split("/").pop();

            const post =
                posts.find(
                    p => p.slug === slug
                );

            if (!post) {
                return Response.json(
                    {
                        success: false,
                        message: "Post not found"
                    },
                    {
                        status: 404
                    }
                );
            }

            return Response.json(post);
        }

    if (url.pathname === "/api/github/repos" && request.method === "GET") {
        
        // Check cache first
        const cache = caches.default;
        const cacheKey = new Request("https://cache.local/github-repos");
        const cached = await cache.match(cacheKey);
        
        if (cached) {
            return cached; // return cached response instantly
        }

        try {
            const repos = await getGithubRepos();
            const response = Response.json({ success: true, repos });

            // Store in cache for 5 minutes
            const cacheResponse = Response.json(
                { success: true, repos },
                { headers: { "Cache-Control": "public, max-age=300" } }
            );
            await cache.put(cacheKey, cacheResponse);

            return Response.json({ success: true, repos });

        } catch (err) {
            return Response.json(
                { success: false, error: err.message },
                { status: 502 }
            );
        }
    }

        return new Response("Not Found", {
            status: 404
        });
  }
};
export { RateLimiterDO } from "./RateLimiterDO.js";
export default worker;
// Allows Jest (CommonJS) to import this file
if (typeof module !== "undefined") module.exports = { default: worker };
// The cleaner long-term solution would be to migrate the Jest tests to native ES Modules and remove the compatibility export, but that requires updating the Jest configuration as well. Since the current implementation is functional and all tests pass, I kept the compatibility layer for now.
// export default → ES Module syntax.
// module.exports → CommonJS syntax.
// Having both in the same file causes Wrangler to warn that CommonJS is being used inside an ES Module.
// It's a warning, not an error. The Worker still builds and runs correctly.