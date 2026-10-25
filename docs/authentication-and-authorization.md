# Authentication and Authorization

This document describes the recommended Supabase Auth design for the Future Foods React application. It covers Google OAuth and email/password sign-in, JWTs, session handling, and an organization-aware RBAC data model.

> **Current state:** The frontend is a client-rendered Vite/React app using `@supabase/supabase-js`. The Supabase client persists the session and refreshes tokens automatically. The local Supabase config sets a one-hour JWT expiry, enables refresh-token rotation, enables signup, and disables anonymous sign-in. There are currently no app-owned profile, organization, membership, or RBAC tables in the migrations. This document is a proposed design, not a description of already deployed behavior.

## Security model

Keep these responsibilities separate:

1. **Authentication:** Supabase Auth establishes the user's identity using Google OAuth or email/password.
2. **Session:** Supabase Auth issues and refreshes the user's access and refresh tokens.
3. **Authorization:** PostgreSQL grants and Row Level Security (RLS) policies decide what that identity can do to data. React route guards only control presentation and are not security boundaries.

The browser may use the Supabase publishable key. Never expose a Supabase secret/service-role key in frontend code, a `VITE_*` variable, or a browser bundle. A service-role key bypasses RLS and belongs only in a trusted server or protected Edge Function.

## Authentication methods

### Email and password

- Keep email confirmation enabled in production. Use a production SMTP provider for confirmation, invitation, and password-reset messages.
- Use `signUp`, `signInWithPassword`, `resetPasswordForEmail`, and `updateUser` from `supabase.auth`.
- Return non-enumerating responses for sign-in, signup, and password-reset flows where appropriate; do not reveal whether an email is registered.
- Enforce a useful password minimum and enable Supabase Auth rate limits/CAPTCHA as appropriate. The local config currently uses an eight-character UI hint but Auth config's configured minimum is six; align the server-side production policy with the intended standard (at least 8, preferably a stronger policy or MFA for privileged users).
- Require recent reauthentication for sensitive account changes, such as changing email/password or linking an identity.

### Google OAuth

- Configure the Google OAuth client and Supabase Google provider with exact production callback and redirect URLs. Keep development URLs separate and narrowly allow-listed.
- Start login with `signInWithOAuth({ provider: 'google', options: { redirectTo } })` and return users to a dedicated callback route.
- Treat the provider as an identity source. Supabase Auth owns the app session. A Google access token is only needed if the app calls Google APIs; Supabase does not refresh Google provider tokens for the application.
- Do not automatically merge identities based only on matching email unless the provider's verified-email and account-linking behavior has been carefully reviewed. Account linking should be an authenticated, deliberate flow.

### React auth state

Create one shared Supabase client and one auth provider near the app root. On initial load, resolve the current session, then subscribe to `onAuthStateChange` and unsubscribe on unmount. Expose `user`, `session`, and `loading` (and optionally sign-in/out actions) through context. Use this state to render sign-in pages and personalized UI; rely on RLS and server-side checks for actual access control.

Do not put a second, independently editable copy of authorization state in React storage. Avoid logging access tokens, refresh tokens, passwords, confirmation links, or reset tokens.

## JWTs

Supabase access tokens are signed JWTs. The client sends the access token when making requests to Supabase. The JWT contains standard identity/session claims, including the user ID (`sub`), the database role (`role`, typically `authenticated`), issuer, audience, expiry, and `session_id`. PostgreSQL policies can use `auth.uid()` and `auth.jwt()` to inspect the verified request identity and claims.

