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

* Theme toggle
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
