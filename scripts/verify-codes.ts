/**
 * verify-codes.ts
 * Prochází všechny chybové kódy v DB a hledá jejich ověřená data na oficiálních stránkách výrobců.
 *
 * Spuštění:  npx ts-node --project tsconfig.seed.json scripts/verify-codes.ts
 * Pokračování od místa přerušení: skript ukládá postup do verify-progress.json
 * Výsledky:  scripts/verify-results.json  +  přímý update sourceUrl v DB
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import * as zlib from 'zlib'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

// ---------------------------------------------------------------------------
// Konfigurace
// ---------------------------------------------------------------------------

const PROGRESS_FILE = path.join(__dirname, 'verify-progress.json')
const RESULTS_FILE  = path.join(__dirname, 'verify-results.json')
const DELAY_MS      = 2500   // pauza mezi požadavky
const SEARCH_DELAY  = 4000   // delší pauza po search requestech
const TIMEOUT_MS    = 12000  // timeout jednoho požadavku

// ---------------------------------------------------------------------------
// Kvalitní zdroje — seřazené dle priority
// ---------------------------------------------------------------------------

const QUALITY_SOURCES: { domain: string; type: 'official' | 'manual' }[] = [
  // Výrobci
  { domain: 'bosch-home.com',              type: 'official' },
  { domain: 'siemens-home.bsh-group.com',  type: 'official' },
  { domain: 'support.aeg.co.uk',           type: 'official' },
  { domain: 'support.aeg.com',             type: 'official' },
  { domain: 'support.electrolux.co.uk',    type: 'official' },
  { domain: 'support.electrolux.com',      type: 'official' },
  { domain: 'samsung.com',                 type: 'official' },
  { domain: 'lg.com',                      type: 'official' },
  { domain: 'beko.com',                    type: 'official' },
  { domain: 'whirlpool.com',               type: 'official' },
  { domain: 'whirlpool.eu',                type: 'official' },
  { domain: 'siemens.com',                 type: 'official' },
  // Manuály a renomované opravny
  { domain: 'manualslib.com',              type: 'manual' },
  { domain: 'ifixit.com',                  type: 'manual' },
  { domain: 'repairclinic.com',            type: 'manual' },
  { domain: 'appliancepartspros.com',      type: 'manual' },
  { domain: 'partselect.com',              type: 'manual' },
  { domain: 'glotechrepairs.co.uk',        type: 'manual' },
  { domain: 'domex-uk.co.uk',              type: 'manual' },
  { domain: 'ukwhitegoods.co.uk',          type: 'manual' },
  { domain: 'applianceservicecentre.co.uk',type: 'manual' },
  { domain: 'ransom-spares.co.uk',         type: 'manual' },
]

const BLOCKED_DOMAINS = [
  'youtube.com','facebook.com','twitter.com','reddit.com','amazon.com','ebay.com',
  'techinfus.com','washerhouse.com','builderhub','hundred-worries.com','mychoice.techinfus',
  'gizmos.washerhouse','pro.washerhouse','schematic-expert.com','servicemanualhub.com',
  'scribd.com','slideshare.net','pinterest.com','instagram.com','tiktok.com',
  'appliancecodehub.com', // thin SEO content
]

function getSourceType(url: string): 'official' | 'manual' {
  for (const s of QUALITY_SOURCES) {
    if (url.includes(s.domain)) return s.type
  }
  return 'manual'
}

function isBlocked(url: string): boolean {
  return BLOCKED_DOMAINS.some(d => url.includes(d))
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// ---------------------------------------------------------------------------
// URL strategie pro každého výrobce + typ spotřebiče
// Formát: {CODE} = kód velkými, {code} = malými, {CODE_DASH} = e-17
// ---------------------------------------------------------------------------

type UrlTemplate = string

interface BrandStrategy {
  /** Stránky, na nichž jsou všechny kódy najednou – stačí stáhnout jednou */
  listPages?: UrlTemplate[]
  /** Stránky specifické pro jeden kód */
  codePages?: UrlTemplate[]
  /** Zda je listPage cachována pro tuto relaci */
  cacheList?: boolean
}

