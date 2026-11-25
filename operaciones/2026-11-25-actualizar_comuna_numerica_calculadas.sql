-- tem.nrocomuna es text en dmencu y las calculadas migradas de SIEH 1 la comparan con números (zona_3, zona_3_1,
-- copiacomuna): Postgres falla con "el operador no existe: text = integer". Crea comun.texto_a_numero y cambia
-- nrocomuna por texto_a_numero(nrocomuna) en las expresiones, como hace ahora el migrador. Requiere
-- 'texto_a_numero' en pgWhiteList (server-etoi.ts). Idempotente.
-- Uso: psql -U postgres -d <base> -f 2026-11-25-actualizar_comuna_numerica_calculadas.sql
\set ON_ERROR_STOP on
set search_path = base;
begin;
-- Número de una columna de texto con código numérico (tem.nrocomuna es text en dmencu y comuna era numérica en SIEH 1).
-- Vacío o null -> 0, igual que null2zero con los números, para que las expresiones migradas den lo mismo que en SIEH 1.
-- Si no es un número entero, null.
create or replace function comun.texto_a_numero(p_texto text) returns bigint
  language sql immutable as $$
    select case when nullif(trim(p_texto), '') is null then 0
                when trim(p_texto) ~ '^-?[0-9]+$' then trim(p_texto)::bigint end
  $$;

update variables_opciones
   set expresion_condicion = regexp_replace(expresion_condicion, '\mnrocomuna\M', 'texto_a_numero(nrocomuna)', 'g'),
       expresion_valor     = regexp_replace(expresion_valor,     '\mnrocomuna\M', 'texto_a_numero(nrocomuna)', 'g')
 where operativo = 'pcetoi' and tabla_datos like '%\_calculada'
   and (expresion_condicion ~ '\mnrocomuna\M' or expresion_valor ~ '\mnrocomuna\M')
   and coalesce(expresion_condicion, '') || coalesce(expresion_valor, '') !~ 'texto_a_numero';
update variables
   set expresion = regexp_replace(expresion, '\mnrocomuna\M', 'texto_a_numero(nrocomuna)', 'g'),
       filtro    = regexp_replace(filtro,    '\mnrocomuna\M', 'texto_a_numero(nrocomuna)', 'g')
 where operativo = 'pcetoi' and clase = 'calculada'
   and (expresion ~ '\mnrocomuna\M' or filtro ~ '\mnrocomuna\M')
   and coalesce(expresion, '') || coalesce(filtro, '') !~ 'texto_a_numero';
select variable, expresion_condicion, expresion_valor from variables_opciones
 where operativo = 'pcetoi' and (expresion_condicion ~ 'nrocomuna' or expresion_valor ~ 'nrocomuna')
 order by variable, orden;
commit;
