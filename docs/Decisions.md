# Decisions

## My Work

I was primarily responsible for:

* Project planning and documentation
* Website design using Figma
* Setting up the Git repository
* Managing version control with Git and GitHub
* Creating commits and pushing code using WSL and VS Code Terminal
* Developing the Home page
* Developing the Projects page
* Developing the Contact page
* Building the portfolio chatbot
* Setting up the backend architecture
* Integrating Resend for email delivery
* Configuring deployment on Render and Cloudflare Pages
* Setting up CI/CD using GitHub Actions
* Writing and maintaining project documentation

## AI Assistance

AI was used as a development assistant for:

* Generating ideas and implementation guidance
* Assisting with the Journey page development
* Improving responsive design across devices
* Assisting with theme toggle implementation
* Assisting with contact form integration
* Assisting with backend email functionality
* Assisting with automated testing using Jest and Supertest
* Providing guidance during deployment and CI/CD setup
* Reviewing code and helping debug issues
* Guidance for JWT authentication
* Guidance for Cloudflare D1 integration
* Cloudflare Durable Objects implementation
* Assistance with admin dashboard implementation
* Assistance with guestbook UI responsiveness
* Assistance with protected route implementation

## External API Failure Strategy

GitHub repositories are fetched through the Cloudflare Worker.

If GitHub returns an error or is unavailable:

- Worker returns HTTP 502
- Frontend displays a fallback message
- Portfolio page continues functioning

This prevents the Projects page from crashing when GitHub is unavailable.

## Caching Strategy

GitHub repository data is cached using the Cloudflare Cache API for 5 minutes.

This means:
- First request → fetches from GitHub API, stores in cache
- Next requests within 5 minutes → served from cache instantly
- After 5 minutes → cache expires, fresh fetch from GitHub

Why 5 minutes: GitHub repos don't change frequently.
A short TTL keeps data reasonably fresh without hitting GitHub rate limits.

## Streaming Chatbot

The chatbot originally used a traditional request–response model where the complete AI response was returned before being displayed.

It was redesigned to use Server-Sent Events (SSE), allowing Gemini responses to stream incrementally through the Cloudflare Worker.

The frontend renders incoming words progressively, creating a typewriter-style experience similar to ChatGPT.

Benefits:

- Lower perceived latency
- Immediate feedback for users
- Improved conversational experience
- Reduced waiting time for long responses

## Rate Limiting

The original implementation used Cloudflare KV to count requests.

This was later replaced with Cloudflare Durable Objects.

Reasons:

- Strong consistency
- No race conditions
- Better suited for counters
- One Durable Object instance per client IP
- Automatic expiration using Durable Object alarms

## Chatbot Evaluations

The chatbot includes automated evaluation tests.

Two evaluation modes are maintained:

- Mock evaluations for CI, using predefined responses without calling Gemini.
- Real evaluations against the deployed Worker using the live Gemini API.

This allows regressions to be detected before deployment while avoiding unnecessary API usage during automated workflows.