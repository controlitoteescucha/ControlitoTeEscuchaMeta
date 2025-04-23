import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot'
import { uploadFileLegacy } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1YWx_MhJ8mSxZiA6RaZv91sX965KMBxtvenN9FdXWdL0';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC';

export const evidenciasTodero = addKeyword('3')
    .addAnswer("📍 *¿En qué ubicación hiciste la actividad?*\nPor favor, descríbela de manera detallada. 😊", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ ubicacion: ctx.body });
        }
    )
    .addAnswer("📝 *¿Sobre qué elemento trabajaste?*\n\nEjemplo: puerta, piso, ventana, etc. 🛠️", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if (!nombreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ *Nombre no válido.* Por favor, ingresa un nombre válido (solo letras y espacios).");
            }
            await ctxFn.state.update({ elemento: ctx.body });
        }
    )
    .addAnswer("📋 *¿Cuál es la actividad que realizaste?*\n\nPor favor, descríbela de manera detallada. 😊", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ actividad: ctx.body });
        }
    )
    .addAnswer("📸 *¡Necesitamos una foto como evidencia!*\n\nPor favor, envíame una imagen de la actividad realizada. 😊", { capture: true }, 
        async (ctx, ctxFn) => {
            if (!ctx || !ctx.url) {
                return ctxFn.fallBack("❌ No se pudo obtener la imagen. Por favor, inténtalo nuevamente.");
            }

            const mimeType = ctx.mimetype || 'image/jpeg'; 
            await ctxFn.state.update({ mimeType: mimeType });

            const tempDir = os.tmpdir();
            const uploadDir = path.join(tempDir, 'whatsapp-uploads');
                
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            try {
                const localPath = await ctxFn.provider.saveFile(ctx, { path: uploadDir });
                await ctxFn.state.update({ localPath: localPath });
            } catch (error) {
                console.error('Error al guardar archivo:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al procesar tu imagen. Por favor, inténtalo nuevamente.");
            }
    
        }
    )
    .addAnswer("✅ *¡Gracias por tu colaboración!*\n\nEl registro de la actividad ha sido exitoso. 😊\n\n¡Tu trabajo es muy valioso para nosotros! 🌟", 
        null, 
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.ubicacion,
                    userInfo.elemento,
                    userInfo.actividad
                ]
            ], spreadsheetId , userInfo.conjunto);
            try {
                await uploadFileLegacy(
                    userInfo.localPath, 
                    `${ctx.from}-${ctx.pushName}`, 
                    userInfo.conjunto, 
                    driveId, 
                    spreadsheetId, 
                    userInfo.mimeType
                );
            } catch (error) {
                console.error('Error al subir archivo:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al subir tu imagen. Por favor, inténtalo nuevamente.");
            } finally {
                if (fs.existsSync(userInfo.localPath)) {
                    fs.unlinkSync(userInfo.localPath);
                }
            }
            ctxFn.endFlow();
        }
    );