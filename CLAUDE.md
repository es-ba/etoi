# CLAUDE.md — etoi

@node_modules/dmencu/CLAUDE.md

Encuesta Trimestral de Ocupación e Ingresos. App que corre sobre Backend-Plus y PostgreSQL y **extiende la aplicación `dmencu`** (dependencia npm) mediante un mixin: `emergeAppetoi(emergeAppDmEncu(...))` en `src/server/server-etoi.ts`. Funciona en dispositivos móviles mediante offline-first (PWA con service worker), igual que dmencu.

Lo que es común a todas las encuestas (hoja de ruta, asignaciones, motor de tareas, metadatos de formularios) vive en `dmencu`, `meta-enc` y `backend-plus`. Acá sólo van las diferencias de etoi. Antes de tocar comportamiento general, seguir las reglas de dmencu importadas arriba (`node_modules/dmencu/CLAUDE.md`).

---

## Estructura de archivos

- `src/server/` — backend. Cada tabla tiene su archivo `table-*.ts`.
  - `app-etoi.ts`: clase `AppEtoi` que sobreescribe métodos de dmencu (menús, `clientIncludes`, `createResourcesForCacheJson`, `appendToTableDefinition`, etc.).
  - `def-config.ts`: configuración estática (`defConfig`), incluye scripts de instalación de la base (`install.dump.scripts`).
  - `procedures-etoi.ts`: procedimientos propios de etoi; extiende los de dmencu (`setHdrQuery`, `getOperativoActual`).
  - `types-etoi.ts`: re-exporta los tipos de dmencu y define los propios.
- `src/unlogged/` — formulario de relevamiento sin login.
  - `my-bypass-formulario.ts` y `my-render-formulario.ts`: ganchos propios que se conectan a `dmencu/dist/unlogged/unlogged/*`.
  - `offline.jade`, `img/`: plantilla y recursos.
- `src/client/` — `etoi.ts` (cliente propio) y `menu.ts`.
- `src/test/test.ts` — tests (hoy vacío, ver sección de tests).
- `install/` — `operativos.tab`, `parametros.tab`, `pre-adapt.sql`: datos de instalación.
- `dist/` — salida generada por el build. Está en `.gitignore`, no editar ni versionar.

---

> 📝 Los nombres de tablas en `src/server/table-*.ts` son los de la base. Si una tabla de dmencu necesita un cambio para etoi, hacerlo con `be.appendToTableDefinition(...)` en `app-etoi.ts` (como ya se hace con `tareas_tem_ingreso`) antes que copiar el archivo entero.

---

### Stack

- **Base de datos**: PostgreSQL, esquema `base`. Hay dos usuarios: un owner que crea tablas y procedimientos, y un admin que usa el backend. Sus datos de configuración están en `def-config.ts` y en `local-config.yaml`.
- **Dependencia clave**: `dmencu` (ver `package.json`). Al actualizarla, revisar que los imports de `dmencu/dist/...` sigan existiendo.

---

## Configuración local

- `local-config.yaml` (y cualquier `local-*`) contiene credenciales y **no se versiona** (`.gitignore`). `example-local-config.yaml` es la plantilla.
- `def-config.ts` tiene los valores base; la configuración local los pisa.

---

## Compilación

- `npm run build` compila en orden `src/unlogged`, `src/client`, `src/server` y luego corre `mixin-patch`. Cada paso se puede correr por separado (`build-client`, `build-server`, `build-unlogged`).

---

## Contexto de base de datos — esquema `base`

Todos los objetos pertenecen al esquema `base`. Los nombres están en castellano.

### Lógica de negocio en PostgreSQL

Muchas reglas de negocio críticas están implementadas como **funciones almacenadas y triggers en PostgreSQL**, no en el backend Node.js. Esto es una decisión arquitectónica deliberada: garantiza que esas reglas no puedan saltearse aunque alguien modifique el backend.

Los scripts de esa lógica vienen de `dmencu` y de otros paquetes y se cargan desde `def-config.ts` (`install.dump.scripts.post-adapt`). Ejemplos: `sincronizacion_tem.sql`, `control_cargado_tareas_tem_trg.sql`, `tarea_cumple_condicion.sql`, `momento_consistencia_cumple_condicion.sql`.

> ⚠️ Si Claude Code necesita entender o modificar una regla de negocio importante, debe buscar primero si existe una función o trigger en PostgreSQL que la implemente — no asumir que toda la lógica está en TypeScript. Reimplementar en el backend lógica que ya existe en la base de datos introduce duplicación y riesgo de inconsistencia. Buscar en `node_modules/dmencu/install/` y en `install/pre-adapt.sql` antes de agregar lógica nueva.

---

## Casos de prueba

- **Estado actual**: `npm test` ejecuta `mocha ... test/`, pero no existe carpeta `test/` en la raíz y `src/test/test.ts` está vacío. Hoy no hay tests propios de etoi.
- Cuando se agreguen, seguir el esquema de dmencu: `tsc -p src/test` compila a `dist/test/` y mocha corre `dist/test/test.js`. Hay que alinear `package.json` con esa estructura antes de escribir tests.
