# My Portfolio Website

A responsive full-stack portfolio website showcasing my projects, skills, journey, blogs, and contact information.

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Cloudflare Workers
* Cloudflare D1 Database

### Email Service

* Resend

### AI

* Google Gemini API (gemini-2.5-flash-lite)

### Testing

* Jest

### Deployment & DevOps

* Cloudflare Workers
* GitHub Actions

## Features

* Responsive design for desktop and mobile devices
* AI-powered portfolio chatbot
* Project showcase section
* Journey timeline
* Blog page
* Contact form with backend integration
* Automated testing
* CI/CD pipeline

* Admin authentication using JWT
* Protected admin guestbook dashboard
* View contact form submissions
* Delete guestbook messages
* Dark mode support

## Chatbot

**What it is:**
A chatbot on my portfolio that answers questions about me — my skills, education, projects, and contact info.

**How it works:**

* The frontend sends the user's message to `/api/chat` on the Cloudflare Worker
* The Worker calls the Google Gemini API with a system prompt containing all my details
* Gemini generates a natural response and sends it back

**Rate limiting:**
The Worker limits each user to 20 messages per hour using server-side rate limiting powered by Cloudflare KV. Requests are tracked by client IP address. If the limit is reached, the chatbot automatically switches to a predefined keyword-based fallback so users can still get answers without consuming any AI API quota.

**Message persistence:**
Chat messages are saved in `sessionStorage`, so conversations remain available while navigating between pages during the same browser session. When the tab is closed, the chat history is cleared. Rate limiting is enforced server-side and is not stored in the browser.

**Fallback mode:**
If the AI is down or the limit is hit, it falls back to keyword matching. Zero API calls, zero cost.

## Contact Form

The contact form is powered by a Cloudflare Worker.

When a user submits the form:

1. The frontend sends a POST request to `/api/contact`.
2. The Worker validates the form data.
3. Resend is used to send the message to my email address.
4. The Worker returns a success or failure JSON response.

5. The message is stored in a Cloudflare D1 database.
6. The Worker returns a success or failure JSON response.

## Admin Guestbook

The portfolio includes a protected admin guestbook for managing contact form submissions.

### Features

* Password-protected login
* JWT authentication using secure HTTP-only cookies
* Protected API routes
* View all submitted contact messages
* Delete messages from the dashboard
* Responsive design for desktop and mobile

### Authentication Flow

1. Admin enters password.
2. Worker validates password against Cloudflare secret.
3. Worker creates a JWT token.
4. JWT is stored in a secure HTTP-only cookie.
5. Protected routes verify the JWT before returning data.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/test` | GET | Health check |
| `/api/contact` | POST | Sends contact form email via Resend |
| `/api/chat` | POST | AI chatbot via Gemini API |
| `/api/admin/login` | POST | Admin login |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/check` | GET | Check admin session |
| `/api/admin/messages` | GET | Fetch guestbook messages |
| `/api/admin/messages/:id` | DELETE | Delete a guestbook message |

## Testing

Automated tests are implemented using Jest.

### Frontend Tests

* Verify that all portfolio pages exist in the correct locations

### Worker API Tests

* Verify all API endpoints (`/api/test`, `/api/contact`, `/api/chat`)
* Validate request handling and input validation
* Resend and Gemini are mocked — no real API calls during tests

## CI/CD

GitHub Actions is used for Continuous Integration and Continuous Deployment.

### Continuous Integration (CI)

* Runs on every pull request to main
* Runs all Jest tests (frontend + worker)
* PRs cannot be merged until all tests pass

### Continuous Deployment (CD)

* Runs on every push to main
* Deploys to Cloudflare Workers via Wrangler
* Cloudflare authentication is handled securely through GitHub Secrets

## Branch Protection

The main branch is protected via a GitHub branch ruleset. All pull requests must pass the CI test job before merging is allowed.

## Project Structure

```
portfolio-worker/
├── .github/workflows/
│   ├── ci.yml          # Runs tests on every PR
│   └── deploy.yml      # Deploys to Cloudflare on push to main
├── public/             # Static HTML, CSS, JS files
│   ├── Admin/
│   │   ├── guestbook.html
│   │   ├── guestbook.css
│   │   └── guestbook.js
│   ├── tests/
│   │   └── frontend.test.js
│   ├── index.html
│   ├── Contact/
│   ├── Projects_/
│   ├── Journey/
│   └── Blogpg/
├── src/
│   ├── index.js        # Cloudflare Worker entry point
│   └── tests/
│       └── worker.test.js
├── wrangler.jsonc
└── package.json
```

## Pages

* **Home Page:** Introduction, skills, and technologies I use
* **Projects Page:** Displays featured and smaller projects
* **Journey Page:** Shows my learning journey and milestones
* **Blog Page:** Contains articles and updates
* **Contact Page:** Allows visitors to send messages directly to my email

# API

## GET /api/posts

Returns all blog posts.

## GET /api/posts/{slug}

Returns a single blog post.

## GET /api/github/repos

Returns live GitHub repositories.

## POST /api/contact

Submits contact form.

## POST /api/chat

Portfolio chatbot endpoint.