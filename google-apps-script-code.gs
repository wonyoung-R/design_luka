// Code.gs
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('QnAForm');
    
    // FormData 또는 JSON 데이터 처리
    let data;
    if (e.postData && e.postData.contents) {
      try {
        // JSON 데이터인 경우
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        // FormData인 경우
        data = {
          name: e.parameter.name,
          phone: e.parameter.phone,
          email: e.parameter.email,
          message: e.parameter.message,
          emailConsent: e.parameter.emailConsent === 'true'
        };
      }
    } else {
      // URL 파라미터로 전송된 경우
      data = {
        name: e.parameter.name,
        phone: e.parameter.phone,
        email: e.parameter.email,
        message: e.parameter.message,
        emailConsent: e.parameter.emailConsent === 'true'
      };
    }
    
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.message || '',
      data.emailConsent ? 'Yes' : 'No'
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data submitted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'API is working'
  }))
  .setMimeType(ContentService.MimeType.JSON);
} 