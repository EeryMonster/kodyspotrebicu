// Rozšířený obsah pro kategoriální stránky /pracky, /mycky, /susicky.
// Cíl: ~800-1000 slov originálního CZ obsahu per kategorii pro SEO + AdSense
// E-E-A-T. Sdílí strukturu s brand-content.ts pro vizuální konsistenci.

export interface CategoryContent {
  generations?: { name: string; description: string }[]
  commonProblems?: { name: string; codesAcrossBrands: string; tip: string }[]
  maintenance?: string
  longevity?: string
  faq?: { q: string; a: string }[]
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  pracka: {
    generations: [
      {
        name: 'Mechanické pračky (~ do roku 2005)',
        description: 'Pračky s otočným programátorem a relé. Neměly displej – závadu indikovala blikající kontrolka nebo program, který neproběhl. Jednoduchá konstrukce znamená levnější opravy, ale méně funkcí.',
      },
      {
        name: 'Elektronické pračky (2005–2018)',
        description: 'Pračky s displejem zobrazujícím chybové kódy (E + číslo nebo F + číslo). Hlavní pohon přes řemenice a motor s uhlíky, později invertorové motory. Standard pro většinu domácností v ČR.',
      },
      {
        name: 'Smart pračky (2018 a novější)',
        description: 'Pračky s Wi-Fi konektivitou (Home Connect, ThinQ, SmartThings, MyAEG), bezkartáčovými invertorovými motory (Direct Drive, EcoSilence Drive, iQdrive, ProSmart), automatickým dávkováním (i-DOS, AutoDose) a diagnostikou přes aplikaci.',
      },
    ],
    commonProblems: [
      {
        name: 'Pomalé nebo žádné plnění vodou',
        codesAcrossBrands: 'Bosch E17 · Siemens F17 · AEG/Electrolux E10/E11 · Beko E10 · Samsung 4E · LG IE · Whirlpool F02',
        tip: 'Otevřený přívodní kohout, čisté sítko v hadici (přední strana ventilu), tlak alespoň 1 bar. Bezpečně lze řešit doma.',
      },
      {
        name: 'Pračka nevypouští vodu',
        codesAcrossBrands: 'Bosch/Siemens F18 · AEG/Electrolux E20/E21 · Beko E20 · Samsung 5E · LG OE · Whirlpool F21',
        tip: 'Zanesený filtr u dna (vyšroubujte a propláchněte), ucpaná vypouštěcí hadice nebo sifon. Lze obvykle vyřešit svépomocí.',
      },
      {
        name: 'Chyba motoru (opotřebené uhlíky)',
        codesAcrossBrands: 'Bosch/Siemens F21 · AEG/Electrolux E50/E51 · Samsung 3E · LG CE/LE · Whirlpool F11',
        tip: 'Typicky opotřebené motorové uhlíky u motorů s kartáči. Vyžaduje servisní výměnu (1 200–2 500 Kč). Bezkartáčové invertorové motory tuto závadu nemají.',
      },
      {
        name: 'Nevyvážená náplň (vibrace)',
        codesAcrossBrands: 'Samsung/LG UE · Beko C9 · Whirlpool F0E5',
        tip: 'Přerozdělte prádlo rovnoměrně, vyhněte se praní jediného těžkého kusu (deky, ručníky). Zkontrolujte, že pračka stojí vodorovně.',
      },
      {
        name: 'AquaStop / únik vody',
        codesAcrossBrands: 'Bosch/Siemens E13/F23 · AEG/Electrolux E30 · Samsung/LG LE · Whirlpool F8E1',
        tip: 'Závažné. Aktivován systém AquaStop kvůli skutečnému úniku nebo vlhku v podstavci. Vypněte přívodní kohout a vyžádejte servis.',
      },
      {
        name: 'Chyba ohřevu vody',
        codesAcrossBrands: 'Bosch/Siemens F19 · AEG/Electrolux E60/E61/E62 · Beko H2/H3 · Samsung HE · LG HE · Whirlpool F08',
        tip: 'Vadné topné těleso nebo NTC teplotní senzor. Vyžaduje servisní výměnu (1 500–3 000 Kč). U starších modelů často následek tvrdé vody – pomáhá pravidelné odvápnění.',
      },
    ],
    maintenance: 'Pravidelná údržba prodlužuje životnost pračky o roky a předchází většině poruch. Doporučujeme: jednou měsíčně spustit prázdný cyklus na 90 °C nebo speciální „čisticí program" (rozpustí zbytky pracího prostředku a zabije bakterie); jednou za 3 měsíce vyčistit odpadní filtr u dna pračky (pravidelně se ucpává mincemi, knoflíky, žmolky); jednou za 3 měsíce odvápnit pračku speciálním přípravkem (zejména v lokalitách s tvrdou vodou). Po každém praní nechávejte dvířka i zásobník na prací prostředek otevřené, aby se vlhkost odpařila a předešlo se zápachu. Gumové těsnění dvířek otírejte vlhkým hadříkem v záhybech – právě tam se nejčastěji usazuje plíseň.',
    longevity: 'Pračky obvykle slouží 7–12 let při běžném provozu (4–5 cyklů týdně) – podle vlastní značky, péče a kvality vody. Prémiové značky (Miele 15+, Bosch s EcoSilence Drive 10–15) vydrží déle, levnější modely 7–10 let. Závažnější závady přicházejí typicky kolem 7.–9. roku: opotřebená ložiska bubnu (3 500–6 000 Kč na opravu), motorové uhlíky (1 200–2 500 Kč), topné těleso (1 500–3 000 Kč). Obecné pravidlo pro rozhodnutí oprava vs. výměna: pokud cena opravy přesahuje 50 % hodnoty nového srovnatelného spotřebiče, vyplatí se výměna. Pokud máte pračku se 10letou zárukou na motor (Bosch EcoSilence Drive, Siemens iQdrive, LG Direct Drive, Beko ProSmart) a motor selže, oprava je v záruce zdarma – cena ostatních dílů ale vaše záruka nepokrývá.',
    faq: [
      {
        q: 'Proč moje pračka silně vibruje?',
        a: 'Nejčastější příčiny: nerovnoměrně rozložené prádlo v bubnu, příliš malá nebo příliš velká náplň, nevyrovnaná pračka (nestojí přesně vodorovně). Méně časté, ale závažnější: opotřebené tlumiče nebo ložiska bubnu. Při malém množství přidejte další kusy, zkontrolujte nastavení nožiček vodováhou a mezi pračkou a stěnou nechte alespoň 2 cm prostoru.',
      },
      {
        q: 'Co znamenají písmenné kódy v kódu chyby (E, F, U, D)?',
        a: 'Písmeno na začátku obvykle označuje kategorii: E (Error) je obecná chyba, F = Failure obvykle závažnější závada vyžadující servis, U = User error (nevyvážení, otevřená dvířka), D = Door (problém s dveřmi). Konkrétní význam se liší podle značky – kompletní seznam najdete v naší databázi. Pozor: Samsung používá unikátní formát kódů s číslicí a písmenem (4E, 5E, UE), Beko zase H1–H8 pro elektroniku.',
      },
      {
        q: 'Kdy je pračka neopravitelná?',
        a: 'Žádná pračka není „neopravitelná" – jen některé opravy se nevyplatí ekonomicky. Pravidlo: pokud oprava přesahuje 50 % ceny nového srovnatelného spotřebiče (přibližně 6 000 Kč pro mid-range pračku), zvažte výměnu. Závady, kdy je výměna obvykle lepší volba: vadná řídicí deska + stáří 8+ let, vadný motor u bezzáručního modelu, vadný buben + ložiska + tlumiče současně (kombinovaná oprava 7 000+ Kč).',
      },
      {
        q: 'Jak často mám dělat „servisní praní" (prázdný cyklus)?',
        a: 'Doporučujeme jednou měsíčně. Spusťte pračku naprázdno na nejvyšší teplotu (90 °C) bez prádla a bez nebo s minimem pracího prostředku. Tento cyklus rozpustí usazené zbytky pracích prostředků a zabije bakterie a plísně, které způsobují zápach z bubnu. Některé pračky mají speciální „Drum Clean" nebo „Hygiena+" program přímo pro tento účel.',
      },
      {
        q: 'Jak vybrat náhradní díl, když znám jen značku a model?',
        a: 'Pro přesnou identifikaci dílu potřebujete typové označení (najdete na štítku uvnitř dvířek nebo na zadní straně) a výrobní číslo. S těmito údaji vám eshop nebo servis najde kompatibilní díl. Pro nejčastější díly (filtry, čerpadla, hadice) najdete univerzální alternativy. Při objednávce dílu na detailu chybového kódu v naší databázi vidíte přímé prokliky na Heureku.cz s relevantními díly pro vaši značku.',
      },
    ],
  },
  mycka: {
    generations: [
      {
        name: 'Starší elektronické myčky (do roku 2010)',
        description: 'Myčky bez displeje (např. Siemens SE/SF, Miele G4xxx) – chyby hlásí blikáním kontrolek místo číselných kódů. Typicky 12 sad nádobí, hlučnost 48–50 dB, plastová vana.',
      },
      {
        name: 'Moderní myčky s displejem (2010–2018)',
        description: 'Standard pro většinu domácností. Displej zobrazuje chybové kódy (E + číslo nebo F + číslo u Miele/Whirlpool, I + číslo u AEG/Electrolux). Nerezová vana u prémiových modelů, hlučnost 42–46 dB, 13–14 sad.',
      },
      {
        name: 'Smart myčky (2018+)',
        description: 'Myčky s Wi-Fi (Home Connect, MyAEG, SmartThings), automatickým dávkováním (PowerDisk u Miele, AutoDos u Bosch), sušením Zeolithem (BSH/Siemens iQ700+) a hlasovým ovládáním. Hlučnost 38–42 dB, energetická třída A.',
      },
    ],
    commonProblems: [
      {
        name: 'Zanesený filtr',
        codesAcrossBrands: 'Bosch/Siemens E22 · AEG/Electrolux I10 · Beko E1 · Samsung HE · LG IE · Whirlpool F1',
        tip: 'Nejčastější problém u myček. Vyšroubujte spodní filtr (po vyjmutí košů), propláchněte pod tekoucí vodou a vraťte zpět. Lze řešit doma za 5 minut.',
      },
      {
        name: 'Myčka nevypouští vodu',
        codesAcrossBrands: 'Bosch/Siemens E24/E25 · AEG/Electrolux I20 · Beko E2 · Samsung 5C · LG OE · Whirlpool F2',
        tip: 'Zkontrolujte: spodní filtr, sifon (často ucpaný zbytky jídla), vypouštěcí hadici (zalomení) a vypouštěcí čerpadlo (cizí předmět, tvrdá kost).',
      },
      {
        name: 'Aqua Stop / únik vody',
        codesAcrossBrands: 'Bosch/Siemens E15 · AEG I30 · Samsung/LG LE · Beko E4',
        tip: 'Závažné. Aktivován systém ochrany proti vyplavení – ve vaně myčky je voda. Vypněte přívodní kohout a vyžádejte servis. Často způsobeno nadměrnou pěnou nebo skutečným úniknem.',
      },
      {
        name: 'Chyba ohřevu vody',
        codesAcrossBrands: 'Bosch/Siemens E08/E09 · AEG/Electrolux I60 · Beko E3 · Samsung HE · LG HE · Whirlpool F3',
        tip: 'Vadné průtokové topení nebo NTC senzor teploty. Vyžaduje servisní výměnu (1 500–3 000 Kč). U starších myček bývá příčinou tvrdá voda a vodní kámen – pomáhá pravidelné odvápnění.',
      },
      {
        name: 'Cirkulační čerpadlo',
        codesAcrossBrands: 'Miele F594 · AEG/Electrolux I50 · Beko E5 · LG nE',
        tip: 'Hluk při běhu, voda nedotéká k ostřikovacím ramenům. Vyžaduje servisní výměnu (1 500–2 800 Kč včetně práce).',
      },
    ],
    maintenance: 'Údržba myčky předchází většině poruch a zlepšuje výsledky mytí. Doporučujeme: jednou měsíčně spustit „servisní program" (nejvyšší teplota bez nádobí) se speciálním čističem myček nebo octem (1 šálek do spodní vany); jednou za 3 měsíce vyčistit spodní filtr (zbytky jídla, žmolky) i hrubý filtr; pravidelně doplňovat speciální sůl (změkčuje vodu, předchází vodnímu kameni) a leštidlo (lepší sušení a méně skvrn); kontrolovat ostřikovací ramena (otvory se mohou ucpat) – vyjmout a propláchnout pod tekoucí vodou. V lokalitách s tvrdou vodou je sůl a odvápnění klíčové – jinak hrozí vápenné usazeniny v topení a předčasná porucha.',
    longevity: 'Myčky obvykle slouží 7–12 let podle značky a péče. Z průzkumu dTest spolehlivosti vede Miele (průměrná životnost 14 let a 3 měsíce) a Asko (oba získali 86 bodů v indexu spokojenosti). Mass-market značky (Beko, Whirlpool, Samsung) se pohybují kolem 7–10 let. Nejčastější závady v polovině životnosti: ucpané topení (vápník), opotřebené cirkulační čerpadlo, vadný NTC senzor teploty. Pravidlo oprava vs. výměna: pokud cena opravy přesahuje 50 % ceny nové srovnatelné myčky (orientačně 5 000 Kč pro mid-range), zvažte výměnu – obzvláště u modelů 8+ let bez Zeolithu, kde nová myčka uspoří 30 % vody a energie. U prémiových značek (Miele, Bosch Serie 6+) má smysl opravovat i nákladnější závady díky delší zbývající životnosti.',
    faq: [
      {
        q: 'Proč myčka neuschne nádobí?',
        a: 'Tři nejčastější příčiny: chybí leštidlo (doplňte do zásobníku a zkontrolujte dávkování), program bez sušení (krátké/eco programy často nesuší – vyberte intenzivní nebo „Auto" s vyšší teplotou), nebo plast neuschne sám (plast neudrží teplo jako keramika/sklo – běžné chování, ne závada). U prémiových myček s Zeolithem (Bosch Serie 6+, Siemens iQ700+) je sušení výrazně lepší díky absorpci vlhkosti.',
      },
      {
        q: 'Proč zbývá voda v myčce po programu?',
        a: 'Pokud zbývá malé množství vody u spodního filtru, je to normální (myčka tuto vodu drží pro těsnění čerpadla). Pokud je vody hodně (5+ cm v dolní vaně), jde o problém s vypouštěním: zanesený filtr, ucpaný sifon, vadné vypouštěcí čerpadlo, nebo aktivní AquaStop. Začněte vyčištěním filtru – řeší to 70 % případů.',
      },
      {
        q: 'Co znamenají kontrolky leštidlo nebo sůl?',
        a: 'Většina myček má samostatné kontrolky pro nedostatek soli a leštidla. Sůl změkčuje vodu a předchází vodnímu kameni v topení (nelze ji nahradit obyčejnou kuchyňskou solí – musí být speciální regenerační sůl). Leštidlo zlepšuje sušení a předchází skvrnám od vody. Obě kontrolky znamenají potřebu doplnit – nepoškozuje to myčku, ale výsledky mytí budou horší.',
      },
      {
        q: 'Co je Zeolith sušení a vyplatí se?',
        a: 'Zeolith je přírodní minerál, který absorbuje vlhkost a uvolňuje ji jako teplo. U myček (Bosch Serie 6+, Siemens iQ700+) výrazně zlepšuje sušení – nádobí včetně plastů vychází suché. Vyplatí se hlavně domácnostem, které myčku používají denně a chtějí top výsledky bez ručního dosušování. U běžných uživatelů 2–3× týdně stačí kvalitní leštidlo a Zeolith je nadbytek.',
      },
      {
        q: 'Jak často doplňovat sůl a leštidlo?',
        a: 'Závisí na tvrdosti vody ve vaší lokalitě a frekvenci mytí. Orientačně: sůl jednou za 4–8 týdnů (tvrdá voda = častěji), leštidlo jednou za 2–4 týdny. Nastavte myčce správnou tvrdost vody přes ovládací panel – tím se sůl dávkuje optimálně. Tvrdost vody zjistíte u vodárenského dodavatele (často je informace na faktuře nebo webu).',
      },
    ],
  },
  susicka: {
    generations: [
      {
        name: 'Odtahové sušičky',
        description: 'Vyhánějí vlhký vzduch hadicí ven z bytu. V ČR málo rozšířené, protože vyžadují stavební zásah (otvor ven, odvod kondenzátu). Levnější pořizovací cena, ale problematická instalace.',
      },
      {
        name: 'Kondenzační sušičky (klasické)',
        description: 'Ohřívají vzduch elektrickým topným tělesem, vlhkost kondenzuje do nádoby. Žádná instalace navíc – stačí zásuvka. Vyšší spotřeba (okolo 561 kWh/rok) než tepelné čerpadlo, ale levnější pořizovací cena.',
      },
      {
        name: 'Sušičky s tepelným čerpadlem',
        description: 'Modernější technologie – recyklují teplo. Spotřeba kolem 177 kWh/rok (zhruba třetina kondenzační), 1–2 kWh na cyklus (max 8 Kč). Vyšší pořizovací cena, ale za 2–3 roky se rozdíl vrátí. Všechny sušičky s energetickou třídou A mají tepelné čerpadlo.',
      },
    ],
    commonProblems: [
      {
        name: 'Ucpaný kondenzátor / výfuková hadice',
        codesAcrossBrands: 'LG D75/D80/D90/D95 · Bosch/Siemens E:02 · AEG/Electrolux E5E · Samsung FE · Beko H03/H04',
        tip: 'Nejčastější problém sušiček. Pročistěte filtr žmolků (po každém cyklu!), kondenzátor (1× za 3 měsíce vyjmout a propláchnout) a u odtahových sušiček i výfukovou hadici. LG diagnostikuje úroveň ucpání ve 4 stupních (75/80/90/95 %).',
      },
      {
        name: 'Přehřátí sušičky',
        codesAcrossBrands: 'Bosch/Siemens E:03 · AEG/Electrolux E62 · Beko H01 · Samsung HE · Whirlpool F02',
        tip: 'Termostat nebo bezpečnostní pojistka. Nejčastěji způsobeno: ucpaným filtrem žmolků, kondenzátorem, nebo nedostatečným větráním kolem sušičky. Vyčistěte vše a nechte sušičku chladnout 2 hodiny.',
      },
      {
        name: 'Chyba senzoru teploty',
        codesAcrossBrands: 'Bosch/Siemens E:01 · AEG/Electrolux E2E · Beko H02 · Samsung ET/TC · LG TE · Whirlpool F03',
        tip: 'Vadný NTC termistor v bubnu nebo výfuku. Vyžaduje servisní výměnu (1 200–2 000 Kč). Často signalizuje budoucí přehřátí.',
      },
      {
        name: 'Chyba kompresoru tepelného čerpadla',
        codesAcrossBrands: 'Bosch/Siemens E:67 · AEG/Electrolux EHF/E6F · Samsung HC/HP · LG LE2',
        tip: 'Závažná závada u sušiček s tepelným čerpadlem (3 000–8 000 Kč na opravu). U starších modelů 8+ let se obvykle už nevyplatí. Zkontrolujte záruku na kompresor (Samsung 20 let, jiné značky obvykle 10 let).',
      },
      {
        name: 'Sušení trvá příliš dlouho',
        codesAcrossBrands: 'Bosch/Siemens E:02 · AEG/Electrolux ETE · Beko H02 · Samsung HC',
        tip: 'Hlavní příčiny: zanesený filtr/kondenzátor (vyčistit), přeplnění bubnu (max 50–75 % objemu), prádlo příliš mokré po praní (zvýšit odstředění pračky), nebo skutečná závada termostatu/senzoru.',
      },
    ],
    maintenance: 'Sušičky vyžadují pravidelnou údržbu více než pračky či myčky – právě filtr žmolků a kondenzátor jsou nejčastější příčinou poruch. Doporučujeme: po KAŽDÉM cyklu vyčistit filtr žmolků (jinak hrozí přehřátí a požár!); jednou za 3 měsíce vyjmout kondenzátor a propláchnout pod sprchou (u modelů s tepelným čerpadlem zkontrolovat čistotu výparníku); jednou za 6 měsíců vyprázdnit zásobník na kondenzát (pokud sušička nemá přímý odtok); zajistit větrání kolem sušičky (alespoň 5 cm na bocích, 10 cm vzadu); kontrolovat výfukovou hadici u odtahových sušiček 1× ročně.',
    longevity: 'Sušičky obvykle slouží 10–13 let při běžném provozu (3–4 cykly týdně) – delší životnost než pračky díky méně frekventovanému používání a menšímu mechanickému namáhání. Sušičky s tepelným čerpadlem mají kratší životnost samotného kompresoru (typicky 8–12 let), ale levnější provoz vyrovnává. Závažné závady přicházejí: tepelné čerpadlo / kompresor (kolem 8.–10. roku, 3 000–8 000 Kč), motor ventilátoru (1 500–3 000 Kč), termostat (800–1 500 Kč). Pravidlo oprava vs. výměna: u sušiček s tepelným čerpadlem s vadným kompresorem starších 8 let se výměna obvykle vyplatí (úspora energie u novějšího modelu se rychle vrátí). U kondenzačních sušiček s vadným topným tělesem (1 500–2 500 Kč) má smysl opravit i u staršího modelu.',
    faq: [
      {
        q: 'Jaký typ sušičky vybrat – kondenzační, tepelné čerpadlo, nebo odtahová?',
        a: 'Pro většinu českých domácností: sušička s tepelným čerpadlem. Třetinová spotřeba elektřiny (kolem 8 Kč za cyklus místo 22 Kč u kondenzační), žádná stavební úprava, vyšší pořizovací cena se vrátí za 2–3 roky používání. Odtahové sušičky vyžadují otvor ven a v ČR jsou neobvyklé. Klasické kondenzační sušičky bez tepelného čerpadla se ještě prodávají, ale vyšší provozní náklady činí výhodu nižší ceny krátkodobou.',
      },
      {
        q: 'Kolik stojí jeden cyklus sušení?',
        a: 'Sušička s tepelným čerpadlem spotřebuje na cyklus 1–2 kWh (orientačně 5–8 Kč při aktuální ceně elektřiny v ČR). Kondenzační sušička bez tepelného čerpadla spotřebuje 3–4 kWh na cyklus (přibližně 15–22 Kč). Roční náklady: tepelné čerpadlo cca 1 000–1 500 Kč, kondenzační cca 3 000–4 500 Kč při 3 sušeních týdně.',
      },
      {
        q: 'Proč sušení trvá tak dlouho (3–4 hodiny)?',
        a: 'U sušiček s tepelným čerpadlem je delší doba cyklu normální – pracují při nižší teplotě (50–60 °C) než kondenzační (70–80 °C), aby šetřily energii a chránily prádlo. Pokud cyklus trvá výrazně déle než obvykle: zanesený filtr žmolků nebo kondenzátor, přeplnění (max 50–75 % bubnu), prádlo příliš mokré (zvyšte odstředění na pračce na 1200–1400 ot./min).',
      },
      {
        q: 'Jaké jsou kódy D75, D80, D90 a D95 u LG sušičky?',
        a: 'LG má v sušičkách jedinečný systém diagnostiky průchodnosti výfukové hadice / kondenzátoru. Kód D + číslo udává úroveň ucpání: D75 = 75 % ucpáno (lehké, vyčistit při příští údržbě), D80 = 80 % (vyčistit brzy), D90 = 90 % (vyčistit hned, jinak hrozí přehřátí), D95 = 95 % (kritické, neprovozovat). Tato funkce není u jiných značek – ostatní zobrazí kód až při skutečném přehřátí.',
      },
      {
        q: 'Vyplatí se kombinovaná pračkosušička oproti samostatným spotřebičům?',
        a: 'Pračkosušička je řešení pro malé byty bez prostoru na dva spotřebiče. Nevýhody: nižší kapacita sušení (vždy menší než kapacita praní – např. 8 kg prát, jen 5 kg sušit), delší cyklus (3–5 hodin sušení), vyšší spotřeba vody a energie (často potřebuje vodu na chlazení kondenzátoru). Pokud máte prostor, samostatná pračka + sušička s tepelným čerpadlem je z dlouhodobého hlediska úspornější a praktičtější.',
      },
    ],
  },
}
