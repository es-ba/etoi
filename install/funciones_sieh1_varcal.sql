-- Funciones de SIEH 1 que usan las variables calculadas migradas (blanco e informado ya vienen con dmencu).
-- Tipos bigint porque las columnas de dmencu son bigint. Va en prepare, después de esquema_comun.sql que crea comun.
-- Para bases existentes: operaciones/2026-11-18-actualizar_funciones_sieh1_varcal.sql

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

-- Número de una columna de texto con código numérico (tem.nrocomuna es text en dmencu y comuna era numérica en SIEH 1).
-- Vacío o null -> 0, igual que null2zero con los números, para que las expresiones migradas den lo mismo que en SIEH 1.
-- Si no es un número entero, null.
create or replace function comun.texto_a_numero(p_texto text) returns bigint
  language sql immutable as $$
    select case when nullif(trim(p_texto), '') is null then 0
                when trim(p_texto) ~ '^-?[0-9]+$' then trim(p_texto)::bigint end
  $$;
