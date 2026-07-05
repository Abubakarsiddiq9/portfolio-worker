import { testCases } from "./cases.js";
import { CHAT_URL } from "./config.js";

let passed = 0;

for (const test of testCases) {
    try {
        const response = await fetch(CHAT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                history: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: test.question
                            }
                        ]
                    }
                ]
            })
        });
        if (!response.ok) {

            let error = "";
        
            try {
                error = await response.text();
            } catch {}
        
            if (
                response.status === 429 &&
                error.includes("GEMINI_QUOTA_EXCEEDED")
            ) {
            
                console.log("");
                console.log("❌ Gemini API quota exceeded.");
                console.log("Please run the real evals again after your quota resets.");
            
                process.exit(0);
            }
            if (
                response.status === 429 &&
                error.includes("Too many requests")
            ) {
                console.log("");
                console.log("❌ Chat API rate limit reached.");
                console.log("Disable the chat rate limiter or wait before running evals.");
            
                process.exit(0);
            }
            if (
                response.status === 503 &&
                error.includes("GEMINI_UNAVAILABLE")
            ) {
            
                console.log("");
                console.log("❌ Gemini service is temporarily unavailable.");
                console.log("Please try again later.");
            
                process.exit(0);
            }
        
            throw new Error(
                `HTTP ${response.status}\n${error}`
            );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let reply = "";

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);

            const lines = chunk.split("\n");

            for (const line of lines) {

                if (!line.startsWith("data:")) continue;

                try {

                    const json = JSON.parse(
                        line.replace("data:", "").trim()
                    );

                    const text =
                        json?.candidates?.[0]
                            ?.content?.parts?.[0]
                            ?.text;

                    if (text) {
                        reply += text;
                    }

                } catch {
                    // ignore malformed chunks
                }
            }
        }

        const success = test.mustContain.every(
            (text) =>
                reply
                    .toLowerCase()
                    .includes(text.toLowerCase())
        );

        if (success) {
            console.log(`PASS  ${test.name}`);
            passed++;
        } else {
            console.log(`FAIL  ${test.name}`);
            console.log(`Expected: ${test.mustContain.join(", ")}`);
            console.log(`Reply: ${reply}`);
        }
    } catch (err) {
        console.log(`ERROR ${test.name}`);
        console.log(err.message);
    }
}

console.log("");
console.log(
    `Passed ${passed}/${testCases.length}`
);