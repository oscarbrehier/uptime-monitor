create extension if not exists "uuid-ossp";

-- MONITOR table
create table public.monitors (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    url text not null,
    interval_seconds integer not null default 60,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PING LOGS table
create table public.ping_logs (
    id bigint generated always as identity primary key,
    monitor_id uuid references public.monitors(id) on delete cascade not null,
    status_code integer not null,
    latency_ms integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast time-series queries on logs
create index idx_ping_logs_monitor_time on public.ping_logs(monitor_id, created_at desc);

-- Enable RLS
alter table public.monitors enable row level security;
alter table public.ping_logs enable row level security;

-- RLS policies for MONITORS
create policy "Users can view their own monitors"
    on public.monitors for select
    using (auth.uid() = user_id);

create policy "Users can insert their own monitors"
    on public.monitors for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own monitors"
    on public.monitors for update
    using (auth.uid() = user_id);

create policy "Users can delete their own monitors"
    on public.monitors for delete
    using (auth.uid() = user_id);

-- RLS policies for PING LOGS
create policy "Users can view logs for their monitors"
    on public.ping_logs for select
    using (
        exists (
            select 1 from public.monitors
            where public.monitors.id = public.ping_logs.monitor_id
            and public.monitors.user_id = auth.uid()
        )
    );