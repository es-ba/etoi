-- Da de alta en tabla_datos y variables las tablas de datos que faltaban en una base de pcetoi existente
-- (install/pre-adapt.sql las tenía comentadas). sql2tabla_datos solo agrega lo que falta: se puede correr más de una vez.
-- Uso: psql -U postgres -d <base> -f 2026-11-24-actualizar_tabla_datos_unidades_pcetoi.sql
\set ON_ERROR_STOP on
set search_path = base;
-- set role <app>_owner;
begin;
select sql2tabla_datos('base', t, 'pcetoi')
  from unnest(array['tem', 'viviendas', 'hogares', 'personas', 'visitas', 'visitas_web', 'visitas_tel', 'visitas_pres',
                    'hogares_sup', 'personas_sup', 'visitas_sup']) with ordinality as x(t, orden)
  where exists (select 1 from information_schema.tables where table_schema = 'base' and table_name = x.t)
  order by orden;
select tabla_datos, count(*) as variables from variables where operativo = 'pcetoi' and clase = 'interna'
  group by tabla_datos order by tabla_datos;
commit;
