"use strict";

import { AppBackend, emergeAppMetaEnc, emergeAppOperativos, emergeAppRelEnc } from "meta-enc";
import {OperativoGenerator, emergeAppVarCal, emergeAppDatosExt, emergeAppConsistencias, emergeAppProcesamiento, emergeAppDmEncu, pgWhiteList} from 'dmencu';
import { emergeAppetoi } from "./app-etoi";

OperativoGenerator.mainTD = 'viviendas';
OperativoGenerator.mainTDPK = 'vivienda'; // TODO: hacer esto dinámico en paquete consistencias
pgWhiteList.push('blanco','es_fecha','completar_fecha','valida_mesanio_edad');
// funciones de SIEH 1 que usan las calculadas migradas de etoi262 (operaciones/2026-11-18-actualizar_funciones_sieh1_varcal.sql)
pgWhiteList.push('negado','enrango','rango','nulo_a_neutro','round');
var Appetoi = emergeAppetoi(
    emergeAppDmEncu(
        emergeAppProcesamiento(
            emergeAppConsistencias(
                emergeAppDatosExt(
                    emergeAppMetaEnc(
                        emergeAppRelEnc(
                            emergeAppVarCal(
                                emergeAppOperativos(AppBackend)
                            )
                        )
                    )
                )
            )
        )
    )
);

new Appetoi().start();

