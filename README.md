# NexMatch

Production-ready dating platform scaffold (Step 1: Project setup)

Requirements
- Node 18+ (or as supported by Next 15)
- PostgreSQL (local or managed)
- Yarn or npm

Quick start
1. Copy and configure environment:
   cp .env.example .env
   # edit .env to point DATABASE_URL to your Postgres instance

2. Install dependencies:
   npm install

3. Generate Prisma client and run initial migration:
   npx prisma generate
   npx prisma migrate dev --name init

4. Run dev server:
   npm run dev
   Open http://localhost:3000

Testing
- Run unit tests:
  npm run test

Notes
- This scaffold includes a minimal User model in Prisma; each feature will modify prisma/schema.prisma and we will generate migrations as we progress.
- If your repo is private and you want me to commit these changes directly, grant me access or tell me to proceed and I'll push the changes (I can open a PR).
