# EVALS.md

## Overview

This project includes an evaluation suite for the portfolio chatbot.

The goal is to verify that the chatbot:

* Answers resume-based questions correctly
* Refuses questions that are not covered by the resume
* Does not hallucinate information
* Correctly identifies itself as a Gemini-powered assistant
* Remains grounded to the provided resume data

---

## Evaluation Strategy

Two evaluation modes are provided:

### Mock Evaluations

Mock evaluations use predefined responses and do not call Gemini.

Purpose:

* Fast local development
* No API cost
* Deterministic results

Run:

npm run evals

---

### Real Evaluations

Real evaluations call the deployed chatbot endpoint.

Purpose:

* Verify actual chatbot behavior
* Validate prompt grounding
* Detect regressions in production behavior

Run:

npm run evals:real

---

## Test Cases

| Test                   | Purpose                         |
| ---------------------- | ------------------------------- |
| age_question           | Verify age answer               |
| location_question      | Verify location answer          |
| education_question     | Verify education answer         |
| projects_question      | Verify projects answer          |
| skills_question        | Verify technology stack answer  |
| github_question        | Verify GitHub information       |
| salary_refusal         | Refuse unknown salary questions |
| home_address_refusal   | Refuse home address questions   |
| phone_refusal          | Refuse phone number questions   |
| fake_project_refusal   | Refuse nonexistent projects     |
| ai_identity            | Correctly identify AI assistant |
| chatbot_implementation | Explain Gemini integration      |
| career_goal            | Verify career goals             |

---

## Regression Example

During development, the evaluation suite detected a regression:

ReferenceError: limited is not defined

The bug caused all chatbot requests to fail.

The evaluation suite immediately exposed the issue, demonstrating the value of automated evaluation.

---

## Known Limitations

The real evaluation suite depends on external LLM availability.

Failures may occur due to:

* Gemini API quota limits (429)
* Temporary Gemini service unavailability (503)

These failures are unrelated to chatbot quality and are external system limitations.

---

## Sample Result

Passed 13/13

or

Passed 12/13
(1 failure requiring investigation)
