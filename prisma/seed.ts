import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || 'postgresql://ondrejtichy@localhost:5432/appliance_codes' })
const prisma = new PrismaClient({ adapter })

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface CodeDef {
  brand: string
  applianceType: 'pracka' | 'mycka' | 'susicka'
  subtype?: string
  code: string
  altCodes?: string[]
  title: string
  shortMeaning: string
  severityLevel: 1 | 2 | 3 | 4
  canUserTrySafeChecks: boolean
  safeChecks: string[]
  likelyCauses: string[]
  whenToStopAndCallService: string[]
  relatedSymptoms: string[]
  possibleParts: string[]
  faq: { q: string; a: string }[]
  sourceType: 'official' | 'manual' | 'community'
  sourceUrl?: string
}

const codes: CodeDef[] = [
  // ===== BOSCH PRAČKY =====
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E17', altCodes: ['F17'],
    title: 'Chyba plnění vodou – příliš pomalé plnění',
    shortMeaning: 'Pračka se neplní vodou dostatečně rychle nebo vůbec.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte, zda je přívod vody otevřen', 'Zkontrolujte hadici přívodu vody', 'Vyčistěte filtr přívodní hadice'],
    likelyCauses: ['Zavřený kohout přívodu vody', 'Zanesený filtr přívodní hadice', 'Nízký tlak vody v domácnosti', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud problém přetrvává i po kontrole přívodu vody', 'Pokud vidíte poškozené hadice'],
    relatedSymptoms: ['pračka-se-neplní', 'slabý-přívod-vody'],
    possibleParts: ['Elektromagnetický ventil', 'Přívodní hadice', 'Filtr přívodní hadice'],
    faq: [
      { q: 'Co znamená kód E17 na pračce Bosch?', a: 'Kód E17 znamená, že pračka nedostává dostatek vody v daném čase. Nejčastěji jde o zavřený kohout nebo zanesený filtr.' },
      { q: 'Jak resetovat chybu E17 na Bosch?', a: 'Po odstranění příčiny pračku vypněte a znovu zapněte. Spusťte nový program.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E18', altCodes: ['F18'],
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Pračka nedokáže vyčerpat vodu v určeném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla (vpravo dole)', 'Zkontrolujte odpadní hadici, zda není zalomená', 'Zkontrolujte, zda sifon či odpad není ucpaný'],
    likelyCauses: ['Ucpaný filtr čerpadla', 'Zalomená nebo ucpaná odpadní hadice', 'Vadné čerpadlo', 'Ucpaný sifon'],
    whenToStopAndCallService: ['Pokud čerpadlo vydává hluk nebo nefunguje vůbec', 'Pokud voda zůstává i po vyčištění filtru'],
    relatedSymptoms: ['pračka-nevypouští', 'voda-v-bubnu'],
    possibleParts: ['Čerpadlo', 'Filtr čerpadla', 'Odpadní hadice'],
    faq: [
      { q: 'Kde najdu filtr čerpadla na Bosch pračce?', a: 'Filtr čerpadla se nachází vpravo dole za malými dvířky. Před otevřením připravte ručník – vyteče voda.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E27', altCodes: ['F27'],
    title: 'Vadný senzor tlaku (pressostat)',
    shortMeaning: 'Senzor tlaku, který měří hladinu vody v pračce, hlásí poruchu nebo zasílá nesprávné hodnoty.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný tlakový senzor (pressostat)', 'Ucpané nebo zlomené tlakové vedení k senzoru', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – pračka nemůže správně řídit plnění vodou'],
    relatedSymptoms: ['pračka-se-neplní', 'přeplnění'],
    possibleParts: ['Tlakový senzor (pressostat)', 'Tlakové vedení'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E3',
    title: 'Přehřátí topného tělesa / motor',
    shortMeaning: 'Detekováno přehřátí – motor nebo topné těleso jsou příliš horké.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Přeplněný buben', 'Příliš mnoho praní v krátkém čase', 'Vadný termostat', 'Vadné topné těleso'],
    whenToStopAndCallService: ['Ihned při opakovaném výskytu', 'Pokud pračka vydává zápach po spálení'],
    relatedSymptoms: ['pračka-se-přehřívá'],
    possibleParts: ['Termostat', 'Topné těleso', 'NTC senzor teploty'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E23',
    title: 'Chyba senzoru průtoku vody (Aqua Stop)',
    shortMeaning: 'Systém Aqua Stop detekoval únik vody nebo poruchu senzoru.',
    severityLevel: 4, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Únik vody ve spodní části pračky', 'Vadný senzor průtoku', 'Prasklá hadice uvnitř pračky'],
    whenToStopAndCallService: ['Okamžitě – může dojít k zaplavení', 'Pokud vidíte vodu pod pračkou'],
    relatedSymptoms: ['únik-vody', 'pračka-nespustí'],
    possibleParts: ['Aqua Stop senzor', 'Přívodní hadice', 'Těsnění bubnu'],
    faq: [],
    sourceType: 'official',
  },

  // ===== BOSCH MYČKY =====
  {
    brand: 'Bosch', applianceType: 'mycka', code: 'E15',
    title: 'Aqua Stop – detekce úniku vody',
    shortMeaning: 'Bezpečnostní systém detekoval přítomnost vody ve vaně myčky pod košem.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Nakloňte myčku dozadu (asi 45°) na 10 minut a vraťte zpět', 'Zkontrolujte hadice a těsnění'],
    likelyCauses: ['Únik z přívodní hadice', 'Přeteče dávkovač leštidla', 'Prasklé těsnění pumpy'],
    whenToStopAndCallService: ['Pokud se chyba opakuje i po naklonění', 'Pokud vidíte fyzický únik vody'],
    relatedSymptoms: ['myčka-nespustí', 'voda-pod-myčkou'],
    possibleParts: ['Aqua Stop senzor', 'Přívodní hadice', 'Těsnění pumpy'],
    faq: [
      { q: 'Jak odstranit chybu E15 na myčce Bosch?', a: 'Vypněte myčku, odpojte od elektřiny a nakloňte ji dozadu přibližně pod úhlem 45°. Počkejte 10-15 minut, aby voda odtekla ze snímače. Narovnejte zpět a zapněte.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'mycka', code: 'E25',
    title: 'Ucpané čerpadlo / filtr čerpadla',
    shortMeaning: 'Odčerpávací čerpadlo je blokováno nebo zanesené.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr v dolní části myčky', 'Zkontrolujte filtr čerpadla pod filtrem', 'Odstraňte případné zbytky jídla nebo sklo'],
    likelyCauses: ['Zbytky jídla v čerpadle', 'Střepy od rozbití sklenice', 'Ucpané sítko', 'Vadné čerpadlo'],
    whenToStopAndCallService: ['Pokud čerpadlo vydává zvuk, ale nečerpá', 'Pokud po vyčištění filtru problém přetrvává'],
    relatedSymptoms: ['myčka-nevypouští'],
    possibleParts: ['Odčerpávací čerpadlo', 'Filtr myčky'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'mycka', code: 'E22',
    title: 'Zanesený filtr myčky',
    shortMeaning: 'Filtr myčky je ucpaný a brání správnému mytí.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Vyjměte a umyjte filtr pod tekoucí vodou', 'Použijte kartáček k čištění jemného síta'],
    likelyCauses: ['Pravidelné zanedbávání čištění filtru', 'Velké množství zbytků jídla'],
    whenToStopAndCallService: [],
    relatedSymptoms: ['špatné-mytí'],
    possibleParts: ['Filtr myčky'],
    faq: [
      { q: 'Jak často čistit filtr myčky Bosch?', a: 'Doporučuje se čistit filtr alespoň jednou za měsíc nebo po každých 20 cyklech mytí.' },
    ],
    sourceType: 'official',
  },

  // ===== BOSCH SUŠIČKY =====
  {
    brand: 'Bosch', applianceType: 'susicka', code: 'E:01',
    title: 'Chyba senzoru teploty',
    shortMeaning: 'Senzor teploty naměřil chybnou hodnotu nebo přestál komunikovat s elektronikou.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný NTC senzor teploty', 'Přerušené vedení ke senzoru', 'Vadná hlavní deska'],
    whenToStopAndCallService: ['Při prvním výskytu', 'Pokud sušička začne přehřívat prádlo'],
    relatedSymptoms: ['sušička-přehřívá'],
    possibleParts: ['NTC senzor teploty', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'susicka', code: 'E:02',
    title: 'Čas sušení příliš dlouhý / nesprávné sušení',
    shortMeaning: 'Sušička detekovala, že prádlo není vysušené ani po maximální době sušení.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr chlupů', 'Zkontrolujte a vyčistěte kondenzátor', 'Nepřeplňujte sušičku', 'Zkontrolujte odvětrání místnosti'],
    likelyCauses: ['Ucpaný filtr chlupů', 'Zanesený kondenzátor', 'Přeplnění bubnu', 'Špatné větrání místnosti', 'Vadný senzor vlhkosti'],
    whenToStopAndCallService: ['Pokud problém přetrvává po vyčištění filtrů'],
    relatedSymptoms: ['prádlo-mokré', 'dlouhé-sušení'],
    possibleParts: ['Filtr chlupů', 'Kondenzátor', 'Senzor vlhkosti'],
    faq: [
      { q: 'Proč sušička Bosch suší příliš dlouho?', a: 'Nejčastěji jde o ucpaný filtr chlupů nebo kondenzátor. Oba je třeba pravidelně čistit po každém cyklu (filtr) a jednou za měsíc (kondenzátor).' },
    ],
    sourceType: 'official',
  },

  // ===== SIEMENS PRAČKY =====
  {
    brand: 'Siemens', applianceType: 'pracka', code: 'F17',
    title: 'Chyba plnění vodou',
    shortMeaning: 'Pračka nedostala vodu v požadovaném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Otevřete kohout přívodu vody naplno', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'],
    likelyCauses: ['Zavřený nebo přivřený kohout', 'Zanesený filtr', 'Nízký vodní tlak', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud problém přetrvává', 'Pokud ventil nefunguje'],
    relatedSymptoms: ['pračka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'pracka', code: 'F18',
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Pračka nemůže vypustit vodu dostatečně rychle.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr čerpadla', 'Zalomená odpadní hadice', 'Vadné čerpadlo'],
    whenToStopAndCallService: ['Pokud čerpadlo nevydává zvuk při pokusu o čerpání'],
    relatedSymptoms: ['pračka-nevypouští'],
    possibleParts: ['Čerpadlo', 'Filtr čerpadla'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'pracka', code: 'F21',
    title: 'Chyba motoru',
    shortMeaning: 'Motor pračky hlásí poruchu nebo přehřátí.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Přepnutý motor', 'Vadný tacho generátor', 'Přerušené vedení motoru', 'Vadný motor'],
    whenToStopAndCallService: ['Při prvním výskytu', 'Pokud buben nelze otočit'],
    relatedSymptoms: ['buben-se-neotáčí'],
    possibleParts: ['Motor', 'Tacho generátor', 'Kartáče motoru'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'pracka', code: 'F43',
    title: 'Chyba ohřevu / topného tělesa',
    shortMeaning: 'Pračka neohřívá vodu nebo ohřev je pomalý.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor teploty', 'Porucha relé ohřevu na desce'],
    whenToStopAndCallService: ['Ihned – prádlo se nepere ve správné teplotě'],
    relatedSymptoms: ['studená-voda', 'špatné-praní'],
    possibleParts: ['Topné těleso', 'NTC senzor', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },

  // ===== SIEMENS MYČKY – iQ řada (s displejem, od ~2010) =====
  {
    brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E15',
    title: 'Aqua Stop – únik vody',
    shortMeaning: 'Systém Aqua Stop detekoval vodu ve spodní vaně myčky.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Nakloňte myčku dozadu na 10 minut'],
    likelyCauses: ['Únik z hadice', 'Přeteče dávkovač', 'Vadné těsnění'],
    whenToStopAndCallService: ['Pokud se opakuje'],
    relatedSymptoms: ['voda-pod-myčkou'],
    possibleParts: ['Aqua Stop senzor', 'Těsnění', 'Přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E09',
    title: 'Chyba ohřevu vody',
    shortMeaning: 'Myčka neohřívá vodu na požadovanou teplotu.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor', 'Vadná deska'],
    whenToStopAndCallService: ['Při prvním výskytu'],
    relatedSymptoms: ['myčka-neumývá', 'studená-voda'],
    possibleParts: ['Topné těleso', 'NTC senzor', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },

  // ===== SIEMENS SUŠIČKY =====
  {
    brand: 'Siemens', applianceType: 'susicka', code: 'E:01',
    title: 'Chyba senzoru teploty',
    shortMeaning: 'Senzor teploty je vadný nebo odpojený.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný NTC senzor', 'Porucha desky'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nespustí'],
    possibleParts: ['NTC senzor', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'susicka', code: 'E:62',
    title: 'Přehřátí – termostat',
    shortMeaning: 'Sušička se přehřála a bezpečnostní termostat se odpojil.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr chlupů', 'Vyčistěte kondenzátor', 'Zkontrolujte větrání za sušičkou'],
    likelyCauses: ['Ucpaný filtr', 'Zanesený kondenzátor', 'Špatné větrání', 'Vadný termostat'],
    whenToStopAndCallService: ['Pokud se opakuje po vyčištění'],
    relatedSymptoms: ['sušička-se-přehřívá'],
    possibleParts: ['Bezpečnostní termostat', 'Termostat ohřevu', 'Filtr chlupů'],
    faq: [],
    sourceType: 'official',
  },

  // ===== AEG PRAČKY =====
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E10',
    title: 'Chyba přívodu vody',
    shortMeaning: 'Pračka nedostala vodu v požadovaném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'],
    likelyCauses: ['Uzavřený kohout', 'Ucpaný filtr', 'Nízký tlak vody', 'Vadný ventil'],
    whenToStopAndCallService: ['Pokud přetrvává i po kontrole přívodu'],
    relatedSymptoms: ['pračka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E20',
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Odpadní čerpadlo nedokáže vyčerpat vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpaná hadice', 'Vadné čerpadlo'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pračka-nevypouští'],
    possibleParts: ['Čerpadlo', 'Filtr čerpadla'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E40',
    title: 'Chyba dveří',
    shortMeaning: 'Dveře pračky nejsou řádně uzavřeny nebo uzamčeny.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte, zda zámek funguje'],
    likelyCauses: ['Dveře nejsou zavřeny', 'Vadný zámek', 'Cizí předmět v rámu'],
    whenToStopAndCallService: ['Pokud zámek mechanicky nefunguje'],
    relatedSymptoms: ['pračka-nespustí'],
    possibleParts: ['Zámek dveří'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E50',
    title: 'Chyba motoru',
    shortMeaning: 'Porucha motoru nebo tacho generátoru.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný motor', 'Vadný tacho generátor', 'Ucpané ložisko bubnu'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['buben-se-neotáčí', 'hluk-při-praní'],
    possibleParts: ['Motor', 'Tacho generátor', 'Ložisko bubnu'],
    faq: [],
    sourceType: 'official',
  },

  // ===== AEG MYČKY =====
  {
    brand: 'AEG', applianceType: 'mycka', code: 'i10',
    title: 'Chyba přívodu vody',
    shortMeaning: 'Myčka nedostává vodu nebo tlak vody je příliš nízký.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice'],
    likelyCauses: ['Uzavřený kohout', 'Ucpaný filtr', 'Nízký tlak vody'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'mycka', code: 'i20',
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Myčka nedokáže vyčerpat vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr myčky', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané čerpadlo', 'Zalomená odpadní hadice'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-nevypouští'],
    possibleParts: ['Odpadní čerpadlo', 'Filtr myčky'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'mycka', code: 'i30',
    title: 'Aqua Control – detekce úniku vody',
    shortMeaning: 'Systém Aqua Control detekoval vodu ve spodní vaně.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Nakloňte myčku dozadu na 10 minut'],
    likelyCauses: ['Únik z hadice', 'Přetečení', 'Vadné těsnění'],
    whenToStopAndCallService: ['Pokud se opakuje'],
    relatedSymptoms: ['voda-pod-myčkou'],
    possibleParts: ['Aqua Control senzor', 'Těsnění', 'Přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },

  // ===== AEG SUŠIČKY =====
  {
    brand: 'AEG', applianceType: 'susicka', code: 'E5E',
    title: 'Chyba senzoru teploty výfuku',
    shortMeaning: 'Senzor teploty výfukového vzduchu je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný senzor', 'Špatné zapojení', 'Porucha desky'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nespustí'],
    possibleParts: ['NTC senzor', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'susicka', code: 'EHE',
    title: 'Přehřátí sušičky',
    shortMeaning: 'Sušička překročila maximální provozní teplotu.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr chlupů', 'Vyčistěte kondenzátor', 'Zajistěte dobré větrání'],
    likelyCauses: ['Ucpaný filtr', 'Zanesený kondenzátor', 'Špatné větrání', 'Vadný termostat'],
    whenToStopAndCallService: ['Pokud se opakuje po vyčištění'],
    relatedSymptoms: ['sušička-se-přehřívá'],
    possibleParts: ['Bezpečnostní termostat', 'Filtr chlupů', 'Kondenzátor'],
    faq: [],
    sourceType: 'official',
  },

  // ===== ELECTROLUX PRAČKY =====
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E10',
    title: 'Chyba přívodu vody',
    shortMeaning: 'Pračka nedostala vodu v požadovaném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte přívod vody', 'Vyčistěte filtr hadice'],
    likelyCauses: ['Zavřený kohout', 'Ucpaný filtr', 'Nízký tlak vody'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pračka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E20',
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Čerpadlo nedokáže vyčerpat vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané čerpadlo', 'Zalomená hadice'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pračka-nevypouští'],
    possibleParts: ['Čerpadlo', 'Filtr čerpadla'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E40',
    title: 'Chyba dveří',
    shortMeaning: 'Dveře pračky nejsou správně uzavřeny.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte zámek'],
    likelyCauses: ['Dveře nezavřeny', 'Vadný zámek'],
    whenToStopAndCallService: ['Pokud zámek nefunguje'],
    relatedSymptoms: ['pračka-nespustí'],
    possibleParts: ['Zámek dveří'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E90',
    title: 'Chyba elektroniky / hlavní desky',
    shortMeaning: 'Detekována porucha hlavní řídicí desky.',
    severityLevel: 4, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba', 'Porucha napájení'],
    whenToStopAndCallService: ['Ihned', 'Pokud reset nepomůže'],
    relatedSymptoms: ['pračka-nereaguje'],
    possibleParts: ['Hlavní deska', 'Programátor'],
    faq: [
      { q: 'Jak resetovat pračku Electrolux při chybě E90?', a: 'Odpojte pračku od sítě na 10 minut, znovu zapojte a zkuste spustit program.' },
    ],
    sourceType: 'official',
  },

  // ===== ELECTROLUX MYČKY =====
  {
    brand: 'Electrolux', applianceType: 'mycka', code: 'i10',
    title: 'Chyba přívodu vody myčky',
    shortMeaning: 'Myčka nedostala vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Otevřete kohout', 'Vyčistěte filtr přívodní hadice'],
    likelyCauses: ['Zavřený kohout', 'Ucpaný filtr'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'mycka', code: 'i20',
    title: 'Chyba vypouštění vody myčky',
    shortMeaning: 'Myčka nemůže vypustit vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr myčky', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané čerpadlo'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-nevypouští'],
    possibleParts: ['Odpadní čerpadlo', 'Filtr'],
    faq: [],
    sourceType: 'official',
  },

  // ===== ELECTROLUX SUŠIČKY =====
  {
    brand: 'Electrolux', applianceType: 'susicka', code: 'E51',
    title: 'Chyba topného tělesa',
    shortMeaning: 'Topné těleso sušičky je vadné nebo přerušené.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Přepálené topné těleso', 'Vadný termostat', 'Porucha desky'],
    whenToStopAndCallService: ['Ihned – prádlo se nesuší'],
    relatedSymptoms: ['sušička-nesuší'],
    possibleParts: ['Topné těleso', 'Termostat', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'susicka', code: 'E52',
    title: 'Přehřátí sušičky',
    shortMeaning: 'Sušička překročila bezpečnou provozní teplotu.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr chlupů', 'Vyčistěte kondenzátor'],
    likelyCauses: ['Ucpaný filtr', 'Zanesený kondenzátor', 'Špatné větrání'],
    whenToStopAndCallService: ['Pokud se opakuje'],
    relatedSymptoms: ['sušička-se-přehřívá'],
    possibleParts: ['Bezpečnostní termostat', 'Filtr chlupů'],
    faq: [],
    sourceType: 'official',
  },

  // ===== SAMSUNG PRAČKY =====
  {
    brand: 'Samsung', applianceType: 'pracka', code: '4E', altCodes: ['4C'],
    title: 'Chyba přívodu vody',
    shortMeaning: 'Pračka Samsung nedetekuje přívod vody nebo jej dostává nedostatečně.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte kohout přívodu vody', 'Zkontrolujte filtr přívodní hadice', 'Ujistěte se, že hadice není zalomená'],
    likelyCauses: ['Zavřený kohout', 'Zanesený filtr', 'Zalomená přívodní hadice', 'Nízký tlak vody'],
    whenToStopAndCallService: ['Pokud přetrvává po kontrole přívodu'],
    relatedSymptoms: ['pračka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice', 'Přívodní hadice'],
    faq: [
      { q: 'Co znamená kód 4E na pračce Samsung?', a: '4E nebo 4C signalizuje problém s přívodem vody. Nejdříve zkontrolujte kohout přívodu vody a filtr přívodní hadice.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: '5E', altCodes: ['5C', 'SE'],
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Pračka Samsung nemůže odvést vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici', 'Zkontrolujte sifon'],
    likelyCauses: ['Ucpaný filtr', 'Zalomená nebo ucpana hadice', 'Vadné čerpadlo'],
    whenToStopAndCallService: ['Pokud čerpadlo nefunguje'],
    relatedSymptoms: ['pračka-nevypouští'],
    possibleParts: ['Odpadní čerpadlo', 'Filtr čerpadla'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'dE', altCodes: ['dC', 'DC'],
    title: 'Chyba dveří',
    shortMeaning: 'Dveře pračky Samsung nejsou správně zavřeny nebo zámek nefunguje.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte, zda v rámu dveří nic nepřekáží'],
    likelyCauses: ['Dveře nezavřeny', 'Vadný zámek', 'Přeplněný buben brání zavření'],
    whenToStopAndCallService: ['Pokud zámek mechanicky nefunguje'],
    relatedSymptoms: ['pračka-nespustí'],
    possibleParts: ['Zámek dveří'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: '3E', altCodes: ['3C', 'EA'],
    title: 'Chyba motoru',
    shortMeaning: 'Porucha nebo přetížení motoru pračky Samsung.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Vypněte pračku hlavním vypínačem nebo odpojte ze zásuvky, počkejte 1 minutu a znovu zapněte.',
      'Spusťte nový program – pokud se chyba neobjeví znovu, šlo o přechodnou závadu.',
    ],
    likelyCauses: ['Přeplněný buben', 'Vadný motor', 'Vadný hallový senzor', 'Mechanická blokace bubnu'],
    whenToStopAndCallService: ['Pokud chyba přetrvává po restartu', 'Pokud buben nejde otočit ani ručně'],
    relatedSymptoms: ['buben-se-neotáčí'],
    possibleParts: ['Motor', 'Hallový senzor', 'Uhlíkové kartáče motoru'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'HE', altCodes: ['HC', 'H1'],
    title: 'Chyba ohřevu vody',
    shortMeaning: 'Topné těleso nebo senzor teploty vody jsou vadné.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte, zda je přívodní hadice studené vody zapojena do studeného přívodu – ne do teplého.',
    ],
    likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor', 'Porucha relé na desce', 'Přehozené přívodní hadice teplé a studené vody'],
    whenToStopAndCallService: ['Pokud hadice jsou správně zapojeny a chyba přetrvává'],
    relatedSymptoms: ['studená-voda', 'špatné-praní'],
    possibleParts: ['Topné těleso', 'NTC senzor teploty'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'UE', altCodes: ['UC'],
    title: 'Nevyvážená náplň (nevyvážení)',
    shortMeaning: 'Prádlo je v bubnu nevyvážené, pračka neodstřeďuje.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Otevřete buben a rovnoměrně přeskládejte prádlo', 'Odeberte část prádla, pokud je přeplněný'],
    likelyCauses: ['Nevyvážené velké kusy prádla', 'Přeplněný buben', 'Jedno velké prádlo v malém bubnu'],
    whenToStopAndCallService: [],
    relatedSymptoms: ['pračka-neodsřeďuje', 'vibrace'],
    possibleParts: [],
    faq: [
      { q: 'Proč Samsung pračka hlásí UE?', a: 'Kód UE znamená unbalanced – nevyváženo. Přeskládejte prádlo v bubnu rovnoměrně a spusťte znovu.' },
    ],
    sourceType: 'official',
  },

  // ===== SAMSUNG MYČKY =====
  {
    brand: 'Samsung', applianceType: 'mycka', code: 'LE', altCodes: ['LC'],
    title: 'Detekce úniku vody',
    shortMeaning: 'Myčka Samsung detekovala vodu ve spodní části.',
    severityLevel: 4, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Únik z přívodní hadice', 'Vadné těsnění pumpy', 'Přeteče dávkovač'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['voda-pod-myčkou'],
    possibleParts: ['Přívodní hadice', 'Těsnění pumpy', 'Dávkovač'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'mycka', code: '5C', altCodes: ['5E'],
    title: 'Chyba vypouštění vody myčky Samsung',
    shortMeaning: 'Myčka nemůže odčerpat vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr myčky', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané čerpadlo', 'Zalomená hadice'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-nevypouští'],
    possibleParts: ['Odpadní čerpadlo', 'Filtr'],
    faq: [],
    sourceType: 'official',
  },

  // ===== SAMSUNG SUŠIČKY =====
  {
    brand: 'Samsung', applianceType: 'susicka', code: 'HE',
    title: 'Chyba ohřevu sušičky',
    shortMeaning: 'Topné těleso nebo senzor sušičky jsou vadné.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Vadný termostat', 'Přepálená pojistka'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'],
    possibleParts: ['Topné těleso', 'Termostat', 'Tepelná pojistka'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'susicka', code: 'FE',
    title: 'Chyba ventilátoru sušičky',
    shortMeaning: 'Ventilátor sušičky nepracuje správně.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Ucpaný ventilátor chlupům', 'Vadný motor ventilátoru'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší', 'sušička-se-přehřívá'],
    possibleParts: ['Motor ventilátoru', 'Ventilátor'],
    faq: [],
    sourceType: 'official',
  },

  // ===== BEKO PRAČKY =====
  {
    brand: 'Beko', applianceType: 'pracka', code: 'H2',
    title: 'Topné těleso – přerušený obvod (Beko)',
    shortMeaning: 'Obvod topného tělesa pračky Beko je přerušen – topné těleso nefunguje nebo je odpojena přívodní svorka.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Přepálené topné těleso', 'Přerušený přívodní kabel tělesa', 'Koroze svorky topného tělesa', 'Vadná hlavní deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['studená-voda', 'špatné-praní'],
    possibleParts: ['Topné těleso', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'H5',
    title: 'Chyba vypouštění vody',
    shortMeaning: 'Pračka Beko nemůže vyčerpat vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané čerpadlo', 'Zalomená hadice'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pračka-nevypouští'],
    possibleParts: ['Čerpadlo', 'Filtr čerpadla'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'H3',
    title: 'Topné těleso se neodpíná – přehřátí vody (Beko)',
    shortMeaning: 'Topné těleso pračky Beko zůstává trvale zapnuté a ohřívá vodu nad nastavenou teplotu.',
    severityLevel: 4, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Zkratovaný triak topného tělesa na desce', 'Vadný NTC senzor (neodpíná ohřev)', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Okamžitě – hrozí poškození prádla i pračky'],
    relatedSymptoms: ['přehřátí-vody'],
    possibleParts: ['Triak topného tělesa', 'NTC senzor teploty', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'H7',
    title: 'Porucha tlakového senzoru hladiny vody – Beko',
    shortMeaning: 'Tlakový senzor hladiny vody (pressostat) hlásí poruchu nebo nesprávné hodnoty.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný tlakový senzor (pressostat)', 'Ucpané tlakové vedení k senzoru', 'Vadná hlavní deska'],
    whenToStopAndCallService: ['Ihned – pračka nemůže správně řídit plnění vodou'],
    relatedSymptoms: ['pračka-se-neplní', 'přeplnění'],
    possibleParts: ['Tlakový senzor (pressostat)', 'Tlakové vedení'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'H1',
    title: 'Porucha NTC senzoru teploty – Beko',
    shortMeaning: 'Teplotní senzor (NTC termistor) je přerušen nebo má zkrat. Správná hodnota odporu je ~4700 Ω při 25 °C.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušený nebo zkratovaný kabel senzoru', 'Koroze konektoru'],
    whenToStopAndCallService: ['Ihned – pračka nemůže správně řídit teplotu'],
    relatedSymptoms: ['studená-voda', 'přehřátí-vody'],
    possibleParts: ['NTC senzor teploty'],
    faq: [],
    sourceType: 'official',
  },

  // ===== BEKO MYČKY =====
  {
    brand: 'Beko', applianceType: 'mycka', code: 'E1',
    title: 'Chyba přívodu vody – pomalé plnění myčky Beko',
    shortMeaning: 'Myčka nedostala dostatek vody v požadovaném čase (příliš dlouhé plnění).',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte, zda je kohout přívodu vody otevřen', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody v domácnosti'],
    likelyCauses: ['Uzavřený nebo přivřený kohout', 'Ucpaný filtr přívodní hadice', 'Nízký tlak vody', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud přetrvává po kontrole přívodu vody'],
    relatedSymptoms: ['myčka-se-neplní'],
    possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'mycka', code: 'E2',
    title: 'Chyba vypouštění vody myčky Beko',
    shortMeaning: 'Myčka Beko nedokázala odvést odpadní vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr v dolní části myčky', 'Zkontrolujte odpadní hadici, zda není zalomená', 'Zkontrolujte, zda sifon není ucpaný'],
    likelyCauses: ['Ucpaný filtr', 'Ucpané nebo zalomené odpadní potrubí', 'Nefunkční odpadní čerpadlo'],
    whenToStopAndCallService: ['Pokud čerpadlo nevydává zvuk'],
    relatedSymptoms: ['myčka-nevypouští'],
    possibleParts: ['Odpadní čerpadlo', 'Filtr myčky'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'mycka', code: 'E3',
    title: 'Chyba ohřevu – myčka Beko nedosahuje požadované teploty',
    shortMeaning: 'Myčka nedokázala ohřát vodu na nastavenou teplotu – pravděpodobně vadné topné těleso.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Silný vodní kámen na topném tělese', 'Vadný termostat', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – vadné topné těleso nelze opravit svépomocí'],
    relatedSymptoms: ['myčka-neumývá', 'studená-voda'],
    possibleParts: ['Topné těleso', 'Termostat', 'NTC senzor'],
    faq: [],
    sourceType: 'official',
  },

  // ===== BEKO SUŠIČKY =====
  {
    brand: 'Beko', applianceType: 'susicka', code: 'H01',
    title: 'Přehřátí sušičky Beko',
    shortMeaning: 'Sušička Beko se přehřála.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr chlupů', 'Vyčistěte kondenzátor'],
    likelyCauses: ['Ucpaný filtr', 'Zanesený kondenzátor', 'Špatné větrání'],
    whenToStopAndCallService: ['Pokud se opakuje'],
    relatedSymptoms: ['sušička-se-přehřívá'],
    possibleParts: ['Bezpečnostní termostat', 'Filtr chlupů'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'susicka', code: 'H02',
    title: 'Chyba senzoru teploty sušičky Beko',
    shortMeaning: 'Senzor teploty sušičky Beko je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný NTC senzor', 'Špatné zapojení'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nespustí'],
    possibleParts: ['NTC senzor', 'Hlavní deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'susicka', code: 'H05',
    title: 'Chyba motoru sušičky Beko',
    shortMeaning: 'Motor sušičky Beko je vadný nebo přetížený.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný motor', 'Mechanická blokace'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nespustí', 'buben-se-neotáčí'],
    possibleParts: ['Motor', 'Klínový řemen'],
    faq: [],
    sourceType: 'official',
  },
]

// Add more codes to reach 100+ (additional codes)
const additionalCodes: CodeDef[] = [
  { brand: 'Bosch', applianceType: 'pracka', code: 'E4', title: 'Přeplnění vodou', shortMeaning: 'Úroveň vody je příliš vysoká – pračka se přeplnila.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný tlakový senzor', 'Ucpané tlakové hadičky', 'Vadný elektromagnetický ventil – zůstává otevřený'], whenToStopAndCallService: ['Ihned – hrozí vytopení'], relatedSymptoms: ['voda-přetéká'], possibleParts: ['Tlakový senzor', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'E37', title: 'Chyba tlakového senzoru', shortMeaning: 'Tlakový senzor hladiny vody ohlásil chybu.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte a vyčistěte tlakové hadičky senzoru'], likelyCauses: ['Vadný tlakový senzor', 'Ucpané tlakové vedení'], whenToStopAndCallService: ['Pokud problém přetrvává'], relatedSymptoms: ['pračka-se-neplní', 'přeplnění'], possibleParts: ['Tlakový senzor'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'mycka', code: 'E24', title: 'Chyba odčerpávání – myčka nevypouští vodu', shortMeaning: 'Myčka nedokázala vypustit vodu – ucpaný filtr, odpadní hadice nebo selhání čerpadla.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr ve spodní části myčky', 'Zkontrolujte odpadní hadici, zda není zalomená', 'Zkontrolujte, zda odpad v dřezu není ucpaný'], likelyCauses: ['Ucpaný filtr nebo sítko', 'Zalomená nebo ucpaná odpadní hadice', 'Nefunkční odčerpávací čerpadlo', 'Ucpaný sifon'], whenToStopAndCallService: ['Pokud čerpadlo nevydává zvuk', 'Pokud voda zůstane i po vyčištění filtru'], relatedSymptoms: ['myčka-nevypouští'], possibleParts: ['Odčerpávací čerpadlo', 'Filtr myčky', 'Odpadní hadice'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'susicka', code: 'E:03', title: 'Přerušení programu – přehřátí', shortMeaning: 'Program byl přerušen z důvodu přehřátí.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte a vyčistěte filtry', 'Zkontrolujte větrání prostoru'], likelyCauses: ['Ucpané filtry', 'Špatné větrání', 'Přeplněný buben'], whenToStopAndCallService: ['Pokud se opakuje pravidelně'], relatedSymptoms: ['sušička-se-přehřívá'], possibleParts: ['Bezpečnostní termostat', 'Filtr chlupů'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F48', title: 'Chyba komunikace – deska a motor', shortMeaning: 'Přerušena komunikace mezi řídicí deskou a motorem.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný konektor', 'Vadný motor', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Motor', 'Hlavní deska', 'Konektor'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F23', title: 'Chyba hladiny vody – přeplnění', shortMeaning: 'Voda překročila povolenou hladinu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný tlakový senzor', 'Vadný ventil'], whenToStopAndCallService: ['Ihned – hrozí únik'], relatedSymptoms: ['přeplnění', 'voda-přetéká'], possibleParts: ['Tlakový senzor', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E14', title: 'Chyba senzoru průtoku vody', shortMeaning: 'Senzor průtoku vody hlásí nesprávné hodnoty.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný senzor průtoku', 'Cizí těleso v senzoru'], whenToStopAndCallService: ['Pokud myčka nepracuje'], relatedSymptoms: ['myčka-se-neplní'], possibleParts: ['Senzor průtoku vody'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E90', title: 'Chyba elektroniky AEG', shortMeaning: 'Porucha hlavní řídicí desky.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba napájení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska'], faq: [{ q: 'Jak resetovat pračku AEG při E90?', a: 'Odpojte pračku na 10 minut a znovu zapněte.' }], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'susicka', code: 'E6A', title: 'Porucha bezpečnostního termostatu', shortMeaning: 'Bezpečnostní termostat se aktivoval kvůli přehřátí.', severityLevel: 4, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr', 'Zkontrolujte větrání'], likelyCauses: ['Ucpané filtry', 'Špatné větrání', 'Vadný termostat'], whenToStopAndCallService: ['Pokud se opakuje'], relatedSymptoms: ['sušička-se-přehřívá'], possibleParts: ['Bezpečnostní termostat'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E35', title: 'Chyba hladiny vody – přeplnění', shortMeaning: 'Hladina vody v pračce je příliš vysoká.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný tlakový senzor', 'Vadný elektromagnetický ventil'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['přeplnění'], possibleParts: ['Tlakový senzor', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'mycka', code: 'i50', title: 'Chyba oběhového čerpadla myčky', shortMeaning: 'Oběhové čerpadlo myčky Electrolux nefunguje.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné oběhové čerpadlo', 'Cizí těleso v čerpadle', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá'], possibleParts: ['Oběhové čerpadlo'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'OE', altCodes: ['OC'], title: 'Přeplnění vodou – Samsung', shortMeaning: 'Hladina vody v pračce Samsung je příliš vysoká.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Snižte množství pracího prášku nebo prostředku – nadměrná pěna může způsobit tuto chybu.', 'Vypněte pračku, odpojte ze zásuvky na 1 minutu a znovu spusťte nový program.'], likelyCauses: ['Příliš mnoho pracího prostředku způsobující přeplnění pěnou', 'Vadný tlakový senzor', 'Vadný elektromagnetický ventil'], whenToStopAndCallService: ['Pokud chyba přetrvává i po snížení dávky detergenttu'], relatedSymptoms: ['přeplnění', 'voda-přetéká'], possibleParts: ['Tlakový senzor', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'TE', altCodes: ['TC'], title: 'Chyba teploty vody – Samsung', shortMeaning: 'Chyba senzoru teploty nebo topného tělesa.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Vypněte pračku, odpojte ze zásuvky na 60 sekund.', 'Znovu zapněte a spusťte nový program.'], likelyCauses: ['Vadný NTC senzor', 'Vadné topné těleso'], whenToStopAndCallService: ['Pokud chyba přetrvává po restartu'], relatedSymptoms: ['studená-voda'], possibleParts: ['NTC senzor', 'Topné těleso'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'susicka', code: 'tC', title: 'Chyba senzoru teploty sušičky Samsung', shortMeaning: 'Senzor teploty sušičky Samsung ohlásil poruchu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor', 'Porucha desky'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nespustí'], possibleParts: ['NTC senzor', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'H4', title: 'Zkrat triaku přívodního ventilu – Beko', shortMeaning: 'Byl detekován zkrat triaku elektromagnetického přívodního ventilu na řídicí desce.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Zkrat triaku na řídicí desce', 'Vadný elektromagnetický ventil způsobující přetížení', 'Porucha řídicí desky'], whenToStopAndCallService: ['Ihned – elektrická porucha'], relatedSymptoms: ['přeplnění', 'pračka-nespustí'], possibleParts: ['Řídicí deska', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'mycka', code: 'E4', title: 'Chyba hladiny vody myčky Beko', shortMeaning: 'Nesprávná hladina vody v myčce Beko.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný senzor hladiny', 'Vadný ventil'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['myčka-se-neplní'], possibleParts: ['Senzor hladiny', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },

  // ===== BOSCH PRAČKY – rozšíření =====
  { brand: 'Bosch', applianceType: 'pracka', code: 'E16', altCodes: ['F16'], title: 'Otevřená dvířka – pračka nespustí program', shortMeaning: 'Pračka Bosch nespustí program, protože dvířka nejsou správně zavřena nebo zámek nedetekuje zavření.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dvířka – musí cvaknou', 'Zkontrolujte, zda v rámu dvířek nic nepřekáží', 'Zkontrolujte plastovou záchytku na dvířkách'], likelyCauses: ['Dvířka nejsou řádně zavřena', 'Vadný mikrospínač v zámku dveří', 'Poškozená záchytka dvířek', 'Deformovaný rám dvířek'], whenToStopAndCallService: ['Pokud záchytka je poškozena', 'Pokud zámek nereaguje ani po zavření'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří', 'Záchytka dvířek'], faq: [{ q: 'Proč Bosch pračka hlásí E16 i když jsou dvířka zavřena?', a: 'Může jít o vadný mikrospínač v zámku dveří. Dveře zavřete silněji, nebo zkontrolujte, zda záchytka není zlomená.' }], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'F19', title: 'Chyba ohřevu vody', shortMeaning: 'Topné těleso pračky nefunguje nebo voda se neohřívá.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Přerušené vedení k topnému tělesu', 'Výpadek fáze napájení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['studená-voda', 'špatné-praní'], possibleParts: ['Topné těleso', 'NTC senzor', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'F22', title: 'Chyba teplotního senzoru NTC', shortMeaning: 'Senzor teploty vody (NTC) je vadný nebo odpojen.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC termistor', 'Přerušený kabel senzoru', 'Koroze konektoru'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['studená-voda', 'přehřátí'], possibleParts: ['NTC senzor teploty'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'F25', title: 'Chyba senzoru zákalnosti vody', shortMeaning: 'Senzor zákalnosti (čistoty) vody hlásí poruchu.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný senzor zákalnosti', 'Znečistění senzoru', 'Vadná deska'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['špatné-praní'], possibleParts: ['Senzor zákalnosti', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'E91', title: 'Chyba komunikace elektroniky', shortMeaning: 'Chyba v komunikaci mezi moduly řídicí elektroniky.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Vypněte pračku a odpojte na 5 minut, pak zapněte znovu'], likelyCauses: ['Přechodová chyba napájení', 'Vadná hlavní deska', 'Vadný řídicí modul'], whenToStopAndCallService: ['Pokud reset nepomůže'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska', 'Řídicí modul'], faq: [], sourceType: 'official' },

  // ===== BOSCH MYČKY – rozšíření =====
  { brand: 'Bosch', applianceType: 'mycka', code: 'E01', title: 'Porucha řídicí desky – chyba napájecího modulu', shortMeaning: 'Porucha řídicí elektroniky myčky (kódy E01–E05 označují poruchu výkonového modulu nebo řídicí desky).', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná řídicí deska', 'Porucha napájecího modulu', 'Vadný triak na desce'], whenToStopAndCallService: ['Ihned – vyžaduje výměnu elektroniky'], relatedSymptoms: ['myčka-nespustí', 'myčka-nereaguje'], possibleParts: ['Řídicí deska', 'Napájecí modul'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'mycka', code: 'E09', title: 'Chyba ohřevu vody myčky', shortMeaning: 'Myčka neohřívá vodu na požadovanou teplotu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá'], possibleParts: ['Topné těleso', 'NTC senzor'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'mycka', code: 'E05', title: 'Porucha triaku vodního spínače', shortMeaning: 'Chyba triaku spínače přívodu vody na řídicí desce nebo porucha plovákového spínače.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný triak na řídicí desce', 'Porucha plovákového spínače', 'Zkrat v obvodu vodního ventilu'], whenToStopAndCallService: ['Ihned – elektrická porucha'], relatedSymptoms: ['myčka-nespustí', 'myčka-se-neplní'], possibleParts: ['Řídicí deska', 'Plovákový spínač', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'mycka', code: 'E08', title: 'Porucha zahřívání – příliš pomalý ohřev', shortMeaning: 'Voda se ohřívá příliš pomalu nebo nedosahuje teploty.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Topné těleso s nízkým výkonem', 'Usazený kámen na topném tělese', 'Vadný termostat'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['myčka-neumývá'], possibleParts: ['Topné těleso', 'Termostat'], faq: [], sourceType: 'official' },

  // ===== BOSCH SUŠIČKY – rozšíření =====
  { brand: 'Bosch', applianceType: 'susicka', code: 'E:06', title: 'Porucha topného okruhu sušičky', shortMeaning: 'Topné těleso sušičky Bosch je vadné nebo nefunguje.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Přepálené topné těleso', 'Přepálená tepelná pojistka', 'Vadné relé ohřevu'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Topné těleso', 'Tepelná pojistka', 'Relé'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'susicka', code: 'E:90', title: 'Porucha elektroniky sušičky Bosch', shortMeaning: 'Chyba řídicí elektroniky sušičky.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba', 'Výpadek napájení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nespustí'], possibleParts: ['Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== SIEMENS PRAČKY – rozšíření =====
  { brand: 'Siemens', applianceType: 'pracka', code: 'F01', title: 'Dveře se správně nezavřou', shortMeaning: 'Pračka Siemens nespustí program, protože dveře nejsou řádně zavřeny.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dveře', 'Odstraňte případné prádlo zachycené v rámu'], likelyCauses: ['Dveře nezavřeny', 'Prádlo zachyceno v rámu', 'Vadný zámek'], whenToStopAndCallService: ['Pokud zámek nefunguje'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F19', title: 'Chyba ohřevu vody Siemens', shortMeaning: 'Topné těleso pračky Siemens nepracuje správně.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Nízké napájení', 'Vadný NTC senzor'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['studená-voda'], possibleParts: ['Topné těleso', 'NTC senzor'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F22', title: 'Chyba teplotního senzoru Siemens', shortMeaning: 'NTC senzor teploty vody je vadný nebo odpojen.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC termistor', 'Přerušený kabel', 'Koroze konektoru'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['studená-voda'], possibleParts: ['NTC senzor teploty'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F34', title: 'Dveře se nezamknou', shortMeaning: 'Zámek dveří pračky Siemens se mechanicky nezamkne.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte, zda v rámu nic nepřekáží', 'Zkontrolujte stav plastové záchytky na dveřích'], likelyCauses: ['Vadný zámek dveří', 'Zlomená záchytka', 'Deformovaný rám'], whenToStopAndCallService: ['Pokud záchytka visí nebo chybí'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'pracka', code: 'F91', title: 'Chyba komunikace modulů', shortMeaning: 'Ztráta komunikace mezi řídicími moduly pračky Siemens.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Odpojte pračku na 5 minut a znovu zapněte'], likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba', 'Porucha napájení'], whenToStopAndCallService: ['Pokud reset nepomůže'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska', 'Řídicí modul'], faq: [], sourceType: 'official' },

  // ===== SIEMENS MYČKY – iQ řada rozšíření =====
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E06', title: 'Porucha snímače dveří myčky Siemens', shortMeaning: 'Snímač polohy dveří myčky hlásí chybu.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte, zda jsou dveře řádně zavřeny', 'Zkontrolujte závěs dveří'], likelyCauses: ['Vadný snímač dveří', 'Vadný konektor', 'Poškozený závěs'], whenToStopAndCallService: ['Pokud myčka nespustí ani po zavření'], relatedSymptoms: ['myčka-nespustí'], possibleParts: ['Snímač dveří', 'Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E07', title: 'Chyba sušícího systému myčky', shortMeaning: 'Sušící systém myčky Siemens nefunguje správně.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso sušení', 'Vadný ventilátor', 'Vadný termostat sušení'], whenToStopAndCallService: ['Pokud nádobí zůstává mokré'], relatedSymptoms: ['nádobí-mokré'], possibleParts: ['Topné těleso', 'Ventilátor sušení', 'Termostat'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'iq', code: 'E22', title: 'Zanesený filtr myčky Siemens', shortMeaning: 'Filtr myčky Siemens je ucpaný a brání správnému provozu.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Vyjměte a umyjte filtr pod tekoucí vodou', 'Vyčistěte jemné sítko kartáčkem'], likelyCauses: ['Zanedbání pravidelného čištění', 'Velké množství zbytků jídla'], whenToStopAndCallService: [], relatedSymptoms: ['špatné-mytí'], possibleParts: ['Filtr myčky'], faq: [], sourceType: 'official' },

  // ===== SIEMENS MYČKY – SE/SF řada (starší modely, blikací kódy, do ~2010) =====
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E1', title: 'Přehřátí nebo vadné topné těleso (SE/SF)', shortMeaning: '1 bliknutí: topné těleso myčky se přehřálo nebo nefunguje.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Silný vodní kámen na topném tělese', 'Vadný termostat'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá', 'studená-voda'], possibleParts: ['Topné těleso', 'Termostat'], faq: [{ q: 'Jak se kód E1 zobrazuje na starší myčce Siemens SE/SF?', a: 'Starší modely SE/SF nemají displej. Chybu signalizuje 1 bliknutí kontrolky programu s pauzou, které se opakuje.' }], sourceType: 'manual' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E2', title: 'Vadný senzor teploty NTC (SE/SF)', shortMeaning: '2 bliknutí: teplotní senzor (NTC) myčky neposílá správné hodnoty.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC termistor', 'Přerušené vedení k senzoru', 'Koroze konektoru'], whenToStopAndCallService: ['Pokud myčka nepere ve správné teplotě'], relatedSymptoms: ['myčka-neumývá', 'studená-voda'], possibleParts: ['NTC senzor teploty'], faq: [], sourceType: 'manual' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E3', title: 'Pomalé plnění vodou (SE/SF)', shortMeaning: '3 bliknutí: myčka nedosáhla požadované hladiny vody v daném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'], likelyCauses: ['Zavřený kohout', 'Ucpaný filtr přívodní hadice', 'Nízký tlak vody', 'Vadný elektromagnetický ventil'], whenToStopAndCallService: ['Pokud přetrvává po kontrole přívodu'], relatedSymptoms: ['myčka-se-neplní'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'], faq: [], sourceType: 'manual' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E4', title: 'Porucha průtokového spínače (SE/SF)', shortMeaning: '4 bliknutí: průtokový spínač pod topným tělesem nefunguje správně.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný průtokový spínač', 'Ucpané rameno ostřiku', 'Vadná oběhová pumpa'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá'], possibleParts: ['Průtokový spínač', 'Oběhová pumpa'], faq: [], sourceType: 'manual' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E5', title: 'Přeplnění – vadný senzor hladiny (SE/SF)', shortMeaning: '5 bliknutí: hladina vody překročila povolenou mez nebo senzor hlásí chybu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný senzor hladiny', 'Ucpané tlakové vedení senzoru', 'Vadný elektromagnetický ventil'], whenToStopAndCallService: ['Ihned – hrozí přetečení'], relatedSymptoms: ['přeplnění', 'voda-přetéká'], possibleParts: ['Senzor hladiny vody', 'Elektromagnetický ventil'], faq: [], sourceType: 'manual' },
  { brand: 'Siemens', applianceType: 'mycka', subtype: 'se-sf', code: 'E6', title: 'Porucha Aquasensoru – senzor zákalnosti (SE/SF)', shortMeaning: '6 bliknutí: senzor zákalnosti vody (Aquasensor) nefunguje. Pozor – na iQ modelech kód E06 znamená poruchu snímače dveří.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr a sítko myčky', 'Spusťte krátký program bez nádobí'], likelyCauses: ['Zanesený nebo vadný Aquasensor', 'Usazený vodní kámen na senzoru'], whenToStopAndCallService: ['Pokud problém přetrvává po vyčištění'], relatedSymptoms: ['špatné-mytí'], possibleParts: ['Aquasensor (senzor zákalnosti)'], faq: [{ q: 'Proč kód E6 na starší myčce Siemens SE/SF neznamená totéž co E06 na nové myčce?', a: 'Starší generace SE/SF a novější iQ řada používají odlišné diagnostické systémy. E6 na SE/SF = porucha Aquasensoru (zákalnost), zatímco E06 na iQ modelech = porucha snímače dveří.' }], sourceType: 'manual' },

  // ===== SIEMENS SUŠIČKY – rozšíření =====
  { brand: 'Siemens', applianceType: 'susicka', code: 'E:02', title: 'Dlouhé sušení / zanesený kondenzátor', shortMeaning: 'Sušička Siemens suší příliš dlouho kvůli zanešení kondenzátoru nebo filtru.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr chlupů', 'Vyčistěte kondenzátor', 'Nepřeplňujte buben'], likelyCauses: ['Zanesený kondenzátor', 'Ucpaný filtr chlupů', 'Přeplnění bubnu', 'Vadný senzor vlhkosti'], whenToStopAndCallService: ['Pokud přetrvává po vyčištění'], relatedSymptoms: ['prádlo-mokré', 'dlouhé-sušení'], possibleParts: ['Kondenzátor', 'Filtr chlupů', 'Senzor vlhkosti'], faq: [], sourceType: 'official' },
  { brand: 'Siemens', applianceType: 'susicka', code: 'E:03', title: 'Přerušení programu – přehřátí Siemens', shortMeaning: 'Program byl přerušen kvůli přehřátí sušičky.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtry', 'Zkontrolujte větrání prostoru'], likelyCauses: ['Ucpané filtry', 'Špatné větrání', 'Přeplněný buben'], whenToStopAndCallService: ['Pokud se opakuje'], relatedSymptoms: ['sušička-se-přehřívá'], possibleParts: ['Bezpečnostní termostat', 'Filtr chlupů'], faq: [], sourceType: 'official' },

  // ===== AEG PRAČKY – rozšíření =====
  { brand: 'AEG', applianceType: 'pracka', code: 'E11', title: 'Pračka AEG se neplní vodou včas', shortMeaning: 'Pračka nedokázala naplnit nádrž na požadovanou úroveň v daném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte přívod vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'], likelyCauses: ['Vadný přívodní ventil', 'Ucpaná přívodní hadice', 'Nízký tlak vody'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['pračka-se-neplní'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E13', title: 'Únik vody – AEG', shortMeaning: 'Pračka AEG detekovala únik vody ze systému do základny.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Prasklá hadice uvnitř pračky', 'Vadné těsnění bubnu', 'Vadná pumpa'], whenToStopAndCallService: ['Okamžitě – hrozí zaplavení'], relatedSymptoms: ['únik-vody', 'voda-pod-pračkou'], possibleParts: ['Hadice', 'Těsnění bubnu', 'Pumpa'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E21', title: 'Pračka AEG nevypustila vodu v čase', shortMeaning: 'Pračka nedokázala odvést odpadní vodu v požadovaném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'], likelyCauses: ['Ucpaný filtr čerpadla', 'Ucpané čerpadlo', 'Zalomená odpadní hadice', 'Vadná deska'], whenToStopAndCallService: ['Pokud čerpadlo nevydává zvuk'], relatedSymptoms: ['pračka-nevypouští'], possibleParts: ['Čerpadlo', 'Filtr čerpadla'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E31', title: 'Porucha senzoru hladiny vody AEG', shortMeaning: 'Tlakový senzor hladiny vody hlásí poruchu.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte a vyčistěte hadičku tlakového senzoru'], likelyCauses: ['Vadný tlakový senzor', 'Ucpané tlakové vedení', 'Vadná deska'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['pračka-se-neplní', 'přeplnění'], possibleParts: ['Tlakový senzor'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E41', title: 'Dveře pračky AEG se nezamknou', shortMeaning: 'Zámek dveří se nezamkne nebo je vadný.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte záchytku na dveřích'], likelyCauses: ['Vadný zámek', 'Zlomená záchytka', 'Vadná elektronika zámku'], whenToStopAndCallService: ['Pokud záchytka je poškozena'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E51', title: 'Zkrat triaku motoru AEG', shortMeaning: 'V řídicím obvodu motoru byl detekován zkrat triaku.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Zkrat triaku na desce', 'Vadný motor', 'Porucha řízení motoru'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['buben-se-neotáčí', 'pračka-nereaguje'], possibleParts: ['Hlavní deska', 'Motor', 'Triak'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E61', title: 'Topné těleso AEG neohřeje vodu', shortMeaning: 'Topné těleso nedokáže ohřát vodu na nastavenou teplotu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Silný vodní kámen na topném tělese', 'Přerušený obvod'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['studená-voda', 'špatné-praní'], possibleParts: ['Topné těleso', 'NTC senzor'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'E62', title: 'Přehřátí vody AEG', shortMeaning: 'Teplota vody překročila 88 °C – topné těleso nebo termostat jsou vadné.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný termostat', 'Zkrat topného tělesa', 'Vadná řídicí deska'], whenToStopAndCallService: ['Okamžitě – hrozí poškození prádla'], relatedSymptoms: ['přehřátí-vody'], possibleParts: ['Termostat', 'Topné těleso', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'EF1', title: 'Ucpaný odpadní filtr AEG', shortMeaning: 'Odpadní filtr pračky je ucpaný a brání vypouštění vody.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr čerpadla vpravo dole'], likelyCauses: ['Zanedbání čištění filtru', 'Cizí předměty v filtru'], whenToStopAndCallService: [], relatedSymptoms: ['pračka-nevypouští'], possibleParts: ['Filtr čerpadla'], faq: [{ q: 'Jak vyčistit filtr pračky AEG?', a: 'Otočte dolním krytem, vyjměte filtr, vyčistěte pod tekoucí vodou a vraťte zpět.' }], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'pracka', code: 'EF2', title: 'Nadměrná pěna v pračce AEG', shortMeaning: 'Bylo detekováno nadměrné množství pěny v bubnu.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Používejte méně pracího prášku', 'Použijte prací prostředek určený pro automatické pračky'], likelyCauses: ['Příliš mnoho pracího prostředku', 'Nevhodný prací prostředek', 'Zbytky prostředku z předchozího praní'], whenToStopAndCallService: [], relatedSymptoms: ['pěna-v-pračce'], possibleParts: [], faq: [], sourceType: 'official' },

  // ===== AEG MYČKY – rozšíření =====
  { brand: 'AEG', applianceType: 'mycka', code: 'I40', title: 'Porucha tlakového senzoru (hladina vody)', shortMeaning: 'Tlakový senzor hladiny vody myčky AEG hlásí poruchu (4 pípnutí / 4 bliknutí).', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný tlakový senzor', 'Ucpané tlakové hadičky senzoru', 'Porucha řídicí desky'], whenToStopAndCallService: ['Ihned – myčka nemůže správně dávkovat vodu'], relatedSymptoms: ['myčka-se-neplní', 'přeplnění'], possibleParts: ['Tlakový senzor', 'Řídicí deska'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'mycka', code: 'i60', title: 'Chyba topného tělesa myčky AEG', shortMeaning: 'Topné těleso nebo termostat myčky AEG jsou vadné.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Vadný termostat', 'Usazený vodní kámen'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá', 'studená-voda'], possibleParts: ['Topné těleso', 'Termostat'], faq: [], sourceType: 'official' },

  // ===== AEG SUŠIČKY – rozšíření =====
  { brand: 'AEG', applianceType: 'susicka', code: 'E9E', title: 'Porucha elektroniky sušičky AEG', shortMeaning: 'Řídicí elektronika sušičky AEG hlásí chybu.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba napájení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nespustí'], possibleParts: ['Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'AEG', applianceType: 'susicka', code: 'E2E', title: 'Chyba senzoru teploty bubnu AEG', shortMeaning: 'Senzor teploty v bubnu sušičky AEG je vadný.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor bubnu', 'Přerušené vedení', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-se-přehřívá', 'sušička-nespustí'], possibleParts: ['NTC senzor bubnu', 'Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== ELECTROLUX PRAČKY – rozšíření =====
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E11', title: 'Pračka Electrolux se neplní včas', shortMeaning: 'Pračka nedokázala naplnit nádrž v požadovaném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte přívod vody', 'Vyčistěte filtr hadice'], likelyCauses: ['Vadný přívodní ventil', 'Ucpaný filtr', 'Nízký tlak vody'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['pračka-se-neplní'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E13', title: 'Únik vody – Electrolux', shortMeaning: 'Pračka Electrolux detekovala únik vody do základny.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Prasklá hadice', 'Vadné těsnění', 'Vadná pumpa'], whenToStopAndCallService: ['Okamžitě'], relatedSymptoms: ['únik-vody', 'voda-pod-pračkou'], possibleParts: ['Hadice', 'Těsnění bubnu', 'Pumpa'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E21', title: 'Chyba vypouštění Electrolux', shortMeaning: 'Pračka Electrolux nevypustila vodu v čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'], likelyCauses: ['Ucpaný filtr', 'Vadné čerpadlo', 'Zalomená hadice'], whenToStopAndCallService: ['Pokud čerpadlo nefunguje'], relatedSymptoms: ['pračka-nevypouští'], possibleParts: ['Čerpadlo', 'Filtr'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E41', title: 'Chyba zámku dveří Electrolux', shortMeaning: 'Zámek dveří pračky Electrolux nefunguje správně.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte záchytku'], likelyCauses: ['Vadný zámek', 'Záchytka poškozena', 'Vadná elektronika'], whenToStopAndCallService: ['Pokud záchytka je poškozena'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'E60', title: 'Chyba ohřevu vody Electrolux', shortMeaning: 'Topné těleso nebo termostat pračky Electrolux jsou vadné.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor', 'Porucha desky'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['studená-voda', 'špatné-praní'], possibleParts: ['Topné těleso', 'NTC senzor'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'pracka', code: 'EF0', title: 'Aktivován systém proti vyplavení (Electrolux)', shortMeaning: 'Protizáplavový systém pračky Electrolux detekoval vodu ve spodní vaně – pračka se zastavila.', severityLevel: 4, canUserTrySafeChecks: true, safeChecks: ['Snižte množství pracího prostředku – přílišné pěnění může zaplavit spodní vanu.', 'Zkontrolujte dávkovač pracího prostředku a vyčistěte ho.', 'Nakloňte pračku dozadu o 10–15 cm a podržte 30–40 sekund, aby voda vytekla ze spodní vany.', 'Vyčistěte filtr čerpadla a zkontrolujte odpadní hadici.', 'Zkontrolujte těsnění dveří – prohlédněte gumový manžon.'], likelyCauses: ['Únik vody z hadice nebo těsnění uvnitř pračky', 'Přetečení bubnu při nadměrném pěnění', 'Vadné těsnění bubnu nebo pumpy'], whenToStopAndCallService: ['Pokud je voda fyzicky viditelná pod pračkou i po kontrole a naklonění', 'Pokud se chyba opakuje bez nadměrného detergenttu'], relatedSymptoms: ['voda-pod-pračkou', 'únik-vody'], possibleParts: ['Těsnění bubnu', 'Přívodní hadice', 'Pumpa'], faq: [], sourceType: 'official' },

  // ===== ELECTROLUX MYČKY – rozšíření =====
  { brand: 'Electrolux', applianceType: 'mycka', code: 'i60', title: 'Chyba topného tělesa myčky Electrolux', shortMeaning: 'Topné těleso nebo termostat myčky Electrolux jsou vadné.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Vadný termostat', 'Usazený vodní kámen'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá', 'studená-voda'], possibleParts: ['Topné těleso', 'Termostat'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'mycka', code: 'i80', title: 'Porucha paměťového bloku myčky', shortMeaning: 'Chyba paměti nebo elektroniky myčky Electrolux.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná hlavní deska', 'Porucha EEPROM paměti'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-nereaguje'], possibleParts: ['Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== ELECTROLUX SUŠIČKY – rozšíření =====
  { brand: 'Electrolux', applianceType: 'susicka', code: 'E53', title: 'Chyba senzoru teploty výfuku Electrolux', shortMeaning: 'Senzor teploty výfukového vzduchu sušičky je vadný.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nespustí'], possibleParts: ['NTC senzor', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'Electrolux', applianceType: 'susicka', code: 'E54', title: 'Chyba senzoru teploty kondenzátoru', shortMeaning: 'Senzor teploty kondenzátoru sušičky Electrolux je vadný.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor kondenzátoru', 'Přerušené vedení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-se-přehřívá'], possibleParts: ['NTC senzor kondenzátoru', 'Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== SAMSUNG PRAČKY – rozšíření =====
  { brand: 'Samsung', applianceType: 'pracka', code: '1E', altCodes: ['1C', 'E7'], title: 'Chyba senzoru hladiny vody Samsung', shortMeaning: 'Pračka Samsung nepřijímá signál od senzoru hladiny vody.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vypněte pračku hlavním vypínačem nebo odpojte ze zásuvky, počkejte 1 minutu a znovu zapněte.', 'Spusťte nový program.'], likelyCauses: ['Vadný senzor hladiny', 'Ucpané tlakové hadičky', 'Vadná deska'], whenToStopAndCallService: ['Pokud chyba přetrvává po restartu'], relatedSymptoms: ['pračka-se-neplní', 'přeplnění'], possibleParts: ['Senzor hladiny vody', 'Tlakový senzor'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: '8E', altCodes: ['8C', '8E1'], title: 'Chyba senzoru vibrací Samsung', shortMeaning: 'Senzor vibrací (VRT+) pračky Samsung nepracuje správně.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vypněte pračku hlavním vypínačem nebo odpojte ze zásuvky, počkejte 1 minutu a znovu zapněte.', 'Spusťte nový program.'], likelyCauses: ['Vadný senzor vibrací', 'Vadná deska', 'Mechanické poškození senzoru'], whenToStopAndCallService: ['Pokud chyba přetrvává po restartu'], relatedSymptoms: ['vibrace', 'hluk-při-praní'], possibleParts: ['Senzor vibrací VRT+', 'Hlavní deska'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'bE', altCodes: ['bC', 'EB'], title: 'Porucha ovládacích tlačítek Samsung', shortMeaning: 'Jedno nebo více ovládacích tlačítek pračky Samsung je zablokováno nebo vadné.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte, zda je aktivní dětský zámek', 'Podržte tlačítko Start/Pause 5 sekund pro deaktivaci'], likelyCauses: ['Aktivní dětský zámek', 'Vadné ovládací tlačítko', 'Vlhkost v ovládacím panelu'], whenToStopAndCallService: ['Pokud deaktivace dětského zámku nepomůže'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Ovládací panel', 'Tlačítko'], faq: [{ q: 'Jak vypnout dětský zámek na pračce Samsung?', a: 'Podržte tlačítko Temp nebo kombinaci tlačítek dle modelu po dobu 3–5 sekund.' }], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'Sud', altCodes: ['Sd'], title: 'Nadměrné pěnění Samsung', shortMeaning: 'Pračka Samsung detekovala nadměrné množství pěny v bubnu.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Snižte dávku pracího prostředku', 'Používejte prášek označený HE (High Efficiency)'], likelyCauses: ['Příliš mnoho pracího prostředku', 'Nevhodný typ pracího prášku'], whenToStopAndCallService: [], relatedSymptoms: ['pěna-v-pračce'], possibleParts: [], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'CE', title: 'Přehozené přívodní hadice teplé a studené vody', shortMeaning: 'Pračka detekovala přetopení vody – přívodní hadice teplé a studené vody jsou pravděpodobně přehozeny.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte, zda je hadice studené vody zapojena do modrého/studeného vstupu', 'Přehoďte hadice, pokud jsou zaměněny', 'Otočte ventily a spusťte krátký program'], likelyCauses: ['Zaměněné hadice teplé a studené vody při instalaci', 'Teplota vstupní vody překročila 50 °C'], whenToStopAndCallService: ['Pokud přetrvává i po správném zapojení hadic'], relatedSymptoms: ['pračka-přehřívá-prádlo'], possibleParts: ['Přívodní hadice', 'Elektromagnetický ventil'], faq: [{ q: 'Co znamená kód CE na pračce Samsung?', a: 'Kód CE znamená, že pračka detekovala příliš horkou vodu v studeném přívodu. Nejčastější příčinou jsou přehozené přívodní hadice teplé a studené vody.' }], sourceType: 'official' },

  // ===== SAMSUNG MYČKY – rozšíření =====
  { brand: 'Samsung', applianceType: 'mycka', code: '4C', altCodes: ['4E'], title: 'Chyba přívodu vody myčky Samsung', shortMeaning: 'Myčka Samsung nedostává vodu nebo ji dostává nedostatečně.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice'], likelyCauses: ['Uzavřený kohout', 'Ucpaný filtr', 'Nízký tlak vody'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['myčka-se-neplní'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'mycka', code: 'HE', title: 'Chyba ohřevu myčky Samsung', shortMeaning: 'Topné těleso nebo senzor teploty myčky Samsung jsou vadné.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor', 'Vodní kámen'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-neumývá', 'studená-voda'], possibleParts: ['Topné těleso', 'NTC senzor'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'mycka', code: 'OC', title: 'Přeplnění myčky Samsung', shortMeaning: 'Hladina vody v myčce Samsung je příliš vysoká.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný elektromagnetický ventil', 'Vadný senzor hladiny'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['přeplnění', 'voda-přetéká'], possibleParts: ['Elektromagnetický ventil', 'Senzor hladiny'], faq: [], sourceType: 'official' },

  // ===== SAMSUNG SUŠIČKY – rozšíření =====
  { brand: 'Samsung', applianceType: 'susicka', code: 'dF', title: 'Porucha dveří sušičky Samsung', shortMeaning: 'Dveře sušičky Samsung nejsou správně zavřeny nebo zámek nefunguje.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dveře', 'Zkontrolujte záchytku'], likelyCauses: ['Dveře nezavřeny', 'Vadný zámek', 'Poškozená záchytka'], whenToStopAndCallService: ['Pokud záchytka chybí'], relatedSymptoms: ['sušička-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'susicka', code: 'Et', title: 'Chyba teplotního senzoru Samsung', shortMeaning: 'Teplotní senzor sušičky Samsung hlásí poruchu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení', 'Vadná deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nespustí', 'sušička-se-přehřívá'], possibleParts: ['NTC senzor teploty', 'Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== SAMSUNG PRAČKY – doplnění =====
  { brand: 'Samsung', applianceType: 'pracka', code: 'LE', altCodes: ['LC'], title: 'Detekce úniku vody – Samsung', shortMeaning: 'Pračka Samsung detekovala únik vody ve spodní části spotřebiče.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Únik z přívodní nebo odpadní hadice', 'Prasklé těsnění bubnu', 'Vadná pumpa'], whenToStopAndCallService: ['Okamžitě – hrozí zaplavení'], relatedSymptoms: ['voda-pod-pračkou', 'únik-vody'], possibleParts: ['Přívodní hadice', 'Odpadní hadice', 'Těsnění bubnu'], faq: [], sourceType: 'official' },
  { brand: 'Samsung', applianceType: 'pracka', code: 'AE', title: 'Chyba komunikace elektroniky – Samsung', shortMeaning: 'Chyba v komunikaci mezi řídicími moduly nebo externím připojením pračky Samsung.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Odpojte pračku na 5 minut a znovu zapněte', 'Zkontrolujte připojení kabelů k modulům'], likelyCauses: ['Přechodová chyba napájení', 'Vadná hlavní deska', 'Problém s Wi-Fi/SmartThings připojením'], whenToStopAndCallService: ['Pokud reset nepomůže'], relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska', 'Řídicí modul'], faq: [], sourceType: 'official' },

  // ===== BOSCH PRAČKY – doplnění senzorů =====
  { brand: 'Bosch', applianceType: 'pracka', code: 'E26', altCodes: ['F26'], title: 'Vadný analogový senzor tlaku', shortMeaning: 'Analogový senzor tlaku vody (pressostat) hlásí chybné nebo neočekávané hodnoty.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný analogový tlakový senzor', 'Ucpané tlakové vedení', 'Vadná řídicí deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['pračka-se-neplní', 'přeplnění'], possibleParts: ['Tlakový senzor', 'Řídicí deska'], faq: [], sourceType: 'official' },
  { brand: 'Bosch', applianceType: 'pracka', code: 'E28', altCodes: ['F28'], title: 'Vadný senzor průtoku vody', shortMeaning: 'Senzor průtoku (průtokoměr) na přívodní hadici hlásí poruchu nebo neposílá signál.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný průtokoměr', 'Cizí těleso v průtokoměru', 'Vadná řídicí deska'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['pračka-se-neplní'], possibleParts: ['Průtokoměr', 'Řídicí deska'], faq: [], sourceType: 'official' },

  // ===== BEKO PRAČKY – novější modely (E-kódy) =====
  { brand: 'Beko', applianceType: 'pracka', code: 'E2', title: 'Chyba přívodu vody – Beko (novější modely)', shortMeaning: 'Pračka Beko nemůže napustit vodu v požadovaném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'], likelyCauses: ['Uzavřený kohout', 'Ucpaný filtr', 'Nízký tlak vody', 'Vadný elektromagnetický ventil'], whenToStopAndCallService: ['Pokud přetrvává'], relatedSymptoms: ['pračka-se-neplní'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'E3', title: 'Chyba vypouštění vody – Beko (novější modely)', shortMeaning: 'Pračka Beko nemůže vyčerpat vodu v požadovaném čase.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici'], likelyCauses: ['Ucpaný filtr čerpadla', 'Zalomená odpadní hadice', 'Vadné čerpadlo'], whenToStopAndCallService: ['Pokud čerpadlo nefunguje'], relatedSymptoms: ['pračka-nevypouští'], possibleParts: ['Čerpadlo', 'Filtr čerpadla'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'E4', title: 'Přetečení nebo nadměrná pěna – Beko (novější modely)', shortMeaning: 'V bubnu pračky Beko je příliš mnoho vody nebo pěny.', severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Spusťte vypouštěcí program', 'Snižte dávkování pracího prostředku'], likelyCauses: ['Příliš mnoho pracího prostředku', 'Vadný senzor hladiny', 'Vadný přívodní ventil'], whenToStopAndCallService: ['Ihned při opakování'], relatedSymptoms: ['přeplnění', 'pěna-v-pračce'], possibleParts: ['Senzor hladiny', 'Elektromagnetický ventil'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'E7', title: 'Problém s dvířky – Beko (novější modely)', shortMeaning: 'Dvířka pračky Beko nejsou správně zavřena nebo zámek nefunguje.', severityLevel: 1, canUserTrySafeChecks: true, safeChecks: ['Pevně zavřete dvířka', 'Zkontrolujte záchytku a rám dvířek'], likelyCauses: ['Dvířka nezavřena', 'Vadný zámek', 'Poškozená záchytka'], whenToStopAndCallService: ['Pokud záchytka je zlomená'], relatedSymptoms: ['pračka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },

  // ===== BEKO PRAČKY – rozšíření =====
  { brand: 'Beko', applianceType: 'pracka', code: 'H6', title: 'Zkrat triaku motoru – Beko', shortMeaning: 'V řídicím obvodu motoru pračky Beko byl detekován zkrat.', severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Zkrat triaku na desce', 'Vadný motor'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['buben-se-neotáčí'], possibleParts: ['Hlavní deska', 'Motor'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'H8', title: 'Přetečení vody – Beko', shortMeaning: 'Hladina vody překročila bezpečnou mez – přetečení.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný elektromagnetický ventil', 'Vadný tlakový senzor'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['přeplnění', 'voda-přetéká'], possibleParts: ['Elektromagnetický ventil', 'Tlakový senzor'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'pracka', code: 'H11', title: 'Chyba tachogenerátoru motoru Beko', shortMeaning: 'Tachogenerátor motoru je přerušen nebo vadný.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný tachogenerátor', 'Přerušený kabel tachogenerátoru', 'Vadný motor'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['buben-se-neotáčí'], possibleParts: ['Tachogenerátor', 'Motor'], faq: [], sourceType: 'official' },

  // ===== BEKO MYČKY – rozšíření =====
  { brand: 'Beko', applianceType: 'mycka', code: 'E5', title: 'Chyba teplotního senzoru myčky Beko', shortMeaning: 'Senzor teploty vody myčky Beko je vadný.', severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení ke senzoru'], whenToStopAndCallService: ['Pokud myčka nepracuje'], relatedSymptoms: ['studená-voda', 'myčka-neumývá'], possibleParts: ['NTC senzor teploty'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'mycka', code: 'E6', title: 'Chyba zámku dveří myčky Beko', shortMeaning: 'Zámek dveří myčky Beko nefunguje správně.', severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte a pevně zavřete dveře', 'Zkontrolujte záchytku dveří'], likelyCauses: ['Vadný zámek', 'Poškozená záchytka'], whenToStopAndCallService: ['Pokud záchytka chybí'], relatedSymptoms: ['myčka-nespustí'], possibleParts: ['Zámek dveří'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'mycka', code: 'E7', title: 'Přeplnění myčky Beko', shortMeaning: 'Hladina vody v myčce Beko překročila povolenou mez.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný elektromagnetický ventil', 'Vadný senzor hladiny'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['přeplnění'], possibleParts: ['Elektromagnetický ventil', 'Senzor hladiny'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'mycka', code: 'E8', title: 'Porucha elektroniky myčky Beko', shortMeaning: 'Řídicí elektronika myčky Beko hlásí chybu.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadná hlavní deska', 'Přechodová chyba napájení'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['myčka-nereaguje'], possibleParts: ['Hlavní deska'], faq: [], sourceType: 'official' },

  // ===== BEKO SUŠIČKY – rozšíření =====
  { brand: 'Beko', applianceType: 'susicka', code: 'H03', title: 'Chyba motoru ventilátoru sušičky Beko', shortMeaning: 'Motor ventilátoru sušičky Beko je vadný nebo blokovaný.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Vadný motor ventilátoru', 'Cizí předmět blokující ventilátor', 'Ucpaný filtr'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nesuší', 'sušička-se-přehřívá'], possibleParts: ['Motor ventilátoru', 'Ventilátor'], faq: [], sourceType: 'official' },
  { brand: 'Beko', applianceType: 'susicka', code: 'H04', title: 'Chyba topného tělesa sušičky Beko', shortMeaning: 'Topné těleso sušičky Beko je vadné nebo přepálené.', severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [], likelyCauses: ['Přepálené topné těleso', 'Přepálená tepelná pojistka', 'Vadný termostat'], whenToStopAndCallService: ['Ihned'], relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Topné těleso', 'Tepelná pojistka', 'Termostat'], faq: [], sourceType: 'official' },

  // ===== BOSCH SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'Bosch', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:67',
    title: 'Chyba kompresoru tepelného čerpadla – Bosch',
    shortMeaning: 'Kompresor tepelného čerpadla nepracuje nebo hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení kompresoru', 'Chyba řídicí desky kompresoru', 'Nízký tlak chladiva'],
    whenToStopAndCallService: ['Ihned – nutný certifikovaný technik pro práci s chladivem'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Řídicí deska kompresoru', 'Chladivo R134a'],
    faq: [{ q: 'Mohu sušičku s touto chybou dál používat?', a: 'Ne. Provoz bez funkčního kompresoru sušičku poškodí. Chladivo smí doplňovat/opravovat pouze certifikovaný technik (zákon č. 73/2012 Sb.).' }],
    sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:68',
    title: 'Vysoký tlak chladiva – Bosch tepelné čerpadlo',
    shortMeaning: 'Tlak v okruhu chladiva překročil bezpečnou mez.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Ucpaný výparník nebo kondenzátor', 'Vadný tlakový spínač', 'Přeplnění chladivem'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-se-přehřívá'], possibleParts: ['Tlakový spínač', 'Výparník', 'Kondenzátor'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:69',
    title: 'Nízký tlak chladiva – Bosch tepelné čerpadlo',
    shortMeaning: 'Tlak chladiva je příliš nízký – únik nebo nedostatek chladiva.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Únik chladiva', 'Vadný tlakový spínač', 'Vadný kompresor'],
    whenToStopAndCallService: ['Ihned – nutná oprava úniku a doplnění chladiva certifikovaným technikem'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Tlakový spínač', 'Kompresor', 'Chladivo R134a'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:71',
    title: 'Chyba senzoru teploty výparníku – Bosch',
    shortMeaning: 'Senzor teploty výparníku tepelného čerpadla hlásí chybnou hodnotu.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor výparníku', 'Přerušené vedení senzoru', 'Vadná deska'],
    whenToStopAndCallService: ['Pokud chyba přetrvává po restartu'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor výparníku', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Bosch', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:72',
    title: 'Chyba senzoru teploty kondenzátoru – Bosch',
    shortMeaning: 'Senzor teploty kondenzátoru tepelného čerpadla hlásí chybnou hodnotu.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor kondenzátoru', 'Přerušené vedení', 'Vadná deska'],
    whenToStopAndCallService: ['Pokud chyba přetrvává'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor kondenzátoru', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },

  // ===== SIEMENS SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'Siemens', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:67',
    title: 'Chyba kompresoru tepelného čerpadla – Siemens',
    shortMeaning: 'Kompresor tepelného čerpadla nepracuje nebo hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení kompresoru', 'Chyba řídicí desky', 'Nízký tlak chladiva'],
    whenToStopAndCallService: ['Ihned – nutný certifikovaný technik'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Řídicí deska kompresoru'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Siemens', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E:71',
    title: 'Chyba senzoru výparníku – Siemens',
    shortMeaning: 'Senzor teploty výparníku tepelného čerpadla je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení', 'Vadná deska'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor výparníku', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },

  // ===== AEG SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'AEG', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'EHF',
    title: 'Chyba kompresoru tepelného čerpadla – AEG',
    shortMeaning: 'Kompresor tepelného čerpadla sušičky AEG hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení', 'Únik chladiva', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Řídicí deska', 'Chladivo'],
    faq: [{ q: 'Sdílí AEG a Electrolux kódy tepelného čerpadla?', a: 'Ano, AEG a Electrolux patří do skupiny Electrolux Group a jejich sušičky na tepelné čerpadlo sdílí platformu i chybové kódy.' }],
    sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'EHC',
    title: 'Chyba obvodu chladiva – AEG tepelné čerpadlo',
    shortMeaning: 'Problém v chladivovém okruhu – nízký tlak nebo únik.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Únik chladiva', 'Vadný tlakový spínač', 'Zablokovaný výparník'],
    whenToStopAndCallService: ['Ihned – nutný certifikovaný technik'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Tlakový spínač', 'Výparník', 'Chladivo'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'AEG', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'ETE',
    title: 'Chyba senzoru teploty výparníku – AEG',
    shortMeaning: 'Senzor teploty výparníku tepelného čerpadla AEG je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení', 'Vadná deska'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor výparníku', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },

  // ===== ELECTROLUX SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'Electrolux', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E6F',
    title: 'Chyba kompresoru tepelného čerpadla – Electrolux',
    shortMeaning: 'Kompresor tepelného čerpadla sušičky Electrolux hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení', 'Únik chladiva', 'Vadná deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Řídicí deska', 'Chladivo'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E6C',
    title: 'Chyba chladivového okruhu – Electrolux',
    shortMeaning: 'Problém v okruhu chladiva tepelného čerpadla Electrolux.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Únik chladiva', 'Vadný tlakový spínač', 'Ucpaný výparník'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Tlakový spínač', 'Výparník', 'Chladivo'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Electrolux', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'E6T',
    title: 'Chyba senzoru výparníku – Electrolux',
    shortMeaning: 'Senzor teploty výparníku tepelného čerpadla Electrolux je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor', 'Přerušené vedení'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor výparníku', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },

  // ===== SAMSUNG SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'Samsung', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'HC',
    title: 'Chyba kompresoru tepelného čerpadla – Samsung',
    shortMeaning: 'Kompresor tepelného čerpadla sušičky Samsung nefunguje.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení', 'Nízký tlak chladiva', 'Chyba invertoru'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Invertor kompresoru', 'Chladivo'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Samsung', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'HP',
    title: 'Chyba tlaku chladiva – Samsung tepelné čerpadlo',
    shortMeaning: 'Tlak v chladivovém okruhu sušičky Samsung je mimo rozsah.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Únik chladiva', 'Vadný tlakový spínač', 'Ucpaný kondenzátor'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Tlakový spínač', 'Kondenzátor', 'Chladivo'],
    faq: [], sourceType: 'official',
  },

  // ===== BEKO SUŠIČKY TEPELNÉ ČERPADLO =====
  {
    brand: 'Beko', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'H06',
    title: 'Chyba kompresoru tepelného čerpadla – Beko',
    shortMeaning: 'Kompresor tepelného čerpadla sušičky Beko hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný kompresor', 'Přetížení kompresoru', 'Nízký tlak chladiva'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Kompresor', 'Řídicí deska kompresoru'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'H07',
    title: 'Chyba chladivového okruhu – Beko tepelné čerpadlo',
    shortMeaning: 'Problém v okruhu chladiva sušičky Beko na tepelné čerpadlo.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Únik chladiva', 'Vadný tlakový spínač', 'Ucpaný výparník'],
    whenToStopAndCallService: ['Ihned – certifikovaný technik'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['Tlakový spínač', 'Výparník', 'Chladivo'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'susicka', subtype: 'tepelne-cerpadlo', code: 'H08',
    title: 'Chyba senzoru teploty výparníku – Beko',
    shortMeaning: 'Senzor teploty výparníku tepelného čerpadla Beko je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC senzor výparníku', 'Přerušené vedení'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['sušička-nesuší'], possibleParts: ['NTC senzor výparníku', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },

  // ===== WHIRLPOOL PRAČKY =====
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F01',
    title: 'Porucha řídicí desky – Whirlpool',
    shortMeaning: 'Řídicí elektronika pračky Whirlpool hlásí poruchu nebo nereaguje.',
    severityLevel: 4, canUserTrySafeChecks: true, safeChecks: ['Odpojte pračku od elektřiny na 10 minut a znovu zapněte'],
    likelyCauses: ['Vadná hlavní deska', 'Přechodový výpadek napájení', 'Zkrat na desce'],
    whenToStopAndCallService: ['Pokud reset nepomůže'],
    relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska'],
    faq: [{ q: 'Jak resetovat pračku Whirlpool při chybě F01?', a: 'Odpojte pračku ze zásuvky na alespoň 10 minut. Po zapnutí zkuste znovu spustit program. Pokud se F01 vrátí, vyžaduje výměnu řídicí desky.' }],
    sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F06',
    title: 'Chyba tachogenerátoru motoru – Whirlpool',
    shortMeaning: 'Pračka Whirlpool nezjišťuje správně otáčky motoru – tachogenerátor je vadný nebo odpojen.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný tachogenerátor', 'Přerušený kabel tachogenerátoru', 'Vadný motor', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Ihned – buben se neotáčí nebo se zastavuje'],
    relatedSymptoms: ['buben-se-neotaci'], possibleParts: ['Tachogenerátor', 'Motor', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F07',
    title: 'Zkrat triaku motoru – Whirlpool',
    shortMeaning: 'V obvodu řízení motoru byl detekován zkrat triaku na řídicí desce.',
    severityLevel: 4, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Zkrat triaku na řídicí desce', 'Vadný motor způsobující přetížení', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – elektrická porucha'],
    relatedSymptoms: ['buben-se-neotaci'], possibleParts: ['Hlavní deska', 'Motor', 'Triak'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F08',
    title: 'Chyba topného tělesa / relé ohřevu – Whirlpool',
    shortMeaning: 'Topné těleso pračky Whirlpool nefunguje nebo se voda neohřívá.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Přerušený kabel topného tělesa', 'Silný vodní kámen', 'Vadné relé ohřevu na desce'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['pracka-zapáchá'], possibleParts: ['Topné těleso', 'NTC senzor teploty', 'Relé ohřevu'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F11',
    title: 'Chyba komunikace s motorem – Whirlpool',
    shortMeaning: 'Řídicí deska pračky Whirlpool ztratila komunikaci s motorem.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný konektor kabelu motoru', 'Vadný motor', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['buben-se-neotaci'], possibleParts: ['Motor', 'Hlavní deska', 'Kabely motoru'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F12',
    title: 'Chyba paměti EEPROM – Whirlpool',
    shortMeaning: 'Řídicí deska pračky Whirlpool má poškozenou nebo nedostupnou paměť EEPROM.',
    severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Odpojte pračku na 10 minut a znovu zapněte'],
    likelyCauses: ['Poškozená EEPROM paměť na desce', 'Výpadek napájení při ukládání dat', 'Vadná hlavní deska'],
    whenToStopAndCallService: ['Pokud reset nepomůže'],
    relatedSymptoms: ['pračka-nereaguje'], possibleParts: ['Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F18',
    title: 'Chyba odpadního čerpadla – Whirlpool',
    shortMeaning: 'Pračka Whirlpool nemůže vyčerpat odpadní vodu – čerpadlo nebo filtr jsou vadné.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla (vpravo dole)', 'Zkontrolujte odpadní hadici, zda není zalomená', 'Zkontrolujte sifon nebo odpad'],
    likelyCauses: ['Ucpaný filtr čerpadla', 'Vadné odpadní čerpadlo', 'Zalomená nebo ucpaná odpadní hadice', 'Ucpaný sifon'],
    whenToStopAndCallService: ['Pokud čerpadlo nefunguje ani po vyčištění filtru'],
    relatedSymptoms: ['pracka-nevypousti'], possibleParts: ['Odpadní čerpadlo', 'Filtr čerpadla', 'Odpadní hadice'],
    faq: [{ q: 'Kde najdu filtr čerpadla na pračce Whirlpool?', a: 'Filtr čerpadla se nachází vpravo dole za malými dvířky nebo za spodním krytem. Před otevřením připravte ručník.' }],
    sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F21',
    title: 'Pomalé nebo žádné vypouštění vody – Whirlpool',
    shortMeaning: 'Pračka Whirlpool nevypustila vodu v požadovaném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla', 'Zkontrolujte odpadní hadici', 'Zkontrolujte, zda sifon není ucpaný'],
    likelyCauses: ['Ucpaný filtr čerpadla', 'Zalomená odpadní hadice', 'Vadné čerpadlo', 'Ucpaný sifon'],
    whenToStopAndCallService: ['Pokud voda v bubnu zůstane i po vyčištění filtru'],
    relatedSymptoms: ['pracka-nevypousti'], possibleParts: ['Odpadní čerpadlo', 'Filtr čerpadla'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'pracka', code: 'F27',
    title: 'Chyba tlakového senzoru – Whirlpool',
    shortMeaning: 'Tlakový senzor hladiny vody pračky Whirlpool hlásí nesprávné hodnoty nebo poruchu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte a vyčistěte hadičku tlakového senzoru od usazenin'],
    likelyCauses: ['Vadný tlakový senzor (pressostat)', 'Ucpané tlakové vedení', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pracka-se-neplni'], possibleParts: ['Tlakový senzor (pressostat)', 'Tlakové vedení'],
    faq: [], sourceType: 'official',
  },

  // ===== WHIRLPOOL MYČKY =====
  {
    brand: 'Whirlpool', applianceType: 'mycka', code: 'F1',
    title: 'Chyba plnění vodou – myčka Whirlpool',
    shortMeaning: 'Myčka Whirlpool nedosáhla požadované hladiny vody v daném čase.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'],
    likelyCauses: ['Uzavřený kohout přívodu vody', 'Ucpaný filtr přívodní hadice', 'Nízký tlak vody', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud přetrvává po kontrole přívodu'],
    relatedSymptoms: ['myčka-nevypousti'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'mycka', code: 'F2',
    title: 'Chyba odpadního čerpadla – myčka Whirlpool',
    shortMeaning: 'Myčka Whirlpool nevypustila vodu – filtr nebo čerpadlo jsou ucpané.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr v dolní části myčky', 'Zkontrolujte odpadní hadici, zda není zalomená', 'Zkontrolujte, zda sifon není ucpaný'],
    likelyCauses: ['Ucpaný filtr nebo sítko', 'Zalomená odpadní hadice', 'Vadné odpadní čerpadlo'],
    whenToStopAndCallService: ['Pokud čerpadlo nefunguje po vyčištění filtru'],
    relatedSymptoms: ['myčka-nevypousti'], possibleParts: ['Odpadní čerpadlo', 'Filtr myčky', 'Odpadní hadice'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'mycka', code: 'F3',
    title: 'Chyba ohřevu vody – myčka Whirlpool',
    shortMeaning: 'Topné těleso myčky Whirlpool neohřívá vodu nebo se přehřívá.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Silný vodní kámen na topném tělese', 'Vadný termostat', 'Vadná deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['myčka-zapáchá'], possibleParts: ['Topné těleso', 'Termostat', 'NTC senzor'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'mycka', code: 'F4',
    title: 'Chyba teplotního senzoru NTC – myčka Whirlpool',
    shortMeaning: 'Teplotní senzor (NTC termistor) myčky Whirlpool je vadný nebo odpojen.',
    severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušený kabel senzoru', 'Koroze konektoru'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-zapáchá'], possibleParts: ['NTC senzor teploty'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'mycka', code: 'F6',
    title: 'Chyba průtokoměru vody – myčka Whirlpool',
    shortMeaning: 'Průtokoměr přívodní vody myčky Whirlpool hlásí poruchu nebo nesprávné hodnoty.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný průtokoměr', 'Cizí těleso v průtokoměru', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['myčka-nevypousti'], possibleParts: ['Průtokoměr', 'Řídicí deska'],
    faq: [], sourceType: 'official',
  },

  // ===== WHIRLPOOL SUŠIČKY =====
  {
    brand: 'Whirlpool', applianceType: 'susicka', code: 'F01',
    title: 'Porucha řídicí desky sušičky – Whirlpool',
    shortMeaning: 'Řídicí elektronika sušičky Whirlpool hlásí poruchu.',
    severityLevel: 4, canUserTrySafeChecks: true, safeChecks: ['Odpojte sušičku na 10 minut a znovu zapněte'],
    likelyCauses: ['Vadná hlavní deska', 'Výpadek napájení', 'Přechodová chyba'],
    whenToStopAndCallService: ['Pokud reset nepomůže'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'susicka', code: 'F02',
    title: 'Chyba topného okruhu sušičky – Whirlpool',
    shortMeaning: 'Topné těleso nebo relé ohřevu sušičky Whirlpool je vadné.',
    severityLevel: 3, canUserTrySafeChecks: true, safeChecks: ['Zkontrolujte a vyčistěte filtr chlupů', 'Zkontrolujte větrání prostoru'],
    likelyCauses: ['Přepálené topné těleso', 'Přepálená tepelná pojistka', 'Vadné relé ohřevu', 'Ucpané filtry způsobující přehřátí'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['Topné těleso', 'Tepelná pojistka', 'Relé ohřevu'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'susicka', code: 'F03',
    title: 'Chyba vstupního NTC senzoru sušičky – Whirlpool',
    shortMeaning: 'Teplotní senzor vstupního vzduchu sušičky Whirlpool je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušené vedení senzoru', 'Vadná deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['NTC senzor vstupního vzduchu', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'susicka', code: 'F04',
    title: 'Chyba výstupního NTC senzoru sušičky – Whirlpool',
    shortMeaning: 'Teplotní senzor výstupního vzduchu sušičky Whirlpool je vadný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor výstupu', 'Přerušené vedení', 'Vadná deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['susicka-se-prehriva'], possibleParts: ['NTC senzor výstupního vzduchu', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'Whirlpool', applianceType: 'susicka', code: 'F05',
    title: 'Chyba senzoru vlhkosti sušičky – Whirlpool',
    shortMeaning: 'Senzor vlhkosti prádla sušičky Whirlpool hlásí poruchu.',
    severityLevel: 2, canUserTrySafeChecks: true, safeChecks: ['Vyčistěte kovové senzorové lišty vlhkosti uvnitř bubnu (hadříkem s lihovým čisticím prostředkem)'],
    likelyCauses: ['Znečištěné senzorové lišty vlhkosti', 'Vadný senzor vlhkosti', 'Porucha desky'],
    whenToStopAndCallService: ['Pokud přetrvává po vyčištění'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['Senzor vlhkosti', 'Hlavní deska'],
    faq: [{ q: 'Jak vyčistit senzor vlhkosti v sušičce Whirlpool?', a: 'Uvnitř bubnu sušičky jsou dvě kovové lišty – senzory vlhkosti. Otřete je hadříkem namočeným v isopropylalkoholu nebo octu. Usazené zbytky ze saponátů snižují přesnost senzoru.' }],
    sourceType: 'official',
  },

  // ===== LG PRAČKY =====
  {
    brand: 'LG', applianceType: 'pracka', code: 'IE',
    title: 'Chyba přívodu vody – LG',
    shortMeaning: 'Pračka LG nedostává vodu nebo ji dostává příliš pomalu (IE = Input Error).',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte, zda je kohout přívodu vody plně otevřen', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody v domácnosti'],
    likelyCauses: ['Uzavřený kohout přívodu vody', 'Ucpaný filtr přívodní hadice', 'Nízký tlak vody (pod 0,5 bar)', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud přetrvává po kontrole přívodu vody'],
    relatedSymptoms: ['pracka-se-neplni'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [{ q: 'Co znamená chyba IE na pračce LG?', a: 'IE (Input Error) znamená, že pračka LG nedostává dostatek vody. Zkontrolujte, zda je otevřen kohout vody, vyčistěte filtr přívodní hadice a ověřte tlak vody.' }],
    sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'OE',
    title: 'Chyba odpadního čerpadla – LG',
    shortMeaning: 'Pračka LG nevypouští odpadní vodu (OE = Output Error).',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr čerpadla (vpravo dole za krytem)', 'Zkontrolujte odpadní hadici – nesmí být zalomená', 'Zkontrolujte výšku odpadní hadice – max. 96 cm'],
    likelyCauses: ['Ucpaný filtr čerpadla', 'Zalomená nebo ucpaná odpadní hadice', 'Vadné odpadní čerpadlo', 'Ucpaný sifon'],
    whenToStopAndCallService: ['Pokud voda zůstane v bubnu i po vyčištění filtru'],
    relatedSymptoms: ['pracka-nevypousti'], possibleParts: ['Odpadní čerpadlo', 'Filtr čerpadla', 'Odpadní hadice'],
    faq: [{ q: 'Jak vyčistit filtr pračky LG při chybě OE?', a: 'Otevřete kryt vlevo dole. Vytočte zátku filtru a vyjměte ho. Vyčistěte pod tekoucí vodou. Zkontrolujte oběžné kolečko čerpadla, zda se volně otáčí.' }],
    sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'UE',
    title: 'Nevyvážená náplň – LG',
    shortMeaning: 'Buben pračky LG není vyvážen – prádlo je shluknuto na jednom místě (UE = Unbalance Error).',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Otevřete pračku a ručně rovnoměrně rozložte prádlo v bubnu', 'Neperte jeden velký kus prádla samostatně', 'Přidejte k velké položce menší prádlo pro vyvážení'],
    likelyCauses: ['Nevyvážené rozmístění prádla', 'Velký kus (přikrývka, župan) na jednom místě', 'Přeplněný nebo prázdný buben', 'Pračka nestojí na rovném povrchu'],
    whenToStopAndCallService: ['Pokud se UE opakuje i po rovnoměrném rozložení prádla'],
    relatedSymptoms: ['pracka-trese'], possibleParts: [],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'tE',
    title: 'Chyba teplotního senzoru – LG',
    shortMeaning: 'Teplotní senzor (NTC termistor) pračky LG je vadný nebo odpojen.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušený kabel senzoru', 'Koroze konektoru', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['pracka-zapáchá'], possibleParts: ['NTC senzor teploty', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'FE',
    title: 'Přeplnění vodou – LG',
    shortMeaning: 'Hladina vody v pračce LG je příliš vysoká – detekováno přeplnění (FE = Fill Error / Flood Error).',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný elektromagnetický ventil – zůstává otevřený', 'Vadný tlakový senzor', 'Ucpané tlakové vedení senzoru'],
    whenToStopAndCallService: ['Ihned – hrozí vytopení'],
    relatedSymptoms: ['pracka-tece'], possibleParts: ['Elektromagnetický ventil', 'Tlakový senzor'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'PE',
    title: 'Chyba tlakového senzoru – LG',
    shortMeaning: 'Tlakový senzor hladiny vody pračky LG je vadný nebo nefunguje (PE = Pressure Error).',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte a vyčistěte hadičku tlakového senzoru'],
    likelyCauses: ['Vadný tlakový senzor', 'Ucpané tlakové vedení k senzoru', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pracka-se-neplni'], possibleParts: ['Tlakový senzor', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'dE',
    title: 'Otevřená dvířka nebo vadný zámek – LG',
    shortMeaning: 'Pračka LG nespustí program, protože dvířka nejsou správně zavřena nebo zámek nefunguje (dE = Door Error).',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: ['Pevně zavřete dvířka – musí cvaknou', 'Zkontrolujte plastovou záchytku na dvířkách', 'Zkontrolujte, zda prádlo nevystupuje z rámu dvířek'],
    likelyCauses: ['Dvířka nejsou řádně zavřena', 'Vadný zámek dvířek', 'Poškozená záchytka', 'Deformovaný rám'],
    whenToStopAndCallService: ['Pokud záchytka je poškozena nebo zámek nereaguje'],
    relatedSymptoms: ['buben-se-neotaci'], possibleParts: ['Zámek dvířek', 'Záchytka dvířek'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'LE',
    title: 'Přetížení motoru / zablokovaný buben – LG',
    shortMeaning: 'Motor pračky LG je přetížen nebo buben nemůže volně rotovat (LE = Load Error).',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: ['Snižte množství prádla v bubnu', 'Zkontrolujte, zda v bubnu není cizí předmět', 'Vypněte pračku a ručně otočte bubnem, zda se volně pohybuje'],
    likelyCauses: ['Přeplněný buben', 'Cizí předmět blokující buben', 'Vadný motor nebo ložiska', 'Vadná řídicí deska motoru'],
    whenToStopAndCallService: ['Pokud buben nelze ručně otočit', 'Pokud se LE opakuje i s prázdným bubnem'],
    relatedSymptoms: ['buben-se-neotaci'], possibleParts: ['Motor', 'Ložiska bubnu', 'Řídicí deska'],
    faq: [], sourceType: 'official',
  },

  // ===== LG MYČKY =====
  {
    brand: 'LG', applianceType: 'mycka', code: 'IE',
    title: 'Chyba přívodu vody – myčka LG',
    shortMeaning: 'Myčka LG nedostává dostatek vody k zahájení mytí.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte kohout přívodu vody', 'Vyčistěte filtr přívodní hadice', 'Zkontrolujte tlak vody'],
    likelyCauses: ['Uzavřený kohout', 'Ucpaný filtr hadice', 'Nízký tlak vody', 'Vadný elektromagnetický ventil'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-nevypousti'], possibleParts: ['Elektromagnetický ventil', 'Filtr přívodní hadice'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'mycka', code: 'OE',
    title: 'Chyba odpadního čerpadla – myčka LG',
    shortMeaning: 'Myčka LG nevypouští odpadní vodu.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Vyčistěte filtr v dolní části myčky', 'Zkontrolujte odpadní hadici', 'Zkontrolujte sifon'],
    likelyCauses: ['Ucpaný filtr', 'Zalomená odpadní hadice', 'Vadné odpadní čerpadlo'],
    whenToStopAndCallService: ['Pokud voda zůstane i po vyčištění filtru'],
    relatedSymptoms: ['myčka-nevypousti'], possibleParts: ['Odpadní čerpadlo', 'Filtr myčky'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'mycka', code: 'HE',
    title: 'Chyba ohřevu vody – myčka LG',
    shortMeaning: 'Topné těleso myčky LG nefunguje nebo neohřívá vodu na požadovanou teplotu.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadné topné těleso', 'Silný vodní kámen', 'Vadný NTC senzor', 'Vadná deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['myčka-zapáchá'], possibleParts: ['Topné těleso', 'NTC senzor'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'mycka', code: 'tE',
    title: 'Chyba teplotního senzoru – myčka LG',
    shortMeaning: 'NTC teplotní senzor myčky LG je vadný nebo odpojen.',
    severityLevel: 2, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušený kabel', 'Koroze konektoru'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['myčka-zapáchá'], possibleParts: ['NTC senzor teploty'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'mycka', code: 'LE',
    title: 'Detekce úniku vody – myčka LG',
    shortMeaning: 'Systém ochrany před zaplavením myčky LG detekoval vodu ve spodní vaně.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte hadice a těsnění myčky', 'Vypněte myčku a zkontrolujte podlahu pod ní'],
    likelyCauses: ['Únik z přívodní hadice', 'Prasklé těsnění pumpy', 'Přetečení dávkovače leštidla', 'Vadná oběhová pumpa'],
    whenToStopAndCallService: ['Ihned – hrozí zaplavení'],
    relatedSymptoms: ['voda-pod-myčkou'], possibleParts: ['Přívodní hadice', 'Těsnění pumpy', 'Oběhová pumpa'],
    faq: [], sourceType: 'official',
  },

  // ===== LG SUŠIČKY =====
  {
    brand: 'LG', applianceType: 'susicka', code: 'D80',
    title: 'Ucpání výfukové hadice 80 % – LG',
    shortMeaning: 'Průtok vzduchu výfukovou hadicí sušičky LG je zablokován z 80 %.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: ['Zkontrolujte a vyčistěte výfukovou hadici', 'Zkontrolujte výfukový otvor zvenku, zda není ucpán', 'Zkontrolujte a vyčistěte filtr chlupů'],
    likelyCauses: ['Ucpaná nebo zmačkaná výfuková hadice', 'Ucpání výfukového otvoru vnějším materiálem', 'Příliš dlouhá nebo svinutá výfuková hadice'],
    whenToStopAndCallService: ['Pokud přetrvává po vyčištění hadice'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['Výfuková hadice'],
    faq: [{ q: 'Co znamená D80 na sušičce LG?', a: 'D80 znamená, že výfuková hadice je ucpána přibližně z 80 %. Sušička omezuje výkon pro prevenci přehřátí. Vyčistěte výfukovou hadici a zkontrolujte, zda není zalomená nebo příliš dlouhá (max. doporučená délka je dle modelu).' }],
    sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'susicka', code: 'D90',
    title: 'Ucpání výfukové hadice 90 % – LG',
    shortMeaning: 'Průtok vzduchu výfukovou hadicí sušičky LG je zablokován z 90 % – výrazné omezení výkonu.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: ['Ihned vyčistěte výfukovou hadici a výfukový otvor', 'Zkontrolujte délku a ohyby hadice', 'Vyčistěte filtr chlupů'],
    likelyCauses: ['Silně ucpaná výfuková hadice', 'Příliš mnoho ohybů nebo příliš dlouhá hadice', 'Ucpání vnějšího ventilačního otvoru'],
    whenToStopAndCallService: ['Pokud přetrvává po kompletním vyčištění výfukové cesty'],
    relatedSymptoms: ['susicka-nesuší', 'susicka-se-prehriva'], possibleParts: ['Výfuková hadice'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'susicka', code: 'tE',
    title: 'Chyba teplotního senzoru sušičky – LG',
    shortMeaning: 'Teplotní senzor sušičky LG je vadný nebo nereaguje.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný NTC termistor', 'Přerušené vedení', 'Vadná řídicí deska'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['susicka-se-prehriva'], possibleParts: ['NTC senzor teploty', 'Hlavní deska'],
    faq: [], sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'susicka', code: 'FE',
    title: 'Chyba motoru ventilátoru sušičky – LG',
    shortMeaning: 'Motor ventilátoru sušičky LG je vadný nebo zablokovaný.',
    severityLevel: 3, canUserTrySafeChecks: false, safeChecks: [],
    likelyCauses: ['Vadný motor ventilátoru', 'Cizí předmět blokující ventilátor', 'Ucpaný filtr způsobující přetížení'],
    whenToStopAndCallService: ['Ihned'],
    relatedSymptoms: ['susicka-nesuší'], possibleParts: ['Motor ventilátoru', 'Ventilátor'],
    faq: [], sourceType: 'official',
  },

  // ===== AEG PRAČKY – chybějící kódy od výrobce =====
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E30',
    title: 'Detekce úniku vody do základny (AquaStop) – AEG',
    shortMeaning: 'Pračka AEG detekovala vodu ve spodní vaně – aktivoval se systém ochrany proti zaplavení (AquaStop).',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte přívodní hadici – přesvědčte se, zda nejsou viditelné kapky nebo vlhkost v místech napojení.',
      'Nakloňte pračku dozadu o 10–15 cm, podržte 30–40 sekund, aby voda vytekla ze spodní vany, a vraťte pračku do roviny.',
      'Zkontrolujte těsnění dveří – prohlédněte gumový manžon, zda není prasklý nebo poškozený.',
      'Vyčistěte filtry přívodní hadice na obou koncích (u ventilu i u pračky).',
    ],
    likelyCauses: ['Únik vody z přívodní nebo odpadní hadice', 'Poškozené těsnění bubnu nebo dveří', 'Přetečení bubnu při nadměrném pěnění', 'Vadná pumpa'],
    whenToStopAndCallService: ['Pokud po naklonění a kontrole hadic chyba přetrvává', 'Pokud je viditelná voda pod pračkou nebo z pračky vytéká'],
    relatedSymptoms: ['pracka-tece', 'voda-pod-prackou'],
    possibleParts: ['Těsnění dveří', 'Přívodní hadice', 'Odpadní hadice', 'Pumpa'],
    faq: [
      { q: 'Co znamená kód E30 na pračce AEG?', a: 'E30 signalizuje, že systém AquaStop detekoval vodu ve spodní vaně pračky. Nakloňte pračku dozadu, aby voda vytekla, a zkontrolujte hadice a těsnění dveří.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },
  {
    brand: 'AEG', applianceType: 'pracka', code: 'EH0',
    title: 'Chyba napájení – nestabilní síťové napětí (AEG)',
    shortMeaning: 'Pračka AEG detekovala problém se síťovým napájením – napětí je mimo povolený rozsah.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte, zda zástrčka pračky pevně sedí v zásuvce.',
      'Zkuste zapojit pračku do jiné zásuvky.',
      'Zkontrolujte pojistky v rozvaděči domácnosti.',
      'Nepoužívejte prodlužovací kabel – pračka musí být zapojena přímo do zásuvky.',
    ],
    likelyCauses: ['Nestabilní nebo přerušované síťové napětí', 'Vadná zásuvka', 'Porucha řídicí desky', 'Přepětí nebo podpětí v síti'],
    whenToStopAndCallService: ['Pokud ostatní spotřebiče fungují normálně a chyba přetrvává', 'Při opakovaném výskytu bez zjevné příčiny'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska', 'Napájecí modul'],
    faq: [
      { q: 'Co znamená EH0 na pračce AEG?', a: 'EH0 znamená chybu napájení – pračka detekovala nestabilní nebo nesprávné síťové napětí. Zkontrolujte přívodní zásuvku a pojistky.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },
  {
    brand: 'AEG', applianceType: 'pracka', code: 'E60',
    title: 'Chyba ohřevu vody – topné těleso (AEG)',
    shortMeaning: 'Pračka AEG nedokáže ohřát vodu na požadovanou teplotu – problém s topným tělesem nebo jeho řízením.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Spusťte program bez ohřevu (studená voda) – pokud proběhne, potvrzuje to problém s topením.',
      'Zkontrolujte, zda je přívod vody studená (teplá voda z kohoutku může způsobit chybu ohřevu).',
    ],
    likelyCauses: ['Vadné topné těleso', 'Vadný NTC senzor teploty', 'Přerušené vedení k topnému tělesu', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – topné těleso vyžaduje odbornou výměnu'],
    relatedSymptoms: ['pracka-nepere-spravne', 'studena-voda'],
    possibleParts: ['Topné těleso', 'NTC senzor teploty', 'Řídicí deska'],
    faq: [
      { q: 'Jaký je rozdíl mezi E60, E61 a E62 na pračce AEG?', a: 'E60 je obecná chyba ohřevu. E61 a E62 jsou podrobnější kódy – E61 signalizuje nedostatečný ohřev, E62 pak přehřátí vody.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },

  // ===== ELECTROLUX PRAČKY – chybějící kódy od výrobce =====
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E30',
    title: 'Detekce úniku vody do základny – Electrolux',
    shortMeaning: 'Pračka Electrolux detekovala vodu ve spodní vaně – aktivoval se protizáplavový systém.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte přívodní hadici – přesvědčte se, zda nejsou viditelné kapky nebo vlhkost v místech napojení.',
      'Nakloňte pračku dozadu o 10–15 cm, podržte 30–40 sekund, aby voda vytekla ze spodní vany, a vraťte pračku do roviny.',
      'Zkontrolujte těsnění dveří – prohlédněte gumový manžon, zda není prasklý nebo poškozený.',
      'Vyčistěte filtry přívodní hadice na obou koncích.',
    ],
    likelyCauses: ['Únik vody z přívodní nebo odpadní hadice', 'Poškozené těsnění bubnu nebo dveří', 'Přetečení bubnu při nadměrném pěnění', 'Vadná pumpa'],
    whenToStopAndCallService: ['Pokud po naklonění a kontrole hadic chyba přetrvává', 'Pokud je voda viditelná pod pračkou'],
    relatedSymptoms: ['pracka-tece', 'voda-pod-prackou'],
    possibleParts: ['Těsnění dveří', 'Přívodní hadice', 'Odpadní hadice', 'Pumpa'],
    faq: [
      { q: 'Co znamená E30 na pračce Electrolux?', a: 'E30 signalizuje, že protizáplavový systém detekoval vodu ve spodní vaně. Nakloňte pračku dozadu, zkontrolujte hadice a těsnění dveří.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://support.electrolux.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'E50',
    title: 'Chyba motoru – Electrolux',
    shortMeaning: 'Motor pračky Electrolux hlásí poruchu – buben se neotáčí nebo se otáčí nepravidelně.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadné uhlíkové kartáče motoru', 'Vadný tacho senzor motoru', 'Přerušené vedení k motoru', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – vyžaduje odbornou diagnostiku a servis'],
    relatedSymptoms: ['buben-se-neotaci'],
    possibleParts: ['Motor', 'Uhlíkové kartáče motoru', 'Tacho senzor', 'Řídicí deska'],
    faq: [
      { q: 'Co znamená E50 na pračce Electrolux?', a: 'E50 signalizuje poruchu motoru nebo tachogenerátoru. Vyžaduje odborný servis – diagnostiku a případnou výměnu motoru nebo kartáčů.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://support.electrolux.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },
  {
    brand: 'Electrolux', applianceType: 'pracka', code: 'EH0',
    title: 'Chyba napájení – Electrolux',
    shortMeaning: 'Pračka Electrolux detekovala problém se síťovým napájením.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte zástrčku a zásuvku.',
      'Zkuste jinou zásuvku.',
      'Zkontrolujte pojistky v rozvaděči.',
      'Nepoužívejte prodlužovací kabel.',
    ],
    likelyCauses: ['Nestabilní síťové napětí', 'Vadná zásuvka', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Pokud ostatní spotřebiče fungují a chyba přetrvává'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska', 'Napájecí modul'],
    faq: [],
    sourceType: 'official',
    sourceUrl: 'https://support.electrolux.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it',
  },

  // ===== BOSCH PRAČKY – chybějící kódy =====
  {
    brand: 'Bosch', applianceType: 'pracka', code: 'E20', altCodes: ['F20'],
    title: 'Nečekaný ohřev vody – Bosch',
    shortMeaning: 'Pračka Bosch detekovala nečekaný ohřev vody mimo program – topné těleso se zapíná i při studených programech.',
    severityLevel: 4, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Zkratovaný triak topného tělesa na řídicí desce', 'Vadná řídicí deska', 'Vadný NTC senzor teploty'],
    whenToStopAndCallService: ['Ihned – hrozí poškození prádla nebo požár'],
    relatedSymptoms: ['pracka-nepere-spravne'],
    possibleParts: ['Řídicí deska', 'Triak topného tělesa', 'NTC senzor teploty'],
    faq: [
      { q: 'Co znamená E20 nebo F20 na pračce Bosch?', a: 'E20/F20 signalizuje nečekaný ohřev – topné těleso se zapíná i kdy nemá. Jde zpravidla o zkratovaný triak na řídicí desce. Vyžaduje odborný servis.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://www.bosch-home.com/us/owner-support/error-codes/washers',
  },

  // ===== SAMSUNG PRAČKY – chybějící kódy =====
  {
    brand: 'Samsung', applianceType: 'pracka', code: '4C2', altCodes: ['4E2'],
    title: 'Chyba teploty přiváděné vody – Samsung',
    shortMeaning: 'Pračka Samsung detekovala nesprávnou teplotu přívodní vody – pravděpodobně jsou prohozeny přívodní hadice teplé a studené vody.',
    severityLevel: 2, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte, zda jsou hadice přívodu vody správně zapojeny – studená voda do modrého a teplá do červeného ventilu.',
      'Pokud pračka má pouze studený přívod, zkontrolujte, zda není omylem zapojena do teplé vody.',
    ],
    likelyCauses: ['Prohozené přívodní hadice (teplá/studená)', 'Příliš horká přívodní voda', 'Vadný senzor teploty vody'],
    whenToStopAndCallService: ['Pokud hadice jsou správně zapojeny a chyba přetrvává'],
    relatedSymptoms: ['pracka-se-neplni'],
    possibleParts: ['Přívodní hadice', 'Senzor teploty vody'],
    faq: [
      { q: 'Co znamená 4C2 nebo 4E2 na pračce Samsung?', a: '4C2/4E2 signalizuje problém s teplotou přívodní vody. Nejčastěji jsou prohozeny hadice teplé a studené vody.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: '9C1', altCodes: ['9E1', '9C2', '9E2'],
    title: 'Chyba napájení – nízké nebo nestabilní napětí (Samsung)',
    shortMeaning: 'Pračka Samsung detekovala nízké nebo nestabilní síťové napětí.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte, zda zástrčka pevně sedí v zásuvce.',
      'Nepoužívejte prodlužovací kabel ani rozdvojku.',
      'Zkontrolujte pojistky v rozvaděči.',
      'Zkuste spotřebič zapojit do jiné zásuvky.',
    ],
    likelyCauses: ['Nízké síťové napětí', 'Přetížená elektrická síť v domácnosti', 'Vadná zásuvka', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Pokud ostatní spotřebiče fungují normálně a chyba přetrvává'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska', 'Napájecí modul'],
    faq: [
      { q: 'Co znamená 9C1, 9E1 nebo 9C2 na pračce Samsung?', a: 'Tyto kódy signalizují nízké nebo nestabilní napětí sítě. Zkontrolujte zásuvku a zda pračku nezapojujete přes prodlužovací kabel.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'AC6', altCodes: ['AE6'],
    title: 'Chyba komunikace invertoru – Samsung',
    shortMeaning: 'Problém s komunikací mezi řídicí deskou a invertorem motoru pračky Samsung.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Vypněte pračku, odpojte ze zásuvky na 5 minut a znovu spusťte.',
    ],
    likelyCauses: ['Porucha invertoru motoru', 'Vadná řídicí deska', 'Přerušené propojení mezi deskami'],
    whenToStopAndCallService: ['Pokud chyba přetrvává po restartu'],
    relatedSymptoms: ['buben-se-neotaci'],
    possibleParts: ['Invertor motoru', 'Řídicí deska', 'Propojovací kabel'],
    faq: [],
    sourceType: 'official',
    sourceUrl: 'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'PC', altCodes: ['PE', 'PC1', 'PE1'],
    title: 'Chyba detekce polohy spojky (clutch) – Samsung',
    shortMeaning: 'Pračka Samsung nemůže správně detekovat polohu spojky pohonu bubnu.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadná spojka (clutch)', 'Vadný senzor polohy spojky', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – vyžaduje odbornou diagnostiku'],
    relatedSymptoms: ['buben-se-neotaci'],
    possibleParts: ['Spojka pohonu', 'Senzor polohy spojky', 'Řídicí deska'],
    faq: [],
    sourceType: 'official',
    sourceUrl: 'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
  },
  {
    brand: 'Samsung', applianceType: 'pracka', code: 'DDC', altCodes: ['ddC'],
    title: 'Chyba přídavných dveří (Add Door) – Samsung',
    shortMeaning: 'Přídavné dveře pro přikládání prádla byly otevřeny bez stisknutí tlačítka Start/Pause nebo nebyly správně zavřeny.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: [
      'Zavřete přídavné dveře pevně – musí zaklapnout.',
      'Stiskněte tlačítko Start/Pause před otevřením přídavných dveří.',
    ],
    likelyCauses: ['Přídavné dveře otevřeny nesprávně', 'Vadný zámek přídavných dveří'],
    whenToStopAndCallService: ['Pokud dveře nejdou zavřít nebo zámek nefunguje'],
    relatedSymptoms: [],
    possibleParts: ['Zámek přídavných dveří'],
    faq: [
      { q: 'Co znamená DDC na pračce Samsung?', a: 'DDC signalizuje, že přídavné dveře (Add Door) byly otevřeny nesprávně – buď bez zastavení programu, nebo nebyly správně zavřeny.' },
    ],
    sourceType: 'official',
    sourceUrl: 'https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/',
  },

  // ===== LG PRAČKY – chybějící kódy =====
  {
    brand: 'LG', applianceType: 'pracka', code: 'CE',
    title: 'Chyba proudu motoru – LG',
    shortMeaning: 'Pračka LG detekovala zkrat nebo přetížení v obvodu motoru.',
    severityLevel: 4, canUserTrySafeChecks: true,
    safeChecks: [
      'Snižte náplň bubnu – přetížení motoru může způsobit zkrat obvodu.',
      'Vypněte pračku, odpojte ze zásuvky na 10 minut a znovu spusťte.',
    ],
    likelyCauses: ['Přetížený motor', 'Zkrat v obvodu motoru', 'Vadná řídicí deska', 'Vadný invertor motoru'],
    whenToStopAndCallService: ['Pokud chyba přetrvává po restartu a snížení náplně'],
    relatedSymptoms: ['buben-se-neotaci'],
    possibleParts: ['Motor', 'Invertor motoru', 'Řídicí deska'],
    faq: [
      { q: 'Co znamená CE na pračce LG?', a: 'CE signalizuje chybu proudu motoru – buď přetížení, nebo zkrat. Zkuste snížit množství prádla a restartovat.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'HE',
    title: 'Chyba ohřevu vody – LG',
    shortMeaning: 'Pračka LG nedokáže ohřát vodu na požadovanou teplotu.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte, zda je přívod studené vody správně zapojen.',
      'Spusťte program bez ohřevu – pokud proběhne, potvrzuje to problém s topením.',
    ],
    likelyCauses: ['Vadné topné těleso', 'Vadný teplotní senzor (NTC)', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Ihned – topné těleso vyžaduje odbornou výměnu'],
    relatedSymptoms: ['pracka-nepere-spravne', 'studena-voda'],
    possibleParts: ['Topné těleso', 'NTC senzor teploty', 'Řídicí deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'LG', applianceType: 'pracka', code: 'SUD',
    title: 'Příliš mnoho pěny – LG',
    shortMeaning: 'Pračka LG detekovala nadměrné pěnění – pravděpodobně příliš mnoho nebo nevhodný prací prostředek.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: [
      'Počkejte – pračka automaticky přidá oplachový cyklus pro odstranění pěny.',
      'Příště používejte méně pracího prostředku nebo prostředek označený HE (High Efficiency).',
      'Nepoužívejte běžný prací prášek v pračkách front-load.',
    ],
    likelyCauses: ['Příliš mnoho pracího prostředku', 'Nevhodný prací prostředek (ne HE)', 'Zbytky detergentů v bubnu'],
    whenToStopAndCallService: [],
    relatedSymptoms: [],
    possibleParts: [],
    faq: [
      { q: 'Co znamená SUD na pračce LG?', a: 'SUD signalizuje příliš mnoho pěny. Pračka sama přidá oplach. Příště použijte méně pracího prostředku nebo prostředek HE.' },
    ],
    sourceType: 'official',
  },

  // ===== BEKO PRAČKY – chybějící kódy =====
  {
    brand: 'Beko', applianceType: 'pracka', code: 'EH0',
    title: 'Chyba napájení – nestabilní napětí (Beko)',
    shortMeaning: 'Pračka Beko detekovala problém se síťovým napájením – napětí je mimo povolený rozsah.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte zástrčku a zásuvku.',
      'Zkuste jinou zásuvku.',
      'Zkontrolujte pojistky v rozvaděči.',
      'Nepoužívejte prodlužovací kabel.',
    ],
    likelyCauses: ['Nestabilní síťové napětí', 'Vadná zásuvka', 'Přetížená elektrická síť'],
    whenToStopAndCallService: ['Pokud ostatní spotřebiče fungují a chyba přetrvává'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska', 'Napájecí modul'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'EH1',
    title: 'Frekvence sítě mimo rozsah – Beko',
    shortMeaning: 'Pračka Beko detekovala, že frekvence elektrické sítě je mimo povolený rozsah (50 Hz ± odchylka).',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: ['Zkuste zapojit do jiné zásuvky.', 'Zkontrolujte, zda v domácnosti nefunguje zdroj způsobující rušení sítě.'],
    likelyCauses: ['Nestabilní frekvence sítě', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Pokud přetrvává'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'EF0',
    title: 'Nadměrná pěna nebo únik vody – Beko',
    shortMeaning: 'Pračka Beko detekovala nadměrné pěnění nebo únik vody do základny přístroje.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Pokud jde o pěnu: použijte méně pracího prostředku nebo prostředek určený pro automatické pračky.',
      'Nakloňte pračku dozadu a zkontrolujte, zda není voda v základně.',
      'Zkontrolujte těsnění dveří a přívodní hadice.',
    ],
    likelyCauses: ['Příliš mnoho pracího prostředku', 'Nevhodný prací prostředek', 'Únik z hadice nebo těsnění'],
    whenToStopAndCallService: ['Pokud je voda fyzicky viditelná pod pračkou', 'Pokud se opakuje bez nadměrného detergentnu'],
    relatedSymptoms: ['pracka-tece'],
    possibleParts: ['Těsnění dveří', 'Přívodní hadice', 'Čerpadlo'],
    faq: [
      { q: 'Co znamená EF0 na pračce Beko?', a: 'EF0 signalizuje buď nadměrnou pěnu (použijte méně detergenttu), nebo únik vody do základny stroje.' },
    ],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'EA0',
    title: 'Chyba senzoru polohy bubnu (DPS) – Beko',
    shortMeaning: 'Senzor polohy bubnu (Drum Position Sensor) pračky Beko nefunguje správně.',
    severityLevel: 3, canUserTrySafeChecks: false,
    safeChecks: [],
    likelyCauses: ['Vadný DPS senzor', 'Porucha řídicí desky', 'Přerušené vedení senzoru'],
    whenToStopAndCallService: ['Ihned – vyžaduje odbornou diagnostiku a výměnu senzoru'],
    relatedSymptoms: ['buben-se-neotaci'],
    possibleParts: ['DPS senzor polohy bubnu', 'Řídicí deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'Eb0',
    title: 'Nízké síťové napětí – Beko',
    shortMeaning: 'Síťové napětí je pod povolenou hranicí – pračka Beko se odmítá spustit z bezpečnostních důvodů.',
    severityLevel: 3, canUserTrySafeChecks: true,
    safeChecks: [
      'Zkontrolujte zástrčku a zásuvku.',
      'Zkuste zapojit do jiné zásuvky.',
      'Zkontrolujte pojistky v rozvaděči.',
    ],
    likelyCauses: ['Nízké napětí v síti', 'Přetížená elektrická síť', 'Vadná zásuvka'],
    whenToStopAndCallService: ['Pokud ostatní spotřebiče fungují a chyba přetrvává'],
    relatedSymptoms: ['pracka-nespusti'],
    possibleParts: ['Řídicí deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'E80',
    title: 'Chyba programátoru – nesprávné nastavení (Beko)',
    shortMeaning: 'Volič programu byl nastaven do neplatné pozice nebo přepnut během běžícího programu.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: [
      'Otočte volič programu do výchozí polohy (Off) a znovu vyberte program.',
      'Nepřepínejte program za chodu pračky.',
    ],
    likelyCauses: ['Chybné nastavení programu uživatelem', 'Vadný rotační encoder voliče', 'Porucha řídicí desky'],
    whenToStopAndCallService: ['Pokud volič nereaguje správně ani po restartu'],
    relatedSymptoms: [],
    possibleParts: ['Volič programu (encoder)', 'Řídicí deska'],
    faq: [],
    sourceType: 'official',
  },
  {
    brand: 'Beko', applianceType: 'pracka', code: 'C9', altCodes: ['F9'],
    title: 'Nevyvážený buben při odstřeďování – Beko',
    shortMeaning: 'Pračka Beko detekovala nevyvážené prádlo při odstřeďování a zastavila nebo zpomalila buben.',
    severityLevel: 1, canUserTrySafeChecks: true,
    safeChecks: [
      'Otevřete dveře a ručně rovnoměrně rozmístěte prádlo v bubnu.',
      'Neperte příliš malé množství prádla – jeden kus těžkého prádla se těžko vyvažuje.',
      'Přidejte do bubnu ručník nebo podobný kus pro lepší rozložení.',
    ],
    likelyCauses: ['Nevyvážené prádlo v bubnu', 'Příliš malá náplň', 'Jeden velký těžký kus prádla', 'Vadné tlumení (tlumiče)'],
    whenToStopAndCallService: ['Pokud se nevyváženost opakuje při normální náplni', 'Pokud pračka nadměrně vibruje a pohybuje se'],
    relatedSymptoms: ['pracka-trese'],
    possibleParts: ['Tlumiče', 'Pružiny bubnu', 'Protiváha'],
    faq: [
      { q: 'Co znamená C9 nebo F9 na pračce Beko?', a: 'C9/F9 signalizuje nevyvážený buben při odstřeďování. Otevřete pračku a ručně rovnoměrně rozdistribuujte prádlo.' },
    ],
    sourceType: 'official',
  },
]

// Přiřazení subtype podle kódu a applianceType
// Sušičky: rozlišujeme odtahová / kondenzační / tepelné čerpadlo
// Pračky: předně / vrchem plněná
function resolveSubtype(c: CodeDef): string | null {
  if (c.subtype) return c.subtype  // explicitně nastavený subtype má přednost
  if (c.applianceType === 'mycka') return null

  if (c.applianceType === 'pracka') {
    return c.subtype || 'predni-plneni'
  }

  if (c.applianceType === 'susicka') {
    if (c.subtype) return c.subtype
    // Kódy specifické pro odtahovou sušičku (výfuk vzduchu ven)
    const odtahovaKeywords = ['výfuk', 'odtah', 'venting', 'exhaust']
    if (odtahovaKeywords.some(k => c.title.toLowerCase().includes(k) || c.shortMeaning.toLowerCase().includes(k))) {
      return 'odtahova'
    }
    // Kódy zmiňující kondenzátor → kondenzační nebo tepelné čerpadlo
    const kondenzacniKeywords = ['kondenzátor', 'kondenzac']
    if (kondenzacniKeywords.some(k =>
      [...c.safeChecks, ...c.likelyCauses, c.shortMeaning, c.title]
        .join(' ').toLowerCase().includes(k)
    )) {
      return 'kondenzacni'
    }
    // Výchozí: kondenzační (nejrozšířenější typ)
    return 'kondenzacni'
  }

  return null
}

// Specifické přiřazení subtype pro vybrané kódy sušiček
const susickaSubtypeOverrides: Record<string, string> = {
  // Kódy tepelného čerpadla (heat pump) – složitější elektronika, jiné chybové kódy
  'bosch-susicka-e02': 'kondenzacni',      // zmiňuje kondenzátor
  'siemens-susicka-e62': 'kondenzacni',    // zmiňuje kondenzátor
  'aeg-susicka-e5e': 'odtahova',           // výfukový vzduch = odtahová
  'aeg-susicka-ehe': 'kondenzacni',
  'electrolux-susicka-e51': 'kondenzacni',
  'electrolux-susicka-e52': 'kondenzacni',
  'samsung-susicka-he': 'kondenzacni',
  'samsung-susicka-fe': 'kondenzacni',
  'beko-susicka-h01': 'kondenzacni',
  'beko-susicka-h02': 'kondenzacni',
  'beko-susicka-h05': 'kondenzacni',
  // Whirlpool sušičky – základní modely jsou kondenzační nebo odtahové
  'whirlpool-susicka-f01': 'kondenzacni',
  'whirlpool-susicka-f02': 'kondenzacni',
  'whirlpool-susicka-f03': 'kondenzacni',
  'whirlpool-susicka-f04': 'kondenzacni',
  'whirlpool-susicka-f05': 'kondenzacni',
  // LG sušičky – D80/D90 jsou specifické pro odtahové modely
  'lg-susicka-d80': 'odtahova',
  'lg-susicka-d90': 'odtahova',
  'lg-susicka-te': 'kondenzacni',
  'lg-susicka-fe': 'kondenzacni',
}

async function main() {
  const allCodes = [...codes, ...additionalCodes]

  console.log(`Seeding ${allCodes.length} error codes...`)

  for (const c of allCodes) {
    const slug = slugify(`${c.brand}-${c.applianceType}-${c.code}`)

    // Subtype: explicitní má přednost, pak override mapa, pak automatické rozlišení
    const subtype = c.subtype ? c.subtype : (susickaSubtypeOverrides[slug] ?? resolveSubtype(c))

    // Build relatedCodes slugs for same brand+applianceType+subtype
    const relatedCodes = allCodes
      .filter(
        (other) =>
          other !== c &&
          other.brand === c.brand &&
          other.applianceType === c.applianceType
      )
      .slice(0, 3)
      .map((other) => slugify(`${other.brand}-${other.applianceType}-${other.code}`))

    await prisma.errorCode.upsert({
      where: { slug },
      update: {
        ...c,
        code: c.code.toUpperCase(),
        altCodes: c.altCodes || [],
        faq: c.faq as object[],
        relatedCodes,
        slug,
        subtype,
      },
      create: {
        ...c,
        code: c.code.toUpperCase(),
        altCodes: c.altCodes || [],
        faq: c.faq as object[],
        relatedCodes,
        slug,
        subtype,
      },
    })
    process.stdout.write('.')
  }

  console.log(`\n✓ Seeded ${allCodes.length} codes`)

  // Seed symptoms
  type Section = { q: string; answer: string; tips?: string[]; steps?: string[] }
  type SymptomDef = {
    slug: string; title: string; description: string; intro?: string
    sections?: Section[]; relatedCodes: string[]; applianceTypes: string[]
  }

  const symptoms: SymptomDef[] = [
    {
      slug: 'pracka-zapacha',
      title: 'Pračka zapáchá',
      description: 'Z pračky nebo z prádla vychází nepříjemný zápach.',
      intro: 'Nepříjemný zápach z pračky je jedním z nejčastějších problémů domácích spotřebičů. Většinou ho způsobuje plíseň nebo bakterie uvnitř bubnu a těsnění dvířek – a ve většině případů ho zvládnete odstranit sami.',
      sections: [
        {
          q: 'Jak rychle odstranit zápach z pračky?',
          answer: 'Zapněte pračku naprázdno na nejvyšší teplotu (90 °C) a přidejte do zásobníku univerzální prací prostředek nebo speciální čistič pračky. Horká voda zabije bakterie a plíseň uvnitř bubnu.',
          tips: [
            'Po každém praní nechávejte dvířka i zásobník na prací prostředek otevřené – vlhkost se rychleji odpaří.',
            'Gumové těsnění dvířek pravidelně otírejte vlhkým hadříkem, zejména v záhybech.',
            'Jednou za měsíc spusťte čisticí program nebo program na 90 °C naprázdno.',
          ],
        },
        {
          q: 'Proč pračka vůbec zapáchá?',
          answer: 'Příčinou bývá nejčastěji příliš šetrné praní. Pokud perete pouze při nízkých teplotách (30–40 °C), bakterie a plíseň se v pračce množí. Problém zhoršuje i přemíra pracího prostředku, která zanechává zbytky v bubnu a hadicích.',
          tips: [
            'Ručníky, povlečení a kuchyňské utěrky perte na 60–90 °C.',
            'Používejte doporučené množství pracího prostředku – více neznamená čistěji.',
            'Filtr na odpadní vodě čistěte aspoň jednou za 3 měsíce.',
          ],
        },
        {
          q: 'Jak vyčistit ucpaný filtr pračky?',
          answer: 'Zanesený filtr je jednou z nejčastějších příčin zápachu i poruch odvodnění. Čištění zvládnete sami bez nářadí za pár minut.',
          steps: [
            'Najděte filtr ve spodní části pračky – většinou se skrývá za malými dvířky nebo krytem.',
            'Přiložte pod filtr nádobu nebo ručník – vyteče trochu vody.',
            'Pomalu vyšroubujte filtr a vyjměte ho.',
            'Propláchněte filtr pod tekoucí vodou a odstraňte nečistoty.',
            'Zašroubujte filtr zpět a zavřete kryt.',
          ],
          tips: ['Čištění opakujte přibližně jednou za 3 měsíce.'],
        },
      ],
      relatedCodes: ['bosch-pracka-e18', 'beko-pracka-ef'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'pracka-trese',
      title: 'Pračka se třese a hlučí',
      description: 'Pračka při odstřeďování silně vibruje, pohybuje se nebo vydává hlasitý hluk.',
      intro: 'Silné vibrace nebo hluk při odstřeďování nejsou jen nepříjemné – mohou signalizovat závadu, která se časem zhorší. Většinou ale jde o jednoduše řešitelné příčiny.',
      sections: [
        {
          q: 'Proč pračka silně vibruje?',
          answer: 'Nejčastější příčinou jsou nerovnoměrně rozložené prádlo v bubnu, příliš malá nebo příliš velká náplň nebo nevyrovnaná pračka. Méně časté, ale závažnější příčinou jsou opotřebované tlumiče nebo ložiska bubnu.',
          tips: [
            'Při malém množství prádla jsou vibrace obvyklé – přidejte další kusy.',
            'Prádlo vkládejte rovnoměrně, nevhazujte vše na jednu stranu.',
            'Zkontrolujte, že pračka stojí rovně – nastavte nožičky a ověřte vodováhou.',
            'Mezi pračkou a stěnou nechávejte aspoň 2 cm prostor.',
          ],
        },
        {
          q: 'Proč pračka hlučí jako buben?',
          answer: 'Hluk podobný klapání nebo hrkání bývá způsoben cizími předměty v bubnu – mincemi, knoflíky nebo sponkami. Tyto předměty se při odstřeďování dostávají mezi buben a plášť.',
          steps: [
            'Zastavte pračku a zkontrolujte buben i kapsy oblečení.',
            'Zkontrolujte filtr – cizí předměty ho mohou ucpávat.',
            'Pokud hluk přetrvává i po odstranění předmětů, může jít o opotřebovaná ložiska – zavolejte technika.',
          ],
        },
        {
          q: 'Co dělat, když pračka při odstřeďování poskakuje?',
          answer: 'Pračka se pohybuje po podlaze nejčastěji kvůli nevyrovnaným nožičkám nebo tvrdému kluzkému povrchu.',
          tips: [
            'Nastavte nožičky pračky tak, aby všechny pevně seděly na podlaze.',
            'Pod pračku položte protiskluzovou podložku.',
            'Zkontrolujte, zda není pračka opřena o boční stěnu nebo nábytek.',
          ],
        },
      ],
      relatedCodes: ['samsung-pracka-ub', 'bosch-pracka-e27'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'pracka-tece',
      title: 'Voda vytéká z pračky',
      description: 'Pod pračkou nebo z pračky vytéká voda.',
      intro: 'Voda pod pračkou je vždy důvodem k okamžité akci – i malý únik může poškodit podlahu nebo způsobit zkrat. Zjistěte, kde voda teče, a většinu příčin zvládnete opravit sami.',
      sections: [
        {
          q: 'Proč voda vytéká z pračky?',
          answer: 'Nejčastější příčiny jsou uvolněná nebo poškozená odpadní hadice, ucpaný filtr, přetékání pěny kvůli přemíře pracího prostředku nebo poškozené těsnění dvířek.',
          tips: [
            'Zkontrolujte odpadní hadici – zda není natržená, uvolněná nebo ohnutá.',
            'Zkontrolujte přívodní hadici a její spojení s ventilem.',
            'Snižte množství pracího prostředku – nadměrná pěna přetéká přes těsnění.',
          ],
        },
        {
          q: 'Co dělat, když voda teče zespodu pračky?',
          answer: 'Voda vytékající zespodu bývá způsobena ucpaným nebo uvolněným filtrem, prasklou hadicí uvnitř pračky nebo aktivovaným protizáplavovým systémem (Aquastop).',
          steps: [
            'Okamžitě vypněte pračku a zavřete přívod vody.',
            'Zkontrolujte a vyčistěte filtr ve spodní části pračky.',
            'Prohlédněte odpadní a přívodní hadici zezadu.',
            'Pokud voda teče i po kontrole hadicí, volejte technika – může jít o vnitřní poruchu.',
          ],
        },
        {
          q: 'Proč pračka přetéká pěnou?',
          answer: 'Přemíra pracího prostředku je nejčastější příčinou pěnění. Moderní pračky spotřebovávají velmi málo vody, takže stačí malé množství detergentu.',
          tips: [
            'Používejte dávkování dle pokynů na obalu – obvykle méně, než si myslíte.',
            'Pro předem plněné pračky používejte prací prostředky označené „HE" (High Efficiency).',
            'Spusťte pračku naprázdno na 90 °C pro odstraněné zbytků pěny.',
          ],
        },
      ],
      relatedCodes: ['bosch-pracka-e23', 'electrolux-pracka-ef0', 'beko-pracka-ef'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'pracka-se-neplni',
      title: 'Pračka se neplní vodou',
      description: 'Pračka nezačne plnit vodou nebo plnění trvá příliš dlouho.',
      intro: 'Pokud pračka nezačne nabírat vodu nebo program se zasekne hned na začátku, problém bývá nejčastěji mechanický a snadno opravitelný.',
      sections: [
        {
          q: 'Proč pračka nenabírá vodu?',
          answer: 'Příčinou může být zavřený přívod vody, ohnutá nebo ucpaná přívodní hadice, zanesený filtr na hadici nebo závada na elektromagnetickém ventilu.',
          steps: [
            'Zkontrolujte, zda je kohout přívodu vody otevřený.',
            'Ověřte, zda přívodní hadice není ohnutá nebo zmáčknutá.',
            'Vyšroubujte přívodní hadici z pračky a zkontrolujte filtrační síťku na konci hadice – je-li zanesená, propláchněte ji.',
            'Zkontrolujte, zda jsou řádně zavřená dvířka pračky.',
          ],
          tips: ['Pokud voda neteče vůbec, zkuste otevřít jiný kohout v domácnosti – může být výpadek tlaku vody.'],
        },
        {
          q: 'Proč pračka nabírá vodu velmi pomalu?',
          answer: 'Pomalé plnění způsobuje nejčastěji nízký tlak vody, zanesený filtr na přívodní hadici nebo částečně zavřený kohout.',
          tips: [
            'Vyčistěte filtrační síťku na přívodní hadici.',
            'Zkontrolujte tlak vody v domácnosti – doporučený tlak je 0,5–10 bar.',
            'Ujistěte se, že je kohout zcela otevřený.',
          ],
        },
      ],
      relatedCodes: ['bosch-pracka-e17', 'siemens-pracka-f17', 'samsung-pracka-4e'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'pracka-nevypousti',
      title: 'Pračka nevypouští vodu',
      description: 'Po skončení praní zůstane voda v bubnu.',
      intro: 'Voda, která zůstane v bubnu po skončení programu, je jedním z nejčastějších problémů pračky. Ve většině případů jde o ucpaný filtr nebo odpadní hadici – oprava trvá jen pár minut.',
      sections: [
        {
          q: 'Proč pračka nevypouští vodu?',
          answer: 'Nejčastější příčiny jsou ucpaný odpadní filtr, ohnutá nebo ucpaná odpadní hadice, nebo závada na odpadním čerpadle.',
          steps: [
            'Vypněte pračku a vyčkejte – buben neotvírejte, dokud se voda nevypustí nebo dokud ji ručně nevyčerpáte.',
            'Otevřete kryt filtru ve spodní části pračky a pomalu vyšroubujte filtr – vyteče zbylá voda.',
            'Vyčistěte filtr a zašroubujte zpět.',
            'Zkontrolujte odpadní hadici – nesmí být ohnutá, ucpaná ani příliš vysoko zapojena (max. 100 cm od podlahy).',
          ],
          tips: ['Filtr čistěte preventivně jednou za 3 měsíce.'],
        },
        {
          q: 'Co dělat, když čerpadlo hučí, ale voda nejde ven?',
          answer: 'Pokud slyšíte čerpadlo pracovat, ale voda nevychází, pravděpodobně je ucpaný filtr nebo v čerpadle uvízl cizí předmět (mince, knoflík, kůstka z podprsenky).',
          tips: [
            'Po vyčištění filtru spusťte krátký program a sledujte, zda voda odtéká.',
            'Pokud problém přetrvává, může být vadné čerpadlo – zavolejte technika.',
          ],
        },
      ],
      relatedCodes: ['bosch-pracka-e18', 'siemens-pracka-f18', 'samsung-pracka-5e'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'pracka-nespusti',
      title: 'Pračka nespustí program',
      description: 'Pračka nereaguje na spuštění programu.',
      sections: [
        {
          q: 'Proč pračka nespustí?',
          answer: 'Nejčastější příčiny jsou nedomknutá dvířka, aktivovaná dětská pojistka, přerušené napájení nebo chyba v elektrické síti.',
          tips: [
            'Pevně zavřete dvířka – musíte slyšet cvaknutí zámku.',
            'Zkontrolujte, zda není zapnutá dětská pojistka (bývá kombinace tlačítek, viz návod).',
            'Zkuste pračku odpojit na 1–2 minuty od sítě a znovu zapojit.',
            'Zkontrolujte jistič v rozvaděči.',
          ],
        },
      ],
      relatedCodes: ['bosch-pracka-e27', 'samsung-pracka-de'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'buben-se-neotaci',
      title: 'Buben pračky se neotáčí',
      description: 'Buben pračky se neotáčí nebo se otáčí nepravidelně.',
      sections: [
        {
          q: 'Proč se buben pračky neotáčí?',
          answer: 'Příčinou může být přetržený nebo sklouzlý klínový řemen (u starších modelů), závada na motoru, přeplnění bubnu nebo uchaný cizí předmět mezi bubnem a pláštěm.',
          tips: [
            'Zkontrolujte, zda v bubnu nejsou cizí předměty (mince, knoflíky).',
            'Zkuste snížit náplň prádla – přeplnění brání otáčení.',
            'Pokud buben nejde pohnout ani ručně, volejte technika – pravděpodobně jde o zaseklý předmět nebo vadné ložisko.',
          ],
        },
      ],
      relatedCodes: ['siemens-pracka-f21', 'samsung-pracka-3e'],
      applianceTypes: ['pracka'],
    },
    {
      slug: 'mycka-nevypousti',
      title: 'Myčka nevypouští vodu',
      description: 'Po mytí zůstane voda v myčce.',
      sections: [
        {
          q: 'Proč myčka nevypouští vodu?',
          answer: 'Nejčastější příčiny jsou ucpaný filtr myčky, zanesená odpadní hadice nebo závada na odpadním čerpadle.',
          steps: [
            'Vyjměte a vyčistěte filtr na dně myčky – otočte ho doleva a vytáhněte.',
            'Propláchněte filtr pod tekoucí vodou a vraťte zpět.',
            'Zkontrolujte odpadní hadici za myčkou – nesmí být ohnutá.',
            'Pokud problém přetrvává, může být vadné čerpadlo.',
          ],
          tips: ['Filtr čistěte jednou týdně pro prevenci problémů.'],
        },
      ],
      relatedCodes: ['bosch-mycka-e25', 'aeg-mycka-i20'],
      applianceTypes: ['mycka'],
    },
    {
      slug: 'voda-pod-myckou',
      title: 'Voda pod myčkou',
      description: 'Pod myčkou se hromadí voda – příznak úniku.',
      sections: [
        {
          q: 'Proč je pod myčkou voda?',
          answer: 'Únik vody pod myčkou způsobuje nejčastěji uvolněná nebo poškozená hadice, poškozené těsnění dvířek nebo aktivovaný protizáplavový systém (Aquastop).',
          tips: [
            'Zkontrolujte přívodní a odpadní hadici – zda nejsou uvolněné nebo popraskané.',
            'Prohlédněte těsnění dvířek, zda není poškozeno nebo znečištěno.',
            'Pokud je aktivován Aquastop (chyba E15 nebo podobná), vypněte myčku a zavolejte technika.',
          ],
        },
      ],
      relatedCodes: ['bosch-mycka-e15', 'siemens-mycka-e15'],
      applianceTypes: ['mycka'],
    },
    {
      slug: 'mycka-neumyva',
      title: 'Myčka neumývá nádobí',
      description: 'Nádobí vychází z myčky špinavé nebo nezasychá správně.',
      sections: [
        {
          q: 'Proč myčka neumývá správně?',
          answer: 'Nejčastější příčiny jsou ucpaná ramena ostřiku, špatně naplněná myčka, prázdný zásobník soli nebo leštidla, nebo zanesený filtr.',
          steps: [
            'Vyčistěte filtr na dně myčky.',
            'Vyjměte ramena ostřiku a propláchněte trysky (lze použít párátko nebo jehlici).',
            'Doplňte sůl a leštidlo.',
            'Zkontrolujte, zda nádobí neblokuje ramena ostřiku.',
          ],
          tips: [
            'Větší předměty a pánve patří do spodního koše, sklenice do horního.',
            'Nikdy nepřeplňujte myčku – voda se musí dostat ke každému kusu nádobí.',
          ],
        },
      ],
      relatedCodes: ['bosch-mycka-e25', 'aeg-mycka-i30'],
      applianceTypes: ['mycka'],
    },
    {
      slug: 'mycka-zapacha',
      title: 'Myčka zapáchá',
      description: 'Z myčky nebo z nádobí vychází nepříjemný zápach.',
      sections: [
        {
          q: 'Proč myčka zapáchá?',
          answer: 'Příčinou zápachu je nejčastěji zanesený filtr s usazeninami jídla, plíseň na těsnění dvířek nebo zanesená odpadní hadice.',
          steps: [
            'Vyčistěte filtr na dně myčky.',
            'Otřete těsnění dvířek vlhkým hadříkem.',
            'Spusťte prázdnou myčku na nejvyšší teplotu s čisticím přípravkem nebo s octem ve sklenici na dně.',
          ],
          tips: [
            'Po každém mytí nechte dvířka pootevřená, aby se myčka provětrala.',
            'Filtr čistěte jednou týdně.',
          ],
        },
      ],
      relatedCodes: ['bosch-mycka-e25', 'bosch-mycka-e22'],
      applianceTypes: ['mycka'],
    },
    {
      slug: 'susicka-se-prehriva',
      title: 'Sušička se přehřívá',
      description: 'Sušička se přehřívá, vydává pach nebo se automaticky vypíná.',
      sections: [
        {
          q: 'Proč se sušička přehřívá?',
          answer: 'Přehřívání sušičky způsobuje nejčastěji ucpaný filtr chlupů, zanesený kondenzátor (u kondenzačních modelů) nebo špatné větrání místnosti.',
          steps: [
            'Po každém cyklu vyčistěte filtr chlupů – je to nejdůležitější preventivní krok.',
            'Jednou za měsíc vyčistěte kondenzátor (u kondenzačních sušiček) – propláchněte ho pod tekoucí vodou.',
            'Zajistěte dobré větrání místnosti, kde sušička stojí.',
          ],
          tips: ['Nikdy nespouštějte sušičku bez filtru – rychle se zanesou vnitřní části.'],
        },
      ],
      relatedCodes: ['bosch-susicka-e02', 'siemens-susicka-e62'],
      applianceTypes: ['susicka'],
    },
    {
      slug: 'susicka-nesusi',
      title: 'Sušička nesuší prádlo',
      description: 'Prádlo zůstává mokré i po ukončení cyklu sušičky.',
      sections: [
        {
          q: 'Proč sušička nesuší prádlo?',
          answer: 'Nejčastějšími příčinami jsou ucpaný filtr chlupů, zanesený kondenzátor, přeplnění bubnu nebo vadné topné těleso.',
          tips: [
            'Vyčistěte filtr chlupů – zanesený filtr drasticky snižuje výkon sušení.',
            'Nepřeplňujte buben – maximální náplň bývá 7–9 kg, ale pro optimální sušení naplňte na 2/3.',
            'U kondenzačních sušiček vyčistěte kondenzátor.',
            'Zkontrolujte, zda odpadní nádoba na vodu není plná (u kondenzačních sušiček).',
          ],
        },
      ],
      relatedCodes: ['bosch-susicka-e02', 'samsung-susicka-he'],
      applianceTypes: ['susicka'],
    },
  ]

  for (const s of symptoms) {
    await prisma.symptom.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    })
    process.stdout.write('.')
  }

  console.log(`\n✓ Seeded ${symptoms.length} symptoms`)
  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
