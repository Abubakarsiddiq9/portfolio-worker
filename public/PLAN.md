# Portfolio Website Plan

## Research

Before starting, I reviewed several developer portfolio repositories to understand common portfolio structures, layouts, and features.

Reference:

* https://github.com/emmabostian/developer-portfolios

---

## Stack Choice

### Frontend

* HTML
* CSS
* JavaScript

I chose this stack because it is sufficient for building a responsive and interactive portfolio website. I have previously built projects using these technologies and am comfortable working with them.

### Backend

* Cloudflare Workers (handles both static file serving and API routes)

I migrated from a Node.js + Express backend on Render to a Cloudflare Worker. This allows the static site and all dynamic API routes to be served from a single project on Cloudflare's edge network.

### Email Service

* Resend

---

## Planned Pages

### Home / About

A brief introduction about me, my background, and my skills.

### Projects

A showcase of my projects and work.

### Journey

A timeline describing my learning journey and milestones.

### Blog

A collection of articles and blogs written by me.

### Contact Me

A contact form that allows visitors to send messages directly to me.

---

## Features

* Responsive design for desktop and mobile devices
* Interactive AI-powered portfolio chatbot
* Project showcase section
* Journey timeline
* Blog page
* Contact form with backend integration
* Automated testing
* CI/CD pipeline

---

## Features Excluded

To keep the project focused and lightweight, the following features were intentionally excluded:

* Authentication / Login System
* Complex animations
* 3D effects and designs
* Large frontend frameworks such as React
* Static site generator (plain HTML used instead)

---

## Risks / Unknowns

At the start of the project, the following areas were unfamiliar:

* Deploying applications using Cloudflare Workers
* Backend contact form integration
* Email service integration
* CI/CD setup using GitHub Actions
* Gemini API integration

---

## Architecture

### Static Site

Plain HTML, CSS, and JavaScript files served from the `public/` directory via Cloudflare Workers assets.

No static site generator was used. Plain HTML was chosen to keep the project simple and focused on core web fundamentals.

### API Routes

All dynamic routes are handled by a single Cloudflare Worker (`src/index.js`):

* `/api/test` — health check endpoint
* `/api/contact` — contact form, sends email via Resend
* `/api/chat` — AI chatbot, calls Google Gemini API

### Secrets

All sensitive keys are stored as Cloudflare Worker secrets:

* `RESEND_API_KEY`
* `EMAIL`
* `GEMINI_API_KEY`

---

## Contact Form Architecture

The contact form is powered by a Cloudflare Worker.

Workflow:

1. User fills out the contact form.
2. The frontend sends a POST request to `/api/contact`.
3. The Worker validates the submitted data.
4. Resend sends the email securely to my inbox.
5. The Worker returns a JSON response indicating success or failure.

---

## Chatbot Architecture

The chatbot is powered by the Google Gemini API (`gemini-2.5-flash-lite`).

Workflow:

1. User types a message in the chatbot UI.
2. The frontend sends the conversation history to `/api/chat`.
3. The Worker calls the Gemini API with a system prompt containing my details.
4. Gemini generates a response and the Worker returns it to the frontend.

Rate limiting: 20 messages per user per hour (enforced server-side via Cloudflare Worker).

Fallback mode: If the AI is unavailable or the limit is reached, the frontend switches to keyword-based predefined responses automatically.

Message persistence: Chat messages are saved in `sessionStorage` (survives page navigation, clears on tab close). Rate limit count is saved in `localStorage` (persists across sessions for the full hour window).

---

## REST API

| Endpoint | Method | Description |
|---|---|---|
| `/api/test` | GET | Health check |
| `/api/contact` | POST | Sends contact form email via Resend |
| `/api/chat` | POST | AI chatbot via Gemini API |

---

## Testing & CI/CD

### Automated Testing

* Frontend tests verify that all portfolio pages exist.
* Worker API tests verify endpoint behavior with mocked external services (Resend and Gemini are mocked using Jest).

### Continuous Integration (CI)

GitHub Actions automatically runs all tests on every pull request to main. PRs cannot be merged until all tests pass.

### Continuous Deployment (CD)

On push to main, GitHub Actions deploys the Worker to Cloudflare using Wrangler.

### Branch Protection

The main branch is protected via a GitHub branch ruleset. Pull requests require the CI test job to pass before merging is allowed.