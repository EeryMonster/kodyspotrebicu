// Heureka.cz affiliate tracking.
// Heureka používá class="heureka-hn-link" + data-trixam-positionid pro tracking
// (přes JS knihovnu trixam.min.js, která je vložená globálně v layoutu).
// Můžeme dynamicky měnit href a text, pokud zachováme class + positionid.

const POSITION_ID = process.env.NEXT_PUBLIC_HEUREKA_POSITION_ID ?? ''

const APPLIANCE_SUBDOMAIN: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky-pradla',
}

// Heureka URL formáty (různé pro různé endpointy):
// - Hlavní www.heureka.cz: ?h[fraze]= query parameter funguje pro full-text search
// - Subdomény kategorií (pracky, mycky, …): f:q: filter v cestě (Google indexovaný format)

export function heurekaPartUrl(brand: string, part: string): string {
  const url = new URL('https://www.heureka.cz/')
  url.searchParams.set('h[fraze]', `${part} ${brand}`.trim())
  return url.toString()
}

export function heurekaNewApplianceUrl(brand: string, applianceType: string): string {
  const subdomain = APPLIANCE_SUBDOMAIN[applianceType] ?? 'pracky'
  const encoded = encodeURIComponent(brand.trim())
  return `https://${subdomain}.heureka.cz/f:q:${encoded}/`
}

// Props pro Heureka affiliate <a> element. Vrací class a data-trixam-positionid,
// pokud je env var nastavena. Bez positionid odkaz funguje, jen netrackuje provizi.
export function heurekaLinkProps(): Record<string, string> {
  if (!POSITION_ID) return {}
  return {
    className: 'heureka-hn-link',
    'data-trixam-positionid': POSITION_ID,
  }
}

export const HEUREKA_DISCLOSURE =
  'Odkazy vedou na Heureku.cz. Pokud přes ně nakoupíte, můžeme získat provizi — pro vás je cena stejná.'
