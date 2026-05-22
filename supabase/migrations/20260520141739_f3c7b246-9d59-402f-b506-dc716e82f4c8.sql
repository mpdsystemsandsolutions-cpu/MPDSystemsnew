
create table public.sensor_readings (
  id bigserial primary key,
  temperature numeric(5,2) not null,
  humidity numeric(5,2) not null,
  recorded_at timestamptz not null default now()
);

create index sensor_readings_recorded_at_idx on public.sensor_readings (recorded_at desc);

alter table public.sensor_readings enable row level security;

-- Public read access (dashboard is openly readable)
create policy "Anyone can read sensor readings"
  on public.sensor_readings
  for select
  using (true);

-- No insert/update/delete policies: only the server (service role) can write,
-- which bypasses RLS. The public POST endpoint validates a device token.
