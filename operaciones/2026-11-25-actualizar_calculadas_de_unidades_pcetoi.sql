-- varcal arma los joins pasando por la tabla calculada de cada tabla de la cadena (tem -> viviendas -> hogares -> personas)
-- y exige que cada una tenga su <tabla>_calculada con misma_pk; si falta, falla con "La Tabla de datos undefined no existe".
-- Como en ggs2026: da de alta tem_calculada y <ua>_calculada para cada unidad de análisis que no la tenga (solo con
-- las claves), y las relaciones tem -> principal, unidad -> hijas y tabla -> calculada que falten. Idempotente.
-- Uso: psql -U postgres -d <base> -f 2026-11-25-actualizar_calculadas_de_unidades_pcetoi.sql
\set ON_ERROR_STOP on
set search_path = base;
begin;

create temp table claves_tablas on commit drop as
with recursive claves(unidad_analisis, padre, claves) as (
    select unidad_analisis, padre, array['operativo', pk_agregada]
      from unidad_analisis where operativo = 'pcetoi' and padre is null
    union all
    select u.unidad_analisis, u.padre, c.claves || u.pk_agregada
      from unidad_analisis u join claves c on c.unidad_analisis = u.padre
      where u.operativo = 'pcetoi'
)
select 'tem'::text as tabla, null::text as padre, array['operativo', 'enc'] as claves
union all
select unidad_analisis, coalesce(padre, 'tem'), claves from claves;

-- tablas calculadas que faltan
insert into tabla_datos (operativo, tabla_datos, tipo)
  select 'pcetoi', c.tabla || '_calculada', 'calculada'
    from claves_tablas c
    where exists (select 1 from tabla_datos td where td.operativo = 'pcetoi' and td.tabla_datos = c.tabla)
  on conflict do nothing;

-- sus variables de clave, con el tipo de la tabla base
insert into variables (operativo, tabla_datos, variable, tipovar, clase, es_pk, activa, cerrada, grupo, orden)
  select 'pcetoi', c.tabla || '_calculada', k.clave,
         coalesce((select v.tipovar from variables v
                    where v.operativo = 'pcetoi' and v.tabla_datos = c.tabla and v.variable = k.clave), 'texto'),
         'interna', k.orden, true, true, 'claves', k.orden
    from claves_tablas c, unnest(c.claves) with ordinality as k(clave, orden)
    where exists (select 1 from tabla_datos td where td.operativo = 'pcetoi' and td.tabla_datos = c.tabla || '_calculada')
  on conflict do nothing;

-- relaciones: tabla -> su calculada (misma pk) y padre -> hija
insert into relaciones (operativo, tabla_datos, tiene, misma_pk, tabla_relacionada, aridad)
  select 'pcetoi', c.tabla, c.tabla || '_calculada', true, c.tabla || '_calculada', 1
    from claves_tablas c
    where exists (select 1 from tabla_datos td where td.operativo = 'pcetoi' and td.tabla_datos = c.tabla || '_calculada')
  union all
  select 'pcetoi', c.padre, c.tabla, null, c.tabla, case when c.padre = 'tem' then 1 end
    from claves_tablas c where c.padre is not null
  on conflict do nothing;

insert into rel_vars (operativo, tabla_datos, tiene, orden, tabla_relacionada, campo_datos, campo_tiene)
  select 'pcetoi', c.tabla, c.tabla || '_calculada', k.orden, c.tabla || '_calculada', k.clave, k.clave
    from claves_tablas c, unnest(c.claves) with ordinality as k(clave, orden)
    where exists (select 1 from relaciones r where r.operativo = 'pcetoi' and r.tabla_datos = c.tabla and r.tiene = c.tabla || '_calculada')
  union all
  -- tem.enc es la clave de la unidad principal; el resto se une por las claves del padre
  select 'pcetoi', c.padre, c.tabla, k.orden, c.tabla,
         case when c.padre = 'tem' and k.orden = 2 then 'enc' else k.clave end, k.clave
    from claves_tablas c, unnest(c.claves) with ordinality as k(clave, orden)
    where c.padre is not null and k.orden < array_length(c.claves, 1) + case when c.padre = 'tem' then 1 else 0 end
  on conflict do nothing;

select r.tabla_datos, r.tiene, r.misma_pk, string_agg(v.campo_datos || '=' || v.campo_tiene, ', ' order by v.orden) as campos
  from relaciones r left join rel_vars v using (operativo, tabla_datos, tiene)
  where r.operativo = 'pcetoi'
  group by r.tabla_datos, r.tiene, r.misma_pk order by 1, 2;
commit;
