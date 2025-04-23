import { google } from 'googleapis';
import dotenv from 'dotenv';

// Solución para el error de OpenSSL en Node.js 18+
process.env.NODE_OPTIONS = '--openssl-legacy-provider';

dotenv.config();

interface SheetValues {
  values: (string | number)[][];
}

// Configuración mejorada de autenticación
async function getAuth() {
  const rawCredentials = process.env.GOOGLE_CREDENTIALS;
  if (!rawCredentials) {
    throw new Error('La variable GOOGLE_CREDENTIALS no está definida');
  }

  try {
    const credentials = JSON.parse(rawCredentials);
    
    // Verificación de la clave privada
    if (!credentials.private_key) {
      throw new Error('Falta private_key en las credenciales');
    }

    // Asegurar formato correcto de la clave
    const fixedPrivateKey = credentials.private_key.replace(/\\n/g, '\n');

    return new google.auth.GoogleAuth({
      credentials: {
        ...credentials,
        private_key: fixedPrivateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Error al parsear credenciales:', error);
    throw new Error('Credenciales de Google inválidas');
  }
}

// Cliente de Sheets con manejo de errores mejorado
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

async function getSheetsClient() {
  if (!sheetsClient) {
    const auth = await getAuth();
    sheetsClient = google.sheets({ version: 'v4', auth });
  }
  return sheetsClient;
}

// Función mejorada para escribir datos
export async function writeToSheet(
  values: (string | number)[][], 
  range: string, 
  spreadsheetId: string
): Promise<any> {
  try {
    const sheets = await getSheetsClient();
    const resource: SheetValues = { values };

    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: resource,
    });
    
    return res.data;
  } catch (error) {
    console.error('Error detallado al escribir en la hoja:', {
      error: error instanceof Error ? error.message : error,
      range,
      spreadsheetId
    });
    throw error;
  }
}

// Funciones restantes manteniendo el mismo patrón de mejora
export async function readSheet(range: string, spreadsheetId: string) {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error al leer la hoja:', {
      error: error instanceof Error ? error.message : error,
      range,
      spreadsheetId
    });
    throw error;
  }
}

export async function appendToSheet(
  values: (string | number)[][],
  spreadsheetId: string,
  sheetName: string
) {
  try {
    const sheets = await getSheetsClient();
    const range = `${sheetName}!A1`;
    
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    
    return res.data;
  } catch (error) {
    console.error(`Error al agregar datos en "${sheetName}":`, {
      error: error instanceof Error ? error.message : error,
      spreadsheetId
    });
    throw error;
  }
}

// Función mejorada para filtrar datos
export async function getFilteredData(
  spreadsheetId: string,
  sheetName: string,
  columnName: string,
  valueToSearch: string | number
): Promise<(string | number)[][]> {
  try {
    const sheets = await getSheetsClient();
    
    // Validación de entrada
    if (!columnName || columnName.length !== 1 || !/[A-Za-z]/.test(columnName)) {
      throw new Error('El nombre de la columna debe ser una sola letra (A-Z)');
    }

    const columnIndex = columnName.toUpperCase().charCodeAt(0) - 65;
    const range = `${sheetName}!A1:Z1000`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const allRows = response.data.values || [];
    
    // Filtrar incluyendo verificación de existencia de la columna
    const filteredData = allRows.filter(row => 
      row.length > columnIndex && row[columnIndex]?.toString() === valueToSearch.toString()
    );

    if (filteredData.length === 0) {
      console.warn(`No se encontraron coincidencias para ${valueToSearch} en la columna ${columnName}`);
    }

    return filteredData;
  } catch (error) {
    console.error('Error al filtrar datos:', {
      error: error instanceof Error ? error.message : error,
      spreadsheetId,
      sheetName,
      columnName,
      valueToSearch
    });
    throw error;
  }
}

// Función mejorada para insertar imágenes
export async function insertImageLinkToSheet(
  imageUrl: string,
  sheetName: string,
  spreadsheetId: string
): Promise<void> {
  try {
    const sheets = await getSheetsClient();
    
    // Validar URL de imagen
    if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
      throw new Error('La URL de la imagen no es válida');
    }

    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
      majorDimension: 'ROWS',
    });

    const rows = getRes.data.values || [];
    const lastRowIndex = rows.length > 0 ? rows.length : 1; // Si no hay datos, empieza en 1
    const lastColumnIndex = rows[0]?.length > 0 ? rows[0].length - 1 : 0;

    const columnLetter = String.fromCharCode(65 + lastColumnIndex);
    const range = `${sheetName}!${columnLetter}${lastRowIndex}`;
    const formula = `=IMAGE("${imageUrl.replace(/"/g, '""')}")`; // Escapar comillas

    await writeToSheet([[formula]], range, spreadsheetId);
  } catch (error) {
    console.error(`Error al insertar imagen en "${sheetName}":`, {
      error: error instanceof Error ? error.message : error,
      spreadsheetId,
      sheetName,
      imageUrl
    });
    throw error;
  }
}

// Función mejorada para insertar enlaces
export async function insertLinkToSheet(
  link: string,
  sheetName: string,
  spreadsheetId: string,
  linkText?: string
): Promise<void> {
  try {
    const sheets = await getSheetsClient();
    
    // Validar URL
    if (!link || !/^https?:\/\//i.test(link)) {
      throw new Error('El enlace proporcionado no es válido');
    }

    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
      majorDimension: 'ROWS',
    });

    const rows = getRes.data.values || [];
    const lastRowIndex = rows.length > 0 ? rows.length : 1;
    const lastColumnIndex = rows[0]?.length > 0 ? rows[0].length - 1 : 0;

    const columnLetter = String.fromCharCode(65 + lastColumnIndex);
    const range = `${sheetName}!${columnLetter}${lastRowIndex}`;
    
    // Crear fórmula de hipervínculo si se proporciona texto alternativo
    const cellValue = linkText 
      ? `=HYPERLINK("${link.replace(/"/g, '""')}", "${linkText.replace(/"/g, '""')}")`
      : link;

    await writeToSheet([[cellValue]], range, spreadsheetId);
  } catch (error) {
    console.error(`Error al insertar enlace en "${sheetName}":`, {
      error: error instanceof Error ? error.message : error,
      spreadsheetId,
      sheetName,
      link
    });
    throw error;
  }
}
