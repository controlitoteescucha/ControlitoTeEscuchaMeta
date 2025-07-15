import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot'
import { uploadFileLegacy } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { getFormattedTime } from 'scripts/utils';

const spreadsheetId = '1YWx_MhJ8mSxZiA6RaZv91sX965KMBxtvenN9FdXWdL0';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC';

export const evidenciasTodero = addKeyword('3')
    .addAnswer("📸Por favor, envíame una foto del antes de realizar la actividad.", { capture: true }, 
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
    .addAnswer('✅ *¡Gracias por tu colaboración!*\n\nEl registro de la actividad ha sido exitoso. 😊\n\n¡Tu trabajo es muy valioso para nosotros! 🌟', null, async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            const fecha = getFormattedTime();
            try {
                await appendToSheet([
                    [
                        fecha,
                        userInfo.conjunto,
                        ctx.from,
                        userInfo.nombreCompleto,
                    ]
                ], spreadsheetId, userInfo.conjunto);
            } catch (error) {
                console.log('Error: ' + error);
            }
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
        });