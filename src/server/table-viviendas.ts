"use strict";
     
import {TableDefinition, TableContext} from "./types-etoi";
export function viviendas(context:TableContext):TableDefinition {
    var esEditable = context.user.rol==='admin';
    return {
    "name": "viviendas",
    editable: esEditable,    
    "fields": [
        {"name": "operativo", "typeName": "text", "visible": false, "nullable": false},
        {"name": "vivienda", "typeName": "text", "nullable": false},
        {"name": "vdominio", "typeName": "bigint", "visible": false, "nullable": true},
        {"name": "obs_re", "typeName": "text", "nullable": true},
        {"name": "total_vis_web", "typeName": "bigint", "nullable": true},
        {"name": "total_vis_tel", "typeName": "bigint", "nullable": true},
        {"name": "total_vis_pres", "typeName": "bigint", "nullable": true},
        {"name": "fijo", "typeName": "text", "nullable": true},
        {"name": "total_i1", "typeName": "bigint", "nullable": true},
        {"name": "razon_web", "typeName": "bigint", "nullable": true},
        {"name": "razon_tel", "typeName": "bigint", "nullable": true},
        {"name": "razon_707", "typeName": "bigint", "nullable": true},
        {"name": "razon_808", "typeName": "bigint", "nullable": true},
        {"name": "razon_909", "typeName": "bigint", "nullable": true},
        {"name": "razon_pres", "typeName": "bigint", "nullable": true},
        {"name": "razon_1", "typeName": "bigint", "nullable": true},
        {"name": "razon_2", "typeName": "bigint", "nullable": true},
        {"name": "razon_3", "typeName": "bigint", "nullable": true},
        {"name": "razon_4", "typeName": "bigint", "nullable": true},
        {"name": "razon_5", "typeName": "bigint", "nullable": true},
        {"name": "razon_6", "typeName": "bigint", "nullable": true},
        {"name": "razon_7", "typeName": "bigint", "nullable": true},
        {"name": "razon_8", "typeName": "bigint", "nullable": true},
        {"name": "razon_9", "typeName": "bigint", "nullable": true},
        {"name": "rea_web", "typeName": "bigint", "nullable": true},
        {"name": "tel1",    "typeName": "bigint", "nullable": true},
        {"name": "tel2",    "typeName": "bigint", "nullable": true},
        {"name": "tel3",    "typeName": "bigint", "nullable": true},
        {"name": "tel4",    "typeName": "bigint", "nullable": true},
        {"name": "rea_tel", "typeName": "bigint", "nullable": true},
        {"name": "rea_pres", "typeName": "bigint", "nullable": true},
        {"name": "tel5",     "typeName": "text", "nullable": true},
        {"name": "etoi4_esp", "typeName": "bigint", "nullable": true},
        {"name": "razon_999", "typeName": "bigint", "nullable": true},
        {"name": "razon_97", "typeName": "bigint", "nullable": true},
        {"name": "razon_98", "typeName": "bigint", "nullable": true},
        {"name": "razon_99", "typeName": "bigint", "nullable": true},
       
        {"name": "total_vis_sup", "typeName": "bigint", "nullable": true},
        
        {"name": "consistido"    , "label":'consistido' , "typeName": 'timestamp'},
        
        //campos de RE_SUP
        {"name": "tel3_sup", "typeName": "bigint", "nullable": true},
        {"name": "tel2_sup", "typeName": "bigint", "nullable": true},
        {"name": "tel1_sup", "typeName": "bigint", "nullable": true},
        {"name": "rmod", "typeName": "bigint", "nullable": true},
        {"name": "rea_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_9_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_8_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_7_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_6_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_5_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_4_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_3_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_2_sup", "typeName": "bigint", "nullable": true},
        {"name": "razon_1_sup", "typeName": "bigint", "nullable": true},
        {"name": "obs_re_sup", "typeName": "text", "nullable": true},
        {"name": "nombre_sup", "typeName": "text", "nullable": true},
        {"name": "etoi4_esp_sup", "typeName": "text", "nullable": true},
        {"name": "entrevista_sup", "typeName": "bigint", "nullable": true},
        {"name": "coincide_sup", "typeName": "bigint", "nullable": true},

        //campos de personas que agregamos en viviendas provisoriamente para poder guardar
        {"name": "msnombrei",          "typeName": "text",   "nullable": true},
        {"name": "msedadi",            "typeName": "bigint", "nullable": true},
        {"name": "id_blaise",          "typeName": "text",   "nullable": true},
        {"name": "id_blaise_parseado", "typeName": "text",   "nullable": true},
        {"name": "fin_1",              "typeName": "bigint", "nullable": true},
        {"name": "fin_2",              "typeName": "bigint", "nullable": true},
        {"name": "fin_3",              "typeName": "bigint", "nullable": true},
        {"name": "escif",              "typeName": "text",   "nullable": true},
        
        {"name": "obs_faltantes",      "typeName": "text"}
    ],
    "sql": {
        "isReferable": true
    },
    "primaryKey": [
        "operativo",
        "vivienda"
    ],
    "detailTables": [
        {"table": "visitas_web", "fields": ["operativo", "vivienda"], "abr": "vw"},
        {"table": "visitas_tel", "fields": ["operativo", "vivienda"], "abr": "vt"},
        {"table": "visitas_pres", "fields": ["operativo", "vivienda"], "abr": "vp"},
        {"table": "visitas_sup", "fields": ["operativo", "vivienda"], "abr": "vs"},
    ]
};
}