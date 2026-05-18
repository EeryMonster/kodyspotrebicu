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

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // 1) non-www → www (canonical host).
  if (host === 'kodyspotrebicu.cz') {
    const url = request.nextUrl.clone()
    url.host = 'www.kodyspotrebicu.cz'
    return NextResponse.redirect(url, { status: 301 })
  }

  // 2) /symptom/<slug s diakritikou> → /symptom/<slug bez diakritiky> (308).
  //    Page.tsx sice volá permanentRedirect, ale to v dynamic rendering padá
  //    do client-side meta refresh (HTTP 200), což GSC reportuje jako noindex.
  //    Middleware doruči čistý server-side 308 ještě před renderem.
  const pathname = request.nextUrl.pathname
  const symptomMatch = pathname.match(/^\/symptom\/(.+)$/)
  if (symptomMatch) {
    let rawSlug: string
    try { rawSlug = decodeURIComponent(symptomMatch[1]) } catch { return NextResponse.next() }
    const cleanSlug = slugify(rawSlug)
    if (cleanSlug && rawSlug !== cleanSlug) {
      const url = request.nextUrl.clone()
      url.pathname = `/symptom/${cleanSlug}`
      return NextResponse.redirect(url, { status: 308 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
}
