# Testing

## Automated Testing

Automated backend tests were implemented using **Jest** and **Supertest**.

The tests simulate requests to the `/contact` API endpoint and verify that the backend behaves correctly under different scenarios.

### Test 1: Successful Contact Form Submission

```js
test("should send email successfully", async () => {
  ...
});
```

Purpose:

* Sends valid contact form data
* Verifies that the request is accepted
* Verifies that the API returns a successful response

Expected Result:

```json
{
  "success": true
}
```

Status Code:

```text
200 OK
```

---

### Test 2: Missing Required Fields

```js
test("should return 400 if fields are missing", async () => {
  ...
});
```

Purpose:

* Sends incomplete contact form data
* Verifies server-side validation
* Ensures invalid requests are rejected

Expected Result:

```json
{
  "success": false
}
```

Status Code:

```text
400 Bad Request
```

---

## Mocking Resend

The Resend email service is mocked during testing.

This ensures that:

* No real emails are sent during test execution
* Tests run quickly
* Tests do not depend on external services
* Backend logic can be verified in isolation

---

## Manual Testing

The following functionality was manually verified:

### Responsive Design

* Desktop layout
* Tablet layout
* Mobile layout

### Contact Form

* Form submission
* Email delivery
* Error handling

### Portfolio Chatbot

* Chatbot opens correctly
* Responses are displayed correctly

### Theme Toggle

* Light mode
* Dark mode
* Theme switching functionality

---

## Continuous Testing

GitHub Actions automatically runs frontend and backend tests:

* On every push to the main branch
* Once daily using a scheduled cron workflow

This helps ensure that future changes do not break existing functionality.