- The current configured access-token expiry is **3600 seconds (1 hour)**. One hour is a reasonable default for most apps; avoid making tokens long-lived just to reduce refreshes.
- Supabase refreshes the short-lived access token using a rotating refresh token. A refresh token is sensitive bearer material; never send it to analytics, logs, URLs, or third parties.
- JWT claims are snapshots until token refresh. Avoid putting frequently changing organization membership or permissions in JWT claims if changes must take effect immediately.
- Do not treat a decoded JWT in React as trusted authorization evidence. Decoding is suitable for display; server-side verification or database policy evaluation is what establishes trust.
- Use `raw_app_meta_data` for trusted Auth metadata if needed. Never base authorization on `raw_user_meta_data`, which the user can update.
- Keep JWT claims small. If custom claims are introduced, use a Supabase Custom Access Token Hook and validate the claims in RLS or trusted server code.

For this application, prefer database-backed membership and role checks in RLS over a single global `admin` claim. This supports per-organization roles and avoids stale permissions after a membership change. A small stable claim (for example a coarse platform-level classification) may be added later if there is a clear need.

## Session management

For the current client-rendered Vite app, `supabase-js` persistence in browser storage and automatic refresh are the standard supported setup. The current client explicitly enables `persistSession`, `autoRefreshToken`, and `detectSessionInUrl`. Use Supabase's PKCE flow where appropriate for callback handling; `@supabase/ssr` is intended for server-rendered frameworks that need cookie-based sessions, not required solely because this is a React app.

Operational guidance:

- Keep access tokens near the default one-hour expiry unless a documented risk assessment says otherwise.
- Sign out with Supabase Auth. Offer “sign out everywhere” where needed using the Auth sign-out scope that terminates all sessions.
- For higher-risk environments, configure session time-boxing, inactivity timeout, or single-session restrictions in Supabase Auth if the project plan and user experience support them.
- Consider MFA for privileged users and sensitive operations. Reauthentication or MFA assurance should be required before highly sensitive actions.
- If a user is removed from an organization, RLS should deny future database access based on current membership data, even while the user's access JWT remains valid. A JWT may still authorize non-database services until it expires unless those services also check current session/authorization state.
- Do not build application queries against Supabase's internal `auth.sessions` or `auth.users` tables as a substitute for Auth APIs. Supabase owns those tables. The JWT's `session_id` can be used for audit correlation; stronger per-request revocation checks are only needed for particularly sensitive operations.

## Authorization and RBAC

### Recommended model

Use **organization-scoped RBAC** because enterprise users commonly belong to different organizations with different permissions. Each protected business row should carry an `organization_id`; each access decision should verify that the caller has an active membership and the required permission for that organization.

Suggested initial roles:

| Role | Example access |
| --- | --- |
| `owner` | Manage organization, members, roles, and all organization data |
| `admin` | Manage members and operational data; no ownership transfer or platform-wide access |
| `staff` | Work with assigned organization data |
| `viewer` | Read permitted organization data |

Role names are only labels. Define permissions explicitly and make policies check the specific permission required by each operation. Do not infer platform-wide access from a user-supplied profile field or email domain.

### Recommended app-owned tables

Supabase-managed `auth.users` and Auth identities remain the source of authentication identity. Do not duplicate passwords or provider credentials. Add these app-owned tables in migrations when organization-aware authorization is implemented:

| Table | Purpose |
| --- | --- |
| `profiles` | App-specific display/profile fields keyed by `auth.users.id` |
| `organizations` | Tenant/business account boundary |
| `organization_members` | User-to-organization membership, status, invitation/activation metadata |
| `roles` | Organization-scoped role definitions (or a constrained enum for a fixed set) |
| `permissions` | Stable permission identifiers such as `products.read` and `members.manage` |
| `organization_member_roles` | Assign one or more roles to a member in an organization |
| `role_permissions` | Map roles to permissions |
| `invitations` | Optional invitation lifecycle if invitations need tracking beyond Auth email invites |
| `audit_log` | Optional append-only security and administrative activity record |

Avoid a user-global role column if users can be staff in one organization and viewers in another. If the product will remain a single-tenant consumer storefront, the organization and role mapping tables may be unnecessary; use only the minimal profile/ownership model that actual features require.

