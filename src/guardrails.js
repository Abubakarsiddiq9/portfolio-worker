// Messages shown to the user when an input or output is blocked.
const INPUT_BLOCK_MESSAGE =
    "I'm only able to answer questions about Abubakar's portfolio, projects, skills, and experience.";

const OUTPUT_BLOCK_MESSAGE =
    "I couldn't generate a safe response for that request.";

// Common prompt-injection and jailbreak phrases.
// These patterns target common prompt injection techniques that attempt
// to reveal hidden instructions or override the assistant's behavior.
const BLOCKED_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions?/i,
    /system\s+prompt/i,
    /reveal\s+.*prompt/i,
    /show\s+.*prompt/i,
    /developer\s+message/i,
    /pretend\s+to\s+be/i,
    /act\s+as/i,
    /jailbreak/i,
    /bypass/i,
    /override/i,
    /forget\s+(your|all)\s+instructions?/i,
    /roleplay/i
];


export function checkInput(text) {

    if (!text || typeof text !== "string") {
        return {
            allowed: false,
            message: INPUT_BLOCK_MESSAGE
        };
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
        return {
            allowed: false,
            message: INPUT_BLOCK_MESSAGE
        };
    }

    for (const pattern of BLOCKED_PATTERNS) {

        if (pattern.test(trimmed)) {

            return {
                allowed: false,
                message: INPUT_BLOCK_MESSAGE
            };
        }
    }

    const lower = trimmed.toLowerCase();

    return {
        allowed: true
    };
}

export function checkOutput(text) {

    if (!text) {
        return OUTPUT_BLOCK_MESSAGE;
    }

    // Prevent accidental system prompt leakage.
    if (
        /system\s+prompt/i.test(text) ||
        /developer\s+message/i.test(text)
    ) {
        return OUTPUT_BLOCK_MESSAGE;
    }

    return text;
}