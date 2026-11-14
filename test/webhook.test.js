// node test/webhook.test.js — luồng decide → webhook → hàng đợi → gửi lại → hoàn tác, với server giả cục bộ
const Module = require('module'), assert = require('assert'), http = require('http'), path = require('path');
const notices = [];
class Base { open() { this.resolve && this.resolve(global.__note); } }
class Notice { constructor(m) { notices.push(typeof m === 'string' ? m : m.text); this.hide = () => {}; } }
const stub = { Plugin: Base, Modal: Base, Notice, normalizePath: x => x,
  requestUrl: async ({ url, body }) => { const r = await fetch(url, { method: 'POST', body, headers: { 'content-type': 'application/json' } }); return { status: r.status }; } };
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy(stub, { get: (t, k) => k in t ? t[k] : class extends Base {} }) : orig(r, ...a);
global.window = global; global.document = { addEventListener() {} };
global.createFragment = fn => { const f = { text: '', createSpan(o) { f.text += o.text; }, createEl() { return { addEventListener() {} }; } }; fn(f); return f; };
const Plugin = require(path.join(__dirname, '..', 'main.js'));

let md = '## Chờ duyệt\n\n- [ ] **Việc A** `Chờ duyệt` [cnt:: CNT-1]\n\t- ghi chú\n\n## Hoàn thành\n\n## Đang làm\n';
const file = { path: 'TASKS.md' };
const p = Object.create(Plugin.prototype);
p.app = { vault: { read: async () => md, modify: async (f, n) => { md = n; }, getAbstractFileByPath: () => file } };
p.taskFile = file;
p.settings = { activeId: 'b', approverName: 'Nguyên', laneApproved: 'Hoàn thành', laneRevise: 'Đang làm', laneReview: 'Chờ duyệt', webhookUrl: '', webhookChannel: 'tsvh', webhookQueue: [], profiles: [{ id: 'b', name: 'Bảng chính', webhookUrl: '', webhookChannel: '' }] };
p.saveSettings = async () => {};
p.prof = () => p.settings.profiles[0];
const task = () => ({ title: 'Việc A', raw: md.split('\n')[2], ...{ lane: 'Chờ duyệt' } });
const keyT = () => require('../main.js')._t.taskKey(require('../main.js')._t.parseTasks(md, '').tasks[0]);

(async () => {
  const got = [];
  let srv = http.createServer((q, s) => { let b = ''; q.on('data', c => b += c); q.on('end', () => { got.push(JSON.parse(b)); s.end('ok'); }); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const port = srv.address().port;
  const T = require('../main.js')._t;
  const t0 = () => T.parseTasks(md, '').tasks[0];

  // 4. URL trống: chỉ sửa file
  global.__note = 'ok';
  await p.decide(t0(), 'duyet');
  assert(md.includes('- [x] **Việc A** `Hoàn thành`') && !md.includes('chưa báo bot') && got.length === 0);
  p._last = null;
  // hoàn tác URL trống
  md = '## Chờ duyệt\n\n- [ ] **Việc A** `Chờ duyệt` [cnt:: CNT-1]\n\t- ghi chú\n\n## Hoàn thành\n\n## Đang làm\n';

  // 1+3. server bật: duyệt gửi đúng body
  p.settings.webhookUrl = 'http://127.0.0.1:' + port + '/hooks/SECRET';
  await p.decide(t0(), 'duyet');
  assert.strictEqual(got.length, 1); assert(got[0].task.startsWith('Anh Nguyên DUYỆT: "Việc A" · CNT-1'), got[0].task);
  assert.strictEqual(got[0].channel, 'tsvh'); assert.strictEqual(got[0].pie.ket_qua, 'duyet');
  assert(notices.at(-1).includes('đã báo MausBot'));
  // 6. hoàn tác trong 10s → file như cũ + huy_duyet
  await p.undoLast();
  assert.strictEqual(got.length, 2); assert.strictEqual(got[1].pie.ket_qua, 'huy_duyet');
  assert(md.includes('- [ ] **Việc A** `Chờ duyệt`') && md.indexOf('Việc A') < md.indexOf('## Hoàn thành') && !md.includes('✅ Duyệt'));

  // 5. tắt server → lỗi, hàng đợi, đuôi ⚠️; bật lại → gửi lại xoá đuôi
  await new Promise(r => srv.close(r));
  await p.decide(t0(), 'duyet');
  assert(notices.at(-1).includes('CHƯA báo được'), notices.at(-1));
  assert(!notices.at(-1).includes('SECRET') && !notices.at(-1).includes('127.0.0.1'), 'không lộ URL');
  assert(md.includes('⚠️ chưa báo bot')); assert.strictEqual(p.settings.webhookQueue.length, 1);
  srv = http.createServer((q, s) => { let b = ''; q.on('data', c => b += c); q.on('end', () => { got.push(JSON.parse(b)); s.end('ok'); }); });
  await new Promise(r => srv.listen(port, '127.0.0.1', r));
  await p.resendQueue();
  assert.strictEqual(p.settings.webhookQueue.length, 0); assert(!md.includes('chưa báo bot')); assert.strictEqual(got.at(-1).pie.ket_qua, 'duyet');
  srv.close();
  console.log('webhook tests OK');
})().catch(e => { console.error(e); process.exit(1); });