### Illustrative schema

The following is a design sketch, not an applied migration. Tune constraints, grants, enums, and delete behavior to product requirements before adopting it.

```sql
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active'
    check (status in ('invited', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  is_system boolean not null default false,
  unique (organization_id, name)
);

create table public.permissions (
  id text primary key, -- e.g. 'products.read', 'members.manage'
  description text not null
);

create table public.organization_member_roles (
  organization_id uuid not null,
  user_id uuid not null,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key (organization_id, user_id, role_id),
  foreign key (organization_id, user_id)
    references public.organization_members(organization_id, user_id) on delete cascade
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id text not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create index organization_members_user_id_idx
  on public.organization_members(user_id);
```

System roles can be represented by organization-specific seeded rows or as a fixed role enum; choose one model and enforce it consistently. If custom roles are not a requirement, simpler fixed role assignments can reduce schema complexity.

### RLS requirements

- Enable RLS on every table in an exposed schema, including membership and role-mapping tables.
- Restrict table grants as well as creating policies; a policy does not revoke SQL privileges.
- Create explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies for the operations the app actually supports.
- Use `auth.uid()` as the caller identity and validate organization membership and permission in policies or carefully designed helper functions.
- Prevent users from granting themselves roles, changing organization IDs, or creating an owner/admin assignment. Role assignment should be limited to authorized membership managers and validated server-side where needed.
- Keep authorization helper functions narrowly scoped. For `SECURITY DEFINER` functions, set a fixed `search_path`, revoke default public execution, grant only required execution, and review all bypass-RLS behavior.
- Index columns used by policies, particularly `organization_id`, `user_id`, and membership lookup keys.
- Test both allowed and denied cases for each operation, including cross-organization access and role changes.

Do not add a permissive `USING (true)` policy to tenant tables or rely on frontend filters such as `.eq('organization_id', currentOrgId)`. Client filters improve query ergonomics; RLS must independently enforce the boundary.

## Invitations and lifecycle

If organizations invite users, represent pending invitations explicitly with organization, normalized email, intended role(s), expiration, inviter, accepted time, and revoked time. Treat the invitation as untrusted until the invited user completes the Auth flow and the server validates that the authenticated email matches the invitation. Never let a browser write arbitrary role assignments. Record meaningful changes such as invitation issued/accepted/revoked, member role changes, suspension, and organization ownership changes in an append-only audit table if compliance or operations require it.

## Platform administration

Distinguish organization administrators from platform operators. Platform-level tasks must run through a trusted backend/Edge Function using privileged credentials only after verifying the caller's identity and platform-level permission. Do not create a general “admin” client-side bypass or grant the service-role key to the browser.

## Implementation checklist

- [ ] Confirm whether the app is single-tenant or organization/multi-tenant before adding role tables.
- [ ] Configure Google credentials, exact callback URLs, and allowed redirects for each environment.
- [ ] Enable production email confirmation, set up SMTP, and verify reset/confirmation redirects.
- [ ] Align production password policy, rate limits, CAPTCHA, and MFA requirements with risk.
- [ ] Add app-owned identity/membership tables via versioned migrations; do not edit Supabase-managed Auth tables.
- [ ] Enable RLS and least-privilege grants on each exposed table and storage bucket.
- [ ] Add tests for cross-user and cross-organization denial, role assignment, and every permitted action.
- [ ] Keep service-role credentials and other secrets on trusted servers only.
- [ ] Review auth and audit logs without recording credentials or bearer tokens.

## References

- [Supabase Auth overview](https://supabase.com/docs/guides/auth)
- [Supabase React quickstart](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase password authentication](https://supabase.com/docs/guides/auth/passwords)
- [Supabase sessions](https://supabase.com/docs/guides/auth/sessions)
- [Supabase JWTs](https://supabase.com/docs/guides/auth/jwts)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase custom claims and RBAC](https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac)
- [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side)
