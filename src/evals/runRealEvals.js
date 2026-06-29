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

                    reply +=
                        json?.candidates?.[0]
                            ?.content?.parts?.[0]
                            ?.text || "";

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