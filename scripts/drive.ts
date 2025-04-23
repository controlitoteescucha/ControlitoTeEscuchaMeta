import * as fs from 'fs';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { insertImageLinkToSheet, insertLinkToSheet } from './sheets';

process.env.NODE_OPTIONS = '--openssl-legacy-provider';

dotenv.config();

interface UploadFileParams {
  filePath: string;
  fileName: string;
  sheetName: string;
  driveId: string;
  spreadsheetId: string;
  mimeType: string;
}

interface GoogleDriveFileResponse {
  id?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export async function uploadFile({
  filePath,
  fileName,
  sheetName,
  driveId,
  spreadsheetId,
  mimeType
}: UploadFileParams): Promise<string> {
  // Validaciones iniciales
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo ${filePath} no existe`);
  }

  if (!process.env.GOOGLE_CREDENTIALS) {
    throw new Error('La variable GOOGLE_CREDENTIALS no está definida');
  }

  try {
    // Parsear y validar credenciales
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    if (!credentials.private_key) {
      throw new Error('Las credenciales no contienen una clave privada válida');
    }

    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials: {
        ...credentials,
        private_key: credentials.private_key.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    const driveService = google.drive({
      version: 'v3',
      auth: auth, // Pasar directamente el objeto auth
    });

    // Metadatos del archivo
    const fileMetaData = {
      name: fileName,
      parents: [driveId],
      fields: 'id,webViewLink,webContentLink',
    };

    // Configurar media para upload
    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    // Subir archivo a Drive
    const { data: file } = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id,webViewLink,webContentLink',
    });

    if (!file.id) {
      throw new Error('No se pudo obtener el ID del archivo subido');
    }


    // Configurar permisos públicos
    await driveService.permissions.create({
      fileId: file.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      fields: 'id',
    });

    const publicUrl = `https://drive.google.com/uc?id=${file.id}`;

    if (mimeType === 'application/pdf') {
      await insertLinkToSheet(publicUrl, sheetName, spreadsheetId);
    } else {
      await insertImageLinkToSheet(publicUrl, sheetName, spreadsheetId);
    }

    return publicUrl;
  } catch (error) {
    console.error('Error en uploadFile:', {
      error: error instanceof Error ? error.message : error,
      fileName,
      mimeType,
      driveId
    });
    
    // Eliminar archivo temporal en caso de error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error al limpiar archivo temporal:', cleanupError);
    }
    
    throw error; // Re-lanzar el error para manejo superior
  }
}

// Función de conveniencia para mantener compatibilidad
export async function uploadFileLegacy(
  filePath: string,
  fileName: string,
  sheetName: string,
  driveId: string,
  spreadsheetId: string,
  mimeType: string
): Promise<string | undefined> {
  return uploadFile({
    filePath,
    fileName,
    sheetName,
    driveId,
    spreadsheetId,
    mimeType
  });
}