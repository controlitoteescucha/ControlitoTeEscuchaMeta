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
    .addAnswer("📸 *¡Necesitamos una foto como evidencia!*\n\nPor favor, envíame una imagen de como estaba antes de realizar la actividad. 😊", 
        { capture: true }, 
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
                const currentState = ctxFn.state.getMyState(); // Obtener el estado actual
                await ctxFn.state.update({
                ...currentState,
                fotoAntes: localPath
                });
            } catch (error) {
                console.error('Error al guardar archivo:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al procesar tu imagen. Por favor, inténtalo nuevamente.");
            }

    
        }
    )
    .addAnswer("📸 *¡Necesitamos una foto como evidencia!*\n\nPor favor, envíame una imagen de quedó después de realizar la actividad. 😊", 
        { capture: true }, 
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
                const currentState = ctxFn.state.getMyState(); // Obtener el estado actual
                await ctxFn.state.update({
                ...currentState,
                fotoDespues: localPath
                });
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
        const fecha = getFormattedTime();

        await appendToSheet([ 
            [
                fecha, 
                userInfo.conjunto, 
                ctx.from, 
                userInfo.nombreCompleto,
            ]
        ], spreadsheetId , userInfo.conjunto);

        const currentState = ctxFn.state.getMyState();

        try {
            // Subir foto ANTES
            if (currentState.fotoAntes) {
                await uploadFileLegacy(
                    currentState.fotoAntes, 
                    `${ctx.from}-${ctx.pushName}-ANTES`, 
                    currentState.conjunto, 
                    driveId,    
                    spreadsheetId, 
                    currentState.mimeType
                );
            }

            // Subir foto DESPUÉS
            if (currentState.fotoDespues) {
                await uploadFileLegacy(
                    currentState.fotoDespues, 
                    `${ctx.from}-${ctx.pushName}-DESPUES`, 
                    currentState.conjunto, 
                    driveId, 
                    spreadsheetId, 
                    currentState.mimeType
                );
            }
        } catch (error) {
            console.error('Error al subir archivo(s):', error);
            return ctxFn.fallBack("❌ Ocurrió un error al subir tus evidencias. Por favor, inténtalo nuevamente.");
        } finally {
            // Limpieza de archivos temporales
            if (currentState.fotoAntes && fs.existsSync(currentState.fotoAntes)) {
                fs.unlinkSync(currentState.fotoAntes);
            }
            if (currentState.fotoDespues && fs.existsSync(currentState.fotoDespues)) {
                fs.unlinkSync(currentState.fotoDespues);
            }
        }

        ctxFn.endFlow();
    }
);
