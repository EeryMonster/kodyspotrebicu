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
  const host = request.headers.get('host') || ''

  // 1) non-www → www (canonical host).
  if (host === 'kodyspotrebicu.cz') {
    const url = request.nextUrl.clone()
    url.host = 'www.kodyspotrebicu.cz'
    return NextResponse.redirect(url, { status: 301 })
  }

  const pathname = request.nextUrl.pathname

  // 2) /symptom/<slug> normalizace: diakritika + slug-merge mapování.
  //    Pořadí: musí být před generic lowercase (#3), aby %-encoded diakritika
  //    (např. %C4%8D obsahuje uppercase hex) nevyvolalo dvojí redirect.
  //    Page.tsx volá permanentRedirect, ale v dynamic rendering padá do client-side
  //    meta refresh (HTTP 200), což GSC reportuje jako noindex (případ z 2026-05-18).
  const symptomMatch = pathname.match(/^\/symptom\/(.+)$/i)
  if (symptomMatch) {
    let rawSlug: string
    try { rawSlug = decodeURIComponent(symptomMatch[1]) } catch { return NextResponse.next() }

    const cleanSlug = slugify(rawSlug)
    if (cleanSlug && rawSlug !== cleanSlug) {
      const url = request.nextUrl.clone()
      url.pathname = `/symptom/${cleanSlug}`
      return NextResponse.redirect(url, { status: 308 })
    }

    const merged = SYMPTOM_SLUG_REDIRECTS[cleanSlug || rawSlug]
    if (merged) {
      const url = request.nextUrl.clone()
      url.pathname = `/symptom/${merged}`
      return NextResponse.redirect(url, { status: 308 })
    }
  }

  // 3) Lowercase normalizace pro všechny app routes (case-insensitive canonical).
  //    Pokrývá /Bosch/Pracky/..., /znacka/Bosch, /Kod/E22 atd. Stejný důvod jako #2:
  //    page.tsx permanentRedirect by skončil jako client meta refresh (200).
  //    Bezpečné protože všechny naše canonical URL jsou lowercase a /_next a /api
  //    už vyloučené matcherem.
  if (/[A-Z]/.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, { status: 308 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
}
