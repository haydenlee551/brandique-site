/**
 * ═══════════════════════════════════════════════════════════
 *  브랜디크 설문 수신기 — Google Apps Script
 *  · 구글 시트에 한 줄씩 자동 저장
 *  · 지정한 주소로 알림 메일 발송
 *  설치 방법은 같은 폴더의 README.md 참고
 * ═══════════════════════════════════════════════════════════
 */

/* ⬇ 알림 메일을 받을 주소 */
const MAIL_TO = 'contact@brandique.co.kr';

/* ⬇ 저장할 시트 탭 이름 (없으면 자동 생성) */
const SHEET_NAME = '설문';

/** 설문 페이지가 POST로 보낸 데이터를 받는 입구 */
function doPost(e) {
  try {
    const data = (e && e.parameter) ? e.parameter : {};
    saveToSheet_(data);
    sendMail_(data);
    return json_({ ok: true });
  } catch (err) {
    // 저장에 실패해도 내용은 잃지 않도록 오류 알림을 보낸다
    try {
      MailApp.sendEmail(MAIL_TO, '[브랜디크] 설문 처리 오류',
        '오류: ' + err + '\n\n받은 내용:\n' + JSON.stringify((e && e.parameter) || {}, null, 2));
    } catch (_) {}
    return json_({ ok: false, error: String(err) });
  }
}

/** 배포가 살아있는지 브라우저로 확인할 때 쓰는 주소 */
function doGet() {
  return ContentService.createTextOutput('브랜디크 설문 수신기가 작동 중입니다.');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 시트에 한 줄 추가 — 새로운 문항이 생기면 열도 자동으로 늘어난다 */
function saveToSheet_(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  let headers = sh.getLastRow() > 0
    ? sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].filter(String)
    : [];

  if (headers.length === 0) headers = ['접수일시'];

  // 처음 보는 항목은 헤더 끝에 덧붙인다
  Object.keys(data).forEach(function (k) {
    if (headers.indexOf(k) === -1) headers.push(k);
  });

  sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sh.setFrozenRows(1);

  const row = headers.map(function (h) {
    return h === '접수일시' ? new Date() : (data[h] || '');
  });
  sh.appendRow(row);
}

/** 알림 메일 발송 — 답장하면 바로 고객에게 가도록 replyTo를 붙인다 */
function sendMail_(data) {
  const type = data['문의 유형'] || '문의';
  const name = data['성함'] || '이름 없음';
  const subject = '[브랜디크 설문] ' + type + ' · ' + name;

  let body = '';
  Object.keys(data).forEach(function (k) {
    body += '■ ' + k + '\n' + data[k] + '\n\n';
  });
  body += '───────────────\n접수 시각: '
       + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

  const opts = { name: '브랜디크 설문' };
  if (data['이메일']) opts.replyTo = data['이메일'];

  MailApp.sendEmail(MAIL_TO, subject, body, opts);
}

/** 설치 직후 동작 확인용 — 편집기에서 이 함수를 한 번 실행해 보세요 */
function 테스트() {
  doPost({ parameter: {
    '문의 유형': '로고 · 브랜딩',
    '성함': '테스트',
    '이메일': 'test@example.com',
    '기타 요청사항': '설치 확인용 테스트입니다.'
  }});
}
