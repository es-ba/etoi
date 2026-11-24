"use strict";
                
import {TableDefinition, TableContext} from "./types-etoi";
export function hogares(context:TableContext):TableDefinition {
    var esEditable=context.user.rol==='admin';
    return {
    "name": "hogares",
    editable: esEditable,
    "fields": [
        {
            "name": "operativo",
            "typeName": "text",
            "nullable": false
        },
        {
            "name": "vivienda",
            "typeName": "text",
            "nullable": false
        },
        {
            "name": "hogar",
            "typeName": "bigint",
            "nullable": false
        },

        {
            "name": "observaciones",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "gg1",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "entrea",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "f_realiz_o",
            "typeName": "date",
            "nullable": true
        },
        {
            "name": "fijo",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "los_nombres",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "total_m",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "nombrer",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "sorteo",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "tp",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "cr_num_miembro",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "msnombre",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "cr_num_miembro_ing",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon1",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon2_7",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon2_8",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon2_9",
            "typeName": "bigint",
            "nullable": true
        },
        // variables de los casilleros de pcetoi (tabledef_generate de meta-enc)
        {"name": "s1_obs",             "typeName": "text",    "nullable": true},
        {"name": "total_r",            "typeName": "bigint",  "nullable": true},
        {"name": "respond",            "typeName": "bigint",  "nullable": true},
        {"name": "telefono",           "typeName": "text",    "nullable": true},
        {"name": "movil",              "typeName": "text",    "nullable": true},
        {"name": "correo",             "typeName": "text",    "nullable": true},
        {"name": "a1_obs",             "typeName": "text",    "nullable": true},
        {"name": "v2",                 "typeName": "bigint",  "nullable": true},
        {"name": "v2_esp",             "typeName": "text",    "nullable": true},
        {"name": "v4",                 "typeName": "bigint",  "nullable": true},
        {"name": "h2",                 "typeName": "bigint",  "nullable": true},
        {"name": "h2_esp",             "typeName": "text",    "nullable": true},
        {"name": "h3",                 "typeName": "bigint",  "nullable": true}
    ],
    "sql": {
        "isReferable": true
    },
    "primaryKey": [
        "operativo",
        "vivienda",
        "hogar"
    ],
    "detailTables": [
        {
            "table": "personas",
            "fields": [
                "operativo",
                "vivienda",
                "hogar"
            ],
            "abr": "p"
        }
    ],
    "foreignKeys": [
        {
            "references": "viviendas",
            "fields": [
                "operativo",
                "vivienda"
            ]
        }
    ]
};
}