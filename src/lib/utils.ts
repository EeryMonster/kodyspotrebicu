/**
 * Strips leading numbered/bulleted prefixes from stored list content.
 * Prevents double-numbering when component already renders the number (e.g. safeChecks).
 * "1. Zkontroluj..." → "Zkontroluj..."
 * "• text" → "text"
 */
export function normalizeListItem(text: string): string {
  return text
    .replace(/^\s*\d+[\.\)]\s+/, '')
    .replace(/^\s*[-•*]\s+/, '')
    .trim()
}

/**
 * Fixes common inline spacing issues in stored content text.
 * "1.Jak" → "1. Jak"
 * "✓Po" → "✓ Po"
 */
export function normalizeBodyText(text: string): string {
  return text
    .replace(/(\d+\.)([^\s\d])/g, '$1 $2')
    .replace(/([✓✗✔])([^\s])/g, '$1 $2')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const APPLIANCE_LABELS: Record<string, string> = {
  pracka: 'Pračka',
  mycka: 'Myčka',
  susicka: 'Sušička',
}

// Genitiv plurál pro fráze typu "Chybové kódy praček", "Cena opravy myček"
export const APPLIANCE_LABELS_GEN_PL: Record<string, string> = {
  pracka: 'praček',
  mycka: 'myček',
  susicka: 'sušiček',
}

export const APPLIANCE_SLUGS: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky',
}

export const APPLIANCE_FROM_SLUG: Record<string, string> = {
  pracky: 'pracka',
  mycky: 'mycka',
  susicky: 'susicka',
}

export const SEVERITY_LABELS: Record<number, string> = {
  1: 'Nízká',
  2: 'Střední',
  3: 'Vysoká',
  4: 'Kritická',
}

export const SEVERITY_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-800 border border-green-300',
  2: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
  3: 'bg-orange-100 text-orange-900 border border-orange-300',
  4: 'bg-red-100 text-red-800 border border-red-300',
}

export const SEVERITY_CARD_STYLES: Record<number, string> = {
  1: 'border-l-green-400 bg-green-50',
  2: 'border-l-yellow-400 bg-yellow-50',
  3: 'border-l-orange-400 bg-orange-50',
  4: 'border-l-red-400 bg-red-50',
}

export const BRANDS = ['Bosch', 'Siemens', 'AEG', 'Electrolux', 'Samsung', 'Beko', 'Whirlpool', 'LG', 'Miele']

export const SUBTYPE_LABELS: Record<string, string> = {
  // Sušičky
  'odtahova': 'Odtahová',
  'kondenzacni': 'Kondenzační',
  'tepelne-cerpadlo': 'Tepelné čerpadlo',
  // Pračky
  'predni-plneni': 'Předem plněná',
  'vrchni-plneni': 'Vrchem plněná',
  // Myčky – generace Siemens
  'iq': 'iQ řada',
  'se-sf': 'Starší modely SE / SF',
}

export const SEVERITY_DESCRIPTIONS: Record<number, string> = {
  1: 'Nízká závažnost – spotřebič funguje, ale upozorňuje na drobný problém',
  2: 'Střední závažnost – doporučujeme prověřit co nejdříve',
  3: 'Vysoká závažnost – spotřebič může být nebezpečný nebo hrozí poškození',
  4: 'Kritická závažnost – okamžitě vypněte spotřebič a zavolejte servis',
}

export const SERVICE_CTA_URL = '/servis'

// Whitelist Miele kódů, které byly přepsány vlastními slovy (nejsou scraped).
// Ostatní Miele kódy mají noindex, dokud nebudou přepsány.
export const REWRITTEN_MIELE_SLUGS = new Set<string>([
  'miele-mycka-f12',
  'miele-mycka-f70',
  'miele-mycka-f11',
  'miele-mycka-blika-kontrolka-vypousteni-vody',
  'miele-mycka-pritokodtok-blika-a-sviti',
  'miele-mycka-f1',
  'miele-mycka-f2',
  'miele-mycka-f18',
  'miele-mycka-f19',
  'miele-mycka-f594',
])

export function shouldNoIndex(brand: string, slug: string): boolean {
  if (brand.toLowerCase() === 'miele' && !REWRITTEN_MIELE_SLUGS.has(slug)) {
    return true
  }
  return false
}

export function buildServiceCtaUrl(opts: { brand?: string; applianceType?: string; code?: string }): string {
  const params = new URLSearchParams()
  if (opts.brand) params.set('znacka', opts.brand)
  if (opts.applianceType) params.set('typ', opts.applianceType)
  if (opts.code) params.set('kod', opts.code)
  const qs = params.toString()
  return qs ? `/servis?${qs}` : '/servis'
}

