/**
 * Obohacení FAQ a safeChecks v DB na základě patterns v likelyCauses.
 * Spuštění: node scripts/enrich-content.mjs
 */

import { execSync } from 'child_process'

const DB = 'postgresql://neondb_owner:npg_B3nPLzkaTUJ4@ep-square-violet-aljwowmf.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'

function psql(query) {
  const result = execSync(`psql "${DB}" -t -A -c ${JSON.stringify(query)}`, { encoding: 'utf8' })
  return result.trim()
}

// --- Klasifikace příčin ---

function classify(causes, code, shortMeaning) {
  const text = (causes.join(' ') + ' ' + code + ' ' + shortMeaning).toLowerCase()
  const has = (...terms) => terms.some(t => text.includes(t))

  // heatpump před drain – "tepelné čerpadlo" by jinak matchovalo 'čerpadl'
  if (has('kompresor', 'chladivo', 'výparník', 'tepelné čerpadlo')) return 'heatpump'
  if (has('přívod vody', 'kohoutek', 'sítko', 'přívodní hadic', 'přívodu vody')) return 'water_intake'
  if (has('odpad', 'odpadn', 'čerpadl', 'filtr', 'čerpac')) return 'drain'
  if (has('dveřní zámek', 'zámek dveří', 'dvíře', 'dveře', 'pojistka dveří')) return 'door'
  if (has('vodní kámen', 'usazen', 'kámen na topn')) return 'limescale'
  if (has('nevyvážen', 'přetížen', 'nevyváž')) return 'imbalance'
  if (has('přetečení', 'přeplnění', 'hladina vody')) return 'overflow'
  if (has('topné těleso', 'ohřívač', 'ohřev', 'topn')) return 'heating'
  if (has('senzor teploty', 'teplotní čidlo', 'ntc', 'termistor', 'termostat')) return 'temp_sensor'
  if (has('tlakový senzor', 'tlakov', 'hladina')) return 'pressure_sensor'
  if (has('motor', 'tacho', 'ložisko', 'triak motoru', 'řízení motoru')) return 'motor'
  if (has('řídicí deska', 'elektronik', 'hlavní deska', 'řídicí obvod', 'crm deska', 'zkrat triaku')) return 'electronics'
  if (has('únik vody', 'těsnění', 'prasklá hadice', 'aquastop')) return 'leak'
  if (has('napětí', 'přepětí', 'podpětí', 'elektroinstalace')) return 'voltage'
  if (has('ventilátor', 'vzduch', 'výfuk')) return 'fan'
  return 'generic'
}

// --- FAQ templates ---

