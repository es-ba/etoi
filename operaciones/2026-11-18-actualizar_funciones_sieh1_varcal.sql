-- Funciones de SIEH 1 que usan las variables calculadas migradas de etoi262 y no existen en dmencu
-- (blanco e informado ya vienen con dmencu, en el esquema comun). Mismas definiciones que comun.* de SIEH 1,
-- con tipos bigint porque las columnas de dmencu son bigint (con integer no las encuentra: no hay cast implícito).
-- Idempotente. Uso: psql -U postgres -d <base> -f 2026-11-18-actualizar_funciones_sieh1_varcal.sql
-- set role <app>_owner;
\set ON_ERROR_STOP on
create schema if not exists comun;

create or replace function comun.negado(pboolonull boolean) returns boolean
  language sql immutable as $$ select pboolonull is not true $$;

-- 1 si el valor está en el rango, 0 si no (sirve para contar)
create or replace function comun.enrango(p_valor bigint, p_minimo bigint, p_maximo bigint) returns integer
  language sql immutable as $$ select case when (p_valor >= p_minimo and p_valor <= p_maximo) then 1 else 0 end $$;

-- el valor si está en el rango, 0 si no (sirve para sumar)
create or replace function comun.rango(p_valor bigint, p_minimo bigint, p_maximo bigint) returns bigint
  language sql immutable as $$ select case when (p_valor >= p_minimo and p_valor <= p_maximo) then p_valor else 0 end $$;

create or replace function comun.nulo_a_neutro(bigint) returns bigint
  language sql immutable as $$ select coalesce($1, 0) $$;
create or replace function comun.nulo_a_neutro(numeric) returns numeric
  language sql immutable as $$ select coalesce($1, 0) $$;
create or replace function comun.nulo_a_neutro(text) returns text
  language sql immutable as $$ select coalesce($1, '') $$;
