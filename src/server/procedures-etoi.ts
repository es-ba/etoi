"use strict";

import { ProcedureDef, TableDefinition, Client, ProcedureContext, CoreFunctionParameters } from "./types-etoi";
import {json, jsono} from "pg-promise-strict";
import { setHdrQuery, getOperativoActual } from "dmencu/dist/server/server/procedures-dmencu"
import { IdUnidadAnalisis } from "dmencu/dist/server/unlogged/tipos";

setHdrQuery((quotedCondViv:string, context:ProcedureContext, unidadAnalisisPrincipal:IdUnidadAnalisis)=>{
    return `
    with ${context.be.db.quoteIdent(unidadAnalisisPrincipal)} as 
        (select enc, t.json_encuesta as respuestas, t.resumen_estado as "resumenEstado", 
            jsonb_build_object(
                'dominio'       , dominio       ,
                'nomcalle'      , nomcalle      ,
                'sector'        , sector        ,
                'edificio'      , edificio      ,
                'entrada'       , entrada       ,
                'nrocatastral'  , nrocatastral  ,
                'piso'          , piso          ,
                'departamento'  , departamento  ,
                'habitacion'    , habitacion    ,
                'casa'          , casa          ,
                'prioridad'     , reserva+1     ,
                'observaciones' , tt.carga_observaciones ,
                'cita'          , nullif (concat_ws('//', cita, seleccionado_ant),'') ,
                'carga'         , t.area,
                'semana'        , semana
            ) as tem, t.area,
            jsonb_build_object(
                'tarea', tarea,
                'fecha_asignacion', fecha_asignacion,
                'asignado', asignado,
                'main_form', main_form
            ) as tarea,
            min(fecha_asignacion) as fecha_asignacion
            from tem t left join tareas_tem tt using (operativo, enc) left join tareas using (tarea)
            where ${quotedCondViv}
            group by t.operativo, t.enc, t.json_encuesta, t.resumen_estado, dominio, nomcalle,sector,edificio, entrada, nrocatastral, piso,departamento,habitacion,casa,reserva,tt.carga_observaciones, cita, t.area, tarea, fecha_asignacion, asignado, main_form, semana
        )
        select jsonb_build_object(
                ${context.be.db.quoteLiteral(unidadAnalisisPrincipal)}, ${jsono(
                    `select enc, respuestas, jsonb_build_object('resumenEstado',"resumenEstado") as otras from ${context.be.db.quoteIdent(unidadAnalisisPrincipal)}`,
                    'enc',
                    `otras || coalesce(respuestas,'{}'::jsonb)`
                )}
            ) as respuestas,
            ${json(`
                select area as carga, observaciones_hdr as observaciones, min(fecha_asignacion) as fecha
                    from ${context.be.db.quoteIdent(unidadAnalisisPrincipal)} inner join areas using (area) 
                    group by area, observaciones_hdr`, 
                'fecha')} as cargas,
            ${jsono(
                `select enc, jsonb_build_object('tem', tem, 'tarea', tarea) as otras from ${context.be.db.quoteIdent(unidadAnalisisPrincipal)}`,
                    'enc',
                    `otras ||'{}'::jsonb`
                )}
            as "informacionHdr"
`
})

