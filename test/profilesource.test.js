// node test/profilesource.test.js — validate nguồn bảng trong modal Thêm/Sửa bảng (không cần Obsidian)
const Module = require('module'), assert = require('assert'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global.window || global; global.document = global.document || { addEventListener() {} };
const T = require(path.join(__dirname, '..', 'main.js'))._t;
const v = T.validateProfileSource;

// file thiếu file → lỗi
let r = v({ sourceType: 'file', taskPath: '  ' });
assert.strictEqual(r.ok, false); assert(r.error);
assert.strictEqual(v({}).ok, false); // mặc định = file
// file ok
r = v({ sourceType: 'file', taskPath: ' P/t.md ' });
assert.deepStrictEqual(r, { ok: true, fields: { sourceType: 'file', taskPath: 'P/t.md' } });
// folder thiếu folder → dùng gốc vault (chọn: không lỗi), groupBy mặc định status
r = v({ sourceType: 'folder', folderPath: '  ', groupBy: '', folderRecursive: false, taskPath: '' });
assert.strictEqual(r.ok, true);
assert.deepStrictEqual(r.fields, { sourceType: 'folder', folderPath: '', folderRecursive: false, groupBy: 'status', taskPath: 'TASKS.md' });
// folder đủ trường; ô file bỏ trống không bắt buộc, file đang có được giữ
r = v({ sourceType: 'folder', folderPath: '/Notes/Proj/', folderRecursive: 1, groupBy: ' priority ', taskPath: 'Keep.md' });
assert.deepStrictEqual(r.fields, { sourceType: 'folder', folderPath: 'Notes/Proj', folderRecursive: true, groupBy: 'priority', taskPath: 'Keep.md' });
// sourceType lạ → coi như file (fail-closed: cần file)
assert.strictEqual(v({ sourceType: 'zzz', taskPath: '' }).ok, false);
// tạo profile đúng trường
const p = T.makeProfile(Object.assign({ name: 'X' }, v({ sourceType: 'folder', folderPath: 'N', groupBy: 'status' }).fields));
assert.strictEqual(p.sourceType, 'folder'); assert.strictEqual(p.folderPath, 'N'); assert.strictEqual(p.groupBy, 'status'); assert.strictEqual(p.folderRecursive, false);
assert.strictEqual(T.makeProfile({}).sourceType, 'file');
console.log('profilesource OK');
