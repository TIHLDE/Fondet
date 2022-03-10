/**
 * @OnlyCurrentDoc
 */

function getApiKey() {
  let API_KEY = ScriptProperties.getProperty("APPS_SCRIPT_KEY");
  if (API_KEY) {
    return API_KEY;
  }

  const res = SpreadsheetApp.getUi().prompt("Vennligst oppgi API-nøkkelen satt i firebase konfigen.");
  API_KEY = res.getResponseText();

  ScriptProperties.setProperty("APPS_SCRIPT_KEY", API_KEY);
  return API_KEY;
}

function onOpen(e) {
  SpreadsheetApp.getUi()
  .createMenu("TIHLDE-Fondet")
  .addItem('Publiser', 'saveChanges')
  .addItem('Last opp fil', 'uploadFileDialog')
  .addToUi();
}

function saveChanges() {
  const api_key = getApiKey();
  UrlFetchApp.fetch('https://us-central1-fondet.cloudfunctions.net/updateSheetsData', { headers: { Authorization: `Bearer ${api_key}` } });

  const date = new Date(Date.now());
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Status');
  sheet.getRange('A2').setValue(date.toLocaleString('no', { timeZone: 'Europe/Oslo' }));
}

function uploadFileDialog() {
  const html = HtmlService.createHtmlOutputFromFile('UploadFile').setWidth(400).setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(html, 'Last opp fil');
}

// Empty function to test if script execution works from an HTML container.
function testError() {}

function uploadFile(obj) {
  const blob = Utilities.newBlob(Utilities.base64Decode(obj.data), obj.type, obj.name);

  const api_key = getApiKey();
  const res = UrlFetchApp.fetch('https://us-central1-fondet.cloudfunctions.net/uploadFile', {
    method: 'post',
    payload: blob,
    contentType: obj.type,
    headers: { Authorization: `Bearer ${api_key}` },
  });

  const url = res.getContentText();

  SpreadsheetApp.getActiveSheet().getActiveCell().setValue(url);
}
