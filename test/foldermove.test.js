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

// --- plugin với app giả: ghi CHỈ qua processFrontMatter, body không đổi ---
const BODY = '# Tiêu đề\r\n\r\nNội dung  có khoảng trắng cuối   \n- [ ] không phải task\n\n---\nnot frontmatter\n';
const files = {
  'N/a.md': { fm: { status: 'a', tags: ['t'] }, body: BODY },
  'N/c.md': { fm: { status: ['a', 'c'] }, body: BODY },
  'N/u.md': { fm: {}, body: BODY }
};
const calls = [];
const forbid = n => () => { throw new Error('cấm gọi ' + n); };
const app = {
  vault: { modify: forbid('modify'), process: forbid('process'), append: forbid('append'), adapter: { write: forbid('adapter.write') },
    getAbstractFileByPath: p => files[p] ? { path: p } : null,
    getMarkdownFiles: () => Object.keys(files).map(p => ({ path: p })),
    create: async (p, data) => { assert.strictEqual(data, ''); files[p] = { fm: {}, body: '' }; calls.push('create ' + p); return { path: p }; } },
  fileManager: { processFrontMatter: async (f, fn) => { calls.push('pfm ' + f.path); fn(files[f.path].fm); } }
};
const p = Object.create(Plugin.prototype);
p.app = app; p.settings = { activeId: 'x', profiles: [{ id: 'x', sourceType: 'folder', folderPath: 'N', groupBy: 'status', folderRecursive: false }] };
p.prof = () => p.settings.profiles[0];
p.taskData = { lanes: ['a', 'b', 'Chưa xếp'], tasks: [{ notePath: 'N/a.md', lane: 'a' }, { notePath: 'N/c.md', lane: 'a' }, { notePath: 'N/u.md', lane: 'Chưa xếp' }] };
p.taskFile = null;
// reload giả = dựng lại bảng từ frontmatter hiện tại như loadFolderTasks
p.reload = async () => { const g = T.groupNotes(Object.entries(files).map(([path, v]) => ({ path, frontmatter: v.fm })), 'status'); p.taskData = { lanes: [...new Set(['a', 'b', ...g.lanes, 'Chưa xếp'])], tasks: g.tasks }; };
p.taskData.lanes = ['a', 'b', 'Chưa xếp'];
const key = n => T.taskKey(Object.assign({ id: null, title: n, line: 0 }, { lane: 'a' }));

(async () => {
  const before = JSON.stringify(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.body])));
  await p.moveNotes(['N/a.md', 'N/c.md'], 'b');
  assert.deepStrictEqual(files['N/a.md'].fm, { status: 'b', tags: ['t'] });
  assert.deepStrictEqual(files['N/c.md'].fm, { status: 'b' });
  await p.moveNotes(['N/a.md'], 'b'); // kéo lần 2 cùng cột: không ghi nữa
  assert.deepStrictEqual(files['N/a.md'].fm, { status: 'b', tags: ['t'] });
  assert.strictEqual(calls.filter(c => c === 'pfm N/a.md').length, 1, 'cùng cột → không ghi lại file');
  await p.moveNotes(['N/a.md'], 'Chưa xếp'); assert.deepStrictEqual(files['N/a.md'].fm, { tags: ['t'] });
  await p.moveNotes(['N/u.md'], 'a'); assert.deepStrictEqual(files['N/u.md'].fm, { status: 'a' });
  // body byte-for-byte
  assert.strictEqual(JSON.stringify(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.body]))), before);
  // đường dẫn lạ / ngoài folder nguồn: không ghi
  const n0 = calls.length;
  await p.moveNotes(['N/none.md', '../evil.md', 'Other/a.md'], 'b'); assert.strictEqual(calls.length, n0);
  // tạo note từ cột
  await p.createNote('b');
  assert(calls.includes('create N/Việc mới.md')); assert.deepStrictEqual(files['N/Việc mới.md'].fm, { status: 'b' });
  await p.createNote('Chưa xếp'); assert.deepStrictEqual(files['N/Việc mới 2.md'].fm, {});
  // nguồn file: moveNotes không làm gì
  p.settings.profiles[0].sourceType = 'file'; const n1 = calls.length; await p.moveNotes(['N/a.md'], 'b'); assert.strictEqual(calls.length, n1);
  console.log('foldermove OK');
})().catch(e => { console.error(e); process.exit(1); });
