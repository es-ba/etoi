"use strict";

import { TableDefinition, TableContext } from "./types-etoi";
export function visitas_tel(context: TableContext): TableDefinition {
    var esEditable = context.user.rol === 'admin';
    return {
        "name": "visitas_tel",
        editable: esEditable,
        "fields": [
            { "name": "operativo", "typeName": "text", "nullable": false },
            { "name": "vivienda", "typeName": "text", "nullable": false },
            { "name": "visita_tel", "typeName": "bigint", "nullable": false },
            { "name": "anoenc", "typeName": "bigint", "nullable": true },
            { "name": "rol", "typeName": "text", "nullable": true },
            { "name": "per", "typeName": "bigint", "nullable": true },
            { "name": "usu", "typeName": "text", "nullable": true },
            { "name": "fecha", "typeName": "text", "nullable": true },
            { "name": "hora", "typeName": "text", "nullable": true },
            { "name": "anotacion", "typeName": "text", "nullable": true }
        ],
        "sql": {
            "isReferable": true
        },
        "primaryKey": ["operativo", "vivienda", "visita_tel"],
        "detailTables": [],
        "foreignKeys": [
            { "references": "viviendas", "fields": ["operativo", "vivienda"] }
        ]
    };
}