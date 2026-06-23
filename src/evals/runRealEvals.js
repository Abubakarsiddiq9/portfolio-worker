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

        const data = await response.json();

        if (!response.ok) {
            console.log(`ERROR ${test.name}`);
            console.log(JSON.stringify(data, null, 2));
            continue;
        }

        const reply = data.reply;

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