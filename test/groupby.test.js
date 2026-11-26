// node test/groupby.test.js — Group by kiểu Bases: danh sách property, thứ tự/ẩn cột, group 1 file theo trạng thái (không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
class Notice { constructor(m) { Notice.last = m; } }
const stub = { Notice, normalizePath: x => String(x).replace(/\/+/g, '/').replace(/^\/|\/$/g, ''), Plugin: class {} };
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy(stub, { get: (t, k) => k in t ? t[k] : class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const Plugin = require(path.join(__dirname, '..', 'main.js')), T = Plugin._t;

// liệt kê property: bỏ trùng, sort, bỏ null/position
assert.deepStrictEqual(T.listProperties([{ status: 'a', tags: [] }, null, { priority: 1, status: 'b', position: {} }, { Owner: 'x' }]), ['Owner', 'priority', 'status', 'tags']);
assert.deepStrictEqual(T.listProperties([]), []);
// áp thứ tự đã lưu: cột mới nối cuối, cột mất bỏ
assert.deepStrictEqual(T.applyColumnOrder(['a', 'b', 'c'], ['c', 'x', 'a']), ['c', 'a', 'b']);
assert.deepStrictEqual(T.applyColumnOrder(['a', 'b'], undefined), ['a', 'b']);
assert.deepStrictEqual(T.applyColumnOrder(['a', 'b'], ['b', 'b', 'a']), ['b', 'a']);
// cột đã từng có vẫn hiện khi rỗng (keepEmpty), cột ẩn bị loại, auto A→Z đẩy "Chưa xếp" xuống cuối
assert.deepStrictEqual(T.buildColumns(['a'], { order: ['c', 'a', 'b'] }, true), ['c', 'a', 'b']);
assert.deepStrictEqual(T.buildColumns(['a'], { order: ['c', 'a', 'b'] }, false), ['a']);
assert.deepStrictEqual(T.buildColumns(['a', 'b', 'c'], { order: ['c', 'a', 'b'], hidden: ['a'] }, true), ['c', 'b']);
assert.deepStrictEqual(T.buildColumns(['b', 'Chưa xếp', 'a'], { sort: 'auto', order: ['b'] }, true), ['a', 'b', 'Chưa xếp']);
assert.deepStrictEqual(T.buildColumns(['x', 'y'], undefined, true), ['x', 'y']);
// mergeKnown: nối cột mới vào cuối thứ tự đã lưu
assert.deepStrictEqual(T.mergeKnown(['a', 'b'], ['b', 'c']), ['a', 'b', 'c']);

// group 1 file theo trạng thái
const md = ['## Việc mới', '', '- [ ] **A** `Mới`', '- [ ] **B**', '', '## Đang làm', '', '- [ ] **C** `Đang làm`', '- [ ] **D** `Chờ duyệt`', '', '## Xong', '', '- [x] **E** ✅ 2026-11-01', '- [ ] **F** `Tạm dừng`'].join('\n');
const parsed = T.parseTasks(md, '');
const g = T.groupByStatus(parsed);
const colOf = (g, t) => g.tasks.find(x => x.title === t).lane;
assert.strictEqual(colOf(g, 'A'), 'Đang chờ'); assert.strictEqual(colOf(g, 'B'), 'Chưa xử lý');
assert.strictEqual(colOf(g, 'C'), 'Đang thực hiện'); assert.strictEqual(colOf(g, 'D'), 'Đang đánh giá');
assert.strictEqual(colOf(g, 'E'), 'Hoàn thành'); assert.strictEqual(colOf(g, 'F'), 'Tạm dừng');
assert.deepStrictEqual(g.lanes, ['Đang chờ', 'Đang thực hiện', 'Đang đánh giá', 'Hoàn thành', 'Tạm dừng', 'Chưa xử lý']);
// mọi nhãn trong LABELS (+ task không token) đều ra cột có trong lanes — không thẻ nào biến mất
const labs = ['Đang chờ', 'Mới', 'Đang thực hiện', 'Đang làm', 'Đang đánh giá', 'Chờ duyệt', 'Hoàn thành', 'Chưa hoàn thành', 'Không hoàn thành', 'Tạm dừng', 'Hủy', 'Huỷ', 'Dự kiến', 'Đã đóng', 'Đóng', 'Lỗi', 'Báo lỗi', 'Error', 'ERROR'];
const allMd = '## L\n\n' + labs.map((l, i) => '- [ ] **T' + i + '** `' + l + '`').join('\n') + '\n- [ ] **Không token**\n- [x] **Xong tay** ✅ 2026-11-01\n';
const ga = T.groupByStatus(T.parseTasks(allMd, ''));
assert.strictEqual(ga.tasks.length, labs.length + 2);
ga.tasks.forEach(t => assert(ga.lanes.includes(t.lane), 'thẻ ' + t.title + ' ở cột ' + t.lane + ' không có trong lanes'));
assert(ga.lanes.includes('Lỗi'));
// cột mặc định luôn có để kéo vào được, kể cả bảng rỗng
assert.deepStrictEqual(T.groupByStatus(T.parseTasks('## L\n', '')).lanes, ['Đang chờ', 'Đang thực hiện', 'Đang đánh giá', 'Hoàn thành']);
// khoá thẻ không đổi so với parse gốc (thao tác ghi vẫn tìm được dòng)
parsed.tasks.forEach(t => assert(g.tasks.some(x => T.taskKey(x) === T.taskKey(t)), t.title));
// không đổi tasks gốc
assert.strictEqual(parsed.tasks[0].lane, 'Việc mới');
// kéo sang cột trạng thái → đổi token, heading nguyên
const S = T.statusColumnRaw;
assert.strictEqual(S('- [ ] **A** `Mới` `🤖 X`', 'Đang thực hiện'), '- [ ] **A** `Đang thực hiện` `🤖 X`');
assert.strictEqual(S('- [ ] **A**', 'Đang đánh giá'), '- [ ] **A** `Đang đánh giá`');
assert(/^- \[x\] \*\*A\*\* ✅ \d{4}-\d{2}-\d{2}$/.test(S('- [ ] **A** `Mới`', 'Hoàn thành')));
assert.strictEqual(S('- [x] **E** ✅ 2026-11-01', 'Đang thực hiện'), '- [ ] **E** `Đang thực hiện`');
assert.strictEqual(S('- [ ] **A** `Mới` `x`', 'Chưa xử lý'), '- [ ] **A** `x`');
assert.strictEqual(S('- [ ] **A** `Mới`', 'Cột lạ'), '- [ ] **A** `Mới`'); // fail-closed
assert.strictEqual(S('- [ ] **A** `Mới`', 'Đang chờ'), '- [ ] **A** `Mới`'.replace('`Mới`', '`Đang chờ`'));
// bulk với khoá heading
const sigs = T.bulkSigs(g.tasks, g.tasks.filter(t => ['A', 'B'].includes(t.title)));
const r = T.bulkMd(md, sigs, (m, k) => T.editLineMd(m, k, l => S(l, 'Đang thực hiện')));
assert(r.includes('**A** `Đang thực hiện`') && r.includes('**B** `Đang thực hiện`') && r.includes('## Việc mới'));
// thêm việc có trạng thái
assert(T.addTaskMd('## L\n', 'L', { title: 'N', status: 'Đang thực hiện' }).includes('- [ ] **N** `Đang thực hiện`'));
assert(!T.addTaskMd('## L\n', 'L', { title: 'N' }).includes('`'));

// --- plugin (app giả): đổi group-by, thứ tự cột, kéo thẻ ở chế độ trạng thái ---
let file = md; const f = { path: 'TASKS.md' };
const p = Object.create(Plugin.prototype);
p.app = { vault: { read: async () => file, modify: async (_, n) => { file = n; }, getAbstractFileByPath: () => f } };
p.taskFile = f; p.reload = async () => { const par = T.parseTasks(file, ''); p.taskData = p.groupMode() === 'status' ? p._shapeColumns(T.groupByStatus(par)) : par; };
p.settings = { activeId: 'x', profiles: [{ id: 'x', sourceType: 'file', taskPath: 'TASKS.md', fileGroup: 'status', columnPrefs: {}, laneStatus: {} }] };
p.prof = () => p.settings.profiles[0]; let saved = 0; p.saveSettings = async () => { saved++; };
(async () => {
  assert.strictEqual(p.groupMode(), 'status');
  await p.reload();
  const key = t => T.taskKey(p.taskData.tasks.find(x => x.title === t));
  await p.moveTaskToPos(key('A'), 'Đang thực hiện', null);
  assert(file.includes('**A** `Đang thực hiện`') && file.split('\n').indexOf('## Việc mới') >= 0 && file.indexOf('**A**') < file.indexOf('## Đang làm'), 'A vẫn ở heading cũ');
  await p.reload(); await p.bulkMove([key('B'), key('C')], 'Hoàn thành');
  assert(/- \[x\] \*\*B\*\* ✅/.test(file) && /- \[x\] \*\*C\*\* ✅/.test(file));
  // thứ tự cột theo nhóm, lưu trong profile
  await p.reload(); await p.moveLane('Hoàn thành', 'Đang chờ', true);
  assert.strictEqual(p.prof().columnPrefs.status.order[0], 'Hoàn thành'); assert.strictEqual(p.prof().columnPrefs.status.sort, 'manual'); assert(saved > 0);
  assert.strictEqual(p.taskData.lanes[0], 'Hoàn thành'); // reload áp thứ tự
  await p.toggleColumn('Tạm dừng'); assert.deepStrictEqual(p.prof().columnPrefs.status.hidden, ['Tạm dừng']);
  await p.toggleColumn('Tạm dừng'); assert.deepStrictEqual(p.prof().columnPrefs.status.hidden, []);
  await p.setColumnSort('auto'); assert.strictEqual(p.prof().columnPrefs.status.sort, 'auto');
  // đổi group-by file: lane ↔ trạng thái
  await p.setGroupBy('lane'); assert.strictEqual(p.prof().fileGroup, 'lane'); assert.strictEqual(p.groupMode(), 'lane');
  await p.setGroupBy('status'); assert.strictEqual(p.groupMode(), 'status');
  // ánh xạ lane → trạng thái chỉnh ngay trên bảng
  await p.setLaneStatus('Đang làm', 'Đang thực hiện'); assert.deepStrictEqual(p.prof().laneStatus, { 'Đang làm': 'Đang thực hiện' });
  await p.setLaneStatus('Đang làm', null); assert.deepStrictEqual(p.prof().laneStatus, {});
  await p.setLaneStatus('X', 'Nhãn lạ'); assert.deepStrictEqual(p.prof().laneStatus, {}, 'nhãn lạ bị bỏ');
  console.log('groupby OK');
})().catch(e => { console.error(e); process.exit(1); });
