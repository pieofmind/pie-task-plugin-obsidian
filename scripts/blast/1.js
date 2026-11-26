// node scripts/blast/1.js — differential: không cấu hình ánh xạ → moveTaskMd/moveTaskToPosMd/bulk y hệt main (so với file main.js gốc truyền vào)
// dùng: git show origin/main:main.js > /tmp/old-main.js && node scripts/blast/1.js /tmp/old-main.js
const Module = require('module'), fs = require('fs'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global; global.document = { addEventListener() {} };
const load = f => { delete require.cache[require.resolve(f)]; return require(f)._t; };
const oldP = path.resolve(process.argv[2]);
// bản cũ chưa export hàm di chuyển → nối thêm export tạm
const tmp = oldP + '.exp.js';
fs.writeFileSync(tmp, fs.readFileSync(oldP, 'utf8') + '\nPieTasksPlugin._t.moveTaskMd = moveTaskMd; PieTasksPlugin._t.moveTaskToPosMd = moveTaskToPosMd; PieTasksPlugin._t.bulkSigs = bulkSigs; PieTasksPlugin._t.bulkMd = bulkMd;\n');
const O = load(tmp), N = load(path.join(__dirname, '..', '..', 'main.js'));
const fixtures = [path.join(__dirname, '..', '..', 'TASKS.sample.md'), ...fs.readdirSync(path.join(__dirname, '..', '..', 'test')).filter(f => f.endsWith('.md')).map(f => path.join(__dirname, '..', '..', 'test', f))].filter(fs.existsSync).map(f => fs.readFileSync(f, 'utf8'));
let n = 0, bad = 0;
const chk = (a, b, what) => { n++; if (a !== b) { bad++; console.log('DIFF', what); } };
for (const md of fixtures) {
  const tasks = N.parseTasks(md, '').tasks, lanes = [...new Set(tasks.map(t => t.laneName))];
  for (const t of tasks) for (const ln of lanes) {
    const k = N.taskKey(t);
    for (const ls of [undefined, {}, null]) {
      chk(O.moveTaskMd(md, k, ln), N.moveTaskMd(md, k, ln, ls), 'move ' + k + '→' + ln);
      chk(O.moveTaskToPosMd(md, k, ln, null), N.moveTaskToPosMd(md, k, ln, null, ls), 'pos ' + k + '→' + ln);
    }
  }
  for (const ln of lanes) {
    const run = X => X.bulkMd(md, X.bulkSigs(X.parseTasks(md, '').tasks, X.parseTasks(md, '').tasks), (m, k) => X.moveTaskMd(m, k, ln));
    chk(run(O), run(N), 'bulk→' + ln);
  }
}
fs.unlinkSync(tmp);
console.log('BLAST cases=' + n + ' diff=' + bad + ' fixtures=' + fixtures.length);
process.exit(bad ? 1 : 0);
