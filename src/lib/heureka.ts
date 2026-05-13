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

// Heureka URL format (od cca 2024): subdoména kategorie + filter v cestě.
// Příklad: https://cerpadla.heureka.cz/f:q:Zahradní%20čerpadlo/
// Starý format ?h[fraze]= už nefunguje (vrací 404).

const PARTS_SUBDOMAIN = 'nahradni-dily-velke-spotrebice'

function heurekaSubdomainSearch(subdomain: string, query: string): string {
  const encoded = encodeURIComponent(query.trim())
  return `https://${subdomain}.heureka.cz/f:q:${encoded}/`
}

export function heurekaPartUrl(brand: string, part: string): string {
  return heurekaSubdomainSearch(PARTS_SUBDOMAIN, `${part} ${brand}`)
}

export function heurekaNewApplianceUrl(brand: string, applianceType: string): string {
  const subdomain = APPLIANCE_SUBDOMAIN[applianceType] ?? 'pracky'
  return heurekaSubdomainSearch(subdomain, brand)
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
