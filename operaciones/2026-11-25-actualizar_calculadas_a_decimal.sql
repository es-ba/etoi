-- Las calculadas migradas de SIEH 1 quedaron con tipovar numero (bigint) y varias tienen decimales en SIEH 1
-- (sem_hs, sem_hs1p, sem_hs2p, semhst53bis, meshst53bis, inghort53bisdecl, ...): se redondeaban y arrastraban la
-- diferencia a las que dependen de ellas. En SIEH 1 son numeric: pasan a decimal. varcal recrea las tablas
-- calculadas en cada calculadas_generar, así que el cambio de tipo se aplica al volver a generar. Idempotente.
-- Uso: psql -U postgres -d <base> -f 2026-11-25-actualizar_calculadas_a_decimal.sql
\set ON_ERROR_STOP on
set search_path = base;
begin;
update variables
   set tipovar = 'decimal'
 where operativo = 'pcetoi' and clase = 'calculada' and tipovar = 'numero'
   and tabla_datos in ('hogares_calculada', 'personas_calculada');
select tabla_datos, tipovar, count(*) from variables
 where operativo = 'pcetoi' and clase = 'calculada' group by 1, 2 order by 1, 2;
commit;
