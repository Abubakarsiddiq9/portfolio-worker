# Architecture Overview

This document explains the purpose of each major file and how requests flow through the application.

---

## Project Structure

### src/index.js

Main Cloudflare Worker entry point.

Responsibilities:

* Handles all API routes
* Validates requests
* Performs authentication checks
* Enforces rate limiting
* Calls external services
* Returns JSON responses

Examples:

* GET /api/posts
* GET /api/posts/{slug}
* GET /api/github/repos
* POST /api/contact
* POST /api/chat

---

### src/data/posts.js

Blog data source.

Responsibilities:

* Stores blog metadata
* Stores blog content
* Provides data for blog API endpoints

Used by:

* GET /api/posts
* GET /api/posts/{slug}

---

### src/github.js

GitHub integration layer.

Responsibilities:

* Calls GitHub REST API
* Transforms repository data
* Returns simplified repository objects

Used by:

* GET /api/github/repos

---

### public/Blogpg/blogs.js

Blog listing page logic.

Responsibilities:

* Fetches blog data from the API
* Generates blog cards dynamically
* Renders blog previews

Uses:

* GET /api/posts

---

### public/Blogpg/blogpg.html

Blog listing page.

Responsibilities:

* Displays all blog cards
* Loads blogs.js

---

### public/Blogpg/allblogs/blog.js

Single blog page logic.

Responsibilities:

* Reads slug from URL
* Fetches blog content from API
* Renders selected blog

Uses:

* GET /api/posts/{slug}

---

### public/Blogpg/allblogs/blog.html

Single blog template.

Responsibilities:

* Provides container for blog content
* Loads blog.js

---

### public/Projects_/projectspg.html

Projects page.

Responsibilities:

* Displays featured projects
* Displays GitHub repository modal

Uses:

* GET /api/github/repos

---

### public/prscript.js

Shared frontend functionality.

Responsibilities:

* Theme toggle\
* Chatbot UI
* Streaming AI rendering
* Session history persistence\
* Admin login modal
* Authentication state handling
* Shared UI behavior

---

### openapi.yaml

API contract documentation.

Responsibilities:

* Documents endpoints
* Defines request and response formats
* Describes authentication requirements

---

### HLD.md

High-Level Design document.

Responsibilities:

* Describes system components
* Explains component interactions

---

### SEQUENCE.md

Sequence diagram documentation.

Responsibilities:

* Explains request flow
* Documents success and failure paths

---

## Request Flow Example

### Loading a Blog

1. User opens blog page.
2. blog.js extracts the slug from the URL.
3. blog.js requests:

GET /api/posts/{slug}

4. Cloudflare Worker receives the request.
5. Worker reads blog data from posts.js.
6. Worker returns JSON.
7. blog.js renders the blog content.

---

### Loading GitHub Repositories

1. User opens Projects page.
2. Frontend requests:

GET /api/github/repos

3. Worker receives request.
4. Worker calls GitHub REST API.
5. Worker transforms repository data.
6. Worker returns JSON.
7. Frontend renders repository cards.

If GitHub is unavailable:

1. GitHub request fails.
2. Worker returns 502.
3. Frontend displays a fallback message.

### src/chatbot.js

Handles AI communication.

Responsibilities:

- Builds Gemini requests
- Streams Gemini responses using Server-Sent Events
- Injects the portfolio system prompt
- Returns streaming responses to the Worker

Used by:

- POST /api/chat-stream

### src/rateLimiter.js

Worker-side rate limiting layer.

Responsibilities:

- Extracts client IP
- Locates the correct Durable Object
- Sends rate-limit requests
- Blocks requests exceeding configured limits

Used by:

- POST /api/chat-stream
- POST /api/admin/login

### src/rateLimiterDO.js

Durable Object implementation.

Responsibilities:

- Stores request counters
- Maintains one counter per client
- Automatically clears counters when the window expires
- Provides strongly consistent request counting

### Streaming Chatbot Request Flow

1. User sends a message.

2. Frontend sends the conversation history to:

POST /api/chat-stream

3. Worker validates the request body.

4. Worker checks the client's rate limit using the Durable Object.

5. The latest user message is inspected by the guardrails.

6. If the message is a prompt injection attempt, a safe response is returned immediately.

7. Otherwise, the Worker sends the request to Gemini.

8. Gemini streams its response.

9. The Worker forwards each chunk to the browser using Server-Sent Events (SSE).

10. The frontend renders the response progressively and stores the conversation in sessionStorage.

### src/guardrails.js

Worker-side AI safety checks.

Responsibilities:

- Detects prompt injection attempts
- Blocks system prompt extraction requests
- Blocks instruction override attacks
- Returns a safe response before Gemini is called

Used by:

- src/chatbot.js

### src/validation.js

Server-side validation for the contact form.

Responsibilities:

- Validates required fields
- Validates email format
- Trims user input
- Rejects invalid requests before processing

Used by:

- POST /api/contact

### src/turnstile.js

Cloudflare Turnstile verification.

Responsibilities:

- Verifies Turnstile tokens with Cloudflare
- Rejects automated submissions
- Returns verification status to the Worker

Used by:

- POST /api/contact

### src/securityHeaders.js

Applies security headers to Worker responses.

Responsibilities:

- Adds Content-Security-Policy (CSP)
- Prevents clickjacking
- Prevents MIME sniffing
- Sets Referrer Policy
- Sets Permissions Policy

Used by:

- All API responses

### Contact Form Request Flow

1. User fills out the contact form.

2. Cloudflare Turnstile generates a verification token.

3. Frontend submits the form and Turnstile token to POST /api/contact.

4. Worker checks the client's rate limit.

5. Worker verifies the Turnstile token with Cloudflare.

6. Worker validates all submitted fields.

7. If validation succeeds, the email is sent using Resend.

8. The message is stored in the D1 database.

9. A success response is returned to the browser.