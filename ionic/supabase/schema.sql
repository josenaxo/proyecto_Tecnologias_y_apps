create table public.cuentas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null check (length(trim(nombre)) > 0),
  tipo text not null,
  saldo_inicial numeric(14, 0) not null default 0,
  color text not null default '#00d4aa',
  created_at timestamptz not null default now(),
  unique (id, usuario_id)
);

create table public.movimientos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  cuenta_id uuid not null,
  nombre text not null,
  categoria text not null,
  monto numeric(14, 0) not null check (monto > 0),
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  fecha timestamptz not null default now(),
  foreign key (cuenta_id, usuario_id) references public.cuentas(id, usuario_id)
);

create table public.presupuestos (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  categoria text not null,
  limite numeric(14, 0) not null check (limite >= 0),
  primary key (usuario_id, categoria)
);

create table public.metas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null check (length(trim(nombre)) > 0),
  objetivo numeric(14, 0) not null check (objetivo > 0),
  actual numeric(14, 0) not null default 0 check (actual >= 0),
  vence date,
  color text not null default '#00d4aa',
  emoji text not null default '🎯',
  created_at timestamptz not null default now()
);

create index movimientos_usuario_fecha on public.movimientos (usuario_id, fecha desc);
create index movimientos_cuenta on public.movimientos (cuenta_id);

alter table public.cuentas enable row level security;
alter table public.movimientos enable row level security;
alter table public.presupuestos enable row level security;
alter table public.metas enable row level security;

revoke all on public.cuentas, public.movimientos, public.presupuestos, public.metas from anon, authenticated;
grant select, insert on public.cuentas, public.movimientos to authenticated;
grant select, insert, update on public.presupuestos, public.metas to authenticated;

create policy "Leer cuentas propias" on public.cuentas for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy "Crear cuentas propias" on public.cuentas for insert to authenticated
  with check ((select auth.uid()) = usuario_id);

create policy "Leer movimientos propios" on public.movimientos for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy "Crear movimientos propios" on public.movimientos for insert to authenticated
  with check ((select auth.uid()) = usuario_id);

create policy "Leer presupuestos propios" on public.presupuestos for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy "Crear presupuestos propios" on public.presupuestos for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy "Editar presupuestos propios" on public.presupuestos for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

create policy "Leer metas propias" on public.metas for select to authenticated
  using ((select auth.uid()) = usuario_id);
create policy "Crear metas propias" on public.metas for insert to authenticated
  with check ((select auth.uid()) = usuario_id);
create policy "Editar metas propias" on public.metas for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
