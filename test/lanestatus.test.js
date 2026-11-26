// node test/lanestatus.test.js — kéo task sang lane thì đổi trạng thái theo ánh xạ lane→trạng thái (không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const T = require(path.join(__dirname, '..', 'main.js'))._t;
const TODAY = T.today();

const md = [
  '## Việc mới', '', '- [ ] **A** `Mới` `🤖 Stuart` [type:: x] 📅 2026-11-17', '\t- con 1', '- [ ] **B** `Mới`', '- [ ] **C** `Mới`',
  '', '## Đang làm', '', '- [ ] **D** `Đang làm`', '',
  '## Hoàn thành', '', '- [x] **E** `Đang làm` ✅ 2026-11-01', '\t- ghi chú E', '',
  '## Khác', '', '- [ ] **F** `Mới`'
].join('\n');
const map = { 'Đang làm': 'Đang làm', 'Hoàn thành': 'Hoàn thành' };
const key = t => T.taskKey(T.parseTasks(md, '').tasks.find(q => q.title === t));
const line = (m, t) => m.split('\n').find(l => l.includes('**' + t + '**'));

// 1. sang lane ánh xạ Đang làm: đổi token tại chỗ, token khác + dòng con giữ nguyên
let r = T.moveTaskMd(md, key('A'), 'Đang làm', map);
assert.strictEqual(line(r, 'A'), '- [ ] **A** `Đang làm` `🤖 Stuart` [type:: x] 📅 2026-11-17');
assert(r.includes('\t- con 1'));
assert.strictEqual(T.parseTasks(r, '').tasks.find(t => t.title === 'A').laneName, 'Đang làm');
// 2. sang lane hoàn thành
r = T.moveTaskMd(md, key('A'), 'Hoàn thành', map);
assert.strictEqual(line(r, 'A'), '- [x] **A** `🤖 Stuart` [type:: x] 📅 2026-11-17 ✅ ' + TODAY);
// 3. [x] về lane Đang làm
r = T.moveTaskMd(md, key('E'), 'Đang làm', map);
assert.strictEqual(line(r, 'E'), '- [ ] **E** `Đang làm`');
// 4. lane không ánh xạ: byte-for-byte như cũ
assert.strictEqual(T.moveTaskMd(md, key('A'), 'Khác', map), T.moveTaskMd(md, key('A'), 'Khác'));
assert.strictEqual(T.moveTaskMd(md, key('E'), 'Khác', map), T.moveTaskMd(md, key('E'), 'Khác'));
// 5. hàng loạt 3 task (cùng đường bulkApply của plugin)
const bulk = lane => { const ps = T.parseTasks(md, '').tasks.filter(q => ['A', 'B', 'C'].includes(q.title)); return T.bulkMd(md, T.bulkSigs(T.parseTasks(md, '').tasks, ps), (m, k) => T.moveTaskMd(m, k, lane, map)); };
r = bulk('Đang làm');
for (const t of ['A', 'B', 'C']) assert(line(r, t).includes('`Đang làm`') && !line(r, t).includes('`Mới`'), t);
r = bulk('Hoàn thành');
for (const t of ['A', 'B', 'C']) assert(line(r, t).startsWith('- [x]') && line(r, t).endsWith('✅ ' + TODAY), t);
// 6. không cấu hình ánh xạ: y như cũ
assert.strictEqual(T.moveTaskMd(md, key('A'), 'Đang làm', undefined), T.moveTaskMd(md, key('A'), 'Đang làm'));
assert.strictEqual(T.moveTaskMd(md, key('A'), 'Đang làm', {}), T.moveTaskMd(md, key('A'), 'Đang làm'));
// kéo vị trí (moveTaskToPosMd) cũng đổi; cùng lane thì không đổi trạng thái
r = T.moveTaskToPosMd(md, key('A'), 'Đang làm', null, map);
assert(line(r, 'A').includes('`Đang làm`'));
assert.strictEqual(T.moveTaskToPosMd(md, key('D'), 'Đang làm', null, map), T.moveTaskToPosMd(md, key('D'), 'Đang làm', null));
assert.strictEqual(T.moveTaskToPosMd(md, key('A'), 'Khác', null, map), T.moveTaskToPosMd(md, key('A'), 'Khác', null));
// nhãn lạ trong ánh xạ → fail-closed: chỉ chuyển lane
assert.strictEqual(T.moveTaskMd(md, key('A'), 'Đang làm', { 'Đang làm': 'Xyz' }), T.moveTaskMd(md, key('A'), 'Đang làm'));
// task chưa có token trạng thái → thêm 1 token, không trùng
const md2 = '## L1\n\n- [ ] **P**\n\n## L2\n';
const k2 = T.taskKey(T.parseTasks(md2, '').tasks[0]);
assert.strictEqual(T.moveTaskMd(md2, k2, 'L2', { L2: 'Đang làm' }), '## L1\n\n\n## L2\n- [ ] **P** `Đang làm`\n');
// parse ô cấu hình
assert.deepStrictEqual(T.parseLaneStatus('Đang làm = Đang làm\n\nHoàn thành=Hoàn thành\nbậy'), { 'Đang làm': 'Đang làm', 'Hoàn thành': 'Hoàn thành' });
console.log('lanestatus OK');