const SOURCES: Record<string, Record<string, BrandStrategy>> = {
  Bosch: {
    pracka: {
      codePages: [
        'https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-washing-error-{code}-or-f{code}-washing-machine',
        'https://www.bosch-home.com/us/owner-support/get-support/{code}-in-display',
        'https://www.bosch-home.com/gb/owner-support/get-support/support-selfhelp-washing-error-{code}-or-f{code}-washing-machine',
      ],
    },
    mycka: {
      codePages: [
        'https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-error-{code}-dishwasher',
        'https://www.bosch-home.com/gb/owner-support/get-support/support-selfhelp-dishwasher-error-{code}-dishwasher',
        'https://www.bosch-home.com/us/owner-support/get-support/{code}-in-display',
      ],
    },
    susicka: {
      codePages: [
        'https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dryer-error-{code}',
        'https://www.bosch-home.com/us/owner-support/get-support/{code}-in-display',
      ],
    },
  },
  Siemens: {
    pracka: {
      codePages: [
        'https://www.siemens-home.bsh-group.com/gb/service/get-support/support-selfhelp-washing-error-{code}-or-f{code}-washing-machine',
        'https://www.siemens-home.bsh-group.com/us/owner-support/get-support/support-selfhelp-washing-error-{code}-or-f{code}-washing-machine',
      ],
    },
    mycka: {
      codePages: [
        'https://www.siemens-home.bsh-group.com/gb/service/get-support/support-selfhelp-dishwasher-error-{code}',
      ],
    },
    susicka: {
      codePages: [
        'https://www.siemens-home.bsh-group.com/gb/service/get-support/support-selfhelp-dryer-error-{code}',
      ],
    },
  },
  AEG: {
    pracka: {
      listPages: [
        'https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
      ],
      cacheList: true,
    },
    mycka: {
      codePages: [
        'https://support.aeg.co.uk/support-articles/article/dishwasher-displays-error-code-{code-lower}',
        'https://support.aeg.co.uk/support-articles/article/dishwasher-displays-an-error-code-how-to-fix-it',
      ],
    },
    susicka: {
      codePages: [
        'https://support.aeg.co.uk/support-articles/article/tumble-dryer-displays-error-code-{code-lower}',
        'https://support.aeg.co.uk/support-articles/article/tumble-dryer-displays-error-message-{code-lower}',
      ],
    },
  },
  Electrolux: {
    pracka: {
      listPages: [
        'https://support.electrolux.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
      ],
      cacheList: true,
    },
    mycka: {
      codePages: [
        'https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-{code-lower}',
        'https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-an-error-code-how-to-fix-it',
      ],
    },
    susicka: {
      codePages: [
        'https://support.electrolux.co.uk/support-articles/article/tumble-dryer-displays-error-code-{code-lower}',
        'https://support.electrolux.co.uk/support-articles/article/tumble-dryer-displays-error-message-{code-lower}',
      ],
    },
  },
  Samsung: {
    pracka: {
      listPages: [
        'https://www.samsung.com/us/support/troubleshoot/TSG10000997/',
        'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
      ],
      cacheList: true,
    },
    mycka: {
      listPages: [
        'https://www.samsung.com/us/support/troubleshoot/TSG10004499/',
        'https://www.samsung.com/ca/support/home-appliances/meaning-of-error-codes-on-your-samsung-dishwasher/',
      ],
      cacheList: true,
    },
    susicka: {
      listPages: [
        'https://www.samsung.com/us/support/troubleshoot/TSG10001006/',
        'https://www.samsung.com/uk/support/home-appliances/check-the-information-codes-of-the-dryer/',
      ],
      cacheList: true,
    },
  },
  LG: {
    pracka: {
      listPages: [
        'https://www.lg.com/uk/support/product-help/washing-machines/error-codes',
        'https://www.lg.com/us/support/help-library/lg-washer-error-code-list--20150140270078',
      ],
      cacheList: true,
    },
    mycka: {
      listPages: [
        'https://www.lg.com/uk/support/product-help/dishwashers/error-codes',
      ],
      cacheList: true,
    },
    susicka: {
      listPages: [
        'https://www.lg.com/uk/support/product-help/dryers/error-codes',
      ],
      cacheList: true,
    },
  },
  Beko: {
    pracka: {
      listPages: [
        'https://www.beko.com/gb-en/help-support/washing-machine-error-codes',
        'https://www.beko.com/cz-cs/pomoc-a-podpora/chybove-kody-pracky',
      ],
      cacheList: true,
    },
    mycka: {
      listPages: [
        'https://www.beko.com/gb-en/help-support/dishwasher-error-codes',
      ],
      cacheList: true,
    },
    susicka: {
      listPages: [
        'https://www.beko.com/gb-en/help-support/tumble-dryer-error-codes',
      ],
      cacheList: true,
    },
  },
  Whirlpool: {
    pracka: {
      listPages: [
        'https://www.whirlpool.eu/en/support/faq/washing-machines/error-codes.html',
        'https://www.whirlpool.co.uk/support/washing-machines/error-codes/',
      ],
      cacheList: true,
    },
    mycka: {
      listPages: [
        'https://www.whirlpool.eu/en/support/faq/dishwashers/error-codes.html',
      ],
      cacheList: true,
    },
    susicka: {
      listPages: [
        'https://www.whirlpool.eu/en/support/faq/dryers/error-codes.html',
      ],
      cacheList: true,
    },
  },
}

