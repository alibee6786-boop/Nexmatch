# Password reset - rate limiting & reCAPTCHA

Changes in this update

- Rate limiting: a simple rate limiter is now applied to the password-reset request endpoint. It uses Redis if REDIS_URL is provided, otherwise falls back to an in-memory Map (suitable for single-instance dev only).
  - Default limits: 5 requests per hour per IP.
  - Redis is recommended for production (e.g., Upstash, AWS Elasticache).

- reCAPTCHA verification: the password-reset request now requires a recaptchaToken (v3 or v2). The server verifies the token with Google's siteverify endpoint using RECAPTCHA_SECRET.
  - Client-side, the forgot-password page attempts to execute grecaptcha (v3) using NEXT_PUBLIC_RECAPTCHA_SITE_KEY and includes the token in the request.

Env variables added (add to .env):
- RECAPTCHA_SECRET=your-recaptcha-secret
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key (for client)
- REDIS_URL=redis://:password@host:port (optional for production rate-limiting)

Notes & recommendations
- For production, set up Redis and provide REDIS_URL. The in-memory fallback is not suitable for serverless or multi-instance setups.
- Choose reCAPTCHA v3 for invisible checks, or v2 checkbox if you prefer user interaction. Update site keys accordingly.
- Consider tightening rate limits or adding adaptive throttling based on observed abuse.

Apply changes
- npm install (ioredis added)
- Configure env vars
- npx prisma generate && npx prisma migrate deploy (or migrate dev)

