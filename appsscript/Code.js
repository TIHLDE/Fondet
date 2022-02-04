/**
 * @OnlyCurrentDoc
 */

var api_key = PropertiesService.getScriptProperties().getProperty('APPS_SCRIPT_KEY');

function onOpen(e) {
  SpreadsheetApp.getUi()
  .createMenu("TIHLDE-Fondet")
  .addItem('Publiser', 'saveChanges')
  .addItem('Last opp fil', 'uploadFileDialog')
  .addToUi();
}

function saveChanges() {
  UrlFetchApp.fetch('https://us-central1-fondet.cloudfunctions.net/updateSheetsData', { headers: { Authorization: `Bearer ${api_key}` } });

  var date = new Date(Date.now());
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Status');
  sheet.getRange('A2').setValue(date.toLocaleString('no', { timeZone: 'Europe/Oslo' }));
}

function uploadFileDialog() {
  var html = HtmlService.createHtmlOutputFromFile('UploadFile').setWidth(400).setHeight(150);

  SpreadsheetApp.getUi().showModalDialog(html, 'Last opp fil');
}

// Empty function to test if script execution works from an HTML container.
function testError() {}

function uploadFile(obj) {
  var blob = Utilities.newBlob(Utilities.base64Decode(obj.data), obj.type, obj.name);

  var res = UrlFetchApp.fetch('https://us-central1-fondet.cloudfunctions.net/uploadFile', {
    method: 'post',
    payload: blob,
    contentType: obj.type,
    headers: { Authorization: `Bearer ${api_key}` },
  });

  var url = res.getContentText();

  SpreadsheetApp.getActiveSheet().getActiveCell().setValue(url);
}
