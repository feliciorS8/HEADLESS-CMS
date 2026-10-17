# The Serverless Odyssey

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Cloud%20PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5?logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Edge%20Deployment-black?logo=vercel)

An educational full-stack serverless project exploring a modern web application stack. The repository is built with Next.js 16 App Router and is intended to connect to managed cloud services for data, media delivery, and deployment.

## Architecture: Four Pillars

| Pillar                        | Responsibility                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| **Next.js 16 App Router**     | Application UI, routing, and server-side application logic.                                     |
| **Supabase Cloud PostgreSQL** | Managed relational database and the Supabase platform services used by the application.         |
| **Cloudinary CDN**            | Media asset storage, delivery, and image transformations.                                       |
| **Vercel Edge**               | Application hosting and edge delivery for routes and features compatible with the Edge Runtime. |

## Prerequisites

- Node.js 20 or later and npm
- A Supabase project
- A Cloudinary account

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the public environment template to a local-only file:

   ```bash
   cp .env.example .env.local
   ```

   On PowerShell, use `Copy-Item .env.example .env.local`.

3. Add the credentials for your Supabase and Cloudinary projects to `.env.local`. Keep `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` server-side; never prefix private credentials with `NEXT_PUBLIC_` or expose them in browser code.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

The required environment variable names are listed in [`.env.example`](.env.example). Never commit `.env.local` or other files containing credentials.

## Git Branch Workflow

1. Keep `main` as the stable integration branch; do not commit course work directly to it.
2. Create a focused branch from the latest `main`, for example `feat/profile-page` or `fix/upload-validation`.
3. Make small, descriptive commits on that branch and push it to the remote repository.
4. Open a pull request into `main`, review the changes and checks, then merge when approved.

## Security Baseline

- Commit `.env.example` only with blank values; do not commit `.env`, `.env.local`, or credential-bearing variants.
- Keep Supabase service-role and Cloudinary API secrets in server-only code and deployment environment settings.
- Review `git status` and the staged diff before every commit. If a credential is exposed, rotate it immediately; deleting it in a later commit does not remove it from Git history.

## Available Commands

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the local development server. |
| `npm run lint`  | Run ESLint.                         |
| `npm run build` | Create a production build.          |
| `npm run start` | Serve the production build locally. |
