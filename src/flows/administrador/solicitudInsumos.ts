import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';
import { uploadFileLegacy } from 'scripts/drive';

const spreadsheetId = '1pZay2ko2KsU3_sv1t591bLCMIOlduXHBaksft0Hkw88';
const driveId = '1rt0xak1pFBaMsoTFG-nhLpbajaVUkSh-'

export const flujoPedidoInsumosAdministrador = addKeyword('3')
    .addAnswer("📸 *¡Hola!* Por favor, envíame una foto con los insumos que deseas pedir. 📦✨\n\nAsegúrate de que la foto sea clara y esté bien iluminada. 😊", { capture: true }, 
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
            // Limpiar archivo temporal después de subir
            if (fs.existsSync(userInfo.localPath)) {
                fs.unlinkSync(userInfo.localPath);
            }
        }
        ctxFn.endFlow();
});