import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { uploadFileLegacy } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { getFormattedTime } from 'scripts/utils';

const spreadsheetId = '1YWx_MhJ8mSxZiA6RaZv91sX965KMBxtvenN9FdXWdL0';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC';

export const evidenciasTodero = addKeyword('3')
    .addAnswer("📸 Por favor, envíame una foto del *antes* de realizar la actividad.", { capture: true },
        async (ctx, ctxFn) => {
            if (!ctx || !ctx.url) {
                return ctxFn.fallBack("❌ No se pudo obtener la imagen. Por favor, inténtalo nuevamente.");
            }

            const mimeType = ctx.mimetype || 'image/jpeg';
            await ctxFn.state.update({ mimeType });

            const tempDir = os.tmpdir();
            const uploadDir = path.join(tempDir, 'whatsapp-uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            try {
                const localPathBefore = await ctxFn.provider.saveFile(ctx, { path: uploadDir });
                await ctxFn.state.update({ localPathBefore });
            } catch (error) {
                console.error('Error al guardar imagen antes:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al procesar tu imagen. Por favor, inténtalo nuevamente.");
            }
        }
    )
    .addAnswer("📸 Ahora envíame una foto del *después* de realizar la actividad.", { capture: true },
        async (ctx, ctxFn) => {
            if (!ctx || !ctx.url) {
                return ctxFn.fallBack("❌ No se pudo obtener la imagen. Por favor, inténtalo nuevamente.");
            }

            const mimeType = ctx.mimetype || 'image/jpeg';
            await ctxFn.state.update({ mimeType });

            const tempDir = os.tmpdir();
            const uploadDir = path.join(tempDir, 'whatsapp-uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            try {
                const localPathAfter = await ctxFn.provider.saveFile(ctx, { path: uploadDir });
                await ctxFn.state.update({ localPathAfter });
            } catch (error) {
                console.error('Error al guardar imagen después:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al procesar tu imagen. Por favor, inténtalo nuevamente.");
            }
        }
    )
    .addAnswer('✅ *¡Gracias por tu colaboración!*\n\nEl registro de la actividad ha sido exitoso. 😊\n\n¡Tu trabajo es muy valioso para nosotros! 🌟', null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            const fecha = getFormattedTime();

            try {
                await appendToSheet([
                    [fecha, userInfo.conjunto, ctx.from, userInfo.nombreCompleto]
                ], spreadsheetId, userInfo.conjunto);
            } catch (error) {
                console.error('Error al registrar en hoja:', error);
            }

            try {
                // Subir imagen del ANTES
                await uploadFileLegacy(
                    userInfo.localPathBefore,
                    `${ctx.from}-${ctx.pushName}-ANTES`,
                    userInfo.conjunto,
                    driveId,
                    spreadsheetId,
                    userInfo.mimeType
                );

                // Subir imagen del DESPUÉS
                await uploadFileLegacy(
                    userInfo.localPathAfter,
                    `${ctx.from}-${ctx.pushName}-DESPUES`,
                    userInfo.conjunto,
                    driveId,
                    spreadsheetId,
                    userInfo.mimeType
                );
            } catch (error) {
                console.error('Error al subir imágenes:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al subir tus imágenes. Por favor, inténtalo nuevamente.");
            } finally {
                if (fs.existsSync(userInfo.localPathBefore)) fs.unlinkSync(userInfo.localPathBefore);
                if (fs.existsSync(userInfo.localPathAfter)) fs.unlinkSync(userInfo.localPathAfter);
            }

            ctxFn.endFlow();
        }
    );
