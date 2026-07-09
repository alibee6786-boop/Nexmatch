Authentication

This branch includes support for Email/password (credentials) and OAuth providers (GitHub + Google) via Auth.js.

Environment variables
- AUTH_SECRET: random secret for Auth.js
- GITHUB_ID, GITHUB_SECRET: GitHub OAuth app credentials
- GOOGLE_ID, GOOGLE_SECRET: Google OAuth credentials

Setup notes
1. Create OAuth apps on GitHub and Google and add their client IDs and secrets to your .env.
2. Ensure NEXTAUTH_URL is set (e.g., http://localhost:3000) and your OAuth app redirect URLs include `${NEXTAUTH_URL}/api/auth/callback/github` and `${NEXTAUTH_URL}/api/auth/callback/google`.
3. Run migrations and start the app.
