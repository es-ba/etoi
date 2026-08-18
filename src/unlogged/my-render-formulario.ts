import { IdFormulario, RespuestasRaiz, ForPk, IdVariable, DatosHdrUaPpal } from "dmencu/dist/unlogged/unlogged/tipos";
import {getDatosByPass, setCalcularVariablesEspecificasOperativo, respuestasForPk} from "dmencu/dist/unlogged/unlogged/bypass-formulario";

setCalcularVariablesEspecificasOperativo((respuestasRaiz:RespuestasRaiz, forPk:ForPk)=>{
    //ajustar variables
    if(forPk.formulario == 'F:S1_SUP' as IdFormulario){
        let hogar = forPk.hogar as number - 1;
        if(respuestasRaiz.hogares && respuestasRaiz.hogares[hogar]){
            let respuestasHogarSup = respuestasRaiz.hogares_sup[hogar];
            let respuestasHogar = respuestasRaiz.hogares[hogar];
            respuestasHogarSup.resp_indi_sup = respuestasHogar.msnombre;
            if(respuestasHogar.personas && respuestasHogar.personas instanceof Array){
                respuestasHogarSup.resp_comp_ed_sup = respuestasHogar.personas[0]?.edad;
                respuestasHogarSup.resp_comp_sup = respuestasHogar.personas[0]?.nombre;
                respuestasHogarSup.resp_indi_ed_sup = 
                    respuestasHogar.cr_num_miembro?
                        respuestasHogar.personas[respuestasHogar.cr_num_miembro -1]?.edad
                    :null;
            }
        }
    }
    if(forPk.formulario == 'F:RE' as IdFormulario){
        let {respuestas} = respuestasForPk(forPk);
        if(respuestasRaiz.rea_web == '1' || respuestasRaiz.rea_tel == '1' || respuestasRaiz.rea_pres == '1'){
            const datosByPassViv= getDatosByPass().informacionHdr[forPk.vivienda];
            var infoSeleccionadoyCita=datosByPassViv.tem.cita;
            var posSeparador=infoSeleccionadoyCita.indexOf('//');
            var infoSeleccionado= posSeparador==-1?infoSeleccionadoyCita: infoSeleccionadoyCita.slice(posSeparador + 2) ;
            var infoSeleccionadoJson=JSON.parse(infoSeleccionado.replace(/""/g,'"'));

            //respuestas['msi' as IdVariable] = respuestas['$p0' as IdVariable];
            respuestas['msnombrei' as IdVariable] = infoSeleccionadoJson.nombre;
            respuestas['msedadi'as IdVariable] = infoSeleccionadoJson.edad;
            let idBlaise = datosByPassViv.codigosBlaise[forPk.vivienda]?.idblaise;
            if(idBlaise){
                respuestas['id_blaise' as IdVariable] = idBlaise;
                let idParseado = idBlaise.toString().split('');
                idParseado.splice(6,0,"-");
                idParseado.splice(3,0,"-");
                idParseado = idParseado.join('');
                respuestas['id_blaise_parseado' as IdVariable] = idParseado;
            }else{
                //throw Error ("no hay id de blaise asignado para el hogar")
            }
            respuestas['$B.F:I1' as IdVariable] = null;
            respuestas['total_i1' as idVariable] = 1;
        }else {
            respuestas['msnombrei' as IdVariable] = null;
            respuestas['id_blaise' as IdVariable] = null;
            respuestas['id_blaise_parseado' as IdVariable] = null;
            respuestas['total_i1' as idVariable] = null;
            //respuestas['$B.F:I1' as IdVariable] = 'ok'
        
        }
    }    
})