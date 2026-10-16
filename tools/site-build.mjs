#!/usr/bin/env node
// Package public files only. Keep Git metadata, dependencies and local configuration out of hosting.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
const publicFiles = ['index.html', 'found.html', 'assets', 'api', 'packs', 'examples', 'skills', 'LICENSE', 'THIRD-PARTY-NOTICES.md'];
for (const name of publicFiles) fs.cpSync(path.join(root, name), path.join(dist, name), { recursive: true });
// Keep the existing published video examples accessible without shipping their build dependencies.
fs.cpSync(path.join(root, 'make-your-own/examples'), path.join(dist, 'make-your-own/examples'), { recursive: true });
console.log(`Packaged public site in ${dist}`);
