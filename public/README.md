# My Portfolio Website

A responsive full-stack portfolio website showcasing my projects, skills, journey, blogs, and contact information.

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Email Service

* Resend

### Testing

* Jest
* Supertest

### Deployment & DevOps

* Cloudflare Pages
* Render
* GitHub Actions

## Features

* Responsive design for desktop and mobile devices
* Interactive portfolio chatbot
* Project showcase section
* Journey timeline
* Blog page
* Contact form with backend integration
* Automated testing
* CI/CD pipeline

## Chatbot
What it is:
A chatbot on my portfolio that answers questions about me — my skills, education, projects, and contact info.
How it works:

* The frontend sends the user's message to my Express.js backend hosted on Render
* The backend calls the Google Gemini API with a system prompt containing all my details
* Gemini generates a natural response and sends it back

Rate limiting:
The backend limits each user to 20 messages per hour using express-rate-limit. If they hit the limit, the chatbot switches to a predefined keyword-based fallback so they still get answers without consuming any API quota.
Message persistence:
Chat messages are saved in sessionStorage — so if you navigate to another page and come back, your conversation is still there. But when you close the tab, it clears. The rate limit count is saved in localStorage separately, so it persists across page navigations for the full hour window.
Fallback mode:
If the AI is down or limit is hit, it falls back to keyword matching — like if message includes "skills" → answer with tech stack. Zero API calls, zero cost.

## Contact Form

The contact form is powered by a Node.js and Express backend.

When a user submits the form:

1. The frontend sends a POST request to the backend API.
2. The backend validates the form data.
3. Rate limiting is applied to prevent spam.
4. Resend is used to send the message to my email address.
5. The API returns a success or failure response to the frontend.

## Testing

Automated tests are implemented using Jest and Supertest.

### Frontend Tests

* Verify important frontend functionality
* Check critical UI components

### Backend Tests

* Verify API endpoints
* Validate request handling
* Test successful and failed contact form submissions

## CI/CD

GitHub Actions is used for Continuous Integration and Continuous Deployment.

### Continuous Integration (CI)

* Runs frontend and backend tests on every push
* Prevents broken code from reaching production

### Continuous Deployment (CD)

* Deploys the website only when all tests pass
* Uses Cloudflare Pages for production deployment
* Cloudflare authentication is handled securely through GitHub Secrets

### Scheduled Testing

A cron workflow runs automated tests once per day to ensure continued project stability.

## Project Structure

* Home Page
* Projects Page
* Journey Page
* Blog Page
* Contact Page

## Design

* Project planning is documented in `PLAN.md`
* Figma design link is available in `DESIGN.md`
