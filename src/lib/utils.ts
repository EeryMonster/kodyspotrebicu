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
export const REPAIR_PRICE_RANGES: Record<number, { min: number; max: number; diy: string; service: string }> = {
  1: { min: 0, max: 200, diy: 'Většinou vyřešíte sami za pár minut', service: 'Servis: 500–800 Kč (výjezd)' },
  2: { min: 200, max: 1500, diy: 'Často DIY – výměna hadice / čištění filtru', service: 'Servis: 800–1 800 Kč' },
  3: { min: 1500, max: 4000, diy: 'Náročnější oprava (zámek, čerpadlo, topení)', service: 'Servis: 1 800–4 500 Kč včetně dílu' },
  4: { min: 4000, max: 9000, diy: 'Nedoporučujeme svépomocí (řídicí deska, ložiska bubnu)', service: 'Servis: 4 000–9 000 Kč; zvážit nový spotřebič' },
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
