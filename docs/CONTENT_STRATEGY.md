# Obsahová strategie a pravidla pro texty chybových kódů (kodyspotrebicu.cz)

Tento dokument slouží jako závazný stylopis (guideline) pro vytváření a rozšiřování obsahu v databázi chybových kódů (`prisma/seed.ts`). Vychází z požadavků uživatele na detailní, praktické a SEO-přívětivé texty.

## 1. Obecná pravidla stylu
*   **Konec strohých informací:** Popisy chyb nesmí být pouze jednořádkové věty typu "Porucha F05 je ucpání spotřebiče". Každý kód musí uživateli nabídnout **komplexní příběh a návod k řešení**.
*   **Empatie a uklidnění:** Uživatel čte text ve stresové situaci (pračka neodtéká, teče voda). Text by měl působit uklidňujícím a návodným dojmem (např. "Chyba XY je poměrně častým problémem, který vás zastaví uprostřed praní... Jak postupovat, abyste si nemuseli ihned volat servis...").
*   **Strukturování a formátování:** Využívejte podnadpisů (h3), odstavců a odrážek (v poli `content`).

## 2. Povinná struktura každého záznamu (objekt v `seed.ts`)

Při přidávání nového kódu dbejte na plné využití všech vlastností, které schéma nabízí:

### `title` a `shortMeaning`
*   **`title`:** Jasný, klikatelný nadpis (např. "Chyba odtoku vody / ucpání spotřebiče").
*   **`shortMeaning`:** Srozumitelné a praktické shrnutí v jedné větě, např. "Pračka nedokáže správně vypustit vodu z bubnu kvůli zanesenému filtru."

### `safeChecks` (Co může vyzkoušet doma)
Konkrétní kroky, ne jen "vyčistěte filtr".
*   *Špatně:* Vyčistěte filtr.
*   *Dobře:* Otevřete kryt filtru čerpadla, vypusťte vodu hadičkou nebo samospádem do ploché nádoby a vyčistěte filtr. Prstem zkontrolujte, zda se volně točí vrtulka.
*   *Vždy zahrnout:* Instrukci na reset spotřebiče (např. "Odpojte od sítě na 1-2 minuty" nebo "Podržte Start/Pause na 10 vteřin").

### `likelyCauses` (Nejčastější příčiny)
Běžným jazykem popsané fyzické problémy:
*   "Drobný předmět (mince, knoflík, nit) blokující lopatky čerpadla."
*   "Zablokovaná, zalomená nebo nesprávně umístěná odtoková hadice."

### `whenToStopAndCallService` (Kdy volat servis)
Bezpečnostní pojistka:
*   "Pokud pračka vydává neobvyklé chrčivé zvuky v oblasti čerpadla."
*   "Když dojde k poškození elektrických částí."

### `faq` (Často kladené dotazy)
Vyplnit vždy 3-4 užitečné Q&A. Tvoří to bohaté výsledky v Googlu!
*   **Q:** Co znamená chyba [KÓD] u pračky [ZNAČKA]?
*   **Q:** Mohu sám čistit filtr čerpadla?
*   **Q:** Jak resetuji pračku [ZNAČKA] s chybou [KÓD]?

### `content` (Detailní postup)
Tohle je srdce detailu. Musí obsahovat formátovaný text (odstavce `p`, podnadpisy `h3`).
*   **Úvod:** Krátký úvod, proč chyba vzniká.
*   **Postup údržby krok za krokem:** Detailně popsané (voda do kýbla, zachycená mince, kontrola vrtulky).
*   **Reset a zkouška:** Zmínka o zapojení do sítě, způsobu resetu a testování pomocí krátkého programu bez prádla.

## 3. Příklad ideálního obsahu (zapsáno v `content` poli)
```typescript
content: [
  { type: "text", tag: "p", value: "Chyba F05 u praček Whirlpool je poměrně častým problémem..." },
  { type: "text", tag: "h3", value: "Krok 1: Postup údržby a čištění filtru" },
  { type: "text", tag: "p", value: "Odpojte pračku ze sítě. Jestli je v pračce voda, vypusťte ji..." },
  { type: "text", tag: "p", value: "Velmi často se stává, že u lamely vrtulky v prostoru filtru se zachytí drobný předmět..." },
  { type: "text", tag: "h3", value: "Krok 2: Kontrola hadice a reset" },
  { type: "text", tag: "p", value: "Zkontrolujte stav odtokové hadice..." },
  { type: "text", tag: "p", value: "Po vyčištění a zapojení pračky zpět do sítě proveďte reset..." }
]
```
