-- Create tables for Boiling Crab prize redemption app

create extension if not exists "uuid-ossp";

create table if not exists staff (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists prizes (
  id uuid primary key default uuid_generate_v4(),
  label text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists redemptions (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid not null references staff(id),
  prize_id uuid not null references prizes(id),
  redeemed_at date not null default current_date,
  manager text,
  created_at timestamptz not null default now()
);

create or replace view redemptions_view as
select r.id,
       r.staff_id,
       r.prize_id,
       r.redeemed_at,
       r.manager,
       r.created_at,
       s.name as staff_name,
       p.label as prize_label
from redemptions r
join staff s on r.staff_id = s.id
join prizes p on r.prize_id = p.id;

-- Enable row level security and block by default
alter table staff enable row level security;
alter table prizes enable row level security;
alter table redemptions enable row level security;

-- Policies that deny all access by default
drop policy if exists block_staff on staff;
drop policy if exists block_prizes on prizes;
drop policy if exists block_redemptions on redemptions;
create policy block_staff on staff for all using (false);
create policy block_prizes on prizes for all using (false);
create policy block_redemptions on redemptions for all using (false);

-- Seed data for staff and prizes
insert into staff (name) values ('Alice'), ('Bob'), ('Charlie') on conflict (name) do nothing;
insert into prizes (label) values ('Free Meal'), ('Extra Day Off'), ('Gift Card') on conflict (label) do nothing;