// ---------------------------------------------------------------------------
// HTTP fetch s browser headers + gzip dekódováním
// ---------------------------------------------------------------------------

const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'cs,en-US;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
}

async function fetchPage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, { headers: BROWSER_HEADERS, timeout: TIMEOUT_MS }, (res) => {
      // Sleduj přesměrování
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location
        if (!loc.startsWith('http')) {
          try { loc = new URL(loc, url).href } catch { resolve(null); return }
        }
        fetchPage(loc).then(resolve)
        return
      }
      if (res.statusCode !== 200) {
        resolve(null)
        return
      }

      const chunks: Buffer[] = []
      let stream: NodeJS.ReadableStream = res

      const encoding = res.headers['content-encoding']
      if (encoding === 'gzip') {
        stream = res.pipe(zlib.createGunzip())
      } else if (encoding === 'br') {
        stream = res.pipe(zlib.createBrotliDecompress())
      } else if (encoding === 'deflate') {
        stream = res.pipe(zlib.createInflate())
      }

      stream.on('data', (c: Buffer) => chunks.push(c))
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      stream.on('error', () => resolve(null))
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

// ---------------------------------------------------------------------------
// HTML → čistý text
// ---------------------------------------------------------------------------

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ---------------------------------------------------------------------------
// Hledá kód v textu a vrátí výřez okolo nálezu
// ---------------------------------------------------------------------------

function extractWindow(text: string, code: string, windowChars = 600): string | null {
  // Hledej přesnou shodu (celé slovo, case-insensitive)
  const pattern = new RegExp(`(?<![A-Za-z0-9])(${escapeRegex(code)})(?![A-Za-z0-9])`, 'i')
  const match = text.search(pattern)
  if (match === -1) return null

  const start = Math.max(0, match - windowChars / 2)
  const end   = Math.min(text.length, match + windowChars / 2)
  return text.slice(start, end).trim()
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ---------------------------------------------------------------------------
// Sestaví URL z template
// ---------------------------------------------------------------------------

function buildUrl(template: string, code: string): string {
  const codeLower = code.toLowerCase().replace(':', '-')
  const codeUpper = code.toUpperCase()
  return template
    .replace(/{CODE}/g, codeUpper)
    .replace(/{code}/g, codeLower)
    .replace(/{code-lower}/g, codeLower)
    .replace(/{CODE_DASH}/g, codeLower)
}

// ---------------------------------------------------------------------------
// Typy
// ---------------------------------------------------------------------------

interface ErrorCodeRow {
  id: number
  slug: string
  code: string
  brand: string
  appliance_type: string
  source_url: string | null
  source_type: string
}

interface VerifyResult {
  slug: string
  code: string
  brand: string
  applianceType: string
  status: 'found' | 'not_found'
  sourceUrl?: string
  sourceType?: 'official' | 'manual'
  excerpt?: string
}

interface Progress {
  lastSlug: string | null
  done: string[]  // slug[], co už bylo zpracováno
}

// ---------------------------------------------------------------------------
// Pomocné funkce pro progress a výsledky
// ---------------------------------------------------------------------------

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'))
  }
  return { lastSlug: null, done: [] }
}

function saveProgress(p: Progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2))
}

function loadResults(): VerifyResult[] {
  if (fs.existsSync(RESULTS_FILE)) {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
  }
  return []
}

function saveResults(r: VerifyResult[]) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(r, null, 2))
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// DuckDuckGo HTML search
// ---------------------------------------------------------------------------

