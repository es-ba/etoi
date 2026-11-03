export const defConfig=`
server:
  port: 3075
  base-url: /etoi271
  session-store: memory
db:
  user: etoi271_admin
  motor: postgresql
  host: localhost
  database: etoi271_db
  schema: base
install:
  dump:
    db:
      owner: etoi271_owner
      apply-generic-user-replaces: true
    admin-can-create-tables: true
    enances: inline
    skip-content: true
    scripts:
      prepare:
      - ../node_modules/operativos/install/rel_tabla_relacionada.sql
      - ../node_modules/dmencu/install/esquema_comun.sql
      - ../node_modules/meta-enc/install/prepare.sql
      - ../node_modules/varcal/install/wrappers.sql
      - ../node_modules/operativos/install/sql2tabla_datos.sql
      - schema-backups.sql
      post-adapt:
      - ../node_modules/pg-triggers/lib/recreate-his.sql
      - ../node_modules/pg-triggers/lib/table-changes.sql
      - ../node_modules/pg-triggers/lib/function-changes-trg.sql
      - ../node_modules/pg-triggers/lib/enance.sql
      - ../node_modules/meta-enc/install/casilleros_orden_total_fun.sql
      - ../node_modules/meta-enc/install/casilleros_jerarquizados_fun.sql
      - ../node_modules/consistencias/install/try_sql.sql
      - ../node_modules/dmencu/install/sincro_tareas_areas_tareas_tem_trg.sql
      - ../node_modules/dmencu/install/sincronizacion_tareas_tem.sql
      - ../node_modules/dmencu/install/sincronizacion_tem.sql
      - ../node_modules/dmencu/install/control_disform_cerrado_trg.sql
      - ../node_modules/dmencu/install/control_cargado_tareas_tem_trg.sql
      - ../node_modules/dmencu/install/generador_accion_cumple_condicion.sql
      - ../node_modules/dmencu/install/tarea_cumple_condicion.sql
      - ../node_modules/dmencu/install/momento_consistencia_cumple_condicion.sql
      - ../node_modules/dmencu/install/agregar_historial_tem_trg.sql
      - ../node_modules/dmencu/install/carga_inicial_tareas_tem.sql
      - ../node_modules/dmencu/install/validar_tareas_tem_trg.sql
      - ../node_modules/dmencu/install/asignar_desasignar_tareas_tem_trg.sql
      - ../node_modules/dmencu/install/desverificar_tarea_trg.sql
      - ../node_modules/dmencu/install/inicial_update_varcal_por_encuesta.sql
      - ../node_modules/dmencu/install/desintegrarpk.sql
      - ../node_modules/dmencu/install/actualizar_inconvar.sql
login:
  infoFieldList: [usuario, rol, idper]
  table: usuarios
  userFieldName: usuario
  passFieldName: md5clave
  rolFieldName: rol
  activeClausule: activo
  lockedClausule: not activo
  plus:
    maxAge-5-sec: 5000    
    maxAge: 864000000
    maxAge-10-day: 864000000
    allowHttpLogin: true
    fileStore: false
    skipCheckAlreadyLoggedIn: true
    loginForm:
      usernameLabel: usuario
      passwordLabel: clave
      buttonLabel: entrar
      formImg: img/login-lock-icon.png
    chPassForm:
      usernameLabel: usuario
      oldPasswordLabel: clave anterior
      newPasswordLabel: nueva clave
      repPasswordLabel: repetir nueva clave
      buttonLabel: Cambiar
      formTitle: Cambio de clave
  messages:
    userOrPassFail: el nombre de usuario no existe o la clave no corresponde
    lockedFail: el usuario se encuentra bloqueado
    inactiveFail: es usuario está marcado como inactivo
client-setup:
  cursors: true
  lang: es
  menu: true
  deviceWidthForMobile: device-width
  user-scalable: no
`