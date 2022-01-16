
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem("Publiser", 'saveChanges')
  .addToUi();
}

function saveChanges() {
  var updateFunctionUrl = PropertiesService.getScriptProperties().getProperty("UPDATE_FUNCTION_URL");
  UrlFetchApp.fetch(updateFunctionUrl);
  
  var date = new Date(Date.now());
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Status");
  sheet.getRange('A2').setValue(date.toLocaleString('no', {timeZone: 'Europe/Oslo'}));
  
}