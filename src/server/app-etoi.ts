"use strict";

import * as dmencu from "./types-etoi";
import {Context, TableContext, Request, OptsClientPage, TableDefinition, MenuInfoBase } from "./types-etoi";
import {defConfig} from "./def-config"
import {procedures} from "./procedures-etoi"

import { viviendas           } from './table-viviendas';
import { visitas             } from './table-visitas';
import { hogares             } from './table-hogares';
import { visitas_web         } from './table-visitas_web';
import { visitas_tel         } from './table-visitas_tel';
import { visitas_pres        } from './table-visitas_pres';
import { personas            } from './table-personas';
import { visitas_sup         } from './table-visitas_sup';
import { hogares_sup         } from './table-hogares_sup';
import { personas_sup        } from './table-personas_sup';

const APP_DM_VERSION="#26-08-05";

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppetoi<T extends Constructor<dmencu.AppAppDmEncuType>>(Base:T){
  return class AppEtoi extends Base{
    constructor(...args:any[]){ 
        super(args);
    }
    
    configStaticConfig(){
        super.configStaticConfig();
        this.setStaticConfig(defConfig);
    }

    async getProcedures(){
        var parentProc = await super.getProcedures()
        return parentProc.concat(procedures);
    }

    clientIncludes(req:Request, hideBEPlusInclusions:OptsClientPage){
        return super.clientIncludes(req, hideBEPlusInclusions).concat([
            { type: 'js', src: 'client/etoi.js' },
            { type: 'js', src: 'my-bypass-formulario.js' },
            { type: 'js', src: 'my-render-formulario.js' },
        ])
    }
    async createResourcesForCacheJson(){
        var be = this;
        var jsonResult = await super.createResourcesForCacheJson();
        jsonResult.version = APP_DM_VERSION;
        jsonResult.appName = 'etoi';
        jsonResult.cache=jsonResult.cache.concat([
            "my-render-formulario.js",
            'my-bypass-formulario.js'
        ])
        return jsonResult
    }
    getColorsJson(sufijo:'_test'|'_capa'|''){
        let miSufijo: '_prod'|'_test'|'_capa' = sufijo || '_prod';
        let coloresEntornos = {
            "_prod":"#067DB5",
            "_test":"#C47208",
            "_capa":"#880996",
        }
        return {
            "start_url": "../campo",
            "display": "standalone",
            "theme_color": "#3F51B5",
            "background_color": coloresEntornos[miSufijo]
        }
    }

    getMenuAsignacion(context:Context){
        let menuAsignacion = super.getMenuAsignacion(context);
        menuAsignacion.menuContent = menuAsignacion.menuContent.filter((item) => !['ingresador'].includes(item.name))
        return menuAsignacion;
    }

    getMenuRecepcion(context:Context){
        let menuRecepcion = super.getMenuRecepcion(context);
        menuRecepcion.menuContent = menuRecepcion.menuContent.filter((item) => !['ingresador'].includes(item.name))
        return menuRecepcion;
    }
    /*
    getMenuControles(context:Context){
        let menuControles = []//super.getMenuControles(context);
        menuControles.push({menuType:'proc', name:'encuestas_procesamiento_pasar', label: 'pasar encuestas a procesamiento'})
        menuControles.push({menuType:'table', name:'resumen', table:'control_resumen', selectedByDefault:true})
        return menuControles;
    }

    getMenuVarios(context:Context){
        let menuVarios = super.getMenuVarios(context);
        menuVarios.menuContent.push({menuType:'table', name:'no_rea'        , label:'no rea'})
        menuVarios.menuContent.push({menuType:'table', name:'no_rea_sup'    , label:'no rea sup'})
        return menuVarios;
    }*/

    prepareGetTables(){
        var be=this;
        super.prepareGetTables();
        this.getTableDefinition={
            ...this.getTableDefinition,
            viviendas,
            visitas,
            hogares,
            personas,
            visitas_sup,
            hogares_sup,
            visitas_web,
            visitas_tel,
            visitas_pres,
            personas_sup,
        }
        // delete(this.getTableDefinition.personas);
        // delete(this.getTableDefinition.personas_sup);
        // delete(this.getTableDefinition.hogares);
        // delete(this.getTableDefinition.hogares_sup);
        // delete(this.getTableDefinition.visitas);
        be.appendToTableDefinition('grilla_hoja_ruta',function(tableDef:TableDefinition, _context?:TableContext){
            tableDef.hiddenColumns=tableDef.hiddenColumns?.filter(element => 
                !['seleccionado_ant','cita'].includes(element)
            );
           // console.log('camposhidden', tableDef.hiddenColumns )
            tableDef.fields.find((field)=>field.name=='semana')!.visible=true;
        });
        be.appendToTableDefinition('tem',function(tableDef:TableDefinition, _context?:dmencu.TableContext){
            tableDef.hiddenColumns=tableDef.hiddenColumns?.filter(element => 
                !['seleccionado_ant','cita','semana'].includes(element)
            );
            tableDef.hiddenColumns?.push('cant_h','cant_p','seleccionado','orden_relevamiento','mapa','rotacion','enc_autogenerado_dm','enc_autogenerado_dm_capa','h4','x','y')
       // console.log('camposhidden', tableDef.hiddenColumns )
            tableDef.fields.find((field)=>field.name=='semana')!.visible=true;
            tableDef.fields.splice(26, 0, 
                {name :'recep_blaise' , typeName: 'text', editable: true  },
            );
            tableDef.fields.splice(27, 0, 
                {name :'proie_blaise' , typeName: 'text', editable: true  },
            );
            tableDef.fields.splice(28, 0, 
                {name :'lote' , typeName: 'text', editable: true  },
            );
            tableDef.fields.splice(29, 0, 
                {name :'grado_matching' , typeName: 'decimal', editable: true  },
            );
            tableDef.fields.splice(30, 0, 
                {name :'observaciones_blaise' , typeName: 'text', editable: true  },
            );
            tableDef.fields.splice(31, 0, 
                {name :'resultado_blaise' , typeName: 'text', editable: true  },
            );
            tableDef.sql!.from = tableDef.sql!.from!.replace(
                'from tem t',
                ',t.recep_blaise, t.proie_blaise, t.lote, t.grado_matching, t.observaciones_blaise, t.resultado_blaise from tem t'
            );
        });

        be.appendToTableDefinition('tareas_tem',function(tableDef:TableDefinition){
            tableDef.hiddenColumns=tableDef.hiddenColumns?.filter(element => element !='semana');
           // console.log('camposhidden', tableDef.hiddenColumns )
            tableDef.fields.splice(26, 0, 
                {name :'recep_blaise'        , typeName: 'text'   , editable: false, inTable: false },
            );
            tableDef.fields.splice(27, 0, 
                {name :'proie_blaise'        , typeName: 'text'   , editable: false, inTable: false },
            );
            tableDef.fields.splice(28, 0, 
                {name :'lote'                , typeName: 'text'   , editable: false, inTable: false },
            );
            tableDef.fields.splice(29, 0, 
                {name :'grado_matching'      , typeName: 'decimal', editable: false, inTable: false },
            );
            tableDef.fields.splice(30, 0, 
                {name :'observaciones_blaise', typeName: 'text'   , editable: false, inTable: false },
            );
            tableDef.fields.push(
                {name:'semana'               , typeName:'integer' , editable: false, inTable: false },
            );
            tableDef.sql!.from = tableDef.sql!.from!.replace(
                'select tt.tarea, t.operativo, t.enc, t.area',
                'select tt.tarea, t.operativo, t.enc, t.area, t.recep_blaise, t.proie_blaise, t.lote, t.grado_matching, t.observaciones_blaise, t.semana, t.resultado_blaise '
            );
        })
        be.appendToTableDefinition('usuarios',function(tableDef:TableDefinition){
            tableDef.fields.push(
                {name:'usuario_blaise' , typeName:'text' , editable: true },
            );
        })
        be.appendToTableDefinition('no_rea',function(tableDef:TableDefinition){
            tableDef.fields.push(
                {name:'orden' , typeName:'bigint' , editable: true },
            );
        })
        be.appendToTableDefinition('no_rea_sup',function(tableDef:TableDefinition){
            tableDef.fields.push(
                {name:'orden' , typeName:'bigint' , editable: true },
            );
        })
        be.appendToTableDefinition('tareas_tem_ingreso',function(tableDef:TableDefinition, _context?:TableContext){
            tableDef.sql!.from = tableDef.sql!.from!.replace(
                "'__implementar_en_operativo_final'",
                `(select concat_ws( '; ',case when seleccionado_ant::jsonb->>'cel' is not null  then concat('cel:',seleccionado_ant::jsonb->>'cel') else null end
                    , case when seleccionado_ant::jsonb->>'tel' is not null  then concat('tel:',seleccionado_ant::jsonb->>'tel') else null end
                    , case when seleccionado_ant::jsonb->>'alternativo' is not null  then concat('otro:',seleccionado_ant::jsonb->>'alternativo') else null end
                    )
                    from tem tel
                        where t.operativo = tel.operativo and t.enc=tel.enc
	                )`
            );
        })        
        //be.appendToTableDefinition('inconsistencias',function(tableDef:TableDefinition, context:Context){
        //    tableDef.fields.splice(2,0,
        //        {name:'persona'     , typeName:'bigint'   , editable: false},
        //    );
        //    tableDef.editable=tableDef.editable || context.puede?.encuestas.justificar;
        //    tableDef.fields.forEach(function(field){
        //        if(field.name=='pk_integrada'){
        //            field.visible=false;
        //        }
        //        if(field.name=='justificacion'){
        //            field.editable=context.forDump || context.puede?.encuestas.justificar;
        //        }
        //    })
        //    tableDef.fields=tableDef.fields.filter(f=>f.name !='hogar');
        //})
    }
  }
}
