// Bohatý obsah pro značkové stránky /znacka/[brand].
// Cíl: ~1000 slov originálního textu per značka pro SEO + AdSense E-E-A-T.
// Začínáme Boschem jako pilotem, ostatní značky se postupně doplní (do té doby
// fallback na BRAND_INTROS v page.tsx zůstává).

export interface BrandContent {
  intro: string[]
  modelLines?: { name: string; description: string }[]
  topCodes?: { code: string; appliance: string; tip: string }[]
  longevity?: string
  faq?: { q: string; a: string }[]
}

export const BRAND_CONTENT: Record<string, BrandContent> = {
  whirlpool: {
    intro: [
      'Whirlpool je americký výrobce domácích spotřebičů s evropskými výrobními závody v Polsku a Itálii. Pod skupinu Whirlpool Corporation patří i značky Hotpoint (dříve Hotpoint-Ariston), Indesit a Bauknecht – kódy chyb a náhradní díly jsou proto u těchto značek z velké části sdílené a opravovat je dokáže stejný servis.',
      'Chybové kódy Whirlpool praček mají dva formáty: starší modely používají F + dvojmístné číslo (F01–F42), novější modely se 6th Sense technologií rozšiřují formát na FxEy kombinace (F0E5, F1E4, F3E1, F5E1, F6E1, F8E1) pro detailnější diagnostiku. Myčky používají krátké kódy F1–F6, sušičky F01–F05.',
    ],
    modelLines: [
      {
        name: 'Základní pračky Whirlpool',
        description: 'Cenově dostupné modely se základní výbavou a klasickými F-kódy (F01–F42). Solidní zpracování za příznivou cenu, často první volba pro nájemní bydlení nebo náhradu staršího spotřebiče.',
      },
      {
        name: '6th Sense (střední řada)',
        description: 'Pračky s technologií 6th Sense – senzor automaticky přizpůsobí množství vody, spotřebu energie a délku programu podle náplně. Snižuje spotřebu vody, energie i času až o 70 %. Novější FxEy formát kódů pro lepší diagnostiku.',
      },
      {
        name: 'Supreme Care + FreshCare+ (prémiová řada)',
        description: 'Top modely Whirlpool s prémiovým designem Supreme Care (kapacita do 12 kg, A+++ energetická třída), funkcí FreshCare+ (udržuje prádlo svěží po praní bez plísní), ZenTechnology (tichý chod) a možností prodloužené záruky 10 nebo 20 let na motor.',
      },
    ],
    topCodes: [
      { code: 'F02', appliance: 'pračka', tip: 'Zastavení průtoku vody – kohout zavřený, sítko v hadici ucpané, tlak nízký.' },
      { code: 'F08', appliance: 'pračka', tip: 'Topné těleso / relé ohřevu – vadné topení nebo elektrický spínač, vyžaduje servis.' },
      { code: 'F21', appliance: 'pračka', tip: 'Pomalé nebo žádné vypouštění – filtr, čerpadlo, vypouštěcí hadice.' },
      { code: 'F0E5', appliance: 'pračka', tip: 'Nevyváženost náplně – přerozdělte prádlo, vyhněte se samostatnému praní velkých kusů.' },
      { code: 'F5E1', appliance: 'pračka', tip: 'Problém se zámkem dveří – zkontrolujte zavření, čistotu těsnění a magnet zámku.' },
      { code: 'F8E1', appliance: 'pračka', tip: 'Problém s přívodem/odtokem vody / přetečení – kontrola hadic, sifonu, čerpadla.' },
      { code: 'F1', appliance: 'myčka', tip: 'Chyba plnění vodou myčky – kohout, sítko AquaStop, tlak.' },
      { code: 'F01', appliance: 'sušička', tip: 'Porucha řídicí desky – vyžaduje servisní zásah, obvykle výměna elektroniky.' },
    ],
    longevity: 'Pračky a myčky Whirlpool obvykle slouží 8–11 let při běžném provozu (4–5 cyklů týdně) podle CZ uživatelských zkušeností. Whirlpool je positioned jako mass-market značka s dobrým poměrem cena/výkon. Závažnější závady přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, koroze topného tělesa nebo elektronika. V ČR má standardní zákonnou záruku 2 roky; Whirlpool nabízí pro vybrané modely 5letou prodlouženou záruku zdarma na celý spotřebič a 10letou (případně až 20letou u některých prémiových modelů) záruku na motor/kompresor – obě po registraci na whirlpool.cz. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna.',
    faq: [
      {
        q: 'Jaké značky patří do Whirlpool Corporation?',
        a: 'Do skupiny Whirlpool patří značky Whirlpool, Hotpoint (dříve Hotpoint-Ariston), Indesit a Bauknecht – a starší značky Ignis a Polar. Tyto značky sdílí konstrukční platformy, náhradní díly i servisní síť v ČR. Chybové kódy jsou u Whirlpool, Indesit a Hotpoint často shodné nebo velmi podobné.',
      },
      {
        q: 'Jaké záruky Whirlpool nabízí v ČR?',
        a: 'Whirlpool v ČR poskytuje 3 typy bezplatných prodloužených záruk po registraci na whirlpool.cz: (1) 5letá záruka na celý spotřebič po registraci do 14 dnů od koupě; (2) 10letá záruka na motor/kompresor (vybrané modely) po registraci do 60 dnů; (3) až 20letá záruka na motor u prémiových modelů nebo Infiniti záruka na vybrané náhradní díly. Aby byla záruka platná, musí opravy provádět autorizovaný servisní technik Whirlpool.',
      },
      {
        q: 'Co je technologie 6th Sense?',
        a: '6th Sense je vlastní technologie Whirlpool, která pomocí snímačů automaticky přizpůsobuje množství vody, spotřebu energie a délku programu podle skutečné velikosti a typu náplně. Podle výrobce snižuje spotřebu vody, energie i času až o 70 %. Najdete ji v drtivé většině moderních Whirlpool praček, myček i trub.',
      },
      {
        q: 'Proč mají pračky Whirlpool dva formáty kódů (F08 vs. F0E5)?',
        a: 'Starší modely Whirlpool používají krátké kódy F01–F42 (např. F08 = topné těleso, F21 = vypouštění). Novější modely s 6th Sense a vyspělejší elektronikou používají rozšířený formát FxEy (např. F0E5 = nevyváženost, F5E1 = zámek dveří, F8E1 = přívod vody) – tento systém umožňuje detailnější diagnostiku. V naší databázi najdete obě varianty s rozlišením podle generace.',
      },
      {
        q: 'Kde najdu autorizovaný servis Whirlpool v ČR?',
        a: 'Whirlpool má v ČR vlastní servisní centrum a oficiálního partnera AP Servis. Objednání opravy (záruční i pozáruční): 251 001 001 (Po–Pá 8:00–17:00, cena místního hovoru) nebo přes whirlpool.cz/sluzby/rezervujte-si-navstevu. AP Servis specializovaný na pračky/myčky: 227 191 726, mobil 607 736 769, info@servis-whirlpool.cz. Mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady.',
      },
      {
        q: 'Lze resetovat pračku Whirlpool bez servisu?',
        a: 'Ano. Otočte programátor (nebo zmáčkněte tlačítko On/Off) do polohy „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U některých modelů 6th Sense lze reset spustit i podržením tlačítka Start/Pauza 5 sekund. Pokud se chyba vrátí, jde o reálnou závadu vyžadující servis.',
      },
    ],
  },
  lg: {
    intro: [
      'LG je jihokorejský výrobce s inovativními technologiemi v oblasti domácích spotřebičů. Pračky LG jsou v ČR oblíbené hlavně díky technologii přímého pohonu Direct Drive – motor je přímo spojen s bubnem bez řemene, což snižuje hlučnost, zvyšuje životnost a snižuje počet pohyblivých částí.',
      'Chybové kódy LG mají formát dvou písmen nebo písmeno + číslo (OE, IE, UE, LE, PE, SUD…). Sušičky LG mají jedinečnou diagnostiku ucpání výfukové hadice ve čtyřech úrovních (D75, D80, D90, D95 podle procenta ucpání) a sérii kódů tE1–tE6 pro různé termistory. Novější modely se ThinQ aplikací umí kód identifikovat a navrhnout postup automaticky.',
    ],
    modelLines: [
      {
        name: 'Slim pračky LG (kompaktní)',
        description: 'Pračky s hloubkou 45 cm vhodné do menších bytů a koupelen. Vstupní modely často bez AI DD a Steam, ale s Direct Drive motorem a 10letou zárukou na motor. Kapacita 6,5–8,5 kg.',
      },
      {
        name: 'Direct Drive + Steam (střední řada)',
        description: 'Standardní 60cm pračky s Direct Drive motorem, parní funkcí Steam (odstranění alergenů a žmolků), TurboWash (rychlé praní za 59 min) a ThinQ + WiFi pro vzdálené ovládání. Kapacita 8–10 kg.',
      },
      {
        name: 'AI DD + TurboWash 360° (prémiová řada)',
        description: 'Top modely s AI DD (umělá inteligence detekuje typ tkaniny a váží prádlo, automaticky volí pohyby a režim) a TurboWash 360° (rychlé praní za 39 minut). Některé modely s ezDispense (automatické dávkování). Plná 10letá záruka na Direct Drive motor.',
      },
    ],
    topCodes: [
      { code: 'IE', appliance: 'pračka', tip: 'Chyba přívodu vody – kohout otevřený, čisté sítko v hadici, tlak min. 1 bar.' },
      { code: 'OE', appliance: 'pračka', tip: 'Chyba odpadního čerpadla – ucpaný filtr, poškozené čerpadlo nebo vypouštěcí hadice.' },
      { code: 'UE', appliance: 'pračka', tip: 'Nevyvážená náplň – přerozdělte prádlo, vyhněte se praní samostatně velkých kusů (deky, ručníky).' },
      { code: 'LE', appliance: 'pračka', tip: 'Přetížení motoru / zablokovaný buben – snižte množství prádla, zkontrolujte volný buben rukou (při odpojení).' },
      { code: 'DE', appliance: 'pračka', tip: 'Otevřená dvířka nebo vadný zámek – zkontrolujte zavření a čistotu těsnění.' },
      { code: 'D80', appliance: 'sušička', tip: 'Výfuková hadice ucpaná na 80 % – pročistěte hadici a kondenzátor, snižte se ucpávání bude růst.' },
      { code: 'dE', appliance: 'sušička', tip: 'Dveře nejsou zavřeny – zkontrolujte zámek a těsnění.' },
      { code: 'OE', appliance: 'sušička', tip: 'Chyba odtokového čerpadla u kondenzačních sušiček – vyprázdněte zásobník vody, zkontrolujte čerpadlo.' },
    ],
    longevity: 'Pračky a myčky LG obvykle slouží 9–12 let při běžném provozu (4–5 cyklů týdně). Klíčová komponenta – Direct Drive motor – je positioned jako velmi spolehlivá díky absenci kartáčů a minimálnímu počtu pohyblivých částí. LG na něj v ČR poskytuje prodlouženou 10letou záruku (vztahuje se jen na funkční vady statoru a rotoru DD motoru). Závažnější závady ostatních komponent přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo (OE), koroze topného tělesa. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna.',
    faq: [
      {
        q: 'Jak získat 10letou záruku na Direct Drive motor LG?',
        a: 'LG v ČR poskytuje na invertorový Direct Drive motor praček prodlouženou záruku 10 let. Záruka se vztahuje pouze na funkční vady DD motoru (konkrétně statoru a rotoru), ne na další díly pračky. Pro uplatnění je nutné v autorizovaném servisu LGECZ předložit originální záruční list LGECZ a originál dokladu o koupi (faktura/účtenka) s typovým označením a datem prodeje. Počet oprav v období prodloužené záruky není omezen a doba opravy se k záruce přičítá.',
      },
      {
        q: 'Co je Direct Drive, AI DD, ThinQ a TurboWash?',
        a: 'Direct Drive je vlastní technologie LG, kde je motor přímo spojen s bubnem bez řemene a převodů – znamená méně pohyblivých částí, nižší hlučnost a delší životnost. AI DD je vylepšení s umělou inteligencí, která detekuje typ tkaniny a váží prádlo, aby automaticky zvolila nejvhodnější pohyby bubnu. ThinQ je mobilní aplikace pro vzdálené ovládání, plánování a diagnostiku. TurboWash umožňuje rychlé praní za 59 minut, TurboWash 360° dokonce za 39 minut.',
      },
      {
        q: 'Co znamenají kódy D75, D80, D90, D95 u sušičky LG?',
        a: 'Sušičky LG mají jedinečnou diagnostiku průchodnosti výfukové hadice. Kódy D75/D80/D90/D95 indikují, na kolik procent je hadice nebo kondenzátor ucpaný (75 %, 80 %, 90 %, 95 %). Při D75/D80 stačí pročistit filtr žmolků a kondenzátor, při D90/D95 je třeba kontrolovat i samotnou výfukovou hadici a celý systém – jinak hrozí přehřátí a další závady.',
      },
      {
        q: 'Kde najdu autorizovaný servis LG v ČR?',
        a: 'LG má v ČR vlastní službu „Servis u Vás doma" – pro záruční opravy přijede technik LG zdarma k vám. Telefonní čísla: 228 887 050 (objednání opravy), +420 386 350 461 (zákaznická linka). Online vyhledávač servisů je na lg.com/cz/podpora/kontaktujte-nas/vyhledat-servis/. Operátor objedná opravu a SMS přijde s číslem servisu, který do 2 pracovních dnů kontaktuje pro termín. Mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady.',
      },
      {
        q: 'Lze resetovat pračku LG bez servisu?',
        a: 'Ano. Stiskněte tlačítko Power (Vypnuto), vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a stiskněte Power. U modelů s ThinQ lze reset spustit i přes aplikaci nebo přes „diagnostiku Smart Diagnosis", kterou zástupce LG navede přes telefon. Pokud se chyba vrátí, jde o reálnou závadu vyžadující servis.',
      },
    ],
  },
  miele: {
    intro: [
      'Miele je německá prémiová značka s více než 120 lety tradice, proslulá mimořádnou životností spotřebičů. Pračky a myčky Miele jsou výrobcem testovány na 20 let provozu, což odpovídá zhruba 5 000 cyklů. Spotřebiče Miele jsou vyráběny výhradně v Německu a Rakousku a v nezávislých testech (např. dTest) pravidelně obsazují přední příčky životnosti.',
      'V naší databázi najdete chybové kódy myček Miele. Formát kódů je F + číslo (F1, F11, F18, F594…) nebo textová indikace blikajících kontrolek („Přívod vody bliká", „Ostřikovací rameno"…). Novější modely G7000 a G5000 Discovery (od roku 2019) zobrazují kódy přímo na displeji včetně třímístných variant jako F170, F594.',
    ],
    modelLines: [
      {
        name: 'G5000 Discovery (základní/střední myčky)',
        description: 'Cenově dostupnější myčky Miele se základní výbavou Miele kvality. Mají standardní programy, AutoOpen sušení, případně AutoDos (automatické dávkování). Displej zobrazuje kódy F + číslo.',
      },
      {
        name: 'G7000 (prémiové myčky)',
        description: 'Top řada myček s funkcemi AutoDos (automatické dávkování PowerDisk po dobu 20 cyklů), QuickPowerWash (rychlé umytí za 58 min), WiFiConn@ct pro vzdálené ovládání a hlasovou kontrolu, KnockToOpen pro ovládání klepnutím. Třímístné kódy F170+ pro detailnější diagnostiku.',
      },
      {
        name: 'Pračky W1 (přídavně, ne v naší databázi)',
        description: 'Pračky Miele řady W1 (WED, WCR, WXR prefixy) s technologií TwinDos (2 nádoby na prací prostředek), PowerWash 2.0 a bezkartáčovým motorem ProfiEco. Kódy praček Miele zatím v naší databázi nejsou – při poruše využijte oficiální servis Miele (kontakt v FAQ).',
      },
    ],
    topCodes: [
      { code: 'F12', appliance: 'myčka', tip: 'Chyba přívodu vody – kohout otevřený, hadice nepřisrznutá, sítko AquaStop čisté.' },
      { code: 'F13', appliance: 'myčka', tip: 'Chyba přívodu vody (variant) – obdobná diagnostika jako F12.' },
      { code: 'F11', appliance: 'myčka', tip: 'Chyba u G7xxx a G5xxx Discovery od 2019 – obvykle senzor průtoku nebo otevření přívodu.' },
      { code: 'F70', appliance: 'myčka', tip: 'Systém Waterproof aktivován – ve vaně myčky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'F18', appliance: 'myčka', tip: 'Chyba vypouštění – filtr, sifon, vypouštěcí čerpadlo.' },
      { code: 'F19', appliance: 'myčka', tip: 'Chyba ohřevu – topné těleso nebo NTC senzor. Vyžaduje servisní diagnostiku.' },
      { code: 'F594', appliance: 'myčka', tip: 'Chyba cirkulačního čerpadla – zaseknuté nebo opotřebené ložisko.' },
      { code: 'F600', appliance: 'myčka', tip: 'AutoDos – chyba dávkování PowerDisk. Zkontrolujte stav disku a otvor v zásobníku.' },
    ],
    longevity: 'Miele oficiálně testuje pračky a myčky na 20 let provozu (5 000 cyklů – 5 cyklů týdně × 50 týdnů × 20 let). V průzkumech spolehlivosti CZ (dTest) Miele dlouhodobě obsazuje přední příčky s průměrnou životností okolo 15 let a 9 měsíců. To je výrazně více než u většiny ostatních značek (BSH 10–15 let, Electrolux/AEG 10–13 let, Samsung/Beko 8–12 let). V ČR má standardní zákonnou záruku 2 roky; za jednorázový poplatek lze prodloužit záruku na 5 nebo 10 let (Care Protection). Vybrané modely mají automaticky 4,5 roku prodloužené záruky (125 týdnů navíc). Pro spotřebiče zakoupené od 1. října 2025 navíc Miele zavedl novou motorovou záruku. Pravidlo pro opravu vs. výměnu u Miele je posunuto – díky vyšší pořizovací ceně a očekávané životnosti se vyplatí opravovat i nákladnější závady i u starších modelů.',
    faq: [
      {
        q: 'Jaké záruky Miele nabízí v ČR?',
        a: 'Standardní zákonná záruka je 2 roky. Miele v ČR navíc nabízí Care Protection – prodlouženou záruku na 5 nebo 10 let za jednorázový poplatek (po skončení 2leté záruky následuje 3 nebo 8 let dodatečné záruky). U vybraných modelů praček a sušiček získáte automaticky 125 týdnů prodloužené záruky navíc (celkem cca 4,5 roku). Pro spotřebiče zakoupené od 1. října 2025 platí nová motorová záruka.',
      },
      {
        q: 'Co je TwinDos, PowerWash 2.0 a WiFiConn@ct?',
        a: 'TwinDos je systém u praček Miele W1 s dvěma nádobami na prací prostředek (UltraPhase 1 + UltraPhase 2), který automaticky dávkuje přesné množství podle programu. PowerWash 2.0 je rychlé praní (cca 49 minut) bez kompromisu na kvalitě. WiFiConn@ct umožňuje vzdálené ovládání přes aplikaci Miele@home, hlasové ovládání přes Alexa/Google Assistant a vzdálenou diagnostiku.',
      },
      {
        q: 'Co znamenají blikající kontrolky bez konkrétního kódu?',
        a: 'Některé starší myčky Miele (G4xxx a níže) místo kódů blikají kontrolkami symbolizujícími problém – „Přívod vody bliká" = chyba plnění, „Ostřikovací rameno bliká" = zablokované rameno, „Bliká kontrolka Vypouštění vody" = problém s odtokem. Pokud bliká více kontrolek najednou (ukazatele průběhu programu mytí, sušení a konec), jde o závažnější chybu vyžadující servis. V naší databázi najdete každou kombinaci samostatně.',
      },
      {
        q: 'Kde najdu autorizovaný servis Miele v ČR?',
        a: 'Miele má v Česku vlastní servisní síť. Objednávku opravy najdete na miele.cz/c/oprava-26.htm. Bezplatná infolinka: 800 643 531 (Po–Pá 7:30–17:30, pohotovostní služba o víkendu 8:00–18:00), email servis@miele.cz. Centrální servisní středisko: Škrobárenská 502/1, 617 00 Brno. Záruční oprava je u Miele technika zdarma, mimozáruční výjezd a hodinová sazba bývá vyšší než u běžných značek díky originálním dílům a expertízám.',
      },
      {
        q: 'Lze resetovat myčku Miele bez servisu?',
        a: 'Ano. U většiny modelů G5xxx/G7xxx stiskněte tlačítko „Stop" nebo „Vypnuto" na 4–5 sekund, případně otočte programátor do polohy Vypnuto a zpět. Některé starší modely vyžadují vypnutí ze sítě na 60 sekund. Po resetu zkuste program znovu – pokud se chyba vrátí, jde o reálnou závadu vyžadující servis.',
      },
    ],
  },
  beko: {
    intro: [
      'Beko je turecká značka patřící do skupiny Arçelik, která je jedním z největších evropských výrobců domácích spotřebičů. Spotřebiče Beko jsou v ČR oblíbeny pro příznivý poměr ceny a výkonu, dobrou dostupnost náhradních dílů a vlastní servisní síť (zákaznické centrum + autorizovaní partneři).',
      'Chybové kódy Beko mají dva formáty: starší modely používají krátké kódy E1–E8 (pračky i myčky), novější modely rozšiřují formát na E10/E20/E30/E40 + sérii EA/EB/EF/EH (napájení) a H1–H8 (elektronika, topné těleso, motor). Sušičky Beko používají kódy H01–H08. V naší databázi najdete obě varianty.',
    ],
    modelLines: [
      {
        name: 'Základní pračky Beko',
        description: 'Vstupní modely s digitálním displejem a chybovými kódy E10/E20/H1–H8. Standardní spotřeba, jednoduché ovládání. Většina modelů s ProSmart invertorovým motorem se zákonnou 2letou zárukou.',
      },
      {
        name: 'SteamCure / AquaTech (střední řada)',
        description: 'Přidává parní funkci SteamCure (odstraní až 99,9 % bakterií a alergenů, certifikace Allergy UK) a AquaTech (přímé sprchování prádla + šetrnější pohyby bubnu, rychlejší a šetrnější praní až o 50 %). Vybrané modely s 5letou prodlouženou zárukou.',
      },
      {
        name: 'HygieneShield / Beyond (prémiová řada)',
        description: 'Top modely Beko s řadou HygieneShield (odstranění více než 99 % bakterií a virů) a řadou Beyond (kombinace SteamCure + AquaTech + AddSteam + nejlepší zvuková izolace). Plná 10letá záruka na ProSmart invertorový motor po registraci.',
      },
    ],
    topCodes: [
      { code: 'E10', appliance: 'pračka', tip: 'Chyba přívodu vody – kohout otevřený, sítko v hadici čisté, tlak min. 1 bar.' },
      { code: 'E20', appliance: 'pračka', tip: 'Pračka nevypouští – filtr u dna, čerpadlo, vypouštěcí hadice a sifon.' },
      { code: 'E30', appliance: 'pračka', tip: 'Voda v základně – AquaStop aktivován. Vypněte přívodní kohout a vyžádejte servis.' },
      { code: 'E40', appliance: 'pračka', tip: 'Dvířka nejsou zavřena – zkontrolujte těsnění a zámek dveří, lehce přitiskněte.' },
      { code: 'C9', appliance: 'pračka', tip: 'Nevyvážený buben – přerozdělte prádlo, vyhněte se praní jediného těžkého kusu (deka, ručník).' },
      { code: 'H2', appliance: 'pračka', tip: 'Topné těleso – přerušený obvod. Vyžaduje servisní výměnu.' },
      { code: 'E1', appliance: 'myčka', tip: 'Chyba přívodu vody myčky – kohout, sítko, hadice AquaStop.' },
      { code: 'H01', appliance: 'sušička', tip: 'Přehřátí sušičky – zkontrolujte filtr žmolků, kondenzátor a větrání kolem spotřebiče.' },
    ],
    longevity: 'Pračky a myčky Beko obvykle slouží 8–11 let při běžném provozu (4–5 cyklů týdně) podle CZ uživatelských zkušeností. Beko je positioned jako značka s dobrým poměrem cena/výkon – životnost je solidní, ale obvykle kratší než u prémiových BSH nebo Miele. Závažnější závady přicházejí typicky kolem 6.–8. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, opotřebené motorové uhlíky nebo koroze topného tělesa. ProSmart invertor motor (klíčová komponenta) má samostatně 10letou záruku po registraci do 90 dnů od koupě. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna – obzvláště u Beko modelů, kde levnější pořizovací cena snižuje hranici návratnosti.',
    faq: [
      {
        q: 'Jaké záruky Beko nabízí v ČR?',
        a: 'Beko v ČR poskytuje na vybrané modely dvě bezplatné prodloužené záruky: (1) 5letá záruka na celý spotřebič (zahrnuje díly, dopravu a práci technika, případně výměnu spotřebiče) po registraci na bekocr.cz/zaruka-5-let; (2) 10letá záruka na ProSmart invertorový motor nebo kompresor po registraci do 90 dnů od koupě. Kromě toho platí zákonná 2letá záruka na všechny spotřebiče. Záruka platí jen pro prvního majitele.',
      },
      {
        q: 'Co je SteamCure, AquaTech a HygieneShield?',
        a: 'SteamCure je parní funkce, která během cyklu uvolňuje skvrny a po skončení odstraňuje bakterie a alergeny (s certifikací Allergy UK). AquaTech kombinuje přímé sprchování prádla s šetrnějšími pohyby bubnu, což zrychluje praní o 50 % a šetří jemné tkaniny. HygieneShield je samostatná řada spotřebičů Beko zaměřená na odstranění více než 99 % bakterií a virů.',
      },
      {
        q: 'Proč má moje pračka Beko jiný formát kódů (E1 vs. E10)?',
        a: 'Starší modely Beko (zhruba do roku 2015) používají krátké kódy E1–E8. Novější modely mají rozšířený systém: E10/E20/E30/E40 pro hlavní systémy + samostatnou sérii H1–H8 pro elektroniku a topné prvky + EA/EB/EF/EH pro napájení. Význam je často podobný (např. starší E1 ~ novější E10 = chyba přívodu vody), ale ne vždy 1:1 ekvivalent. V naší databázi najdete obě varianty s rozlišením „starší / novější modely".',
      },
      {
        q: 'Kde najdu autorizovaný servis Beko v ČR?',
        a: 'Beko má v Česku vlastní zákaznické centrum a síť autorizovaných partnerů (např. ALPHA Servis, HB Servis). Objednávku opravy najdete na servis.beko.cz/objednavka-opravy-spotrebice-autorizovanym-servisem. Infolinka: 222 525 222 (Po–Pá 8:00–17:00 s pauzou 12:30–13:00, o víkendu také), email podpora.cz@beko.com. Mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady.',
      },
      {
        q: 'Lze resetovat pračku Beko bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto" (případně podržte tlačítko Start/Pauza po dobu 3–5 sekund podle modelu), vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. Pokud se chyba vrátí, jde o reálnou závadu vyžadující diagnostiku.',
      },
    ],
  },
  samsung: {
    intro: [
      'Samsung patří mezi největší světové výrobce elektroniky a domácích spotřebičů. Pračky, myčky a sušičky Samsung jsou vybaveny digitálním displejem, který zobrazuje chybové kódy přímo – bez nutnosti počítat bliknutí kontrolky.',
      'Kódy Samsung praček mají specifický formát kombinující písmena a číslice (4E, 5E, UE, DE, LE, SUD…), případně třípísmenné varianty u novějších modelů (4C2, 9C1, AC6, DDC). Myčky používají krátké dvojznakové kódy (4C, 5C, HE, LE, OC), sušičky obdobně (DF, HE, HC, FE, ET, TC). Novější modely se SmartThings umí chybový kód identifikovat a navrhnout řešení přes aplikaci.',
    ],
    modelLines: [
      {
        name: 'Pračky bez AI (základní výbava)',
        description: 'Vstupní pračky Samsung s digitálním displejem a EcoBubble technologií (efektivní praní za nízkých teplot díky bublinkám pracího prostředku). Bez Wi-Fi a hlasového ovládání. Digitální invertor motor jako u vyšších řad.',
      },
      {
        name: 'EcoBubble + SmartThings (střední řada)',
        description: 'Přidává Wi-Fi konektivitu přes aplikaci SmartThings (vzdálené spuštění, plánování, diagnostika), funkci SuperSpeed (rychlé praní za 40 minut) a u některých modelů SpaceMax (větší kapacita ve standardních rozměrech).',
      },
      {
        name: 'AI EcoBubble + AddWash (prémiová řada)',
        description: 'Top modely s AI Wash (algoritmus, který si pamatuje zvyky a doporučuje cykly), AI Control displejem, AddWash (přídavná dvířka pro vhození zapomenutého kusu během praní) a parní funkcí. Hlasové ovládání přes Bixby, Alexa nebo Google Assistant.',
      },
    ],
    topCodes: [
      { code: '4E', appliance: 'pračka', tip: 'Chyba přívodu vody – kohout otevřený, sítko v hadici čisté, tlak min. 1 bar.' },
      { code: '5E', appliance: 'pračka', tip: 'Pračka nevypouští – filtr u dna, vypouštěcí hadice a sifon.' },
      { code: 'UE', appliance: 'pračka', tip: 'Nevyvážená náplň – přerozdělte prádlo rovnoměrně po bubnu, případně přidejte další kusy při malé dávce.' },
      { code: 'DE', appliance: 'pračka', tip: 'Chyba dveří – nezavřená nebo poškozený zámek. Stiskněte dvířka pevně, zkontrolujte těsnění.' },
      { code: 'LE', appliance: 'pračka', tip: 'Detekce úniku vody – ve vaně je voda. Vypněte přívodní kohout a vyžádejte servis.' },
      { code: 'SUD', appliance: 'pračka', tip: 'Nadměrné pěnění – příliš mnoho pracího prostředku. Spusťte máchací program bez prostředku.' },
      { code: '4C', appliance: 'myčka', tip: 'Chyba přívodu vody – kohout, hadice AquaStop, sítko.' },
      { code: 'HE', appliance: 'sušička', tip: 'Chyba ohřevu – zkontrolujte filtr žmolků a větrání kondenzátoru, případně volejte servis.' },
    ],
    longevity: 'Pračky a myčky Samsung obvykle slouží 8–12 let při běžném provozu (4–5 cyklů týdně) podle CZ uživatelských zkušeností a obecných odhadů pro mass-market značky. Digitální invertor motor (klíčová komponenta) je samostatně positioned jako velmi spolehlivý – Samsung na něj nabízí v ČR 20letou záruku u modelů zakoupených od 1. července 2022. Závažnější závady ostatních komponent přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, koroze topného tělesa. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna.',
    faq: [
      {
        q: 'Co znamená 20letá záruka Samsung na motor pračky?',
        a: 'Samsung v ČR poskytuje 20letou záruku na digitální invertor motor u praček, sušiček a kombinovaných pračkosušiček zakoupených od 1. července 2022. Na starší modely se vztahuje 10letá záruka. Na rozdíl od BSH a Electrolux Group **není potřeba spotřebič registrovat** – záruka platí automaticky, stačí předložit doklad o koupi (faktura) v autorizovaném servisu. Záruka se vztahuje jen na motor, ne na ostatní díly pračky.',
      },
      {
        q: 'Co je AI EcoBubble, AddWash a SmartThings?',
        a: 'EcoBubble je technologie, která přemění prací prostředek na pěnu/bubliny ještě před vstupem do bubnu – pěna proniká snáz do vláken i při nízkých teplotách. AI EcoBubble je vylepšení s AI algoritmem, který si pamatuje zvyklosti uživatele a doporučuje optimální cyklus. AddWash jsou přídavná malá dvířka v hlavních dveřích, kterými lze vhodit zapomenutý kus prádla i během praní. SmartThings je mobilní aplikace pro vzdálené ovládání a diagnostiku.',
      },
      {
        q: 'Co znamenají písmenné kódy Samsung jako 4E, UE nebo SUD?',
        a: 'Samsung pračky používají kódy z dvou písmen/číslic, kde každý kód má konkrétní význam: 4E = chyba přívodu vody, 5E = chyba vypouštění, UE = nevyvážená náplň, DE = chyba dveří, LE = únik vody, SUD = nadměrné pěnění. Některé novější modely mají rozšířené třípísmenné varianty (4C2, 9C1, AC6). Plný seznam najdete v naší databázi.',
      },
      {
        q: 'Kde najdu autorizovaný servis Samsung v ČR?',
        a: 'Samsung má v Česku desítky autorizovaných servisních středisek. Vyhledávač servisu najdete na samsung.com/cz/support/service-center/. Infolinka Samsung CZ: 800 726 786 (zdarma, Po–Ne 8:00–22:00). Záruční oprava je u autorizovaného partnera zdarma; mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady.',
      },
      {
        q: 'Lze resetovat pračku Samsung bez servisu?',
        a: 'Ano. Otočte programátor (nebo zmáčkněte tlačítko Power) do pozice „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U modelů se SmartThings lze reset spustit i přes aplikaci. Pokud se chyba vrátí, jde o reálnou závadu vyžadující diagnostiku.',
      },
    ],
  },
  electrolux: {
    intro: [
      'Electrolux je švédský nadnárodní výrobce domácích spotřebičů s více než 100 lety tradice. Pod skupinu Electrolux patří i značky AEG a Zanussi – chybové kódy E10, E20, E30, E40 a další jsou proto u těchto značek z velké části shodné a sdílí servisní síť i platformy.',
      'Pračky Electrolux používají kódy ve formátu E + číslo a každá desítka označuje konkrétní podsystém: E1x = přívod vody, E2x = vypouštění, E3x = únik / AquaStop, E4x = dveře, E5x = motor, E6x = ohřev, E7x = teplotní čidlo, E8x = programátor, E9x = elektronika. Myčky používají formát I + číslo (I10, I20, I50, I60, I80) a sušičky kombinaci E + číslo (např. E51, E52, E6F).',
    ],
    modelLines: [
      {
        name: 'PerfectCare 600 (základní řada)',
        description: 'Vstupní řada s technologií SensiCare – senzor automaticky upraví délku cyklu, spotřebu vody a energie podle velikosti náplně. Solidní poměr cena/výkon, často první volba domácností.',
      },
      {
        name: 'PerfectCare 700 (střední řada)',
        description: 'Přidává SteamCare – parní úpravu na konci cyklu, která redukuje pomačkání a osvěží oblečení. Senzory SensiCare zůstávají, vyšší max. odstředění, lepší zvuková izolace.',
      },
      {
        name: 'PerfectCare 800 (prémiová řada)',
        description: 'Top řada s UltraCare – šetrné praní chránící vlákna oblečení (méně třepení a vyblednutí), nejnižší hlučnost a invertorový motor s 10letou záruční nadstavbou v ČR (po registraci).',
      },
    ],
    topCodes: [
      { code: 'E10', appliance: 'pračka', tip: 'Chyba přívodu vody – ověřte otevřený kohout, čisté sítko v hadici, dostatečný tlak (min. 1 bar).' },
      { code: 'E20', appliance: 'pračka', tip: 'Pračka nevypouští – zkontrolujte filtr u dna, vypouštěcí hadici a sifon.' },
      { code: 'E30', appliance: 'pračka', tip: 'Únik vody do základny / AquaStop – ve vaně je voda. Vypněte přívodní kohout a vyžádejte servis.' },
      { code: 'E50', appliance: 'pračka', tip: 'Chyba motoru – typicky opotřebené motorové uhlíky nebo vadný tachogenerátor.' },
      { code: 'EF0', appliance: 'pračka', tip: 'Aktivován systém proti vyplavení – stejný význam jako E30, kontrola úniku v komoře.' },
      { code: 'I10', appliance: 'myčka', tip: 'Chyba přívodu vody myčky – kohout, sítko, hadice AquaStop.' },
      { code: 'I50', appliance: 'myčka', tip: 'Chyba oběhového čerpadla – ucpané nebo opotřebené, vyžaduje servisní výměnu.' },
      { code: 'E52', appliance: 'sušička', tip: 'Přehřátí sušičky – zkontrolujte filtr žmolků, kondenzátor a větrání kolem spotřebiče.' },
    ],
    longevity: 'Pračky a myčky Electrolux obvykle slouží 8–12 let při běžném provozu (4–5 cyklů týdně) podle dTest průzkumu spolehlivosti a CZ uživatelských zkušeností. Závažnější závady přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, opotřebené motorové uhlíky (E50) nebo koroze topného tělesa (E60). V ČR má standardní záruku 2 roky; u vybraných modelů Electrolux nabízí po registraci na electrolux.cz do 3 měsíců od koupě 5letou prodlouženou záruku na celý spotřebič NEBO 10letou záruku na invertorový motor (vybrat lze jednu z variant). Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna.',
    faq: [
      {
        q: 'Jsou chybové kódy Electrolux a AEG stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny Electrolux a sdílí konstrukční platformy i elektronické moduly. Kódy E10/E20/E30/E40 atd. mají u Electrolux a AEG praček stejný význam. Zanussi (také Electrolux Group) používá stejné kódy s drobnými rozdíly v zobrazení.',
      },
      {
        q: 'Co je PerfectCare 600, 700 a 800?',
        a: 'Kolekce PerfectCare zahrnuje pračky a sušičky Electrolux ve třech úrovních výbavy. Řada 600 přidává SensiCare (senzor náplně), řada 700 přidává SteamCare (parní funkce na konci cyklu), řada 800 přidává UltraCare (šetrné praní chránící vlákna) a invertorový motor.',
      },
      {
        q: 'Jak získat 10letou záruku na motor Electrolux?',
        a: 'Electrolux v ČR nabízí po registraci spotřebiče (do 3 měsíců od koupě) volbu mezi 5letou prodlouženou zárukou na celý spotřebič a 10letou zárukou na invertorový motor / kompresor. Registrace probíhá na electrolux.cz/mypages/register-a-product/ a certifikát přijde e-mailem. Platí jen pro prvního majitele a u vybraných modelů.',
      },
      {
        q: 'Kde najdu autorizovaný servis Electrolux v ČR?',
        a: 'Electrolux má v Česku přes 100 autorizovaných servisních středisek (sdílí servisní síť s AEG a Zanussi). Objednávku opravy najdete na electrolux.cz/support/repairs/. Infolinka: 261 302 261 (Po–Pá 8:00–16:30), email zakaznicke.centrum@electrolux.com. Mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady.',
      },
      {
        q: 'Lze resetovat pračku Electrolux bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. Pokud se chyba vrátí, jde o reálnou závadu vyžadující diagnostiku.',
      },
    ],
  },
  aeg: {
    intro: [
      'AEG je prémiová značka skupiny Electrolux se silnou tradicí v Německu a Skandinávii. Pračky, myčky a sušičky AEG sdílí konstrukční platformy se značkami Electrolux a Zanussi – chybové kódy E10, E20, E30, E40 a další jsou proto u těchto značek z velké části shodné.',
      'Chybové kódy AEG praček používají formát E + číslo a každá desítka označuje konkrétní podsystém: E1x = přívod vody, E2x = vypouštění, E3x = únik / AquaStop, E4x = dveře, E5x = motor, E6x = ohřev, E7x = teplotní čidlo, E8x = programátor, E9x = elektronika. Myčky AEG používají formát I + číslo a sušičky systém E + číslo + písmeno (např. E2E, EHC).',
    ],
    modelLines: [
      {
        name: '6000 série (základní)',
        description: 'Vstupní řada s technologií ProSense (automatické vážení prádla a úprava cyklu). Vybrané modely mají AutoDose a Wi-Fi konektivitu. U sušiček SensiDry s tepelným čerpadlem.',
      },
      {
        name: '7000 série (střední)',
        description: 'Přidává ProSteam technologii – parní úpravu prádla, která redukuje žmolky až o 30 % a osvěží oděvy bez praní. ProSense + AutoDose dávkování. Sušičky s AbsoluteCare systémem pro šetrné sušení.',
      },
      {
        name: '8000 / 9000 série (prémie)',
        description: 'Top modely s ProSteam, ProSense, AutoDose, TimeSave (zkrácení cyklu až o polovinu) a SoftPlus pro důkladnou distribuci aviváže. Sušičky 9000 s AbsoluteCare jsou nejcitlivější ke hedvábí a vlně.',
      },
    ],
    topCodes: [
      { code: 'E10', appliance: 'pračka', tip: 'Chyba přívodu vody – ověřte otevřený kohout, čisté sítko v hadici, dostatečný tlak (min. 1 bar).' },
      { code: 'E20', appliance: 'pračka', tip: 'Pračka nevypouští – zkontrolujte filtr u dna, vypouštěcí hadici a sifon.' },
      { code: 'E30', appliance: 'pračka', tip: 'AquaStop / únik vody – ve vaně pračky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'E50', appliance: 'pračka', tip: 'Chyba motoru – typicky opotřebené motorové uhlíky. Vyžaduje servisní výměnu.' },
      { code: 'EF1', appliance: 'pračka', tip: 'Ucpaný odpadní filtr – vyšroubujte filtr u dna, propláchněte a vraťte zpět.' },
      { code: 'I10', appliance: 'myčka', tip: 'Chyba přívodu vody – kohout, sítko, hadice AquaStop. Stejná diagnostika jako u pračky.' },
      { code: 'I20', appliance: 'myčka', tip: 'Myčka nevypouští vodu – filtr, sifon, vypouštěcí čerpadlo.' },
      { code: 'E2E', appliance: 'sušička', tip: 'Vadný senzor teploty bubnu – obvykle vyžaduje výměnu NTC čidla servisem.' },
    ],
    longevity: 'Pračky a myčky AEG obvykle slouží 10–13 let při běžném provozu (4–5 cyklů týdně), podle vlastních AEG dat i nezávislých zdrojů. Závažnější závady přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, opotřebené motorové uhlíky (E50) nebo koroze topného tělesa (E60). V ČR má standardní záruku 2 roky; u vybraných modelů AEG nabízí po registraci na aeg.cz do 3 měsíců od koupě prodlouženou záruku 5 let na celý spotřebič, 10 let na inverter motory a doživotní záruku na motor ÖKOInverter. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna – obzvláště u 6000 série starší 8 let.',
    faq: [
      {
        q: 'Jsou chybové kódy AEG a Electrolux stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny Electrolux a sdílí konstrukční platformy i elektronické moduly. Kódy E10/E20/E30/E40 atd. mají u AEG a Electrolux praček stejný význam. Drobné rozdíly mohou být v zobrazení (AEG má často barevný displej s ikonami, Electrolux jednodušší segmentový).',
      },
      {
        q: 'Co znamená písmeno I na začátku kódu myčky AEG?',
        a: 'Myčky AEG používají formát I + číslo (I10, I20, I30, I40, I60), zatímco pračky AEG mají E + číslo a sušičky kombinaci E + číslo + písmeno (např. E2E pro chybu teplotního senzoru bubnu). Logika značení je podobná napříč Electrolux Group.',
      },
      {
        q: 'Co je AEG ProSense a ProSteam?',
        a: 'ProSense je senzor, který automaticky zváží náplň pračky a upraví délku cyklu, spotřebu vody i energie podle skutečné velikosti dávky. Najdete ji ve všech moderních pračkách AEG. ProSteam přidává parní funkci – zvlhčení prádla horkou párou, která redukuje žmolky až o 30 % a osvěží oděvy bez praní. ProSteam je dostupný v 7000 sérii a vyšších.',
      },
      {
        q: 'Kde najdu autorizovaný servis AEG v ČR?',
        a: 'AEG má v Česku přes 100 autorizovaných servisních středisek (servis je společný pro celou Electrolux Group). Objednávku opravy najdete na aeg.cz/support/repairs/. Infolinka pro objednání servisu: 261 302 261 (Po–Pá 8:00–16:30), email zakaznicke.centrum@electrolux.com. Záruční oprava je u autorizovaného partnera zdarma.',
      },
      {
        q: 'Lze resetovat pračku AEG bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. Pokud se chyba vrátí, jde o reálnou závadu vyžadující diagnostiku.',
      },
    ],
  },
  siemens: {
    intro: [
      'Siemens je prémiová německá značka patřící do skupiny BSH (Bosch-Siemens Hausgeräte). Spotřebiče Siemens sdílí konstrukční základ s Bosch – chybové kódy jsou proto u obou značek totožné nebo velmi podobné a oba výrobci sdílí Home Connect, motorové platformy i sušicí technologii Zeolith.',
      'Pračky Siemens používají primárně F-kódy (F01–F91), které značí závažnější závady vyžadující obvykle servisní zásah. Myčky a sušičky Siemens používají E-kódy. Starší myčky řady SE a SF nemají displej a chyby hlásí blikáním kontrolky – odpovídající čísla najdete v naší databázi pod kódy E1–E6.',
    ],
    modelLines: [
      {
        name: 'iQ100 / iQ300 (základní řady)',
        description: 'Cenově dostupné modely se základní výbavou. Vstupní iQ100 nabízí solidní poměr cena/výkon, iQ300 přidává u některých modelů iQdrive motor. Bez Wi-Fi a touchscreen displeje.',
      },
      {
        name: 'iQ500 (střední řada)',
        description: 'Nejprodávanější řada v ČR. Myčky 44 dB se 8 programy, pračky s Wi-Fi a Home Connect, sušičky s tepelným čerpadlem. AntiVibration design, varioSpeed pro zrychlení programů.',
      },
      {
        name: 'iQ700 / iQ800 (prémiové řady)',
        description: 'Top modely s iSensoric touchscreen, i-Dos (automatické dávkování), iQdrive motorem a u myček sušením Zeolith (42 dB). Home Connect, hlasové ovládání přes Alexa/Google Assistant. Siemens v ČR poskytuje na motor iQdrive zdarma 10letou záruku po registraci spotřebiče.',
      },
    ],
    topCodes: [
      { code: 'F17', appliance: 'pračka', tip: 'Chyba plnění vodou – ověřte otevřený přívodní kohout a čistotu sítka v hadici.' },
      { code: 'F18', appliance: 'pračka', tip: 'Pračka nevypouští – zkontrolujte filtr, sifon a vypouštěcí čerpadlo.' },
      { code: 'F21', appliance: 'pračka', tip: 'Chyba motoru – typicky opotřebené motorové uhlíky, vyžaduje servisní výměnu.' },
      { code: 'F23', appliance: 'pračka', tip: 'AquaStop / přeplnění – ve vaně je voda. Vypněte přívodní kohout a vyžádejte servis.' },
      { code: 'E22', appliance: 'myčka', tip: 'Zanesený filtr – vyšroubujte spodní filtr myčky a propláchněte pod tekoucí vodou.' },
      { code: 'E15', appliance: 'myčka', tip: 'AquaStop aktivován – ve vaně myčky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'E:02', appliance: 'sušička', tip: 'Sušení trvá příliš dlouho – obvykle zanesený výměník nebo filtr žmolků.' },
      { code: 'E:03', appliance: 'sušička', tip: 'Sušička se přehřála – zkontrolujte filtr žmolků a větrání kondenzátoru.' },
    ],
    longevity: 'Pračky a myčky Siemens obvykle slouží 10–15 let při běžném provozu (4–5 cyklů týdně). Díky sdílené konstrukci s Bosch jsou typické závady stejné – kolem 7.–9. roku přicházejí opotřebené motorové uhlíky (F21), vadná ložiska bubnu nebo zanesené čerpadlo. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna – obzvláště u iQ100/iQ300 starších 8 let. U iQ700 a iQ800 má smysl opravovat i nákladnější závady díky vyšší pořizovací ceně a 10leté záruce na motor iQdrive (zdarma po registraci spotřebiče v ČR).',
    faq: [
      {
        q: 'Jsou chybové kódy Siemens a Bosch stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny BSH a sdílí konstrukční platformy i elektronické moduly. Drobné rozdíly jsou v označení modelových řad (iQ vs. Serie) a v tom, že pračky Siemens používají primárně F-kódy, zatímco Bosch má více E-kódů.',
      },
      {
        q: 'Co znamenají F-kódy na displeji pračky Siemens?',
        a: 'F-kódy označují závažnější závady, obvykle vyžadující servisní zásah. F17 = chyba plnění, F18 = chyba vypouštění, F21 = problém s motorem (typicky uhlíky), F23 = AquaStop / přeplnění, F43 = chyba topného tělesa. Plný seznam F-kódů Siemens najdete v naší databázi.',
      },
      {
        q: 'Proč moje stará myčka Siemens nemá displej a jen bliká?',
        a: 'Jde o starší modely řady SE a SF. Místo kódu blikají kontrolky – jejich kombinace odpovídá konkrétnímu chybovému kódu (E1, E2, E3...). Návod k dekódování blikání najdete u jednotlivých kódů E1–E6 v naší databázi.',
      },
      {
        q: 'Kde najdu autorizovaný servis Siemens v ČR?',
        a: 'Siemens má v Česku oficiální servis a desítky autorizovaných partnerů. Aktuální seznam je na siemens-home.bsh-group.com/cz. Linka oprav: +420 251 095 042 (Po–Pá 9:00–17:00). Záruční oprava je u autorizovaného partnera zdarma; mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady (hodinová sazba techniků 350–550 Kč, diagnostika od 600 Kč).',
      },
      {
        q: 'Jak získat 10letou záruku na motor iQdrive Siemens?',
        a: 'Siemens v ČR nabízí zdarma prodlouženou 10letou záruku na motor iQdrive u vybraných modelů praček a sušiček (iQ700, iQ800). Stačí spotřebič po nákupu zaregistrovat na siemens-home.bsh-group.com/cz v sekci „Záruka iQdrive". Kromě toho Siemens v ČR nabízí 5letou prodlouženou záruku a 10letou záruku proti prorezivění vnitřních stěn myček.',
      },
      {
        q: 'Lze resetovat pračku Siemens bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U modelů iQ500+ s Home Connect lze reset spustit i přes aplikaci.',
      },
    ],
  },
  bosch: {
    intro: [
      'Bosch je německá značka s dlouhou tradicí ve výrobě domácích spotřebičů. Pračky, myčky a sušičky Bosch patří v Česku k nejrozšířenějším – díky husté servisní síti a dobré dostupnosti náhradních dílů jsou oblíbeny i u techniků.',
      'Chybové kódy Bosch začínají nejčastěji písmenem E nebo F. Kódy jsou z velké části totožné se spotřebiči Siemens, protože obě značky patří do skupiny BSH a sdílí konstrukční platformy. Pokud váš spotřebič zobrazí kód, zkontrolujte nejprve filtr, přívod a odpad vody.',
    ],
    modelLines: [
      {
        name: 'Serie 4 (základní řada)',
        description: 'Cenově dostupné modely se základní výbavou. Pračky řady WAN, myčky s plastovou vanou a hlučností okolo 46 dB. Vyrábí se převážně v Polsku a Turecku. Displej zobrazuje zkrácené kódy ve formátu E + 2 číslice.',
      },
      {
        name: 'Serie 6 (střední řada)',
        description: 'Nejprodávanější řada v ČR. Myčky mají nerezovou vanu, nižší spotřebu vody (11–12 l) a hlučnost kolem 44 dB. Vybaveno systémem AquaStop, EcoSilence Drive a u myček sušením Zeolith.',
      },
      {
        name: 'Serie 8 (prémiová řada)',
        description: 'Top modely s funkcí Home Connect (Wi-Fi), i-DOS u praček (automatické dávkování) a VarioDrawer Pro u myček. Hlučnost myček 42 dB. U praček s EcoSilence Drive motorem (bez kartáčů) nabízí Bosch v ČR zdarma 10letou záruku po registraci v MyBosch.',
      },
    ],
    topCodes: [
      { code: 'E16', appliance: 'pračka', tip: 'Otevřená dvířka – zkontrolujte zavření, čistotu těsnění a magnet zámku.' },
      { code: 'E17', appliance: 'pračka', tip: 'Pomalé plnění vodou – ověřte otevřený přívodní kohout a čistotu sítka v hadici.' },
      { code: 'F21', appliance: 'pračka', tip: 'Problém s pohonem motoru – typicky opotřebené motorové uhlíky, vyžaduje servisní výměnu.' },
      { code: 'E22', appliance: 'myčka', tip: 'Zanesený filtr – vyšroubujte spodní filtr, propláchněte pod tekoucí vodou.' },
      { code: 'E24', appliance: 'myčka', tip: 'Myčka nevypouští vodu – zkontrolujte čerpadlo, sifon a vypouštěcí hadici.' },
      { code: 'E15', appliance: 'myčka', tip: 'AquaStop aktivován – ve vaně myčky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'E:02', appliance: 'sušička', tip: 'Sušení trvá příliš dlouho – obvykle zanesený výměník nebo filtr žmolků.' },
      { code: 'E:03', appliance: 'sušička', tip: 'Sušička se přehřála – zkontrolujte filtr žmolků a větrání kondenzátoru.' },
    ],
    longevity: 'Pračky a myčky Bosch obvykle slouží 10–15 let při běžném provozu (4–5 cyklů týdně). Závažnější závady přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, koroze topného tělesa nebo opotřebené motorové uhlíky. Obecné pravidlo zní: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, zpravidla se vyplatí výměna, obzvláště u Serie 4 starších 8 let. U praček s motorem EcoSilence Drive má smysl opravovat i nákladnější závady – Bosch v ČR poskytuje na tento motor zdarma 10letou záruku po registraci v MyBosch.',
    faq: [
      {
        q: 'Jsou chybové kódy Bosch a Siemens stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny BSH a sdílí konstrukční platformy i elektronické moduly. Drobné rozdíly jsou pouze v označení modelových řad a v zobrazení kódů na displeji.',
      },
      {
        q: 'Lze resetovat pračku Bosch bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U modelů s Home Connect lze reset spustit i přes aplikaci.',
      },
      {
        q: 'Kde najdu autorizovaný servis Bosch v ČR?',
        a: 'Bosch má v Česku oficiální servis a desítky autorizovaných partnerů. Aktuální seznam je na bosch-home.com/cz/vyhledat-prodejce-servis. Linka oprav: +420 251 095 043 (Po–Pá 8:30–17:00). Záruční oprava je u autorizovaného partnera zdarma; mimozáruční opravy v ČR se obvykle pohybují do 1 500 Kč podle typu závady (hodinová sazba techniků 350–550 Kč, diagnostika od 600 Kč).',
      },
      {
        q: 'Jak získat 10letou záruku na motor pračky Bosch?',
        a: 'Bosch v ČR nabízí zdarma prodlouženou 10letou záruku na motor EcoSilence Drive (bezkartáčový motor) u vybraných modelů praček zakoupených od 1. října 2014. Stačí spotřebič po nákupu zaregistrovat na bosch-home.com/cz v sekci MyBosch a aktivovat prodloužení záruky. Vedle toho Bosch nabízí v ČR i 10letou ochranu proti korozi u vybraných myček.',
      },
      {
        q: 'Jakou má pračka Bosch životnost?',
        a: 'Průměrná životnost pračky Bosch je 10–15 let při běžném provozu (4–5 cyklů týdně). První závažnější závady přicházejí obvykle kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo nebo opotřebené motorové uhlíky.',
      },
      {
        q: 'Co znamená kód F + číslo na displeji Bosch?',
        a: 'F-kódy označují závažnější závady, často vyžadující odborný zásah. F21 obvykle indikuje problém s pohonem motoru (typicky opotřebené motorové uhlíky), F23 znamená aktivaci AquaStopu (může jít o skutečný únik vody i o false-positive při vlhku v podstavci), F43 chybu drive systému motoru. E-kódy bývá možné diagnostikovat doma.',
      },
    ],
  },
}
