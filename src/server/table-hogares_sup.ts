"use strict";
                
import {TableDefinition, TableContext} from "./types-etoi";
export function hogares_sup(context:TableContext):TableDefinition {
    var esEditable=context.user.rol==='admin';
    return {
    "name": "hogares_sup",
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
            "name": "obs_hogar_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "resp_comp_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "resp_comp_ed_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "resp_indi_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "resp_indi_ed_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "spr1_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "entrea_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "sp4",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "sp5_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "spr2_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "fecha_realiz_sup",
            "typeName": "date",
            "nullable": true
        },
        {
            "name": "nombres_componentes_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "total_m_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "sorteo_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "total_rango_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "nro_miembro_sel_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "nombre_miembro_sel_sup",
            "typeName": "text",
            "nullable": true
        },
        {
            "name": "nro_mie_sel_ing_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "spr3_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon1_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon_7_1h_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon_8_1_sup",
            "typeName": "bigint",
            "nullable": true
        },
        {
            "name": "razon_9_1h_sup",
            "typeName": "bigint",
            "nullable": true
        },
        // variables de los casilleros de pcetoi (tabledef_generate de meta-enc)
        {"name": "s1_sup_obs",         "typeName": "text",    "nullable": true},
        {"name": "sp5",                "typeName": "text",    "nullable": true},
        {"name": "sp5a",               "typeName": "bigint",  "nullable": true},
        {"name": "sp6",                "typeName": "bigint",  "nullable": true},
        {"name": "sp7",                "typeName": "bigint",  "nullable": true},
        {"name": "sp8",                "typeName": "bigint",  "nullable": true},
        {"name": "sp9",                "typeName": "bigint",  "nullable": true},
        {"name": "sp10_d",             "typeName": "bigint",  "nullable": true},
        {"name": "sp10_m",             "typeName": "bigint",  "nullable": true},
        {"name": "sp10_a",             "typeName": "bigint",  "nullable": true},
        {"name": "sp12",               "typeName": "bigint",  "nullable": true},
        {"name": "sp13",               "typeName": "bigint",  "nullable": true},
        {"name": "sp14",               "typeName": "bigint",  "nullable": true},
        {"name": "sp15",               "typeName": "bigint",  "nullable": true},
        {"name": "sp16",               "typeName": "bigint",  "nullable": true},
        {"name": "sp16b",              "typeName": "bigint",  "nullable": true},
        {"name": "sp17",               "typeName": "bigint",  "nullable": true},
        {"name": "sp19_34",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_35",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_36",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_2",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_3",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_4",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_5",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_6",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_7",             "typeName": "bigint",  "nullable": true},
        {"name": "sp19_13",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_13a",           "typeName": "bigint",  "nullable": true},
        {"name": "sp19_81",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_82",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_11",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_32",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_31",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_12",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_10",            "typeName": "bigint",  "nullable": true},
        {"name": "sp19_especificar",   "typeName": "text",    "nullable": true},
        {"name": "sp20",               "typeName": "bigint",  "nullable": true},
        {"name": "sp21",               "typeName": "bigint",  "nullable": true},
        {"name": "sp22",               "typeName": "bigint",  "nullable": true},
        {"name": "sp23",               "typeName": "bigint",  "nullable": true}
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
            "table": "personas_sup",
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