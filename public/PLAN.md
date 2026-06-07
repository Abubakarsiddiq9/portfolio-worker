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

* Node.js
* Express.js

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
* Interactive portfolio chatbot
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

---

## Risks / Unknowns

At the start of the project, the following areas were unfamiliar:

* Deploying applications using Cloudflare Pages
* Backend contact form integration
* Email service integration
* CI/CD setup using GitHub Actions

---

## Contact Form Architecture

The contact form is powered by a Node.js and Express backend.

Workflow:

1. User fills out the contact form.
2. The frontend sends a POST request to the `/contact` API endpoint.
3. The backend validates the submitted data.
4. Rate limiting is applied to prevent spam.
5. Resend sends the email securely to my inbox.
6. The backend returns a JSON response indicating success or failure.

The frontend is hosted on Cloudflare Pages and the backend is deployed on Render.

---

## REST API

A REST API endpoint called `/contact` was created using Express.

The endpoint:

* Accepts POST requests
* Receives name, email, and message data
* Validates user input
* Applies rate limiting
* Sends emails using Resend
* Returns JSON responses indicating success or failure

---

## Testing & CI/CD

### Automated Testing

* Frontend tests verify important frontend functionality.
* Backend tests verify API behavior and request validation.

### Continuous Integration (CI)

GitHub Actions automatically runs frontend and backend tests whenever code is pushed.

### Continuous Deployment (CD)

Cloudflare deployment occurs only after all tests pass successfully.

### Scheduled Testing

A cron workflow runs tests daily to ensure long-term project stability.
