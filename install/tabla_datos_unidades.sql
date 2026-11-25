-- Va en post-adapt (las tablas ya existen), como cargar_variables_y_opciones.sql de repsic.
-- Para bases existentes: operaciones/2026-11-24-actualizar_tabla_datos_unidades_pcetoi.sql
-- Da de alta cada tabla de datos en tabla_datos y sus columnas en variables (clase interna), para que varcal,
-- consistencias y tabulados encuentren las variables. Orden: de la unidad principal hacia sus hijas, como en repsic.
select sql2tabla_datos('base', 'tem', 'pcetoi');
select sql2tabla_datos('base', 'viviendas', 'pcetoi');
select sql2tabla_datos('base', 'hogares', 'pcetoi');
select sql2tabla_datos('base', 'personas', 'pcetoi');
select sql2tabla_datos('base', 'visitas', 'pcetoi');
select sql2tabla_datos('base', 'visitas_web', 'pcetoi');
select sql2tabla_datos('base', 'visitas_tel', 'pcetoi');
select sql2tabla_datos('base', 'visitas_pres', 'pcetoi');
select sql2tabla_datos('base', 'hogares_sup', 'pcetoi');
select sql2tabla_datos('base', 'personas_sup', 'pcetoi');
select sql2tabla_datos('base', 'visitas_sup', 'pcetoi');
