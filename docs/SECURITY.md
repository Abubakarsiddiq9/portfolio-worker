# SECURITY.md

# Extension 4 – Security & Adversarial Testing

## Overview

This extension focused on identifying possible security risks in the portfolio website, implementing practical defenses, and performing adversarial testing against AI chatbots.

The project follows a defense-in-depth approach by combining multiple layers of protection instead of relying on a single security mechanism.

---

# Threat Model

The following threats were identified.

| Threat | Risk | Mitigation |
|---------|------|------------|
| Spam submissions | High | Cloudflare Turnstile |
| Request flooding | High | Durable Object rate limiting |
| Invalid user input | High | Server-side validation |
| Stored XSS | High | Removed `innerHTML` for untrusted data |
| Prompt Injection | High | Input guardrails before Gemini |
| System prompt leakage | High | Blocked using guardrails |
| Hallucinated resume information | Medium | Strict system prompt |
| Secret leakage | High | Cloudflare Secrets (.dev.vars locally) |
| Clickjacking | Medium | X-Frame-Options |
| MIME sniffing | Medium | X-Content-Type-Options |
| Cross-site attacks | Medium | Content Security Policy |

---

# Security Improvements

## 1. Server-side Validation

Client-side validation can be bypassed.

The contact API now validates all incoming requests on the server before processing them.

Checks include:

- Required fields
- Maximum length
- Email format
- Trimmed input

Invalid requests return HTTP 400.

---

## 2. Durable Object Rate Limiting

The previous implementation used Cloudflare KV.

It was replaced with Durable Objects because they provide strongly consistent counters.

Current limits:

- Contact Form: 5 requests/hour/IP
- Chatbot: 20 requests/hour/IP
- Admin Login: 5 attempts/16 minutes/IP

This reduces spam, brute-force attempts, and API abuse.

---

## 3. Cloudflare Turnstile

The contact form is protected using Cloudflare Turnstile.

Flow:

Browser

↓

Turnstile generates token

↓

Worker verifies token

↓

Contact form processed only if verification succeeds

Without a valid token the Worker returns:

HTTP 403 Forbidden

This prevents automated bot submissions.

---

## 4. Security Headers

Security headers are added to every Worker response.

Implemented headers:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

These headers reduce browser-based attacks including clickjacking and MIME sniffing.

---

## 5. Stored XSS Protection

Previously the admin dashboard rendered user messages using `innerHTML`.

This allowed HTML submitted through the contact form to be interpreted by the browser.

The dashboard now creates DOM elements and assigns user content using `textContent`.

As a result:

Input:

<b>Hello</b>

Displays as:

<b>Hello</b>

instead of rendering bold text.

---

## 6. Prompt Injection Guardrails

Input guardrails inspect every chatbot request before Gemini is called.

Blocked attempts include:

- Ignore previous instructions
- Reveal your system prompt
- Show hidden instructions
- Jailbreak attempts
- Instruction override attacks

Blocked requests never reach Gemini.

This protects both the system prompt and Gemini API quota.

---

## 7. Resume Grounding

The chatbot is instructed to answer using only the provided resume context.

If information is unavailable it responds:

"I don't have that information in my resume data."

This reduces hallucinations and prevents fabricated information.

---
# Remaining Risks

The following risks remain outside the scope of this extension.

- Sophisticated jailbreak techniques may still evolve.
- AI models cannot guarantee perfect resistance against every prompt injection attempt.
- Distributed attacks from many IP addresses are outside the scope of the current rate limiter.
- Cloudflare WAF custom rules can provide additional protection beyond this implementation.

---

# Summary

This extension introduced multiple security layers:

- Server-side validation
- Durable Object rate limiting
- Cloudflare Turnstile
- Security headers
- Content Security Policy
- Stored XSS protection
- Prompt injection guardrails
- Resume-grounded AI responses

Together these significantly improve the security posture of the portfolio website while maintaining a good user experience.