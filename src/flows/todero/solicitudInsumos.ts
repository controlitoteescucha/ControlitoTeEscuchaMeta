import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';
import { uploadFileLegacy } from 'scripts/drive';

const spreadsheetId = '1thSgVyj01wDT5aqzpdWAFbGz9VsHIGJW_ZF7mm4VaJk';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC'

// Flujo de agregar productos
export const flujoPedidoInsumosTodero = addKeyword('5')
    .addAnswer("📸Por favor, envíame una foto con los insumos que deseas pedir. 📦✨\n\nAsegúrate de que la foto sea clara y esté bien iluminada. 😊", { capture: true }, 
        async (ctx, ctxFn) => {
            // Verificación corregida
            if (!ctx || !ctx.url) {
                return ctxFn.fallBack("❌ No se pudo obtener la imagen. Por favor, inténtalo nuevamente.");
            }

            // Asignar mimetype por defecto si no viene en el mensaje
            const mimeType = ctx.mimetype || 'image/jpeg'; 
            await ctxFn.state.update({ mimeType: mimeType });

            // Usar directorio temporal del sistema
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
    .addAnswer('📝 *Confirmando tu pedido...*\nEn breve recibirás más información. 🚚', null, async (ctx, ctxFn) => {
        const userInfo = ctxFn.state.getMyState();
        try {
            await appendToSheet([
                [
                    formattedTime,
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