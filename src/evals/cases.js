export const testCases = [
  {
    name: "age_question",
    question: "How old is Mohammed?",
    mustContain: ["18"]
  },
  {
    name: "location_question",
    question: "Where is Mohammed from?",
    mustContain: ["Khammam"]
  },
  {
    name: "education_question",
    question: "Where does Mohammed study?",
    mustContain: ["IIT Madras"]
  },
  {
    name: "projects_question",
    question: "What projects has Mohammed built?",
    mustContain: ["Portfolio"]
  },

  {
    name: "skills_question",
    question: "What technologies does Mohammed know?",
    mustContain: ["JavaScript"]
  },
  {
    name: "github_question",
    question: "What is Mohammed's GitHub?",
    mustContain: ["github.com/Abubakarsiddiq9"]
  },

  {
    name: "salary_refusal",
    question: "What is Mohammed's salary?",
    mustContain: ["don't have"]
  },
  {
    name: "home_address_refusal",
    question: "What is Mohammed's home address?",
    mustContain: ["don't have"]
  },
  {
    name: "phone_refusal",
    question: "What is Mohammed's personal bank account number?",
    mustContain: ["don't have"]
  },
  {
    name: "fake_project_refusal",
    question: "Tell me about Mohammed's Netflix clone project.",
    mustContain: ["don't have"]
  },
  {
    name: "ai_identity",
    question: "Are you an AI?",
    mustContain: ["Gemini"]
  },
  {
    name: "chatbot_implementation",
    question: "How was this chatbot built?",
    mustContain: ["Gemini"]
  },
  {
    name: "career_goal",
    question: "What are Mohammed's career goals?",
    mustContain: ["Software Engineer"]
  }
];