const APPLIANCE_EN: Record<string, string> = {
  pracka: 'washing machine', mycka: 'dishwasher', susicka: 'dryer',
}
const APPLIANCE_CS: Record<string, string> = {
  pracka: 'pračka', mycka: 'myčka', susicka: 'sušička',
}

async function searchWeb(query: string): Promise<string[]> {
  const url = `https://www.startpage.com/search?q=${encodeURIComponent(query)}&language=cs`
  const html = await fetchPage(url)
  if (!html) return []

  // Startpage vkládá výsledky jako přímé external href atributy
  const urls: string[] = []
  const re = /href="(https?:\/\/[^"]{15,})"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const u = m[1]
    if (!u.includes('startpage') && !u.includes('cdn.') && !u.includes('.png') && !u.includes('.jpg') && !u.includes('.svg'))
      urls.push(u)
  }
  return [...new Set(urls)] // deduplicate
}

// ---------------------------------------------------------------------------
// Cache stažených listPages (brand+type → text)
// ---------------------------------------------------------------------------

const listPageCache = new Map<string, string | null>()

async function getListPageText(brand: string, applianceType: string, urls: string[]): Promise<string | null> {
  const key = `${brand}:${applianceType}`
  if (listPageCache.has(key)) return listPageCache.get(key)!

  for (const url of urls) {
    console.log(`    → fetch list page: ${url}`)
    const html = await fetchPage(url)
    if (html && html.length > 500) {
      const text = htmlToText(html)
      listPageCache.set(key, text)
      return text
    }
    await sleep(DELAY_MS)
  }

  listPageCache.set(key, null)
  return null
}

// ---------------------------------------------------------------------------
// Ověření jednoho kódu
// ---------------------------------------------------------------------------

async function verifyCode(row: ErrorCodeRow): Promise<VerifyResult> {
  const { code, brand, appliance_type: applianceType, slug } = row
  const strategy = SOURCES[brand]?.[applianceType]

  const base: Omit<VerifyResult, 'status'> = { slug, code, brand, applianceType }

  if (!strategy) {
    return { ...base, status: 'not_found' }
  }

  // 1) Zkus list pages (stránky se všemi kódy)
  if (strategy.listPages?.length) {
    const text = await getListPageText(brand, applianceType, strategy.listPages)
    if (text) {
      const excerpt = extractWindow(text, code)
      if (excerpt) {
        // Najdi URL — použij tu, co vrátila text
        const workingUrl = strategy.listPages[0]
        return { ...base, status: 'found', sourceUrl: workingUrl, excerpt }
      }
    }
  }

  // 2) Zkus code-specific pages
  if (strategy.codePages?.length) {
    for (const template of strategy.codePages) {
      const url = buildUrl(template, code)
      console.log(`    → fetch code page: ${url}`)
      const html = await fetchPage(url)
      await sleep(DELAY_MS)

      if (html && html.length > 500) {
        const text = htmlToText(html)
        const excerpt = extractWindow(text, code)
        if (excerpt) {
          return { ...base, status: 'found', sourceUrl: url, excerpt }
        }
        // Stránka existuje ale kód nenalezen – pořád ji zaznamenej
        if (html.length > 2000) {
          return { ...base, status: 'found', sourceUrl: url, excerpt: text.slice(0, 400) }
        }
      }
    }
  }

  // 3) DuckDuckGo search fallback — česky i anglicky
  const applianceEn = APPLIANCE_EN[applianceType] || applianceType
  const applianceCs = APPLIANCE_CS[applianceType] || applianceType
  const queries = [
    `${brand} ${applianceCs} ${code} chyba`,
    `"${code}" ${brand} ${applianceEn} error fix`,
  ]

  const allSearchUrls: string[] = []
  for (const query of queries) {
    console.log(`    → search: ${query}`)
    const urls = await searchWeb(query)
    allSearchUrls.push(...urls)
    await sleep(SEARCH_DELAY)
  }

  // Odstraň duplicity, přijmi cokoliv mimo blokované weby
  // Seřaď: official > manual > ostatní
  const seen = new Set<string>()
  const candidateUrls = allSearchUrls
    .filter(u => !seen.has(u) && seen.add(u))
    .filter(u => !isBlocked(u))
    .sort((a, b) => {
      const rank = (u: string) => getSourceType(u) === 'official' ? 0 : getSourceType(u) === 'manual' ? 1 : 2
      return rank(a) - rank(b)
    })
    .slice(0, 8)

  if (candidateUrls.length === 0) {
    console.log(`    ⚠ search vrátil 0 kandidátů (celkem ${allSearchUrls.length} URL, všechny blokovány nebo žádné)`)
  } else {
    console.log(`    → kandidáti (${candidateUrls.length}): ${candidateUrls.map(u => new URL(u).hostname).join(', ')}`)
  }

  for (const url of candidateUrls) {
    console.log(`    → fetch: ${url.slice(0, 80)}`)
    const html = await fetchPage(url)
    await sleep(DELAY_MS)

    if (html && html.length > 500) {
      const text = htmlToText(html)
      const excerpt = extractWindow(text, code)
      if (excerpt) {
        const sType = getSourceType(url)
        return { ...base, status: 'found', sourceUrl: url, sourceType: sType, excerpt }
      }
    }
  }

  return { ...base, status: 'not_found' }
}

