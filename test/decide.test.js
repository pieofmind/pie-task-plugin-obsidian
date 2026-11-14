// node test/decide.test.js — kiểm logic Duyệt / Yêu cầu sửa (không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const T = require(path.join(__dirname, '..', 'main.js'))._t;

const md = [
  '## Việc mới', '', '- [ ] **Khác** `Mới`', '',
  '## Chờ duyệt', '',
  '- [ ] **Thumbnail 1280x720** `🤖 Stuart` `Chờ duyệt` [type:: x] [cnt:: CNT-2026-006] [gate:: G6] 📅 2026-11-17',
  '\t- Xem: [[a]]', '\t\t- sâu hơn', '\t- [ ] bước 1',
  '- [ ] **Thẻ hai** `Chờ duyệt`', '\t- ghi chú',
  '', '## Đang làm', '', '- [ ] **Đang A** `Đang làm`', '', '## Hoàn thành', '', '- [x] **Cũ** ✅ 2026-11-01',
  '- [ ] **Cuối file** `Chờ duyệt`', '\t- dòng cuối'
].join('\n');
const keyOf = (m, title) => { const x = T.parseTasks(m, '').tasks.find(q => q.title.startsWith(title)); return T.taskKey(x); };
const lines = s => s.split('\n');
const o = { stamp: '2026-11-14 22:10', who: 'Nguyên', note: 'chọn v3', laneApproved: 'Hoàn thành', laneRevise: 'Đang làm' };
// khoá = lane::title::line (không có id)
const k1 = keyOf(md, 'Thumbnail');

let r = T.decideMd(md, k1, 'duyet', o);
const L = lines(r.md), i = L.findIndex(l => l.includes('Thumbnail'));
assert(L.indexOf('## Hoàn thành') < i, 'sang lane Hoàn thành');
assert.strictEqual(L[i], lines(md)[6].replace('`Chờ duyệt`', '`Hoàn thành`').replace('- [ ]', '- [x]'));
assert.deepStrictEqual(L.slice(i + 1, i + 5), ['\t- Xem: [[a]]', '\t\t- sâu hơn', '\t- [ ] bước 1', '\t- ✅ Duyệt 2026-11-14 22:10 · 👤 Nguyên · "chọn v3"']);
assert(L[i - 1] === '' || L[i - 1].startsWith('## ')); // đầu lane
assert(L.includes('- [ ] **Thẻ hai** `Chờ duyệt`') && L.includes('\t- ghi chú'), 'thẻ kế bên nguyên vẹn');
assert.strictEqual(L.length, lines(md).length + 1, 'chỉ thêm 1 dòng nhật ký');
// hoàn tác về y hệt
assert.strictEqual(T.undoDecideMd(r.md, r.undo), md);
// đuôi cảnh báo + gỡ đuôi + hoàn tác khi có đuôi
const w = T.markUnsentMd(r.md, r.log, true); assert(w.includes('⚠️ chưa báo bot'));
assert.strictEqual(T.markUnsentMd(w, r.log, false), r.md);
assert.strictEqual(T.undoDecideMd(w, r.undo), md);
// yêu cầu sửa
const rs = T.decideMd(md, k1, 'yeu_cau_sua', { ...o, note: 'sửa màu' });
const Ls = lines(rs.md), j = Ls.findIndex(l => l.includes('Thumbnail'));
assert(Ls.indexOf('## Đang làm') < j && j < Ls.indexOf('## Hoàn thành'));
assert(Ls[j].includes('`Đang làm`') && Ls[j].startsWith('- [ ]'));
assert(Ls[j + 4].startsWith('\t- ↩️ Yêu cầu sửa 2026-11-14 22:10 · 👤 Nguyên · "sửa màu"'));
// thẻ cuối file (không xuống dòng cuối) và dòng cuối là con
const kl = keyOf(md, 'Cuối file');
const rl = T.decideMd(md, kl, 'duyet', { ...o, note: '' });
assert(rl && rl.md.endsWith('\t- dòng cuối\n\t- ✅ Duyệt 2026-11-14 22:10 · 👤 Nguyên') || rl.md.includes('\t- dòng cuối\n\t- ✅ Duyệt 2026-11-14 22:10 · 👤 Nguyên'));
assert.strictEqual(T.undoDecideMd(rl.md, rl.undo), md);
// thiếu lane đích → không sửa
assert.strictEqual(T.decideMd(md, k1, 'duyet', { ...o, laneApproved: 'Không có' }), null);
// payload
const t = T.parseTasks(md, '').tasks.find(q => q.title.startsWith('Thumbnail'));
const p = T.buildPayload('duyet', t, { who: 'Nguyên', note: 'chọn v3', file: '8.TRACK/TASKS.md', board: 'Bảng chính', channel: 'tsvh', now: new Date(2026, 10, 14, 22, 10, 5) });
assert(p.task.startsWith('Anh Nguyên DUYỆT: "Thumbnail 1280x720" · CNT-2026-006 · G6 · người làm 🤖 Stuart · ghi chú: "chọn v3" · file 8.TRACK/TASKS.md'), p.task);
assert.strictEqual(p.needs_approval, false); assert.strictEqual(p.pie.cnt, 'CNT-2026-006');
const p2 = T.buildPayload('huy_duyet', { raw: '- [ ] **X**', title: 'X' }, { who: 'N', file: 'f', board: 'b', channel: '', now: new Date() });
assert.strictEqual(p2.pie.cnt, null); assert.strictEqual(p2.pie.gate, null); assert(p2.task.startsWith('Anh N HUỶ DUYỆT:'));
assert.strictEqual(T.maskUrl('http://127.0.0.1:8800/hooks/SECRET123?k=1'), 'http://127.0.0.1:8800/hooks/…');
console.log('decide tests OK', p.pie.luc);
