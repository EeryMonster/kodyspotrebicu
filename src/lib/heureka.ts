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

export function heurekaSearchUrl(query: string): string {
  const url = new URL('https://www.heureka.cz/')
  url.searchParams.set('h[fraze]', query)
  return url.toString()
}

export function heurekaPartUrl(brand: string, part: string): string {
  return heurekaSearchUrl(`${part} ${brand}`.trim())
}

export function heurekaNewApplianceUrl(brand: string, applianceType: string): string {
  const subdomain = APPLIANCE_SUBDOMAIN[applianceType] ?? 'pracky'
  const url = new URL(`https://${subdomain}.heureka.cz/`)
  url.searchParams.set('h[fraze]', brand)
  return url.toString()
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