// ---------------------------------------------------------------------------
// Update DB – sourceUrl a sourceType
// ---------------------------------------------------------------------------

async function updateDb(result: VerifyResult) {
  const sType = result.sourceType || 'official'
  await pool.query(
    `UPDATE "ErrorCode"
       SET "sourceUrl"  = $1,
           "sourceType" = $2,
           "updatedAt"  = NOW()
     WHERE slug = $3`,
    [result.sourceUrl, sType, result.slug]
  )
}

// ---------------------------------------------------------------------------
// Hlavní běh
// ---------------------------------------------------------------------------

async function main() {
  console.log('📋 Načítám kódy z DB…')

  const { rows }: { rows: ErrorCodeRow[] } = await pool.query(`
    SELECT id, slug, code, brand, "applianceType" AS appliance_type, "sourceUrl" AS source_url, "sourceType" AS source_type
    FROM "ErrorCode"
    ORDER BY
      CASE "applianceType"
        WHEN 'pracka'  THEN 1
        WHEN 'mycka'   THEN 2
        WHEN 'susicka' THEN 3
        ELSE 4
      END,
      brand, code
  `)

  console.log(`Celkem kódů: ${rows.length}`)

  const progress = loadProgress()
  const results  = loadResults()
  const doneSet  = new Set(progress.done)

  // Najdi startovní pozici
  let startIdx = 0
  if (progress.lastSlug) {
    const idx = rows.findIndex(r => r.slug === progress.lastSlug)
    startIdx = idx === -1 ? 0 : idx + 1
    console.log(`▶ Pokračuji od: ${progress.lastSlug} (index ${startIdx})`)
  }

  let found = 0
  let notFound = 0

  for (let i = startIdx; i < rows.length; i++) {
    const row = rows[i]

    if (doneSet.has(row.slug)) {
      console.log(`  ⏭ přeskočeno (již zpracováno): ${row.brand} ${row.appliance_type} ${row.code}`)
      continue
    }

    const label = `[${i + 1}/${rows.length}] ${row.brand} ${row.appliance_type} ${row.code}`
    console.log(`\n${label}`)

    let result: VerifyResult

    try {
      result = await verifyCode(row)
    } catch (err) {
      console.error(`  ❌ chyba: ${err}`)
      result = { slug: row.slug, code: row.code, brand: row.brand, applianceType: row.appliance_type, status: 'not_found' }
    }

    if (result.status === 'found') {
      console.log(`  ✅ nalezeno: ${result.sourceUrl}`)
      found++

      // Ulož do DB
      try {
        await updateDb(result)
      } catch (err) {
        console.error(`  ⚠ DB update selhal: ${err}`)
      }
    } else {
      console.log(`  ⬜ nenalezeno`)
      notFound++
    }

    // Ulož výsledek
    const existing = results.findIndex(r => r.slug === row.slug)
    if (existing >= 0) results[existing] = result
    else results.push(result)

    // Ulož postup
    doneSet.add(row.slug)
    progress.lastSlug = row.slug
    progress.done = [...doneSet]
    saveProgress(progress)
    saveResults(results)

    // Pauza
    await sleep(DELAY_MS)
  }

  console.log(`\n✅ Hotovo! Nalezeno: ${found}  Nenalezeno: ${notFound}`)
  console.log(`Výsledky: ${RESULTS_FILE}`)

  await pool.end()
}

main().catch(async (err) => {
  console.error(err)
  await pool.end()
  process.exit(1)
})
