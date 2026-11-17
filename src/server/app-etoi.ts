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

const APP_DM_VERSION="#26-11-12";

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
        menuAsignacion.menuContent = menuAsignacion.menuContent.filter((item:MenuInfoBase) => !['ingresador'].includes(item.name))
        return menuAsignacion;
    }

    getMenuRecepcion(context:Context){
        let menuRecepcion = super.getMenuRecepcion(context);
        menuRecepcion.menuContent = menuRecepcion.menuContent.filter((item:MenuInfoBase) => !['ingresador'].includes(item.name))
        return menuRecepcion;
    }

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
        });

        be.appendToTableDefinition('tareas_tem',function(tableDef:TableDefinition){
            tableDef.hiddenColumns=tableDef.hiddenColumns?.filter(element => element !='semana');
           // console.log('camposhidden', tableDef.hiddenColumns )
            tableDef.fields.push(
                {name:'semana'               , typeName:'integer' , editable: false, inTable: false },
            );
            tableDef.sql!.from = tableDef.sql!.from!.replace(
                'select tt.tarea, t.operativo, t.enc, t.area',
                'select tt.tarea, t.operativo, t.enc, t.area, t.semana '
            );
        })
    }
  }
}
