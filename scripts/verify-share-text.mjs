import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

/**
 * Smallest available regression guard for the approved Web Share `text`
 * payload (src/content/share.ts's buildShareText), added instead of a
 * snapshot/unit test since this repo has no test runner configured (see
 * package.json) -- reuses the `typescript` package, already a devDependency,
 * to transpile the single, import-free share.ts module in isolation and
 * execute it, rather than adding a new test dependency for one string.
 *
 * Run: node scripts/verify-share-text.mjs (wired as `pnpm verify:share-text`).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = path.join(__dirname, '..', 'src', 'content', 'share.ts');

const EXPECTED_SHARE_TEXT = [
  '우리 대전여행 갈래?',
  '코스는 이미 뽑아놨어 🎲',
  '네 취향 코스도 궁금해',
  '',
  '👉 바로 뽑고 공유하기',
].join('\n');

const source = fs.readFileSync(SOURCE_PATH, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: 'share.ts',
});

const moduleShim = { exports: {} };
const disallowRequire = () => {
  throw new Error(
    'src/content/share.ts must stay import-free for this standalone check to keep working -- ' +
      'if it now needs an import, this script needs a real module loader instead.'
  );
};
new Function('module', 'exports', 'require', outputText)(
  moduleShim,
  moduleShim.exports,
  disallowRequire
);

const { buildShareText } = moduleShim.exports;
if (typeof buildShareText !== 'function') {
  console.error('FAIL: buildShareText() was not found as an export of src/content/share.ts.');
  process.exit(1);
}

const actual = buildShareText('dummy title', 'dummy count');

let failed = false;

if (actual !== EXPECTED_SHARE_TEXT) {
  failed = true;
  console.error('FAIL: buildShareText() output does not match the approved share-text contract.');
  console.error('Expected:', JSON.stringify(EXPECTED_SHARE_TEXT));
  console.error('Actual:  ', JSON.stringify(actual));
}

const blankLineMatches = actual.match(/\n\n/g) || [];
if (blankLineMatches.length !== 1) {
  failed = true;
  console.error(
    `FAIL: expected exactly 1 blank line ("\\n\\n") in the share text, found ${blankLineMatches.length}.`
  );
}

if (!actual.includes('네 취향 코스도 궁금해\n\n👉 바로 뽑고 공유하기')) {
  failed = true;
  console.error('FAIL: the blank line is not positioned immediately before the CTA line as required.');
}

if (failed) {
  process.exit(1);
}

console.log(
  'PASS: buildShareText() matches the approved share-text contract (exactly one blank line, right before the CTA line).'
);
