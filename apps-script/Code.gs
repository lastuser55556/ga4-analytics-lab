// Тема 7: перед публикацией замените значение на ID своей Google Таблицы.
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID';
const HEADERS = ['request_id', 'created_at', 'name', 'email', 'direction', 'utm_source', 'utm_medium', 'utm_campaign', 'status'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  const clean = key => String(p[key] || '').trim();
  const missing = ['request_id', 'name', 'email', 'direction'].filter(key => !clean(key));
  if (missing.length) return jsonResponse({ok:false, error:'missing_required', fields:missing});
  const id = clean('request_id');
  if (!/^REQ-[A-F0-9]{8}-[A-F0-9]{4}-4[A-F0-9]{3}-[89AB][A-F0-9]{3}-[A-F0-9]{12}$/i.test(id)) return jsonResponse({ok:false, error:'invalid_request_id'});
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean('email'))) return jsonResponse({ok:false, error:'invalid_email'});
  if (!['frontend','backend','data'].includes(clean('direction'))) return jsonResponse({ok:false, error:'invalid_direction'});
  if (['name','email','utm_source','utm_medium','utm_campaign'].some(key => clean(key).length > 200)) return jsonResponse({ok:false, error:'value_too_long'});
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return jsonResponse({ok:false, error:'busy_retry'});
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('leads');
    if (!sheet || sheet.getRange(1,1,1,9).getValues()[0].join('|') !== HEADERS.join('|')) return jsonResponse({ok:false, error:'invalid_sheet_schema'});
    const duplicate = sheet.getRange('A:A').createTextFinder(id).matchEntireCell(true).matchCase(false).useRegularExpression(false).findNext();
    if (duplicate) return jsonResponse({ok:false, error:'duplicate_request_id'});
    sheet.appendRow([id, new Date(), textCell(clean('name')), textCell(clean('email')), clean('direction'), textCell(clean('utm_source') || 'direct'), textCell(clean('utm_medium') || 'none'), textCell(clean('utm_campaign') || 'not_set'), 'new']);
    SpreadsheetApp.flush();
    return jsonResponse({ok:true, request_id:id});
  } catch (error) {
    return jsonResponse({ok:false, error:'storage_error'});
  } finally {
    lock.releaseLock();
  }
}

function textCell(value) { return /^[=+@-]/.test(value) ? "'" + value : value; }
function jsonResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
