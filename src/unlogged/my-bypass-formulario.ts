import { Respuestas, IdUnidadAnalisis, IdVariable, } from "dmencu/dist/unlogged/unlogged/tipos";
import {setCalculoReaNoRea, getEstructura} from "dmencu/dist/unlogged/unlogged/bypass-formulario";
import { strict as likeAr, beingArray } from "like-ar";


/* de operativo PREJU
var esRealizada = (respuestas:Respuestas)=>{
    //TODO GENERALIZAR
    var esRea = false;
    var codRea:number|null= null;
    if(!respuestas['identif' as IdVariable]){
        return {codRea, esRea}
    }else if(respuestas['identif' as IdVariable]==2 ||respuestas['resid_hog' as IdVariable]==2||respuestas['contact' as IdVariable]==2){
        codRea = 2;
        esRea = false;
    }else{
        var reahs: number[]=[] ;
        var respuestasHs = respuestas['hogares'];
        if(respuestasHs){
            for(let respuestasH of respuestasHs){
                var reah:number;
                var selec:number;
                if(respuestasH['entrea' ] != 1||respuestasH['prejue1']==2||respuestasH['tp']==0){
                    reah=2;
                }else{
                    selec=respuestasH['cr_num_miembro']
                    if(respuestasH['personas'] && respuestasH.personas[selec-1] ){
                        var respuestasP = respuestasH.personas[selec-1];
                        var resp_entrea_ind = respuestasP['entreaind' as IdVariable ];
                        if(resp_entrea_ind==null){ //queremos contemplar el undefined
                            reah = 3;
                        }else{
                            reah = Number(resp_entrea_ind);
                        }
                    }else{
                        reah = 3;
                    }
                }
                reahs.push(reah);
            }
            if (reahs.every(rh=>rh==1)){
                codRea = 1;
                esRea = true;
            }else if(reahs.every(rh=>rh==2)){
                codRea = 2;
                esRea = false;
            }else if(reahs.every(rh=>rh==1||rh==3)){
                codRea = 3;
                esRea = false;
            }else{
                codRea = 4;
                esRea = false;
            }
        } else{
            codRea = 3;
            esRea = false;
        }
    }
    return {codRea,esRea}
};
*/
var esRealizada = (respuestas:Respuestas)=>{
    //TODO GENERALIZAR 
    //determinar si fin_1, fin_2, fin_3 se van a tener en cuenta para la rea y cuales de sus valores
    var esRea = false;
    var codRea:number|null= null;
    var vrea_web = respuestas['rea_web' as IdVariable];
    var vrea_tel = respuestas['rea_tel' as IdVariable];
    var vrea_pres = respuestas['rea_pres' as IdVariable];
    var vfin_1 = respuestas['fin_1' as IdVariable];
    var vrazon_tel = respuestas['razon_tel' as IdVariable];
    var vrazon_909 = respuestas['razon_909' as IdVariable];
    var vrazon_999 = respuestas['razon_999' as IdVariable];
    if(!vrea_web && !vrea_tel && !vrea_pres && !vfin_1){
        return {codRea, esRea}
    }else if((vrea_web==2 && vrea_tel==2 && vrea_pres==2)
        ||(vrea_web==1 && !vrea_tel && !vrea_pres && vfin_1==2)
        ||(vrea_web==2 && vrea_tel==1 && !vrea_pres && vfin_1==2)
        ||(vrea_web==2 && vrea_tel==2 && vrea_pres==1 && vfin_1==2)
        ||(vrea_web==2 && vrea_tel==2 && !vrea_pres && (
            (vrazon_tel==909 && vrazon_909== 6)
            ||(vrazon_tel==999 && vrazon_999==1)
        ))

    ){
        codRea = 2;
        esRea = false; 
    }else if(((vrea_web==1 && !vrea_tel && !vrea_pres )
        ||(vrea_web==2 && vrea_tel==1 && !vrea_pres )
        ||(vrea_web==2 && vrea_tel==2 && vrea_pres==1 )) && vfin_1==1
    ){
        codRea = 1;
        esRea = true;
    }else if(
        ((vrea_web==1 && !vrea_tel && !vrea_pres)
            ||(vrea_web==2 && !vrea_tel && !vrea_pres )
            ||(vrea_web==2 && vrea_tel==1 && !vrea_pres )
            ||(vrea_web==2 && vrea_tel==2 && !vrea_pres)
            ||(vrea_web==2 && vrea_tel==2 && vrea_pres==1)
        ) && !vfin_1
    ){
        codRea = 3;
        esRea = false; 
    }else{
            codRea = 5;
            esRea = false;
    }
    return {codRea,esRea}
};
var esRealizadaSup=(respuestas:Respuestas)=>{
    var esReaSup = false;
    var codReaSup:number|null= null;
    var vrea_sup = respuestas['rea_sup' as IdVariable];
    var vrazon_sup = respuestas['razon_sup' as IdVariable];
    var ventrevista_sup = respuestas['entrevista_sup' as IdVariable];

    if(!vrea_sup && !vrazon_sup && !ventrevista_sup) {
        return {codReaSup, esReaSup}
    }else if(vrea_sup==2 && !!vrazon_sup && !ventrevista_sup){
        codReaSup = 2;
        esReaSup = false; 
    }else if(vrea_sup==1 && !vrazon_sup && !!ventrevista_sup){
        codReaSup = 1;
        esReaSup = true;
    }else if((vrea_sup==1 || vrea_sup==2) &&!vrazon_sup && !ventrevista_sup){
        codReaSup = 3;
        esReaSup = false; 
    }else{
        codReaSup = 5;
        esReaSup = false;
    }
   return {codReaSup,esReaSup}
}

//setCalculoReaNoRea(esNoRea, esNoReaSup, esRealizada, esRealizadaSup);