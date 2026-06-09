import { Resend } from "resend";
const GEMINI_MODEL = "gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `You are a friendly portfolio assistant for Mohammed Abubakar Siddiq.
Answer questions about him based ONLY on the facts below. Keep answers concise (2-4 sentences max).
If something is not covered below, say you don't have that info yet and suggest visiting the relevant page.
Never make up facts. Respond in the same language the user writes in.
If asked whether you are AI, Gemini-powered, or how you work: confirm you are an AI assistant powered by Google Gemini, and that Abubakar built this chatbot by integrating the Gemini API into his portfolio — which itself is a demonstration of his web development skills.

FACTS ABOUT ABUBAKAR:
- Full name: Mohammed Abubakar Siddiq
- Age: 18 years old
- Location: Khammam, Telangana, India
- Currently pursuing BS in Data Science at IIT Madras 
- Schooling: 10th at Oxford School Khammam (GPA 9.2/10), Intermediate at Sri Chaitanya Junior College (92.3%)
- Started coding at age 13 during COVID-19 lockdown, first program was "Hello World" in C
- Skills / Tech stack: HTML, CSS, JavaScript, Python, Node.js, Express.js, PostgreSQL, Git, GitHub, Figma, VS Code
- Projects: portfolio website, calculator, clock app, todo app, Islamic learning platform
- Email: abubakarsiddiqmohiuddin@gmail.com
- WhatsApp: +91 8121104202
- GitHub: github.com/Abubakarsiddiq9
- Goals: Become a skilled Software Engineer, build innovative scalable software, interested in intersection of data science and web development
- Portfolio pages: Home, Projects, Journey, Blogs, Contact`;

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
            const { name, email, message } = await request.json();

            if (!name || !email || !message) {
            return Response.json(
                {
                success: false,
                message: "All fields are required"
                },
                { status: 400 }
            );
            }
            console.log("Has RESEND key:", !!env.RESEND_API_KEY);
            console.log("Has EMAIL:", !!env.EMAIL);
            const resend = new Resend(env.RESEND_API_KEY);

            await resend.emails.send({
            from: "onboarding@resend.dev",
            to: env.EMAIL,
            subject: `Portfolio Contact from ${name}`,
            text: `Name: ${name}
        Email: ${email}

        Message:
        ${message}`
            });
            await env.portfolio_db
                .prepare(`
                    INSERT INTO contacts (name, email, message)
                    VALUES (?, ?, ?)
                `)
                .bind(name, email, message) 
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
    url.pathname === "/api/chat" &&
    request.method === "POST"
    ) {
    try {
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

        const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: history
                })
            }
            );

            if (!response.ok) {
            return Response.json(
                {
                success: false,
                message: "AI service error."
                },
                { status: 502 }
            );
            }

            const data = await response.json();

            const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I didn't get a response.";

            return Response.json({
            success: true,
            reply
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
        return new Response("Not Found", {
            status: 404
        });
  }
};
export default worker;
// Allows Jest (CommonJS) to import this file
if (typeof module !== "undefined") module.exports = { default: worker };