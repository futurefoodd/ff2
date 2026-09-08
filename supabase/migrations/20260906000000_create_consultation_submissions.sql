create table if not exists public.consultation_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (
    submission_type in ('nutrition-consult', 'sample-request', 'metabolic-survey')
  ),
  payload jsonb not null,
  status text not null default 'new' check (
    status in ('new', 'in-review', 'contacted', 'closed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists consultation_submissions_created_at_idx
  on public.consultation_submissions (created_at desc);

alter table public.consultation_submissions enable row level security;

-- No public policies are created. Submissions can only be inserted or read by
-- trusted backend code using the Supabase secret/service-role key.
