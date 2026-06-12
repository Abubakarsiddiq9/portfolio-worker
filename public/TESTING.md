# Testing

## Automated Testing

Automated tests are implemented using **Jest**.

All tests run automatically on every pull request via GitHub Actions.

---

## Frontend Tests

Located at `public/tests/frontend.test.js`.

These tests verify that all portfolio pages exist at the correct file paths.

### Test 1: Home page exists
Checks that `public/index.html` exists.

### Test 2: Contact page exists
Checks that `public/Contact/contactpg.html` exists.

### Test 3: Projects page exists
Checks that `public/Projects_/projectspg.html` exists.

### Test 4: Blogs page exists
Checks that `public/Blogpg/blogpg.html` exists.

### Test 5: Journey page exists
Checks that `public/Journey/journeypg.html` exists.

---

## Worker API Tests

Located at `src/tests/worker.test.js`.

These tests verify the behavior of all Cloudflare Worker API endpoints. Resend and the Gemini API are fully mocked so no real external calls are made during testing.

### Mocking

**Resend** is mocked using `jest.mock('resend')` — no real emails are sent.

**Gemini API** (`fetch`) is mocked using `global.fetch = jest.fn()` — no real AI calls are made.

---

### GET /api/test

**Test: returns success true**
* Sends a GET request to `/api/test`
* Verifies status 200
* Verifies `success: true` in response

---

### POST /api/contact

**Test 1: sends email and returns success**
* Sends valid name, email, and message
* Verifies status 200
* Verifies `success: true`

**Test 2: returns 400 when fields are missing**
* Sends incomplete data (name only)
* Verifies status 400
* Verifies `success: false`

---

### POST /api/chat

**Test 1: returns AI reply**
* Sends a valid conversation history array
* Verifies status 200
* Verifies `success: true`
* Verifies reply is a string

**Test 2: returns 400 when history is missing**
* Sends empty request body
* Verifies status 400
* Verifies `success: false`

**Test 3: returns 400 when history is empty array**
* Sends `history: []`
* Verifies status 400
* Verifies `success: false`

---

## Admin Authentication Tests

### Login

* Correct password logs in successfully
* Invalid password returns 401
* JWT cookie is created

### Session Check

* Logged-in users receive `loggedIn: true`
* Logged-out users receive `loggedIn: false`

### Guestbook Access

* Authorized users can view messages
* Unauthorized users are redirected

### Message Deletion

* Delete button removes message
* Database record is removed
* UI updates immediately

### Logout

* JWT cookie is cleared
* Protected routes become inaccessible

### Unknown Route

**Test: returns 404**
* Sends a request to an unknown path
* Verifies status 404

---

## Running Tests Locally

```bash
npm install
npm test
```

Expected output:
```
PASS  public/tests/frontend.test.js
PASS  src/tests/worker.test.js
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

---

## CI/CD Integration

GitHub Actions runs all tests automatically on every pull request to `main`.

The main branch is protected — pull requests cannot be merged until all 12 tests pass.

---

## Manual Testing

The following functionality was manually verified:

### Responsive Design
* Desktop layout
* Mobile layout

### Contact Form
* Form submission
* Email delivery
* Error handling

### Portfolio Chatbot
* Chatbot opens and closes correctly
* AI responses display correctly
* Fallback mode activates when limit is reached
* Messages persist across page navigation (sessionStorage)
* Rate limit persists across page reloads (localStorage)

### Theme Toggle
* Light mode
* Dark mode
* Theme preference saved across sessions