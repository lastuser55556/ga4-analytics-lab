const SPREADSHEET_ID = '1nzaaxePRKwPSm2gj_DhiQ-7lZpSGgGTVHjrMnVqMloo';
const SHEET_NAME = 'leads';

function doPost(e) {
  try {
    const p = e?.parameter || {};
    for (const key of ['request_id', 'name', 'email', 'direction']) {
      if (!String(p[key] || '').trim()) return json_({ ok: false, error: 'missing_' + key });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ ok: false, error: 'sheet_not_found' });

    const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    if (ids.includes(p.request_id)) {
      return json_({ ok: true, duplicate: true, request_id: p.request_id });
    }

    sheet.appendRow([
      p.request_id, new Date(), p.name.trim(), p.email.trim(), p.direction.trim(),
      p.utm_source || 'direct', p.utm_medium || 'none', p.utm_campaign || 'not_set', 'new'
    ]);
    SpreadsheetApp.flush();
    return json_({ ok: true, request_id: p.request_id });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
