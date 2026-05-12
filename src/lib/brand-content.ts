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
