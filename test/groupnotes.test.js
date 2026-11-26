// node test/groupnotes.test.js — nguồn folder: note → thẻ, group theo property frontmatter (hàm thuần, không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const T = require(path.join(__dirname, '..', 'main.js'))._t;
const cols = r => r.lanes.map(l => [l, r.tasks.filter(t => t.lane === l).map(t => t.title)]);

const notes = [
  { path: 'P/a1.md', frontmatter: { status: 'a', priority: 'high' } },
  { path: 'P/a2.md', frontmatter: { status: 'a', priority: 'low' } },
  { path: 'P/b1.md', frontmatter: { status: 'b' } }
];
// 3 note a/a/b
assert.deepStrictEqual(cols(T.groupNotes(notes, 'status')), [['a', ['a1', 'a2']], ['b', ['b1']]]);
// thiếu property → "Chưa xếp" (cột cuối)
let r = T.groupNotes([...notes, { path: 'P/z.md', frontmatter: {} }, { path: 'P/n.md', frontmatter: null }], 'status');
assert.deepStrictEqual(cols(r), [['a', ['a1', 'a2']], ['b', ['b1']], ['Chưa xếp', ['z', 'n']]]);
// list → phần tử đầu; list rỗng / chuỗi rỗng → Chưa xếp
r = T.groupNotes([{ path: 'x.md', frontmatter: { status: ['x', 'y'] } }, { path: 'e.md', frontmatter: { status: [] } }, { path: 's.md', frontmatter: { status: '  ' } }], 'status');
assert.deepStrictEqual(cols(r), [['x', ['x']], ['Chưa xếp', ['e', 's']]]);
// đổi groupBy
assert.deepStrictEqual(cols(T.groupNotes(notes, 'priority')), [['high', ['a1']], ['low', ['a2']], ['Chưa xếp', ['b1']]]);
// số / bool không bị coi là thiếu
assert.deepStrictEqual(cols(T.groupNotes([{ path: 'n.md', frontmatter: { p: 0 } }], 'p')), [[ '0', ['n']]]);
// tiêu đề = title nếu có; owner/due → thẻ; chỉ đọc, mở được note
r = T.groupNotes([{ path: 'P/f.md', frontmatter: { status: 'a', title: 'Tên đẹp', owner: 'Lan', due: '2026-12-01T00:00:00' } }], 'status');
const t = r.tasks[0];
assert.strictEqual(t.title, 'Tên đẹp'); assert.strictEqual(t.owner, 'Lan'); assert.strictEqual(t.date, '2026-12-01');
assert.strictEqual(t.notePath, 'P/f.md'); assert.strictEqual(t.readOnly, true); assert.strictEqual(t.done, false);
assert.deepStrictEqual(t.owners, [{ name: 'Lan', kind: 'human' }]);
// khoá thẻ duy nhất dù trùng tên
r = T.groupNotes([{ path: 'a/x.md', frontmatter: { status: 's' } }, { path: 'b/x.md', frontmatter: { status: 's' } }], 'status');
assert.strictEqual(new Set(r.tasks.map(T.taskKey)).size, 2);
// groupBy rỗng → dùng status; không ném khi dữ liệu lạ
assert.deepStrictEqual(cols(T.groupNotes(notes, '')), cols(T.groupNotes(notes, 'status')));
assert.doesNotThrow(() => T.groupNotes([{ path: 'q.md', frontmatter: { status: { a: 1 } } }], 'status'));
// ghi chú nằm trong folder (không đệ quy / đệ quy)
const files = [{ path: 'P/a.md' }, { path: 'P/sub/b.md' }, { path: 'PP/c.md' }, { path: 'P/d.txt' }];
assert.deepStrictEqual(T.notesInFolder(files, 'P', false).map(f => f.path), ['P/a.md']);
assert.deepStrictEqual(T.notesInFolder(files, 'P/', true).map(f => f.path), ['P/a.md', 'P/sub/b.md']);
console.log('groupnotes OK');
