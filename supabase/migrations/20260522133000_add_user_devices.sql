create extension if not exists pgcrypto;

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Schimmeldetektor',
  device_token text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists devices_owner_id_idx on public.devices (owner_id);

alter table public.devices enable row level security;

drop policy if exists "Users can read own devices" on public.devices;
create policy "Users can read own devices"
  on public.devices
  for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can create own devices" on public.devices;
create policy "Users can create own devices"
  on public.devices
  for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users can update own devices" on public.devices;
create policy "Users can update own devices"
  on public.devices
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own devices" on public.devices;
create policy "Users can delete own devices"
  on public.devices
  for delete
  using (auth.uid() = owner_id);

alter table public.sensor_readings
  add column if not exists device_id uuid references public.devices(id) on delete cascade;

create index if not exists sensor_readings_device_recorded_at_idx
  on public.sensor_readings (device_id, recorded_at desc);

drop policy if exists "Anyone can read sensor readings" on public.sensor_readings;

drop policy if exists "Users can read readings for own devices" on public.sensor_readings;
create policy "Users can read readings for own devices"
  on public.sensor_readings
  for select
  using (
    exists (
      select 1
      from public.devices
      where devices.id = sensor_readings.device_id
        and devices.owner_id = auth.uid()
    )
  );