const FAQ_TEMPLATES = {
  water_intake: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje problém s přívodem vody. Nejčastěji jde o zavřený přívod vody, ucpané sítko na přívodní hadici nebo příliš nízký tlak vody v domácnosti.` },
    { q: `Jak opravit chybu ${code}?`, a: `Zkontrolujte, zda je kohout přívodu vody otevřený. Odpojte přívodní hadici a vyčistěte sítko na vstupu. Pokud problém přetrvá, zavolejte technika.` },
    { q: `Musím volat servis kvůli chybě ${code}?`, a: `Ne vždy. Zkuste nejprve domácí kontrolu – kohout, sítko, hadici. Pokud ani po vyčištění spotřebič nehlásí vodu správně, je nutný technik.` },
  ],
  drain: (code, brand, appliance) => [
    { q: `Co znamená chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} upozorňuje na problém s odpadem vody. Příčinou bývá ucpaný filtr čerpadla, přehnutá nebo ucpaná odpadní hadice.` },
    { q: `Jak vyřešit chybu ${code} doma?`, a: `Vyčistěte filtr čerpadla (umístěný za krytem v dolní části spotřebiče). Zkontrolujte průchodnost odpadní hadice a sifon dřezu. Po čištění spusťte zkušební program.` },
    { q: `Jak dlouho trvá oprava chyby ${code}?`, a: `Čištění filtru zabere 10–15 minut. Pokud je příčinou mechanická závada čerpadla, technik obvykle opraví spotřebič do hodiny.` },
  ],
  door: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje problém s dveřním zámkem. Dvíře nejsou správně zavřena, nebo je zámek mechanicky nebo elektricky vadný.` },
    { q: `Jak opravit chybu ${code}?`, a: `Zkuste dvíře pevně zavřít – mělo by být slyšet cvaknutí. Zkontrolujte, zda nic nebrání zavření (prádlo v těsnění). Pokud problém trvá, je potřeba vyměnit zámek.` },
    { q: `Je chyba ${code} nebezpečná?`, a: `Spotřebič nespustí program, dokud nejsou dvíře správně zajištěny – jde o bezpečnostní funkci. Nepokračujte v provozu s obcházeným zámkem.` },
  ],
  limescale: (code, brand, appliance) => [
    { q: `Čím je způsobena chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje problémy způsobené vodním kamenem, který snižuje výkon topného tělesa nebo zanáší senzory.` },
    { q: `Jak odstraním vodní kámen ze spotřebiče?`, a: `Spusťte odvápňovací program s prostředkem na odvápnění (kyselina citronová nebo komerční přípravek). U praček stačí prázdný prací cyklus na 60 °C s odvápňovačem.` },
    { q: `Jak předejít opakování chyby ${code}?`, a: `Pravidelně odvápňujte spotřebič (každé 3–6 měsíců v závislosti na tvrdosti vody). Používejte správné dávkování pracího prostředku.` },
  ],
  imbalance: (code, brand, appliance) => [
    { q: `Co znamená chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} hlásí nevyváženou náplň bubnu – prádlo je nerovnoměrně rozloženo, spotřebič se zastavil jako ochrana před nadměrnými vibracemi.` },
    { q: `Jak opravit chybu ${code}?`, a: `Otevřete dvíře, rovnoměrně přeskládejte prádlo v bubnu a zavřete. Spusťte program znovu. Vyhněte se praní jednoho kusu těžkého prádla (ručník, džíny) samotného.` },
    { q: `Proč se chyba ${code} opakuje?`, a: `Opakující se nevyvážení může způsobovat poškozené silentbloky (tlumící gumy) pod bubnem – ty poté vyměňuje technik.` },
  ],
  overflow: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje přeplnění nebo chybu snímače hladiny vody. Spotřebič detekoval více vody než má.` },
    { q: `Je chyba ${code} vážná?`, a: `Může být – zkontrolujte, zda voda nevytéká ze spotřebiče. Odpojte přívod vody a zavolejte technika, pokud spotřebič sám vodu nevypustí.` },
    { q: `Jak vyřešit chybu ${code}?`, a: `Zkuste restart: vypněte spotřebič, počkejte 5 minut, znovu zapněte. Pokud chyba přetrvá, jde pravděpodobně o vadný tlakový senzor nebo elektroventil – nutný servis.` },
  ],
  heating: (code, brand, appliance) => [
    { q: `Co znamená chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} upozorňuje na závadu topného tělesa nebo jeho obvodu. Spotřebič nedokáže ohřát vodu nebo vzduch na požadovanou teplotu.` },
    { q: `Mohu opravit chybu ${code} sám?`, a: `Výměna topného tělesa vyžaduje odborný zásah – doporučujeme zavolat certifikovaný servis. Pokuste se nejprve o restart vypnutím ze zásuvky na 5 minut.` },
    { q: `Jak dlouho trvá oprava topného tělesa?`, a: `Výměna topného tělesa u pračky nebo myčky trvá technikovi obvykle 30–60 minut. Cena dílu se pohybuje od 500 do 2 000 Kč podle modelu.` },
  ],
  temp_sensor: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu teplotního čidla (NTC senzoru nebo termistoru). Spotřebič nedokáže měřit správnou teplotu.` },
    { q: `Mohu sám opravit chybu ${code}?`, a: `Výměna teplotního čidla je technicky možná, ale doporučujeme servis – nesprávně připojené čidlo může způsobit poškození spotřebiče nebo bezpečnostní riziko.` },
    { q: `Jak poznat, zda je čidlo vadné nebo jen odpojené?`, a: `Technik změří odpor čidla multimetrem. Při pokojové teplotě by měl NTC senzor ukazovat přibližně 10–20 kΩ. Výrazná odchylka nebo přerušení indikuje vadné čidlo.` },
  ],
  pressure_sensor: (code, brand, appliance) => [
    { q: `Co znamená chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu tlakového senzoru hladiny vody. Spotřebič nedokáže správně měřit množství vody v nádrži.` },
    { q: `Jak opravit chybu ${code}?`, a: `Zkontrolujte, zda není hadička vedoucí k tlakovému senzoru ucpána nebo přehnutá. Pokud je průchodná, je senzor pravděpodobně vadný a vyžaduje výměnu.` },
    { q: `Je výměna tlakového senzoru drahá?`, a: `Tlakový senzor je relativně levný díl (200–600 Kč), ale jeho přesné nalezení a výměna vyžaduje znalost modelu. Technik obvykle zvládne výměnu do 30 minut.` },
  ],
  heatpump: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u sušičky ${brand}?`, a: `Kód ${code} signalizuje závadu chladivového okruhu nebo kompresoru tepelného čerpadla. Může jít o únik chladiva, vadný tlakový spínač nebo zablokovaný výparník.` },
    { q: `Mohu sám opravit chybu ${code}?`, a: `Ne – závady na tepelném čerpadle vyžadují certifikovaného technika. Manipulace s chladivem je regulována zákonem a nesmí ji provádět laik.` },
    { q: `Je oprava tepelného čerpadla drahá?`, a: `Oprava kompresoru nebo doplnění chladiva patří k dražším zásahům – obvykle 2 000–8 000 Kč. Zvažte porovnání s cenou nového spotřebiče u starších modelů.` },
  ],
  motor: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu elektromotoru nebo jeho řídicího obvodu. Příčinou může být vadný motor, tacho generátor nebo přetížení ložisek.` },
    { q: `Mohu opravit chybu ${code} sám?`, a: `Závady motoru vyžadují odborný servis. Neprovádějte opravy elektrických komponent sami – hrozí úraz elektrickým proudem.` },
    { q: `Jak předejít závadám motoru?`, a: `Nepřetěžujte spotřebič nad doporučenou náplň. Pravidelně čistěte filtr. Při neobvyklém hluku nebo vibracích spotřebič ihned odstavte a zavolejte technika.` },
  ],
  electronics: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu řídicí elektroniky nebo hlavní desky. Může jít o přechodovou poruchu způsobenou výpadkem napájení nebo o fyzické poškození desky.` },
    { q: `Pomůže restart při chybě ${code}?`, a: `Ano – zkuste vypnout spotřebič ze zásuvky na 5–10 minut. Přechodové chyby elektroniky se tímto způsobem někdy vyřeší. Pokud se chyba vrátí, je nutný servis.` },
    { q: `Jak drahá je výměna řídicí desky?`, a: `Řídicí deska patří k dražším dílům – cena se pohybuje od 1 500 do 6 000 Kč podle modelu. Technik ji diagnostikuje a ověří, zda nejde o levnější opravu (odpájený spoj, vadný kondenzátor).` },
  ],
  leak: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} detekoval vodu v základně spotřebiče. Příčinou je únik z hadice, těsnění nebo čerpadla. U praček Bosch/Siemens aktivuje systém Aquastop.` },
    { q: `Co mám dělat okamžitě při chybě ${code}?`, a: `Okamžitě zavřete přívod vody a vypněte spotřebič. Vytřete vodu ze základny. Nezapínejte spotřebič, dokud nezjistíte příčinu úniku – hrozí poškození podlahy nebo elektrická závada.` },
    { q: `Mohu sám opravit chybu ${code}?`, a: `Záleží na příčině. Povolené šroubení hadice zvládnete sami. Prasklá hadice nebo vadné těsnění bubnu vyžadují náhradní díl a výměnu – doporučujeme servis.` },
  ],
  voltage: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje nestandardní napájecí napětí v síti – přepětí nebo podpětí. Spotřebič se ochranně vypnul.` },
    { q: `Jak vyřešit chybu ${code}?`, a: `Zkontrolujte ostatní spotřebiče v domácnosti – pokud i jiné mají problémy, kontaktujte elektrikáře nebo distributora elektřiny. Zasuňte spotřebič do jiné zásuvky na jiném okruhu.` },
    { q: `Je přepětí nebezpečné pro spotřebič?`, a: `Opakované výkyvy napětí mohou poškodit řídicí elektroniku. Zvažte instalaci přepěťové ochrany nebo stabilizátoru napětí.` },
  ],
  fan: (code, brand, appliance) => [
    { q: `Co způsobuje chybu ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu ventilátoru nebo jeho řídicího obvodu. Spotřebič nedokáže správně cirkulovat vzduch.` },
    { q: `Mohu opravit chybu ${code} sám?`, a: `Základní kontrolu lze provést sami – zkontrolujte, zda není větrací otvor ucpán prachem. Výměna motoru ventilátoru vyžaduje servis.` },
    { q: `Jak předejít závadám ventilátoru?`, a: `Pravidelně čistěte filtry a větrací otvory. Neumísťujte spotřebič do stísněného prostoru bez dostatečné cirkulace vzduchu.` },
  ],
  generic: (code, brand, appliance) => [
    { q: `Co znamená chyba ${code} u ${appliance}u ${brand}?`, a: `Kód ${code} signalizuje závadu ve spotřebiči. Přesná příčina závisí na modelu – zkuste restart vypnutím ze zásuvky na 5 minut.` },
    { q: `Jak opravit chybu ${code}?`, a: `Pokud restart nepomůže, doporučujeme kontaktovat certifikovaný servis ${brand} s přesným označením modelu (najdete ho na štítku uvnitř dvířek).` },
    { q: `Je chyba ${code} vážná?`, a: `Záleží na konkrétní příčině. Pokud se chyba vrací po restartu nebo spotřebič vydává neobvyklé zvuky, přestaňte ho používat a zavolejte servis.` },
  ],
}

// --- safeChecks templates ---

const SAFE_CHECKS = {
  water_intake: [
    'Zkontrolujte, zda je kohout přívodu vody zcela otevřený',
    'Odpojte přívodní hadici od spotřebiče a vyčistěte sítko na vstupu',
    'Ověřte, zda hadice není přehnutá nebo zmáčknutá',
    'Zkuste zapnout spotřebič znovu po vyčištění sítka',
  ],
  drain: [
    'Vypněte spotřebič a odpojte od elektřiny',
    'Otevřete kryt filtru čerpadla (obvykle dole vpředu) a vyčistěte filtr',
    'Zkontrolujte odpadní hadici – nesmí být přehnutá ani ucpaná',
    'Po vyčištění filtru spusťte krátký testovací program',
  ],
  door: [
    'Zkontrolujte, zda v těsnění dveří není zachyceno prádlo nebo předmět',
    'Pevně zavřete dvíře – mělo by být slyšet zacvaknutí zámku',
    'Restartujte spotřebič vypnutím ze zásuvky na 1 minutu',
  ],
  limescale: [
    'Spusťte odvápňovací program nebo prací cyklus na 60 °C s odvápňovačem',
    'Použijte kyselinu citronovou nebo komerční odvápňovací prostředek',
    'Po odvápnění spusťte prázdný cyklus s čistou vodou',
  ],
  imbalance: [
    'Otevřete dvíře a rovnoměrně přeskládejte prádlo v bubnu',
    'Odstraňte část prádla, pokud je buben přeplněný',
    'Spusťte program znovu – spotřebič se pokusí o nové vyvážení',
  ],
  overflow: [
    'Zkontrolujte, zda voda nevytéká ze spotřebiče',
    'Zavřete přívod vody',
    'Restartujte spotřebič vypnutím ze zásuvky na 5 minut',
  ],
}

const REQUIRES_TECHNICIAN = ['heating', 'temp_sensor', 'pressure_sensor', 'heatpump', 'motor', 'electronics', 'leak', 'voltage', 'fan', 'generic']

const APPLIANCE_LABELS = { pracka: 'pračka', mycka: 'myčka', susicka: 'sušička' }

// --- Hlavní logika ---

async function main() {
  // Fetch all codes missing FAQ or safeChecks
  const raw = execSync(
    `psql "${DB}" -t -A -c "SELECT id, brand, \\"applianceType\\", code, title, \\"shortMeaning\\", array_to_string(\\"likelyCauses\\", '||') FROM \\"ErrorCode\\" WHERE array_length(faq,1) IS NULL OR array_length(\\"safeChecks\\",1) IS NULL ORDER BY brand, \\"applianceType\\", code"`,
    { encoding: 'utf8' }
  )

  const codes = raw.trim().split('\n').filter(Boolean).map(line => {
    const parts = line.split('|')
    return {
      id: parts[0],
      brand: parts[1],
      applianceType: parts[2],
      code: parts[3],
      title: parts[4],
      shortMeaning: parts[5],
      likelyCauses: (parts[6] || '').split('||').filter(Boolean),
    }
  })

  console.log(`Zpracovávám ${codes.length} kódů...\n`)

  const sqlStatements = []

  for (const c of codes) {
    const type = classify(c.likelyCauses, c.code, c.shortMeaning)
    const applianceLabel = APPLIANCE_LABELS[c.applianceType] || c.applianceType
    const faqFn = FAQ_TEMPLATES[type] || FAQ_TEMPLATES.generic
    const faq = faqFn(c.code, c.brand, applianceLabel)
    const safeChecks = SAFE_CHECKS[type] || []
    const canUserTrySafeChecks = safeChecks.length > 0

    // faq is jsonb[] – must be ARRAY['{...}'::jsonb, ...]
    const faqArr = `ARRAY[${faq.map(f => `'${JSON.stringify(f).replace(/'/g, "''")}'::jsonb`).join(',')}]`
    const safeChecksArr = safeChecks.length > 0
      ? `ARRAY[${safeChecks.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]`
      : `ARRAY[]::text[]`

    sqlStatements.push(
      `UPDATE "ErrorCode" SET faq = ${faqArr}, "safeChecks" = ${safeChecksArr}, "canUserTrySafeChecks" = ${canUserTrySafeChecks} WHERE id = ${c.id};`
    )
    process.stdout.write(`  ${c.brand} ${c.code} → ${type}\n`)
  }

  // Write SQL to file for review
  const sqlFile = '/tmp/enrich_updates.sql'
  const { writeFileSync } = await import('fs')
  writeFileSync(sqlFile, sqlStatements.join('\n'))
  console.log(`\n✓ Vygenerováno ${sqlStatements.length} SQL příkazů → ${sqlFile}`)
  console.log('Spusťte: node scripts/enrich-content.mjs --apply pro zápis do DB')

  if (process.argv.includes('--apply')) {
    console.log('\nZapisuji do DB...')
    const { writeFileSync: wf } = await import('fs')
    wf('/tmp/enrich_apply.sql', sqlStatements.join('\n'))
    execSync(`psql "${DB}" -f /tmp/enrich_apply.sql`, { stdio: 'inherit' })
    console.log('✓ Hotovo')
  }
}

main().catch(console.error)