export const SUBTYPE_SECTION_LABELS: Record<string, string> = {
  'iq': 'Modely s displejem – iQ300 / iQ500 / iQ700 (od ~2010)',
  'se-sf': 'Starší modely SE / SF – bez displeje, kódy pomocí blikání (do ~2010)',
}

export const SUSICKA_SUBTYPES = [
  { value: 'odtahova', label: 'Odtahová', desc: 'Odvádí vzduch hadicí ven' },
  { value: 'kondenzacni', label: 'Kondenzační', desc: 'Sbírá vodu do nádoby' },
  { value: 'tepelne-cerpadlo', label: 'Tepelné čerpadlo', desc: 'Nejúspornější typ' },
]

export const PRACKA_SUBTYPES = [
  { value: 'predni-plneni', label: 'Předem plněná', desc: 'Plnění zepředu (nejběžnější)' },
  { value: 'vrchni-plneni', label: 'Vrchem plněná', desc: 'Plnění shora' },
]

// Cenové rozpětí opravy podle závažnosti chyby (CZK).
// Použito v UI sekci "Cena opravy" a v JSON-LD HowTo estimatedCost.
export const REPAIR_PRICE_RANGES: Record<number, { min: number; max: number; serviceRange: string }> = {
  1: { min: 0, max: 200, serviceRange: '500–800 Kč (výjezd)' },
  2: { min: 200, max: 1500, serviceRange: '800–1 800 Kč' },
  3: { min: 1500, max: 4000, serviceRange: '1 800–4 500 Kč včetně dílu' },
  4: { min: 4000, max: 9000, serviceRange: '4 000–9 000 Kč; zvážit nový spotřebič' },
}

// Heuristika: které díly bývají typicky DIY-friendly, a které vyžadují servis.
// Slouží k automatickému doporučení v sekci 'Cena opravy' podle konkrétních dílů.
const DIY_FRIENDLY_KEYWORDS = ['filtr', 'sítko', 'hadice', 'těsnění', 'kryt', 'manžeta', 'sifon', 'gumové']
const SERVICE_ONLY_KEYWORDS = ['řídicí deska', 'elektronika', 'modul', 'motor', 'ložiska bubnu', 'kompresor', 'topné těleso', 'čerpadlo', 'snímač', 'senzor', 'tachogenerátor', 'magnetický ventil']

function isDiyPart(part: string): boolean {
  const lower = part.toLowerCase()
  if (SERVICE_ONLY_KEYWORDS.some(kw => lower.includes(kw))) return false
  if (DIY_FRIENDLY_KEYWORDS.some(kw => lower.includes(kw))) return true
  return false
}

export interface RepairPriceInfo {
  min: number
  max: number
  rangeLabel: string  // např. '200–1 500 Kč'
  diyLabel: string    // např. 'Často DIY – výměna filtru'
  serviceLabel: string // např. 'Servis: 800–1 800 Kč'
}

// Orientační doba opravy podle závažnosti — použito v TL;DR bloku „Rychlý přehled".
export function getRepairTimeEstimate(severity: number): string {
  return ({
    1: '10–30 minut',
    2: '30–90 minut',
    3: '1–3 hodiny (potřebná diagnostika)',
    4: '2+ hodin (specializovaný servis)',
  } as Record<number, string>)[severity] ?? '30–90 minut'
}

