#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const catalog = JSON.parse(read('api/v1/catalog.json'));
const langs = ['en', 'ja', 'zh-Hans'];
const context = { window: {} };
vm.runInNewContext(read('assets/catalog.js'), context);
assert.equal(catalog.site, 'https://motion-prompt.knothhe.com/');
for (const el of catalog.elements) {
  const pack = catalog.packs.find(p => p.pack === el.pack);
  for (const lang of langs) {
    for (const field of ['name', 'meaning', 'ask', 'summary', 'use']) assert.ok(el[field][lang], `${el.id} ${field} ${lang}`);
    assert.equal(el.spec[lang].length, el.spec.en.length);
    assert.equal(read(`api/v1/${lang}/p/${el.id}.txt`).trimEnd(), context.window.MP_PROMPT(el, pack.title[lang], lang));
    assert.ok(read(`api/v1/${lang}/e/${el.id}.txt`).includes(el.name[lang]));
  }
}

// Exercise the first-paint locale decision without a browser, including URL and storage precedence.
for (const name of ['index.html', 'found.html']) {
  const script = read(name).match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [browser, saved, search, expected] of [
    ['zh-CN', null, '', 'zh-Hans'], ['zh-SG', null, '', 'zh-Hans'],
    ['zh-Hans-CN', null, '', 'zh-Hans'], ['ja-JP', null, '', 'ja'],
    ['en-US', 'zh-Hans', '', 'zh-Hans'], ['zh-CN', 'ja', '?lang=zh-Hans', 'zh-Hans'],
    ['zh-CN', 'zh-Hans', '?lang=en', 'en'], ['en-US', 'invalid', '', 'en'],
  ]) {
    const document = { documentElement: { setAttribute() {} } };
    vm.runInNewContext(script, { document, navigator: { language: browser }, location: { search }, localStorage: { getItem: k => k === 'mp-lang' ? saved : null } });
    assert.equal(document.documentElement.lang, expected, `${name} ${browser} ${saved} ${search}`);
  }
}
const cli = (...args) => execFileSync(process.execPath, ['skills/motion-prompt/scripts/motion-prompt.mjs', ...args], { cwd: root, encoding: 'utf8' });
assert.match(cli('search', '弹性入场', '--limit', '1'), /#001\s+弹性入场/);
assert.match(cli('search', 'ポップイン', '--limit', '1'), /#001\s+ポップイン/);
assert.match(cli('search', 'pop-in', '--limit', '1'), /#001\s+Pop-in/);
assert.match(cli('get', '001', '--lang', 'zh-Hans'), /效果规格/);
assert.match(cli('prompt', '120', '--lang', 'zh-Hans'), /双重曝光/);
assert.match(read('LICENSE'), /Copyright \(c\) 2026 Shohei Ohtaki/);
console.log(`Passed locale startup, ${catalog.count} elements in 3 languages, prompt parity and multilingual CLI checks.`);
