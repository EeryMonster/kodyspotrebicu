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
  1: 'bg-green-100 text-green-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-orange-200 text-gray-900',
  4: 'bg-red-100 text-red-800',
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