// Krátká, kontextová rada „co dělat teď" pro TL;DR blok. Varianty podle severity × DIY
// poskytují per-page unikátní úvodní text — řeší clustering thin templated pages,
// kde Google deindexoval kódy jako „Alternativní stránka se správnou značkou kanonické stránky".
export function getTldrAdvice(severity: number, canTryHome: boolean): string {
  if (severity === 4) {
    return 'Okamžitě odpojte spotřebič ze sítě a uzavřete přívod vody. Tato chyba signalizuje vážnou závadu, která se dalším používáním zhoršuje. Kontaktujte autorizovaný servis ještě dnes — pokračování v provozu může vést k poškození elektroniky nebo úniku vody.'
  }
  if (severity === 3) {
    return canTryHome
      ? 'Omezte používání a vyzkoušejte bezpečné kontroly níže. Pokud chyba přetrvá i po prvním resetu, jde pravděpodobně o opotřebený díl — objednejte technika do 1–3 dnů, ať se závada dále nerozvíjí.'
      : 'Omezte používání. Tento typ závady prakticky vždy vyžaduje výměnu vnitřního dílu — připravte se na výjezd technika a u starších spotřebičů zvažte orientační nabídku nového kusu.'
  }
  if (severity === 2) {
    return canTryHome
      ? 'Většina případů této chyby se vyřeší doma během 30 minut. Začněte 10minutovým resetem a postupujte podle bodů níže. Pokud se chyba vrátí třikrát po sobě, kontaktujte servis — pravděpodobně jde o opotřebovaný díl.'
      : 'Tento kód obvykle vyžaduje technika, ale nejdřív zkuste 10minutový reset a kontrolu filtrů. V přibližně 20 % případů jde o dočasnou softwarovou chybu, kterou reset odstraní; pokud nepomůže, objednejte servis.'
  }
  // severity 1
  return canTryHome
    ? 'Jde o méně závažné upozornění. Reset spotřebiče a rychlá kontrola podle bodů níže obvykle stačí. Pokud se chyba pravidelně opakuje, prověřte konkrétní příčinu z přehledu — bývá to běžný uživatelský problém (nesprávný detergent, nakloněný spotřebič, ucpaný filtr).'
    : 'Méně závažné upozornění, které obvykle neblokuje provoz. Pokud spotřebič dokončí program v pořádku, naplánujte si servisní prohlídku při příští údržbě — není nutný okamžitý zásah.'
}

export function getRepairPriceInfo(severity: number, parts: string[] = []): RepairPriceInfo {
  const range = REPAIR_PRICE_RANGES[severity] ?? REPAIR_PRICE_RANGES[2]
  const rangeLabel = `${range.min.toLocaleString('cs-CZ')}–${range.max.toLocaleString('cs-CZ')} Kč`

  // Inteligentní DIY heuristika podle konkrétních dílů
  let diyLabel: string
  if (parts.length === 0) {
    diyLabel = severity <= 2 ? 'Často zvládnete doma' : 'Vyžaduje obvykle servis'
  } else {
    const diyParts = parts.filter(isDiyPart)
    const hardParts = parts.filter(p => !isDiyPart(p))
    if (diyParts.length > 0 && hardParts.length === 0) {
      diyLabel = `Často DIY – výměna nebo čištění: ${diyParts.slice(0, 2).join(', ').toLowerCase()}`
    } else if (diyParts.length === 0) {
      diyLabel = `Vyžaduje servis – výměna: ${hardParts.slice(0, 2).join(', ').toLowerCase()}`
    } else {
      diyLabel = `Některé díly zvládnete sami (${diyParts[0].toLowerCase()}), jiné vyžadují servis (${hardParts[0].toLowerCase()})`
    }
  }

  return {
    min: range.min,
    max: range.max,
    rangeLabel,
    diyLabel,
    serviceLabel: `Servis: ${range.serviceRange}`,
  }
}

// Návod na reset podle značky – krátký 1-řádkový postup, který lze uvést hned po hlavním řešení.
export const BRAND_RESET_INSTRUCTIONS: Record<string, string> = {
  bosch: 'Odpojte pračku ze sítě na 10 minut. Po zapnutí otočte programátor na "0", počkejte 5 sekund a zvolte program znovu.',
  siemens: 'Odpojte spotřebič na 10 minut. U modelů iQ stiskněte tlačítko Start/Pauza na 5 sekund.',
  aeg: 'Stiskněte a držte tlačítko Start na 5 sekund, nebo odpojte pračku na 10 minut.',
  electrolux: 'Stiskněte tlačítko Start/Pauza na 5 sekund. Pokud nepomůže, odpojte ze sítě na 10 minut.',
  samsung: 'Stiskněte Start/Pauza na 3 sekundy. Pokud chyba zůstává, odpojte na 10 minut.',
  beko: 'Otočte programátor na "Stop", odpojte spotřebič na 10 minut a poté znovu spusťte program.',
  whirlpool: 'Odpojte pračku ze sítě na 10 minut. Některé modely vyžadují stisk Start na 5 sekund.',
  lg: 'Vypněte tlačítkem Power, odpojte na 10 minut a znovu zapněte. U modelů s displejem zkuste sekvenci Power → Spin → Power.',
  miele: 'Otočte volič programů na "Stop". Odpojte spotřebič na 10 minut. Po zapnutí zvolte servisní reset (viz manuál).',
}

export const BRAND_RESET_FALLBACK = 'Odpojte spotřebič ze sítě na 10 minut. Po opětovném zapnutí spusťte krátký program (např. máchání).'
