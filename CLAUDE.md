# CLAUDE.md — etoi

Encuesta Trimestral de Ocupación e Ingresos. App que corre sobre Backend-Plus y PostgreSQL y **extiende la aplicación `dmencu`** (dependencia npm) mediante un mixin: `emergeAppetoi(emergeAppDmEncu(...))` en `src/server/server-etoi.ts`. Funciona en dispositivos móviles mediante offline-first (PWA con service worker), igual que dmencu.

Lo que es común a todas las encuestas (hoja de ruta, asignaciones, motor de tareas, metadatos de formularios) vive en `dmencu`, `meta-enc` y `backend-plus`. Acá sólo van las diferencias de etoi. Antes de tocar comportamiento general, revisar primero el CLAUDE.md de dmencu (`c:\npm\dmencu\CLAUDE.md`).

---

## Nombres de operativos

- El número del operativo identifica la onda: en `274`, `27` es el año y `4` es el trimestre.
- Al hablar del operativo en general (documentación, explicaciones, mensajes, nombres de funciones o textos de interfaz), **no usar el código numérico**. Usar la descripción, por ejemplo "la encuesta trimestral", "el operativo vigente" o "la onda actual".
- El código sólo aparece cuando es un identificador técnico que el sistema exige (por ejemplo, nombres de usuario de base de datos o valores de la columna `operativo`) o cuando se habla de una onda concreta.
- Esta regla aplica a cualquier operativo, no sólo a etoi.

---

## Estructura de archivos

- `src/server/` — backend. Cada tabla tiene su archivo `table-*.ts` (convención de `backend-plus`). Antes de trabajar con una tabla, leer su archivo: ahí están columnas, labels y validaciones.
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

- **Backend**: Node.js + TypeScript, `backend-plus` como framework base, con `dmencu` como capa de aplicación.
- **Frontend**: pantallas estándar de backend-plus (grillas editables) más la pantalla de relevamiento, que viene de dmencu y se adapta en `src/unlogged` y `src/client`.
- **Base de datos**: PostgreSQL, esquema `base`. Hay dos usuarios: un owner que crea tablas y procedimientos, y un admin que usa el backend. Sus datos de configuración están en `def-config.ts` y en `local-config.yaml`.
- **Dependencia clave**: `dmencu` (ver `package.json`). Al actualizarla, revisar que los imports de `dmencu/dist/...` sigan existiendo.
- **Deploy**: servicio systemd en Ubuntu. Los desarrolladores pueden usar Windows también.

---

## Configuración local

- `local-config.yaml` (y cualquier `local-*`) contiene credenciales y **no se versiona** (`.gitignore`). `example-local-config.yaml` es la plantilla.
- `def-config.ts` tiene los valores base; la configuración local los pisa.

---

## Convenciones de código

- **Todos los tipos deben ser explícitos**. Prohibido usar `any`, casts vía `unknown`, o cualquier magia sin justificación.
  - Si un callback recibe un parámetro sin tipo, tiparlo (por ejemplo `(item:MenuInfoBase) => ...`), no dejarlo implícito.
  - Si existe código de bajo nivel inevitablemente sin tipado estricto, debe estar encapsulado en ubicaciones muy delimitadas y tratado como excepción, no como norma.
- **Compilación sin fallbacks**: el build no tolera errores. No agregar `|| echo "continue w/error"` a los scripts de `package.json`. Un error de compilación se corrige en el código.
- **Preservar el estilo existente** al modificar archivos: incluyendo el uso de `var` donde ya se usa.
- **No tocar el formato de lo que ya existe**: el diff de un cambio debe mostrar sólo las líneas que cambian de verdad.
  - No reindentar, no reformatear, no quitar ni agregar espacios al final de las líneas, y no agregar ni quitar el salto de línea final del archivo.
  - Respetar el fin de línea de cada archivo. Las líneas nuevas van con el mismo fin de línea que el resto del archivo.
  - En Windows no editar con `sed -i` ni herramientas que reescriban el archivo completo, porque pueden convertir CRLF a LF.
  - Antes de commitear, revisar `git diff --stat` contra `git diff --ignore-all-space --ignore-cr-at-eol --stat`. Si dan distinto, hay cambios de formato que hay que revertir.
- Los nombres de tablas, columnas y variables de dominio van **en castellano**, consistente con el esquema de base de datos.
- El código sigue las convenciones de `backend-plus` para definición de tablas, procedimientos y endpoints.

---

## Compilación

- `npm run build` compila en orden `src/unlogged`, `src/client`, `src/server` y luego corre `mixin-patch`. Cada paso se puede correr por separado (`build-client`, `build-server`, `build-unlogged`).
- Si `mixin-patch` se cuelga sin salida, casi seguro hay un `.d.ts` viejo en `dist/` que dispara la regex de `mixin-patch` (catastrophic backtracking). Ya pasó con `dist/server/app-ggs.d.ts`, residuo de un módulo que no existe más. Solución: borrar `dist/` y volver a compilar.
- Los errores de compilación de etoi se resuelven como en dmencu: tipar explícitamente, sin `any` ni casts, y sin relajar el build.

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
- Es necesario definir una batería de tests para cada funcionalidad crítica que se implemente o extienda.

---

## Documentación

- Este repo no tiene `docs/` ni `ayuda/` propios. La ayuda en línea y la documentación general de la aplicación están en `dmencu`.
- Si una funcionalidad propia de etoi cambia lo que ve o usa la persona, documentarla junto al cambio (README o CLAUDE.md, según corresponda).
