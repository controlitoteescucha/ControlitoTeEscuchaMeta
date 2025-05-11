import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { getFormattedTime } from 'scripts/utils';

const spreadsheetId = '1MaAsMqigyJXIHBFDfM3nMoAtcozBXXwPTHaO4ZbYuNE';

export const salidaSalvavidas = addKeyword('2')
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