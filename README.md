# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Supabse CLI Commands

npx supabase init
npx supabase start
npx supabase migration new add_products
npx supabase migration list
npx supabase db reset
npx supabase db push
npx supabase status
npx supabase gen types typescript --local > src/types/supabase.generated.ts
npx supabase login
npx supabase link --project-ref your-project-ref

## Testing protected consultation forms locally

The `/consultations` forms use Cloudflare Turnstile in the browser and verify
every token again in the backend before saving a submission to Supabase.

1. Apply the local database migration:

```bash
npx supabase migration up --local
```

2. Use Cloudflare's always-pass test site key in the frontend `.env`:

```dotenv
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

3. Add the matching test secret and local Supabase settings to `be/.env`:

```dotenv
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SECRET_KEY=<service-role-key-from-supabase-status>
```

4. Start the frontend and backend, open `/consultations`, complete a form, and
   confirm a row was created in `public.consultation_submissions`.

To test rejection, temporarily use Cloudflare's always-fail pair:

```dotenv
VITE_TURNSTILE_SITE_KEY=2x00000000000000000000AB
TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA
```

Production must use a real Turnstile site key and a secret stored only in the
backend environment. Do not allow `localhost` in the production widget's
hostname list.

## Commit naming conventions
<type>(<optional-scope>): <imperative description>

feat/<description> — new functionality
fix/<description> — non-urgent bug fix
chore/<description> — tooling, dependencies, CI/CD
docs/<description> — documentation
refactor/<description> — internal restructuring
hotfix/<description> — urgent production fix
