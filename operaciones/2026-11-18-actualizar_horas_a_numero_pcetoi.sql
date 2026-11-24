-- Las horas trabajadas por día (t31_*, t32_*) y t53_bis2 son en SIEH 1 una CANTIDAD de horas (entero, con códigos
-- -9 y 33), pero el migrador las pasó como tipovar 'hora' (interval de dmencu). Así no se pueden cargar los datos de
-- SIEH 1 ni evaluar las calculadas que las usan (t31_d<0, rango(t31_d,1,24)), por ejemplo las de subocupación.
-- Este script las pasa a 'numero' en una base pcetoi existente: casilleros, variables y columnas de personas.
-- Idempotente. Uso: psql -U postgres -d <base> -f 2026-11-18-actualizar_horas_a_numero_pcetoi.sql
\set ON_ERROR_STOP on
set search_path = base;
do $$ begin execute format('set role %I', (select pg_get_userbyid(relowner) from pg_class where oid = 'base.personas'::regclass)); end $$;
begin;

create temp table horas_numero (variable text primary key) on commit drop;
insert into horas_numero values ('t31_d'),('t31_l'),('t31_ma'),('t31_mi'),('t31_j'),('t31_v'),('t31_s'),
  ('t32_d'),('t32_l'),('t32_ma'),('t32_mi'),('t32_j'),('t32_v'),('t32_s'),('t53_bis2');

update casilleros c set tipovar = 'numero', longitud = '2'
  from horas_numero h where c.operativo = 'pcetoi' and c.var_name = h.variable and c.tipovar = 'hora';

update variables v set tipovar = 'numero'
  from horas_numero h where v.operativo = 'pcetoi' and v.tabla_datos = 'personas' and v.variable = h.variable and v.tipovar = 'hora';

-- columnas: si ya tienen datos cargados como interval, se pasan a cantidad de horas enteras
do $$
declare r record;
begin
  for r in select c.column_name from information_schema.columns c join horas_numero h on h.variable = c.column_name
             where c.table_schema = 'base' and c.table_name = 'personas' and c.data_type = 'interval'
  loop
    execute format('alter table base.personas alter column %I type bigint using (extract(epoch from %I) / 3600)::bigint',
                   r.column_name, r.column_name);
  end loop;
end $$;

-- informe: encuestas que ya tienen alguna de estas variables cargada en el formulario (json_encuesta)
select count(*) as encuestas_con_horas_en_json
  from tem t
  where t.operativo = 'pcetoi' and t.json_encuesta is not null
    and exists (select 1 from horas_numero h
                 where jsonb_path_exists(t.json_encuesta, ('$.**.' || h.variable || ' ? (@ != null)')::jsonpath));

commit;
