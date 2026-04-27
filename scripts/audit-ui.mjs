/**
 * UI Audit — read-only, modifies nothing.
 * Reports potential issues in src/ files.
 * Usage: node scripts/audit-ui.mjs
 */

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../src', import.meta.url))

// ─── Helpers ────────────────────────────────────────────────────────────────

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...await walk(full))
    else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) files.push(full)
  }
  return files
}

function rel(p) {
  return relative(process.cwd(), p)
}

function section(title) {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  ${title}`)
  console.log('─'.repeat(60))
}

function hit(file, lines) {
  console.log(`  ${rel(file)}`)
  for (const [lineNo, text] of lines) {
    console.log(`    L${lineNo}: ${text.trim().slice(0, 100)}`)
  }
}

function noHits() {
  console.log('  (žádné nálezy)')
}

// ─── Checks ─────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🔍  UI AUDIT — kodyspotrebicu.cz\n')

  const files = await walk(ROOT)
  const parsed = await Promise.all(
    files.map(async (f) => {
      const src = await readFile(f, 'utf8')
      const lines = src.split('\n')
      return { f, src, lines }
    })
  )

  // 1. <footer> výskyty
  section('1. Soubory obsahující <footer>')
  let found = false
  for (const { f, lines } of parsed) {
    const hits = lines.flatMap((l, i) => /<footer[\s>]/.test(l) ? [[i + 1, l]] : [])
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  // 2. <main> výskyty
  section('2. Soubory obsahující <main>')
  found = false
  for (const { f, lines } of parsed) {
    const hits = lines.flatMap((l, i) => /<main[\s>]/.test(l) ? [[i + 1, l]] : [])
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  // 3. Více než jeden <h1>
  section('3. Soubory s více než jedním <h1>')
  found = false
  for (const { f, src, lines } of parsed) {
    const matches = [...src.matchAll(/<h1[\s>]/g)]
    if (matches.length > 1) {
      const hits = lines.flatMap((l, i) => /<h1[\s>]/.test(l) ? [[i + 1, l]] : [])
      hit(f, hits); found = true
    }
  }
  if (!found) noHits()

  // 4. Text „Závažnost:"
  section('4. Soubory obsahující hardcoded „Závažnost:"')
  found = false
  for (const { f, lines } of parsed) {
    const hits = lines.flatMap((l, i) => l.includes('Závažnost:') ? [[i + 1, l]] : [])
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  // 5. Inline hex barvy (style nebo className s #xxxxxx)
  section('5. Soubory s inline hex barvami (style={{ color: "#..." }})')
  found = false
  const hexInStyle = /style=\{[^}]*#[0-9a-fA-F]{3,6}/
  for (const { f, lines } of parsed) {
    if (/opengraph-image\.(tsx|ts|jsx|js)$/.test(f)) continue
    const hits = lines.flatMap((l, i) => hexInStyle.test(l) ? [[i + 1, l]] : [])
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  // 6. style={{ ... }} výskyty (jakékoliv inline style)
  section('6. Soubory obsahující style={{ ... }} (inline styles)')
  found = false
  for (const { f, lines } of parsed) {
    if (/opengraph-image\.(tsx|ts|jsx|js)$/.test(f)) continue
    const hits = lines.flatMap((l, i) => /style=\{\{/.test(l) ? [[i + 1, l]] : [])
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  // 7. Možné nalepené ✓ přímo v JSX textu (ne v className nebo komentáři)
  section('7. Soubory s ✓/✗ přímo v JSX textu (potenciálně nalepené)')
  found = false
  // Match ✓ or ✗ immediately followed by a non-space letter (Czech or ASCII)
  const checkGlued = /[✓✗✔](?=\p{L}|\p{N})/u
  for (const { f, lines } of parsed) {
    const hits = lines.flatMap((l, i) => {
      // Skip lines that are pure className strings or comments
      if (/^\s*(\/\/|\*)/.test(l)) return []
      if (checkGlued.test(l)) return [[i + 1, l]]
      return []
    })
    if (hits.length) { hit(f, hits); found = true }
  }
  if (!found) noHits()

  console.log(`\n${'─'.repeat(60)}`)
  console.log('  ✅  Audit dokončen')
  console.log('─'.repeat(60))
}

run().catch((e) => { console.error(e); process.exit(1) })
