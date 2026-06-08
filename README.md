# Injury Recovery — Real Beta

Evidence-driven injury recovery platform for friends/family testing.

## What is included

- Next.js app ready for GitHub + Vercel
- Supabase authentication support
- Supabase progress saving support
- Mobile-first dashboard
- Assessment engine for injury area, grade, mechanism, symptoms, sport demands, equipment, and red flags
- Phase → week → day → exercise plan structure
- Expandable daily sessions
- Exercise cards with sets, reps, intensity, equipment, cues, and easier alternatives
- Video demo placeholders ready for your own exercise library
- Check-ins and recovery-coach pushback logic

## Deploy without terminal

1. Create a new GitHub repository.
2. Upload the files in this folder directly to the repository root:
   - `app`
   - `data`
   - `lib`
   - `package.json`
   - `next.config.mjs`
   - `README.md`
3. Open Vercel.
4. Import the GitHub repository.
5. Framework preset: Next.js.
6. Build command: `npm run build`.
7. Output directory: leave empty.
8. Deploy.

## Supabase setup

Create a free Supabase project, then add these Vercel environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

In Supabase SQL Editor, run:

```sql
create table if not exists public.recovery_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  profile_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.recovery_profiles enable row level security;

create policy "Users can read their own recovery profile"
on public.recovery_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own recovery profile"
on public.recovery_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own recovery profile"
on public.recovery_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Replacing video placeholders

In `data/rehabKnowledge.js`, every exercise has:

```js
video: 'Add your own video URL here'
```

Replace it later with your own hosted video URLs or approved YouTube embeds.

## Important safety note

This beta is not a medical device and does not replace medical diagnosis. It uses conservative, evidence-informed rules and intentionally refers users out when red-flag signs appear.
