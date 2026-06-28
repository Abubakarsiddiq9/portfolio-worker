import { testCases } from "./cases.js";
import { mockReplies } from "./mockReplies.js";

// Is my evaluation framework working? & to verify testCases are written correctly

let passed = 0;

for (const test of testCases) {
  const reply = mockReplies[test.question] || "";

  const success = test.mustContain.every((text) =>  //.every() check should contain all what written in mustcontian[...] even if one is missed throws err
    reply.toLowerCase().includes(text.toLowerCase())
  );

  if (success) {
    console.log(`PASS  ${test.name}`);
    passed++;
  } else {
    console.log(`FAIL  ${test.name}`);
    console.log(`Reply: ${reply}`);
  }
}

console.log("");
console.log(`Passed ${passed}/${testCases.length}`);