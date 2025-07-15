import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { appendToSheet } from 'scripts/sheets';
import { insertImageLinkAt } from 'scripts/sheets'; // NUEVA función personalizada
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
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

      let rowIndex: number;

      try {
        rowIndex = await appendToSheet([
          [fecha, userInfo.conjunto, ctx.from, userInfo.nombreCompleto]
        ], spreadsheetId, userInfo.conjunto);
      } catch (error) {
        console.error('Error al registrar en hoja:', error);
        return ctxFn.fallBack("❌ No se pudo registrar la actividad en la hoja. Intenta más tarde.");
      }

      try {
        // Subir ANTES al Drive
        const imageUrlAntes = await uploadFileToDriveOnly({
          filePath: userInfo.localPathBefore,
          fileName: `${ctx.from}-${ctx.pushName}-ANTES`,
          driveId,
          mimeType: userInfo.mimeType
        });

        // Subir DESPUÉS al Drive
        const imageUrlDespues = await uploadFileToDriveOnly({
          filePath: userInfo.localPathAfter,
          fileName: `${ctx.from}-${ctx.pushName}-DESPUES`,
          driveId,
          mimeType: userInfo.mimeType
        });

        // Insertar en celdas específicas
        await insertImageLinkAt(imageUrlAntes, spreadsheetId, userInfo.conjunto, rowIndex, 4);  // Columna E
        await insertImageLinkAt(imageUrlDespues, spreadsheetId, userInfo.conjunto, rowIndex, 5); // Columna F

      } catch (error) {
        console.error('Error al subir imágenes o insertar en hoja:', error);
        return ctxFn.fallBack("❌ Ocurrió un error al subir las imágenes. Inténtalo nuevamente.");
      } finally {
        if (fs.existsSync(userInfo.localPathBefore)) fs.unlinkSync(userInfo.localPathBefore);
        if (fs.existsSync(userInfo.localPathAfter)) fs.unlinkSync(userInfo.localPathAfter);
      }

      ctxFn.endFlow();
    }
  );
