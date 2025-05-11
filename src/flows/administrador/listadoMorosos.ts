import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot'
import { uploadFileLegacy } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { getFormattedTime } from 'scripts/utils';

const spreadsheetId = '1FUsUMxnrnMfK4DAwIMGpCygmNW8hbcYIN-IIbvLqIrM';
const driveId = '1Q2OetRkW7NxIulGnUOLnLfC4hWzJd_Qt';

export const listadoMorososFlow = addKeyword('5')
    .addAnswer("📋 Adjunta un PDF con el listado de personas morosas en el pago de la administración:", { capture: true }, 
        async (ctx, ctxFn) => {
            if (!ctx || !ctx.url) {
              return ctxFn.fallBack("❌ No se pudo obtener el documento. Por favor, inténtalo nuevamente.");
            }
        
            const mimeType = ctx.mimetype || 'application/pdf';

            if (!mimeType.includes('pdf')) {
              return ctxFn.fallBack("❌ El archivo debe ser un PDF. Por favor, adjunta un documento válido.");
            }
        
            await ctxFn.state.update({ mimeType });
        
            const tempDir = os.tmpdir();
            const uploadDir = path.join(tempDir, 'whatsapp-uploads');
        
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
        
            try {
              const localPath = await ctxFn.provider.saveFile(ctx, { path: uploadDir });
              await ctxFn.state.update({ localPath });
            } catch (error) {
              console.error('Error al guardar archivo:', error);
              return ctxFn.fallBack("❌ Ocurrió un error al procesar tu archivo. Por favor, inténtalo nuevamente.");
            }
        }
    )
    .addAnswer("✅ ¡Gracias por la información!", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            const fecha = getFormattedTime();
            await appendToSheet([ 
                [
                    fecha, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
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