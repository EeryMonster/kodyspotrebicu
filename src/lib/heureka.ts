// Heureka.cz affiliate tracking.
// Heureka používá class="heureka-hn-link" + data-trixam-positionid pro tracking
// (přes JS knihovnu trixam.min.js, která je vložená globálně v layoutu).
// Můžeme dynamicky měnit href a text, pokud zachováme class + positionid.

const POSITION_ID = process.env.NEXT_PUBLIC_HEUREKA_POSITION_ID ?? ''

// Heureka subdomény kategorií — ověřeno z Google-indexovaných URL.
// Pozor: skutečné názvy se liší od běžně očekávaných ('mycky-nadobi', ne 'mycky';
// 'susicky', ne 'susicky-pradla').
const APPLIANCE_SUBDOMAIN: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky-nadobi',
  susicka: 'susicky',
}

// Heureka URL formáty:
// - Hlavní www.heureka.cz/?h[fraze]= — full-text search napříč celou Heurekou
// - Subdomény kategorií (pracky, mycky-nadobi, susicky) — vedou na kategorii;
//   filtry brand by vyžadovaly per-kategorie ID, takže pro jednoduchost vedeme
//   user jen na subdoménu (heureka tracking zachytí klik, user si vybere značku
//   v Heuretce ručně přes filter)

export function heurekaPartUrl(brand: string, part: string): string {
  const url = new URL('https://www.heureka.cz/')
  url.searchParams.set('h[fraze]', `${part} ${brand}`.trim())
  return url.toString()
}

export function heurekaNewApplianceUrl(_brand: string, applianceType: string): string {
  const subdomain = APPLIANCE_SUBDOMAIN[applianceType] ?? 'pracky'
  return `https://${subdomain}.heureka.cz/`
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
