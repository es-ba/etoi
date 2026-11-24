-- Actualiza las expresiones de las variables calculadas migradas de sieh1 en una base de pcetoi existente, para que
-- queden como las deja ahora dmencu-data/operaciones/migrar_varcal.sql:
--  - comuna -> nrocomuna;
--  - not sin paréntesis -> not (...), que expre-parser exige;
--  - deshace dos adaptaciones de una versión anterior del migrador que ya no hacen falta: *1.0/ vuelve a /
--    (varcal divide con div0err, en numeric) y coalesce(x <> v, true) vuelve a x is distinct from v
--    (expre-parser lo acepta desde la versión que lo agrega).
-- Requiere expre-parser con soporte de is distinct from. Idempotente.
-- Uso: psql -U postgres -d <base> -f 2026-11-24-actualizar_expresiones_calculadas_sieh1.sql
\set ON_ERROR_STOP on
set search_path = base;
begin;
create function pg_temp.adaptar_expresion_sieh1(p_expresion text) returns text language sql immutable as $$
  select regexp_replace(regexp_replace(regexp_replace(regexp_replace(
    replace(p_expresion, '*1.0/', '/'),
    -- coalesce(x <> v, true) -> x is distinct from v (solo la forma exacta que generaba el migrador anterior)
    'coalesce\(([a-z_][a-z0-9_]*) <> (\(\s*-?[0-9]+\s*\)|-?[0-9]+), true\)', '\1 is distinct from \2', 'gi'),
    '\mcomuna\M', 'nrocomuna', 'g'),
    '\mnot\s+([a-z_][a-z0-9_]*\s*\([^()]*\))', 'not (\1)', 'gi'),
    '\mnot\s+([a-z_][a-z0-9_]*\s*(=|<>|<=|>=|<|>)\s*-?[0-9]+)', 'not (\1)', 'gi')
$$;
update variables_opciones
   set expresion_condicion = pg_temp.adaptar_expresion_sieh1(expresion_condicion),
       expresion_valor     = pg_temp.adaptar_expresion_sieh1(expresion_valor)
 where operativo = 'pcetoi' and tabla_datos in ('personas_calculada', 'hogares_calculada')
   and (expresion_condicion is distinct from pg_temp.adaptar_expresion_sieh1(expresion_condicion)
     or expresion_valor     is distinct from pg_temp.adaptar_expresion_sieh1(expresion_valor));
select count(*) filter (where expresion_condicion ~* '\mis distinct from\M') as opciones_con_distinct,
       count(*) filter (where expresion_condicion ~ '\*1\.0/' or expresion_valor ~ '\*1\.0/') as opciones_con_1_0,
       count(*) filter (where expresion_condicion ~ '\mnrocomuna\M' or expresion_valor ~ '\mnrocomuna\M') as opciones_con_nrocomuna
  from variables_opciones where operativo = 'pcetoi';
commit;