export const procedures : ProcedureDef[] = [
    // {
    //     action:'limpiar_individual',
    //     parameters:[
    //         {name:'enc'            ,references:'tem'       , typeName:'text'    },
    //         {name:'hogar'          ,references:'personas'  , typeName:'integer' },
    //         {name:'persona'        ,references:'personas'  , typeName:'integer', label:'persona cuyos datos de I1 hay que limpiar' },
    //         {name:'nombre_persona'           , typeName:'text'   , label:'nombre de la persona cuyos datos del I1 hay que limpiar' },
    //         {name:'confirma'                 , typeName:'boolean', defaultValue:false, label:'Confirma borrado de los datos del I1 de la persona? ' },
    //     ],
    //     roles:['subcoordinador','coordinador','admin'],
    //     progress:true,
    //     coreFunction:async function(context:ProcedureContext, params: CoreFunctionParameters<{enc:string, hogar:number, persona:number, nombre_persona:string, confirma:boolean}>):Promise<string> {
    //         if (!params.confirma){
    //             throw new Error('No confirmó la limpieza')
    //         }

    //         const OPERATIVO = await getOperativoActual(context);
    //         // validar que no sea el seleccionado
    //         const seleccionado = (await context.client.query(`
    //             SELECT case when con_dato(cr_num_miembro_ing) and cr_num_miembro_ing<=1 and cr_num_miembro_ing<=total_m then cr_num_miembro_ing else cr_num_miembro  end elegido
    //               FROM hogares h 
    //               WHERE operativo=$1 and vivienda=$2 and hogar=$3 
    //         `,[OPERATIVO, params.enc, params.hogar]).fetchUniqueValue()).value;
    //         if (params.persona == seleccionado) {
    //             throw new Error('Error, está queriendo limpiar al seleccionado!');
    //         }
    //         //validar nombre 
    //         const nombre_per=(await context.client.query(`
    //             select nombre from personas where operativo=$1 and vivienda=$2 and hogar=$3 and persona=$4
    //             `,[OPERATIVO, params.enc, params.hogar, params.persona]).fetchUniqueValue()).value;
    //          if ( !nombre_per)  {
    //                 throw new Error('Error, la persona a limpiar no existe o su nombre no esta ingresado!');
    //         }            
    //         if (params.nombre_persona !== nombre_per) {
    //                 throw new Error('Error, no coincide el nombre de la persona a limpiar!');
    //         }

    //         const listVarI1=(await context.client.query(`
    //             with recursive subcasilleros(operativo, id_casillero) as (
    //               select operativo, id_casillero, 0::bigint as depth
    //                    FROM casilleros where operativo=$1 and id_casillero='F:I1'
    //               union all
    //                 select c.operativo, c.id_Casillero, s.depth+1
    //                     from subcasilleros s inner join casilleros c 
    //                         on s.operativo = c.operativo and s.id_casillero = c.padre
    //             ), x AS (select  s.*, cr.*
    //                 from subcasilleros s, lateral casilleros_recursivo(operativo, id_casillero) cr
    //                 where s.operativo=$2 
    //                 order by s.depth desc, orden_total desc
    //             )
    //             select string_agg(quote_literal(var_name), '-' order by orden_total) jsonKeyBorrado, string_agg (concat(var_name,'=null'),', ') setUpd   from casilleros c , x
    //             where x.operativo=c.operativo and x.id_casillero=c.id_casillero
    //                 and c.var_name is not null
    //             `,[OPERATIVO,OPERATIVO]).fetchUniqueRow()).row;

    //         var pos_hog:number=params.hogar-1;
    //         var pos_per:number=params.persona-1;
    //         var strUpdTem=`
    //           update tem set json_encuesta=jsonb_set(json_encuesta,'{hogares,${pos_hog},personas,${pos_per}}',
    //             (json_encuesta#>('{hogares,${pos_hog},personas,${pos_per}}')) - ${listVarI1.jsonkeyborrado} )
    //             where operativo=$1 and enc=$2
    //         `;
    //         await context.client.query(strUpdTem
    //           , [ OPERATIVO, params.enc]
    //         ).execute();
    //         var strUpdPer=`
    //           update personas 
    //             set ${listVarI1.setupd}
    //             where operativo=$1 and vivienda=$2 and hogar=$3 and persona=$4
    //         `;
    //         await context.client.query(strUpdPer
    //           , [ OPERATIVO, params.enc, params.hogar, params.persona]
    //           ).execute();

    //         /*
    //         UPDATE tem set json_encuesta=jsonb_set(json_encuesta,'{hogares,vhogar-1,personas,vpersona-1}',
    //         (json_encuesta#>('{hogares,vhogar-1,personas,vpersona-1}')) 
    //         -'msi'-'msnombrei'-'msedadi'-'entreaind'-'movili'-'correoi'-'fecha_cita'-'hora_cita'-'resulcita'-'reams'-'telms'-'correoms'-'nacms'-'id_blaise'-'id_blaise_parseado'-'fin_1'-'fin_2'-'escif'-'fin_3'
    //         )
    //         where enc=venc 
    //         */
    //         return (`Listo. Limpieza realizada en la persona ${params.persona} del hogar ${params.hogar} encuesta ${params.enc}. Por favor consista la encuesta`)
    //     }        
    // },
    
];
