-- Actualizar: quita los campos y la tabla de Blaise/GGS que ya no usa la aplicación.
--  tem: recep_blaise, proie_blaise, lote, grado_matching, observaciones_blaise, resultado_blaise
--  usuarios: usuario_blaise
--  viviendas: id_blaise, id_blaise_parseado
--  tabla tem_blaise
-- Se puede correr más de una vez.
-- Correr con el owner de la base; reemplazar los nombres ficticios por los de la instalación.
--set role etoi_owner;
set search_path = base;

alter table tem drop column if exists recep_blaise;
alter table tem drop column if exists proie_blaise;
alter table tem drop column if exists lote;
alter table tem drop column if exists grado_matching;
alter table tem drop column if exists observaciones_blaise;
alter table tem drop column if exists resultado_blaise;

alter table usuarios drop column if exists usuario_blaise;

alter table viviendas drop column if exists id_blaise;
alter table viviendas drop column if exists id_blaise_parseado;

drop table if exists tem_blaise;
