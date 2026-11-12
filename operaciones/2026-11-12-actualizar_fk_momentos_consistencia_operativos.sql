-- Actualización a dmencu 3.9.9 (procesamiento 2.0.12 / consistencias 2.0.11).
-- Adapta a etoi el script de dmencu:
--   operaciones/2026-11-12-actualizar_fk_momentos_consistencia_operativos.sql
-- momentos_consistencia tiene clave foránea a operativos (on update cascade).
-- Sin ella, renombrar operativos.operativo falla en consistencias por "consistencias momentos_consistencia REL".
-- Se puede correr más de una vez.
set role etoi274_owner; -- adecuar al entorno
set search_path = base;

alter table momentos_consistencia drop constraint if exists "momentos_consistencia operativos REL";
alter table momentos_consistencia add constraint "momentos_consistencia operativos REL"
  foreign key (operativo) references operativos (operativo) on update cascade;

create index if not exists "operativo 4 momentos_consistencia IDX" ON "momentos_consistencia" ("operativo");
