import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { conjuntos, definirConjunto, getFormattedTime, menuConjuntos } from 'scripts/utils';

const spreadsheetId = '1N0E-4I3rDk6MDddAK_QaaL-8XDGSFXu_mzBE3eFGv5U';
const menuconjuntos = menuConjuntos

export const ingresoSupervisor = addKeyword('1')
    .addAnswer(menuconjuntos, { capture: true }, 
        async (ctx, ctxFn) => {
            try {
                const opcionesValidas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

                // Validar la opción seleccionada
                if (!opcionesValidas.includes(ctx.body)) {
                    return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
                }

                await ctxFn.state.update({ estado: 'Ingreso' });
                const conjuntoSeleccionado = definirConjunto(conjuntos, ctx.body);
                await ctxFn.state.update({ conjunto: conjuntoSeleccionado });

            } catch (error) {
                console.error("Error procesando la solicitud:", error);
                return ctxFn.fallBack("❌ Ocurrió un error, por favor intenta nuevamente.");
            }
        }
    )
    .addAnswer("🗺️ Por favor, envía tu ubicación actual:", { capture: true }, 
        async (ctx, ctxFn) => {

            if (ctx.type !== 'location' || !ctx.latitude || !ctx.longitude) {
                return ctxFn.fallBack("❌ Debes enviar tu ubicación compartiéndola directamente desde WhatsApp.");
            }

            await ctxFn.state.update({ estado: 'Ingreso' });

            const ubicacion = `https://www.google.com/maps?q=${ctx.latitude},${ctx.longitude}`;   

            await ctxFn.state.update({ ubicacion });
        }
    )
    .addAnswer("✅ ¡Gracias por la información! Tu ingreso se ha registrado con éxito. 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            const fecha = getFormattedTime();
            await appendToSheet([ 
                [
                    fecha, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.estado,
                    userInfo.ubicacion
                ]
            ], spreadsheetId , userInfo.conjunto);
            ctxFn.endFlow();
        }
    );