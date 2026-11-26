// node test/foldermove.test.js — nguồn folder: kéo thẻ ghi property, tạo note từ cột (không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
class Notice { constructor(m) { Notice.last = m; } }
const stub = { Notice, normalizePath: x => String(x).replace(/\/+/g, '/').replace(/^\/|\/$/g, ''), Plugin: class {} };
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy(stub, { get: (t, k) => k in t ? t[k] : class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const Plugin = require(path.join(__dirname, '..', 'main.js')), T = Plugin._t;

// --- hàm thuần ---
const A = T.applyGroupValue;
let fm = { status: 'a', tags: ['t'] };
assert.strictEqual(A(fm, 'status', 'b'), fm, 'sửa tại chỗ, trả cùng object (processFrontMatter cần mutate)');
assert.deepStrictEqual(fm, { status: 'b', tags: ['t'] });
fm = { status: 'a', tags: ['t'], x: 1 }; A(fm, 'status', 'Chưa xếp'); assert.deepStrictEqual(fm, { tags: ['t'], x: 1 });
fm = { status: ['a', 'c'] }; A(fm, 'status', 'b'); assert.deepStrictEqual(fm, { status: 'b' });
fm = { status: 'a' }; A(fm, 'status', 'b'); const once = JSON.stringify(fm); A(fm, 'status', 'b'); assert.strictEqual(JSON.stringify(fm), once, 'idempotent');
fm = {}; A(fm, 'status', 'Chưa xếp'); assert.deepStrictEqual(fm, {}); // xoá key không có: không ném
fm = { status: 'a' }; A(fm, 'status', ''); assert.deepStrictEqual(fm, {}); // rỗng = xoá (fail-closed: không ghi chuỗi rỗng)
assert.throws(() => A(fm, '', 'b')); assert.throws(() => A(fm, '  ', 'b'), 'key rỗng không được ghi');
assert.deepStrictEqual(Object.keys(A({}, '__proto__', 'x')).length, 0); // không ô nhiễm prototype
assert.strictEqual({}.x, undefined);
// tên note mới không đụng tên có sẵn
assert.strictEqual(T.uniqueNotePath(['N/Việc mới.md'], 'N', 'Việc mới'), 'N/Việc mới 2.md');
assert.strictEqual(T.uniqueNotePath([], '', 'Việc mới'), 'Việc mới.md');
assert.strictEqual(T.uniqueNotePath(['N/Việc mới.md', 'N/Việc mới 2.md'], 'N/', 'Việc mới'), 'N/Việc mới 3.md');

// --- ghi text: chỉ sửa đúng dòng property (giữ comment/thứ tự/định dạng) ---
const S = T.setGroupPropMd;
const BODY = '# Tiêu đề\r\n\r\nNội dung  có khoảng trắng cuối   \n- [ ] không phải task\n\n---\nnot: frontmatter\n';
const FM = ['---', '# ghi chú của Nguyên', 'n: 007', 'status: a   # trạng thái', 'tags:', '  - t1', '  - t2', 'when: 2026-11-26', 'title: "Giữ nguyên"', '---'].join('\n') + '\n';
const lineDiff = (a, b) => { const x = a.split('\n'), y = b.split('\n'); assert.strictEqual(x.length, y.length, 'số dòng'); return x.map((l, i) => l === y[i] ? null : [l, y[i]]).filter(Boolean); };
let r = S(FM + BODY, 'status', 'b');
assert.deepStrictEqual(lineDiff(FM + BODY, r.text), [['status: a   # trạng thái', 'status: b   # trạng thái']]);
assert(r.text.endsWith(BODY)); assert(!r.complex);
assert(r.text.includes('n: 007') && r.text.includes('# ghi chú của Nguyên'));
// idempotent + cùng giá trị → text y hệt
assert.strictEqual(S(r.text, 'status', 'b').text, r.text);
// lane cần quote → "…"; số → quote; list 1 dòng → thay; CRLF giữ
assert.strictEqual(S('---\nstatus: a\n---\n', 'status', 'Đang làm 🔥').text, '---\nstatus: "Đang làm 🔥"\n---\n');
assert.strictEqual(S('---\nstatus: a\n---\n', 'status', '2026').text, '---\nstatus: "2026"\n---\n');
assert.strictEqual(S('---\nstatus: a\n---\n', 'status', 'Đang làm').text, '---\nstatus: Đang làm\n---\n');
assert.strictEqual(S('---\nstatus: [a, c]\n---\n', 'status', 'b').text, '---\nstatus: b\n---\n');
assert.strictEqual(S('---\r\nstatus: a\r\nx: 1\r\n---\r\nbody', 'status', 'b').text, '---\r\nstatus: b\r\nx: 1\r\n---\r\nbody');
// xoá key (Chưa xếp): bỏ đúng 1 dòng; key không có → y nguyên
assert.strictEqual(S(FM + BODY, 'n', 'Chưa xếp').text, (FM + BODY).replace('n: 007\n', ''));
assert.strictEqual(S('---\nx: 1\n---\nb', 'status', 'Chưa xếp').text, '---\nx: 1\n---\nb');
// key chưa có → thêm cuối frontmatter; không có frontmatter → thêm khối; rỗng
assert.strictEqual(S('---\nx: 1\n---\nb', 'status', 'a').text, '---\nx: 1\nstatus: a\n---\nb');
assert.strictEqual(S('# T\nbody', 'status', 'a').text, '---\nstatus: a\n---\n# T\nbody');
assert.strictEqual(S('', 'status', 'a').text, '---\nstatus: a\n---\n');
assert.strictEqual(S('# T', 'status', 'Chưa xếp').text, '# T');
// (1) dòng kế thụt vào / bắt đầu "- " → complex, kể cả khi sau ':' là comment hoặc đã có giá trị
for (const t of ['---\nstatus: # c\n  - a\n---\n', '---\nstatus:\n- a\n- c\n---\n', '---\nstatus: a\n  tiếp tục\n---\n']) { const c = S(t, 'status', 'b'); assert.strictEqual(c.complex, true, t); assert.strictEqual(c.text, t); }
// (3) key có quote → thay đúng dòng, không thêm dòng trùng
assert.strictEqual(S('---\n"status": a\n---\n', 'status', 'b').text, '---\n"status": b\n---\n');
assert.strictEqual(S("---\n'status': a\n---\n", 'status', 'b').text, "---\n'status': b\n---\n");
// (4) giá trị quote chứa ' #' → chỉ giữ comment sau quote đóng
assert.strictEqual(S('---\nstatus: "a #x"   # cmt\n---\n', 'status', 'b').text, '---\nstatus: b   # cmt\n---\n');
assert.strictEqual(S('---\nstatus: "a #x"\n---\n', 'status', 'b').text, '---\nstatus: b\n---\n');
assert.strictEqual(S("---\nstatus: 'it''s #x' # c\n---\n", 'status', 'b').text, '---\nstatus: b # c\n---\n');
assert.strictEqual(S('---\nstatus: a # c\n---\n', 'status', 'b').text, '---\nstatus: b # c\n---\n');
// (5) BOM đầu file: vẫn nhận frontmatter, giữ BOM
assert.strictEqual(S('\uFEFF---\nstatus: a\n---\nb', 'status', 'c').text, '\uFEFF---\nstatus: c\n---\nb');
assert.strictEqual(S('\uFEFF# T', 'status', 'a').text, '\uFEFF---\nstatus: a\n---\n# T');
// property nhiều dòng (block list / block scalar) hoặc frontmatter không đóng → complex, text không đổi
for (const t of ['---\nstatus:\n  - a\n  - c\n---\nb', '---\nstatus: |\n  a\n---\nb', '---\nstatus: a\nx: 1\nb']) { const c = S(t, 'status', 'b'); assert.strictEqual(c.complex, true, t); assert.strictEqual(c.text, t); }
// key chỉ khớp ở cột 0, đúng tên (không khớp status2 / dòng thụt / trong body)
assert.strictEqual(S('---\nstatus2: z\n  status: q\n---\nstatus: body', 'status', 'b').text, '---\nstatus2: z\n  status: q\nstatus: b\n---\nstatus: body');

// --- plugin với app giả: ghi qua vault.process (dòng đơn) / processFrontMatter (nhiều dòng) ---
const files = {
  'N/a.md': { text: FM + BODY }, 'N/c.md': { text: '---\nstatus: [a, c]\ntags: [t]\n---\n' + BODY },
  'N/u.md': { text: BODY }, 'N/m.md': { text: '---\nstatus:\n  - a\n  - c\n---\n' + BODY }
};
const calls = [];
const forbid = n => () => { throw new Error('cấm gọi ' + n); };
const app = {
  vault: { modify: forbid('modify'), append: forbid('append'), adapter: { write: forbid('adapter.write') },
    process: async (f, fn) => { calls.push('process ' + f.path); const o = files[f.path].text; const n = fn(o); if (n !== o) files[f.path].text = n; },
    getAbstractFileByPath: p => files[p] ? { path: p } : null,
    getMarkdownFiles: () => Object.keys(files).map(p => ({ path: p })),
    create: async (p, data) => { files[p] = { text: data }; calls.push('create ' + p); return { path: p }; } },
  fileManager: { processFrontMatter: async (f, fn) => { calls.push('pfm ' + f.path); fn({}); } }
};
const p = Object.create(Plugin.prototype);
p.app = app; p.settings = { activeId: 'x', profiles: [{ id: 'x', sourceType: 'folder', folderPath: 'N', groupBy: 'status', folderRecursive: false }] };
p.prof = () => p.settings.profiles[0];
p.taskFile = null;
// reload giả = dựng lại bảng từ text hiện tại, đọc status bằng regex dòng đơn
const fmOf = t => { const m = t.match(/^---\n([\s\S]*?)\n---\n/); const s = m && m[1].match(/^status:\s*(?:\[([^\],]*).*\]|(.*?))\s*(?:#.*)?$/m); return s ? { status: (s[1] || s[2] || '').replace(/^"|"$/g, '').trim() || undefined } : {}; };
p.reload = async () => { const g = T.groupNotes(Object.entries(files).map(([path, v]) => ({ path, frontmatter: fmOf(v.text) })), 'status'); p.taskData = { lanes: [...new Set(['a', 'b', ...g.lanes, 'Chưa xếp'])], tasks: g.tasks }; };

(async () => {
  await p.reload();
  const bodyOf = k => files[k].text.slice(files[k].text.lastIndexOf('# Tiêu đề'));
  const fixture = files['N/a.md'].text;
  await p.moveNotes(['N/a.md', 'N/c.md'], 'b');
  assert.deepStrictEqual(lineDiff(fixture, files['N/a.md'].text), [['status: a   # trạng thái', 'status: b   # trạng thái']]);
  assert.strictEqual(files['N/c.md'].text, '---\nstatus: b\ntags: [t]\n---\n' + BODY);
  const na = calls.filter(c => c === 'process N/a.md').length;
  await p.moveNotes(['N/a.md'], 'b'); // cùng cột: không ghi lại
  assert.strictEqual(calls.filter(c => c === 'process N/a.md').length, na);
  await p.moveNotes(['N/a.md'], 'Chưa xếp'); assert(!/^status:/m.test(files['N/a.md'].text.split('\n---\n')[0]) && files['N/a.md'].text.includes('n: 007') && files['N/a.md'].text.includes('# ghi chú của Nguyên'));
  await p.moveNotes(['N/u.md'], 'a'); assert.strictEqual(files['N/u.md'].text, '---\r\nstatus: a\r\n---\r\n' + BODY); // file CRLF → khối mới CRLF
  for (const k of ['N/a.md', 'N/c.md', 'N/u.md']) assert(files[k].text.endsWith(BODY), 'body y hệt ' + k);
  // property nhiều dòng → processFrontMatter, text không bị process đổi
  const mt = files['N/m.md'].text; await p.moveNotes(['N/m.md'], 'b');
  assert(calls.includes('pfm N/m.md')); assert.strictEqual(files['N/m.md'].text, mt);
  // đường dẫn lạ / ngoài bảng: không ghi
  const n0 = calls.length; await p.moveNotes(['N/none.md', '../evil.md', 'Other/a.md'], 'b'); assert.strictEqual(calls.length, n0);
  // tạo note từ cột: 1 lần create, không modify
  await p.createNote('b'); assert.strictEqual(files['N/Việc mới.md'].text, '---\nstatus: b\n---\n');
  await p.createNote('Chưa xếp'); assert.strictEqual(files['N/Việc mới 2.md'].text, '');
  // lỗi giữa chừng → Notice, không nuốt / không ném
  const okProcess = app.vault.process; app.vault.process = async () => { throw new Error('đĩa đầy'); };
  Notice.last = null; assert.strictEqual(await p.moveNotes(['N/u.md'], 'b'), 0); assert(/đĩa đầy/.test(Notice.last));
  app.vault.process = okProcess;
  const okCreate = app.vault.create; app.vault.create = async () => { throw new Error('trùng tên'); };
  Notice.last = null; assert.strictEqual(await p.createNote('b'), null); assert(/trùng tên/.test(Notice.last));
  app.vault.create = okCreate;
  // nguồn file: no-op
  p.settings.profiles[0].sourceType = 'file'; const n1 = calls.length; await p.moveNotes(['N/a.md'], 'b'); assert.strictEqual(calls.length, n1);
  console.log('foldermove OK');
})().catch(e => { console.error(e); process.exit(1); });
