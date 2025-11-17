// gafeedback.gs
// GitHub Copilot
// Simple Google Apps Script that accepts POSTed JSON or form data and writes rows to a Google Sheet.
// Configure SPREADSHEET_ID and SHEET_NAME before deploying as a web app.

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Responses';

// Convenience: create sheet if missing and ensure header row exists for given keys.
function ensureSheetExists(keys) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // If sheet empty and keys provided, set header row
  const lastRow = sheet.getLastRow();
  if (lastRow === 0 && keys && keys.length) {
    sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
  }
  return sheet;
}

// Map an object to row values following header order. If header lacks keys, append them.
function objectToRow(obj) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
  const headers = headerRange.getValues()[0].map(h => String(h || '').trim()).filter((_,i)=>i>=0);

  const keys = Object.keys(obj);
  // Append any missing headers
  const missing = keys.filter(k => headers.indexOf(k) === -1);
  if (missing.length) {
    const newHeaders = headers.concat(missing);
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    headers.push(...missing);
  }
  // Build row values in header order
  const row = headers.map(h => obj.hasOwnProperty(h) ? obj[h] : '');
  return { row, headers };
}

function doGet(e) {
  const out = { status: 'ok', message: 'POST JSON or form to write a row.' };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload = {};
  try {
    // Prefer JSON content
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      payload = JSON.parse(e.postData.contents || '{}');
    } else if (e.parameter && Object.keys(e.parameter).length) {
      // Form-encoded: e.parameter gives first values; e.parameters gives arrays.
      payload = {};
      for (const k in e.parameter) {
        payload[k] = e.parameter[k];
      }
    } else {
      // Try to parse raw contents as JSON
      payload = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid payload', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }

  // Add timestamp server-side
  payload._timestamp = new Date().toISOString();

  // Concurrency guard
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // wait up to 10s

  try {
    const sheet = ensureSheetExists(Object.keys(payload));
    const mapping = objectToRow(payload);
    const row = mapping.row;

    // Append row after header (if header exists) or at first row
    const rowIndex = sheet.getLastRow() + 1;
    sheet.getRange(rowIndex + (sheet.getLastRow() === 0 ? 0 : 0), 1, 1, row.length).setValues([row]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', row: rowIndex })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}