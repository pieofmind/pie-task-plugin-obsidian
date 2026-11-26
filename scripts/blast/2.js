// node scripts/blast/2.js <old-main.js> — bảng nguồn file: parseTasks + taskKey y hệt main (git show origin/main:main.js > old.js)
const Module = require('module'), fs = require('fs'), path = require('path');
const orig = Module._load;
Module._load = (r, ...a) => r === 'obsidian' ? new Proxy({}, { get: () => class {} }) : orig(r, ...a);
global.window = global; global.document = { addEventListener() {} };
const load = f => { delete require.cache[require.resolve(f)]; return require(f)._t; };
const O = load(path.resolve(process.argv[2])), N = load(path.join(__dirname, '..', '..', 'main.js'));
const root = path.join(__dirname, '..', '..');
const fx = [path.join(root, 'TASKS.sample.md'), path.join(root, 'People.sample.md')].filter(fs.existsSync).map(f => fs.readFileSync(f, 'utf8'));
let n = 0, bad = 0;
for (const md of fx) { n++; const a = O.parseTasks(md, 'x'), b = N.parseTasks(md, 'x'); if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('DIFF parseTasks'); } }
console.log('BLAST cases=' + n + ' diff=' + bad); process.exit(bad ? 1 : 0);
