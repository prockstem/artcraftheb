#!/usr/bin/env node
// Lists user-visible English UI strings that have no Hebrew translation yet.
//
//   node tools/i18n/extract-ui-strings.cjs          # report missing strings
//   node tools/i18n/extract-ui-strings.cjs --all    # list every candidate
//
// It scans components for JSX text, label-like props (label, title,
// placeholder, tooltip…), toast/error calls and display-string maps, then
// compares them against libs/common/src/lib/i18n/locales/he-ui.ts. Add new
// translations there; add names that should stay in English (models, brands,
// asset names) to tools/i18n/keep-english.json.
const path = require('path');
const root = path.resolve(__dirname, '../..');
const ts = require(path.join(root, 'node_modules/typescript'));
const fs = require('fs');
const ATTRS = new Set(['placeholder','title','label','aria-label','alt','content','tooltip','tooltipContent','description','text','confirmText','cancelText','message','buttonText','emptyMessage','subtitle','heading','helperText','hint','caption','header','emptyText','loadingText']);
const PROPS = new Set(['label','description','title','tooltip','placeholder','message','text','subtitle','heading','confirmText','cancelText','buttonText','name','helperText','hint','caption','header','emptyText','tooltipText','errorMessage','successMessage','displayName','shortLabel','longLabel','badge','category']);
const CALLS = new Set(['toast','success','error','loading','info','warning','setErrorDialog','showError','showToast','addToast','setError','setErrorMessage','setLocalError','alert','confirm','notify']);
const out = new Map();
const UI_NAME = /(label|title|text|subtitle|placeholder|description|message|heading|caption|tooltip|hint|name|cta|prompt$)/i;
const NON_UI_NAME = /(class|file|tag|type|key|event|field|prop|var|store|path|font|asset|model|track|node|mesh|bone|channel|param|query|route|table|column|cache|storage|cookie|header|mime|env|host|url|id)name|^name$|classname|testid|^text(color|size|align|decoration|transform)/i;
const uiName = (n) => UI_NAME.test(n) && !NON_UI_NAME.test(n);
const isUiFile = (f) => f.endsWith('.tsx') || f.includes('/libs/components/') || f.includes('/app/src/');
function add(s, file) {
  s = s.replace(/\s+/g, ' ').trim();
  if (!s || !/[A-Za-z]{2,}/.test(s)) return;
  if (/^[a-z0-9_\-./:#]+$/.test(s) && !s.includes(' ')) return; // identifiers, paths, ids
  if (/^(https?:|\/|#|\.|data:|bg-|text-|flex|grid|w-|h-)/.test(s)) return;
  if (/[{}<>=;]|=>/.test(s)) return;
  if (/^\[/.test(s)) return; // log tags like [Moodboard]
  const tokens = s.split(' ');
  if (tokens.length > 1 && tokens.every(t => /^[!-]?[a-z0-9\[\]:/.%&_#()>*=+,~-]+$/.test(t)) && tokens.some(t => /-|:/.test(t))) return; // tailwind class lists
  if (/^(__|[a-z]+_[a-z_]+$)/.test(s)) return; // internal ids
  if (/^[a-z]+[A-Z][A-Za-z]*$/.test(s)) return; // camelCase identifiers
  if (/^[A-Z_]{2,}$/.test(s) && !['NEW','BETA','SOON','BEST','OFF','ON','PRO','HD','AI'].includes(s)) return; // CONSTANT_IDS
  if (!/[A-Z ]/.test(s) && !/^[a-z]+( [a-z]+)*$/.test(s)) return;
  if (!out.has(s)) out.set(s, new Set());
  out.get(s).add(path.relative(root, file));
}
const patterns = new Map();
function addPattern(p, file) {
  p = p.replace(/\s+/g, ' ').trim();
  const lit = p.replace(/\{\d+\}/g, '');
  if (!/[A-Za-z]{3,}/.test(lit) || /[<>=;]|=>|https?:|^\[/.test(p) || /^[\w\-/.]*\{/.test(p) && !p.includes(' ')) return;
  if (!/ /.test(lit.trim())) return;
  if (!patterns.has(p)) patterns.set(p, new Set());
  patterns.get(p).add(path.relative(root, file));
}
function walk(dir, files=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules','dist','.nx','test-output','storybook-static'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(e.name) && !/\.(spec|test|stories)\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts')) files.push(p);
  }
  return files;
}
const files = [...walk(root + '/apps/artcraft/app/src'), ...walk(root + '/libs')].filter(f => !f.includes('/i18n/'));
for (const file of files) {
  const src = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (n) => {
    if (ts.isJsxText(n)) add(n.text, file);
    else if (ts.isJsxAttribute(n) && n.initializer) {
      const name = n.name.getText();
      if (ATTRS.has(name) || uiName(name)) {
        const init = n.initializer;
        if (ts.isStringLiteral(init)) add(init.text, file);
        else if (ts.isJsxExpression(init) && init.expression) collectStrings(init.expression, file);
      }
    } else if (ts.isJsxExpression(n) && n.expression && n.parent && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent))) {
      collectStrings(n.expression, file);
    } else if (ts.isPropertyAssignment(n) && (PROPS.has(n.name.getText().replace(/['"]/g,'')) || uiName(n.name.getText()))) {
      collectStrings(n.initializer, file);
    } else if (ts.isPropertyAssignment(n) && isUiFile(file) && (ts.isStringLiteral(n.initializer)) && /^[A-Z][a-z]+( [A-Za-z0-9()&:/'-]+)*[.!?…]*$/.test(n.initializer.text)) {
      add(n.initializer.text, file); // display maps like { compact: "Compact" }
    } else if (ts.isReturnStatement(n) && n.expression && isUiFile(file) && ts.isStringLiteral(n.expression) && /^[A-Z0-9][^\n]*[a-z]/.test(n.expression.text) && /[ a-z]/.test(n.expression.text)) {
      add(n.expression.text, file); // label helpers: return "16:9 (Wide)"
    } else if (ts.isVariableDeclaration(n) && n.initializer && uiName(n.name.getText())) {
      collectStrings(n.initializer, file);
    } else if (ts.isCallExpression(n)) {
      const calleeText = n.expression.getText();
      const callee = calleeText.split('.').pop();
      const isLog = /^(console|log|logger|Log)\b/.test(calleeText) || /(^|\.)(debug|trace)$/.test(calleeText);
      if (CALLS.has(callee) && !isLog) n.arguments.forEach(a => collectStrings(a, file));
    } else if (ts.isNewExpression(n) && /Error$/.test(n.expression.getText()) ) {
      // skip thrown error internals
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
}
function collectStrings(e, file) {
  if (!e) return;
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) add(e.text, file);
  else if (ts.isConditionalExpression(e)) { collectStrings(e.whenTrue, file); collectStrings(e.whenFalse, file); }
  else if (ts.isBinaryExpression(e) && (e.operatorToken.kind === ts.SyntaxKind.BarBarToken || e.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken || e.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken)) { collectStrings(e.left, file); collectStrings(e.right, file); }
  else if (ts.isParenthesizedExpression(e)) collectStrings(e.expression, file);
  else if (ts.isTemplateExpression(e)) {
    let pat = e.head.text; e.templateSpans.forEach((sp, i) => { pat += '{' + i + '}' + sp.literal.text; });
    addPattern(pat, file);
  }
}
const candidates = [
  ...[...out.entries()].map(([s, f]) => ({ s, files: [...f], pattern: false })),
  ...[...patterns.entries()].map(([s, f]) => ({ s, files: [...f], pattern: true })),
].sort((a, b) => a.s.localeCompare(b.s));

if (process.argv.includes('--all')) {
  for (const c of candidates) console.log(`${c.s}\t${c.files.join(', ')}`);
  process.exit(0);
}

const dictionary = fs.readFileSync(path.join(root, 'libs/common/src/lib/i18n/locales/he-ui.ts'), 'utf8');
const KEY = /^\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_$][\w$]*):/gm;
const parseKey = (k) =>
  k.startsWith('"') ? JSON.parse(k) : k.startsWith("'") ? k.slice(1, -1).replace(/\\(.)/g, '$1') : k;
const translated = new Set([...dictionary.matchAll(KEY)].map((m) => parseKey(m[1])));
const keep = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'keep-english.json'), 'utf8')));
const missing = candidates.filter((c) => !translated.has(c.s) && !keep.has(c.s));
for (const c of missing) console.log(`${c.pattern ? '[pattern] ' : ''}${c.s}\t${c.files.join(', ')}`);
console.error(`${candidates.length} UI strings found, ${missing.length} without a Hebrew translation.`);
process.exitCode = missing.length ? 1 : 0;
