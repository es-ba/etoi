"use strict";
                
import {TableDefinition, TableContext} from "./types-etoi";
export function personas(context:TableContext):TableDefinition {
    var esEditable=context.user.rol==='admin';
    return {
    "name": "personas",
    editable: esEditable,
    "fields": [
        {"name": "operativo",          "typeName": "text",   "nullable": false},
        {"name": "vivienda",           "typeName": "text",   "nullable": false},
        {"name": "hogar",              "typeName": "bigint", "nullable": false},
        {"name": "persona",            "typeName": "bigint", "nullable": false},
        {"name": "nombre",             "typeName": "text",   "nullable": true},
        {"name": "sexo",               "typeName": "bigint", "nullable": true},
        {"name": "edad",               "typeName": "bigint", "nullable": true},
        {"name": "p4",                 "typeName": "bigint", "nullable": true},
        {"name": "lp",                 "typeName": "bigint", "nullable": true},
        {"name": "l0",                 "typeName": "text",   "nullable": true},
        {"name": "p5",                 "typeName": "bigint", "nullable": true},
        {"name": "p5b",                "typeName": "bigint", "nullable": true},
        {"name": "p6a",                "typeName": "bigint", "nullable": true},
        {"name": "p6b",                "typeName": "bigint", "nullable": true},
        {"name": "p722",               "typeName": "bigint", "nullable": true},
        {"name": "p825",               "typeName": "bigint", "nullable": true},
        {"name": "entreaind",          "typeName": "bigint", "nullable": true},
        {"name": "movili",             "typeName": "text",   "nullable": true},
        {"name": "correoi",            "typeName": "text",   "nullable": true},
        {"name": "fecha_cita",         "typeName": "text",   "nullable": true},
        {"name": "hora_cita",          "typeName": "text",   "nullable": true},
        {"name": "resulcita",          "typeName": "bigint", "nullable": true},
        {"name": "reams",              "typeName": "bigint", "nullable": true},
        {"name": "telms",              "typeName": "text",   "nullable": true},
        {"name": "correoms",           "typeName": "text",   "nullable": true},
        {"name": "nacms",              "typeName": "text",   "nullable": true},

        // SACAMOS ESTOS CAMPOS, Y LOS LLEVAMOS A VIVIENDAS PARA PODER GUARDAR PROVISIONALMENTE
        // {"name": "msi",                "typeName": "bigint", "nullable": true},
        // {"name": "msnombrei",          "typeName": "text",   "nullable": true},
        // {"name": "msedadi",            "typeName": "bigint", "nullable": true},
        // {"name": "id_blaise",          "typeName": "text",   "nullable": true},
        // {"name": "id_blaise_parseado", "typeName": "text",   "nullable": true},
        // {"name": "fin_1",              "typeName": "bigint", "nullable": true},
        // {"name": "fin_2",              "typeName": "bigint", "nullable": true},
        // {"name": "escif",              "typeName": "text",   "nullable": true},
        // {"name": "fin_3",              "typeName": "bigint", "nullable": true},
        // {name: "obs_faltantes", typeName: "text"}

    ],
    "sql": {
        "isReferable": true
    },
    "primaryKey": [
        "operativo",
        "vivienda",
        "hogar",
        "persona"
    ],
    "detailTables": [],
    "foreignKeys": [
        {
            "references": "hogares",
            "fields": [
                "operativo",
                "vivienda",
                "hogar"
            ]
        }
    ]
};
}