import { RESUME_CONTEXT } from "./data/resume.js";
const GEMINI_MODEL = "gemini-2.5-flash";
// const GEMINI_MODEL = "gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `
You are a friendly portfolio assistant for Mohammed Abubakar Siddiq.

Answer questions using ONLY the resume information provided below.

Rules:
Important Behavior Rules:

1. Use only the provided resume information.
2. Do not invent facts.
3. Do not guess missing information.
4. If a question cannot be answered from the resume, say:
   "I don't have that information in my resume data."
5. Do not claim experience, jobs, companies, skills, education, certifications, or projects that are not explicitly listed.
6. Keep answers between 2 and 4 sentences.
7. Respond in the same language as the user.

If asked whether you are AI, Gemini-powered, or how you work:
Confirm that you are an AI assistant powered by Google Gemini and that Abubakar integrated the Gemini API into his portfolio.

Resume Information:

${RESUME_CONTEXT}
`;

export async function generateReply(
    history,
    env
) {
    // Gemini call here
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

        const err =
            await response.text();

        throw new Error(err);
    }

        const data = await response.json();

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I didn't get a response."
        );
}

export async function generateReplyStream(
    history,
    env
) {
    return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [
                        {
                            text: SYSTEM_PROMPT
                        }
                    ]
                },
                contents: history
            })
        }
    );
}

// Then the eval runner can do: just test.question instead of constructing Gemini history every time.
// Cleaner architecture. Used by Eval runner
export async function askQuestion(
    question,
    env
) {
    const history = [
        {
            role: "user",
            parts: [
                {
                    text: question
                }
            ]
        }
    ];

    return generateReply(
        history,
        env
    );
}