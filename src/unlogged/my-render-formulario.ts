import { IdFormulario, RespuestasRaiz, ForPk, IdVariable, DatosHdrUaPpal } from "dmencu/dist/unlogged/unlogged/tipos";
import {getDatosByPass, setCalcularVariablesEspecificasOperativo, respuestasForPk} from "dmencu/dist/unlogged/unlogged/bypass-formulario";

setCalcularVariablesEspecificasOperativo((_respuestasRaiz:RespuestasRaiz, forPk:ForPk)=>{
    if(forPk.formulario == 'F:RE' as IdFormulario){
       
    }    
    if(forPk.formulario == 'F:S1_P' as IdFormulario){
        let {respuestas} = respuestasForPk(forPk);
        respuestas['r0' as IdVariable] = (
                respuestas['r2' as IdVariable] == 1 || respuestas['r3' as IdVariable] == 1 ||
                respuestas['r4' as IdVariable] == 3 || respuestas['r7' as IdVariable] == 2
            )?1:2
    }
})