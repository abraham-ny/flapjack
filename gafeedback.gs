/**
 * Google Apps Script to receive feedback form submissions and save to Google Sheets.
 * Deploy this script as a web app (Execute as: Me, Who has access: Anyone, even anonymous).
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID'); // Replace with your Google Sheets ID
    var sheet = ss.getSheetByName('Feedback') || ss.insertSheet('Feedback');

    // Parse JSON payload
    var data = JSON.parse(e.postData.contents);

    // Append new row with timestamp, name, email, feedback
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.feedback || '',
      data.source || '',
      data.type || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', message: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}