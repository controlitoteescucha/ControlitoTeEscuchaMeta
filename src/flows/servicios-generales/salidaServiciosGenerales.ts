import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1m3Z2v1bxer-lbOgwI4X3VMucwivDFbnXqPw-Ir-6p6s';

export const salidaServiciosGenerales = addKeyword('2')
    .addAnswer("🗺️ Por favor, envía tu ubicación actual:", { capture: true }, 
        async (ctx, ctxFn) => {

            if (ctx.type !== 'location' || !ctx.latitude || !ctx.longitude) {
                return ctxFn.fallBack("❌ Debes enviar tu ubicación compartiéndola directamente desde WhatsApp.");
            }

            await ctxFn.state.update({ estado: 'Salida' });

            const ubicacion = `https://www.google.com/maps?q=${ctx.latitude},${ctx.longitude}`;   

            await ctxFn.state.update({ ubicacion });
        }
    )
    .addAnswer("✅ ¡Gracias por la información! Tu ingreso se ha registrado con éxito. 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
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