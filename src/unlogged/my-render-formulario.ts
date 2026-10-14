import { IdFormulario, RespuestasRaiz, ForPk, IdVariable, DatosHdrUaPpal } from "dmencu/dist/unlogged/unlogged/tipos";
import {getDatosByPass, setCalcularVariablesEspecificasOperativo, respuestasForPk} from "dmencu/dist/unlogged/unlogged/bypass-formulario";

setCalcularVariablesEspecificasOperativo((_respuestasRaiz:RespuestasRaiz, forPk:ForPk)=>{
    //ajustar variables
    if(forPk.formulario == 'F:S1_SUP' as IdFormulario){

    }
    if(forPk.formulario == 'F:RE' as IdFormulario){
     
    }    
})