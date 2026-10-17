create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) > 0),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  budget numeric(14, 2) check (budget is null or budget >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  alter column id set default gen_random_uuid(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.projects
  alter column id set default gen_random_uuid(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.tasks
  alter column id set default gen_random_uuid(),
  add column if not exists description text,
  add column if not exists updated_at timestamptz not null default now(),
  alter column status set default 'todo',
  alter column status set not null;

alter table public.projects
  drop constraint if exists projects_user_id_fkey,
  add constraint projects_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.tasks
  drop constraint if exists tasks_project_id_fkey,
  add constraint tasks_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete cascade;

alter table public.projects
  drop constraint if exists projects_budget_nonnegative_check,
  add constraint projects_budget_nonnegative_check
    check (budget is null or budget >= 0);

alter table public.tasks
  drop constraint if exists tasks_status_check,
  add constraint tasks_status_check
    check (status in ('todo', 'in_progress', 'done'));

create index if not exists projects_user_id_idx
  on public.projects using btree (user_id);

create index if not exists tasks_project_id_idx
  on public.tasks using btree (project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select to anon, authenticated
  using (true);

drop policy if exists "Public can read tasks" on public.tasks;
create policy "Public can read tasks"
  on public.tasks for select to anon, authenticated
  using (true);

insert into public.profiles (id, full_name, avatar_url)
values (
  'f0000000-0000-4000-8000-000000000001',
  'Alya Pratama',
  null
)
on conflict do nothing;

insert into public.projects (id, user_id, title, description, budget)
values
  (
    'f1000000-0000-4000-8000-000000000001',
    'f0000000-0000-4000-8000-000000000001',
    'Serverless Task Odyssey',
    'Membangun dashboard tugas berbasis Next.js dan Supabase dengan validasi server-side serta pengalaman pengguna yang responsif.',
    12500000
  ),
  (
    'f1000000-0000-4000-8000-000000000002',
    'f0000000-0000-4000-8000-000000000001',
    'Edge Media Pipeline',
    'Merancang alur unggah dan optimasi aset visual melalui penyimpanan objek dan CDN edge untuk aplikasi web modern.',
    8400000
  ),
  (
    'f1000000-0000-4000-8000-000000000003',
    'f0000000-0000-4000-8000-000000000001',
    'Realtime Project Hub',
    'Menyediakan workspace kolaboratif dengan relasi proyek-tugas, pembaruan status real-time, dan fondasi akses yang aman.',
    15750000
  )
on conflict do nothing;

insert into public.tasks (id, project_id, title, description, status)
values
  (
    'f2000000-0000-4000-8000-000000000001',
    'f1000000-0000-4000-8000-000000000001',
    'Rancang skema PostgreSQL',
    'Definisikan profil, proyek, tugas, constraint, indeks, dan kebijakan timestamp.',
    'done'
  ),
  (
    'f2000000-0000-4000-8000-000000000002',
    'f1000000-0000-4000-8000-000000000001',
    'Integrasikan Server Actions',
    'Validasi input tugas menggunakan Zod dan proses mutasi melalui Next.js Server Actions.',
    'in_progress'
  ),
  (
    'f2000000-0000-4000-8000-000000000003',
    'f1000000-0000-4000-8000-000000000002',
    'Siapkan penyimpanan aset',
    'Konfigurasikan bucket dan aturan unggah untuk aset gambar proyek.',
    'todo'
  ),
  (
    'f2000000-0000-4000-8000-000000000004',
    'f1000000-0000-4000-8000-000000000002',
    'Aktifkan optimasi edge',
    'Uji pengiriman aset melalui CDN dan evaluasi cache headers.',
    'in_progress'
  ),
  (
    'f2000000-0000-4000-8000-000000000005',
    'f1000000-0000-4000-8000-000000000003',
    'Bangun ringkasan proyek',
    'Tampilkan metrik proyek dan progres tugas dari relasi Supabase.',
    'todo'
  ),
  (
    'f2000000-0000-4000-8000-000000000006',
    'f1000000-0000-4000-8000-000000000003',
    'Verifikasi pembaruan real-time',
    'Pastikan perubahan status tugas tersinkron pada dashboard.',
    'done'
  )
on conflict do nothing;
