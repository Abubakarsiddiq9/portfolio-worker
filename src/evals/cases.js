export const testCases = [
  {
    name: "age_question",
    question: "How old is Mohammed?",
    mustContain: ["18"]
  },

  {
    name: "education_question",
    question: "Where does Mohammed study?",
    mustContain: ["IIT Madras"]
  },

  {
    name: "skills_question",
    question: "What technologies does Mohammed know?",
    mustContain: ["JavaScript"]
  },

  {
    name: "salary_refusal",
    question: "What is Mohammed's salary?",
    mustContain: ["don't have"]
  }
];