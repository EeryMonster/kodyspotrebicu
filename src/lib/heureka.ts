// Heureka.cz affiliate URL builder.
// Po schválení v affiliate.heureka.cz dostaneme partner tag — doplníme do env
// jako NEXT_PUBLIC_HEUREKA_PARTNER_ID. Dokud není, linky fungují bez trackingu.

const PARTNER_TAG = process.env.NEXT_PUBLIC_HEUREKA_PARTNER_ID ?? ''

const APPLIANCE_SUBDOMAIN: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky-pradla',
}

function withPartnerTag(url: URL): URL {
  if (PARTNER_TAG) url.searchParams.set('a', PARTNER_TAG)
  return url
}

export function heurekaSearchUrl(query: string): string {
  const url = new URL('https://www.heureka.cz/')
  url.searchParams.set('h[fraze]', query)
  return withPartnerTag(url).toString()
}

export function heurekaPartUrl(brand: string, part: string): string {
  return heurekaSearchUrl(`${part} ${brand}`.trim())
}

export function heurekaNewApplianceUrl(brand: string, applianceType: string): string {
  const subdomain = APPLIANCE_SUBDOMAIN[applianceType] ?? 'pracky'
  const url = new URL(`https://${subdomain}.heureka.cz/`)
  url.searchParams.set('h[fraze]', brand)
  return withPartnerTag(url).toString()
}

export const HEUREKA_DISCLOSURE =
  'Odkazy vedou na Heureku.cz. Pokud přes ně nakoupíte, můžeme získat provizi — pro vás je cena stejná.'
