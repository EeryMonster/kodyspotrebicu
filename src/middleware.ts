import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-safe slugify (kopie z src/lib/utils.ts — duplikováno, protože middleware
// běží v Edge runtime a import z lib/utils může táhnout server-only závislosti).
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Statické symptom slug-merge mapování (drží paralelně s SLUG_REDIRECTS v
// src/app/symptom/[slug]/page.tsx). Middleware tím doruči 308 ještě před renderem,
// stejný důvod jako u diakritiky.
const SYMPTOM_SLUG_REDIRECTS: Record<string, string> = {
  'pracka-nevypousti': 'voda-zustava-v-pracce',
  'voda-pri-napousteni-tece': 'pracka-tece',
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const originalPath = request.nextUrl.pathname
  let redirect = false

  // 1) non-www → www (canonical host).
  //    Pozn.: pokud je na Vercelu nastaven domain-level redirect pro
  //    kodyspotrebicu.cz, middleware se sem vůbec nedostane a redirect
  //    obslouží edge vrstva. Musí být nastaven jako 308 (Permanent),
  //    ne 307 (Temporary) — jinak Google nekonsoliduje signály a nechá
  //    non-www URL viset v GSC jako „Stránka s přesměrováním".
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase()
  if (host === 'kodyspotrebicu.cz') {
    url.host = 'www.kodyspotrebicu.cz'
    redirect = true
  }

  // 2) Normalizace cesty. Počítáme finální tvar v jednom průchodu a teprve
  //    pak vydáme JEDEN redirect — dřív se řetězily až 2 hopy
  //    (např. /symptom/pračka-nevypouští → /symptom/pracka-nevypousti
  //     → /symptom/voda-zustava-v-pracce), což ředí SEO signály.
  let pathname = originalPath
  const symptomMatch = originalPath.match(/^\/symptom\/(.+)$/i)
  if (symptomMatch) {
    // 2a) /symptom/<slug>: diakritika + slug-merge mapování naráz.
    //     Page.tsx volá permanentRedirect, ale v dynamic rendering padá do
    //     client-side meta refresh (HTTP 200), což GSC reportuje jako noindex
    //     (případ z 2026-05-18) — proto to řešíme už tady v middleware.
    let rawSlug: string
    try { rawSlug = decodeURIComponent(symptomMatch[1]) } catch { return NextResponse.next() }

    const cleanSlug = slugify(rawSlug)
    const finalSlug = SYMPTOM_SLUG_REDIRECTS[cleanSlug] || cleanSlug
    if (finalSlug) pathname = `/symptom/${finalSlug}`
  } else if (/[A-Z]/.test(originalPath)) {
    // 2b) Lowercase normalizace pro ostatní app routes (case-insensitive canonical).
    //     Pokrývá /Bosch/Pracky/..., /znacka/Bosch, /Kod/E22 atd. Bezpečné,
    //     protože všechny naše canonical URL jsou lowercase a /_next a /api
    //     už vyloučené matcherem.
    pathname = originalPath.toLowerCase()
  }

  if (pathname !== originalPath) {
    url.pathname = pathname
    redirect = true
  }

  // 308 (ne 301) kvůli konzistenci se zbytkem webu; Google obě chápe
  // jako permanent a konsoliduje stejně.
  if (redirect) return NextResponse.redirect(url, { status: 308 })

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
}
