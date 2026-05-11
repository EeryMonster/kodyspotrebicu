# Google Search Console — manuální akce po deployi

Tento checklist obsahuje úkony, které **musíš provést ručně** v Google Search Console.
Kód je nasazený a Google zatím o změnách neví — bez těchto kroků trvá týdny, než si jich všimne sám.

---

## 🔴 PRIORITY 1 — Vyřešit www vs non-www kanibalizaci

V exportu z GSC se objevují **obě verze** stejných stránek:
- `https://kodyspotrebicu.cz/electrolux/pracky/electrolux-pracka-e40` (non-www)
- `https://www.kodyspotrebicu.cz/...` (www)

Middleware už redirectuje `non-www → www`, ale Google si pamatuje obě URL.

### Akce 1.1 — Ověř obě property v GSC

1. Otevři https://search.google.com/search-console
2. V dropdownu vlevo nahoře musíš vidět **obě** property:
   - `https://www.kodyspotrebicu.cz` (preferred)
   - `https://kodyspotrebicu.cz` (non-www)
   
3. Pokud non-www property neexistuje, **přidej ji** (tlačítko "Add property"). Bez ní nemůžeš non-www URL spravovat.

### Akce 1.2 — Submit sitemap na obou property

1. V property `www.kodyspotrebicu.cz`:
   - Levé menu → **Sitemaps**
   - Přidej: `https://www.kodyspotrebicu.cz/sitemap.xml`
   - (Pokud už je tam, klikni na "..." → "Resubmit")

2. V property `kodyspotrebicu.cz` (non-www):
   - **NEPŘIDÁVEJ** sitemap. Necháváme Google, ať pochopí, že non-www je pryč.

### Akce 1.3 — Removal request pro top non-www URL

V property **non-www** `kodyspotrebicu.cz`:
1. Levé menu → **Indexing → Removals**
2. Klikni "New request" → "Temporarily remove URL"
3. Submit jednu po druhé tyto URL (top performery, kde je kanibalizace nejvíc):
   ```
   https://kodyspotrebicu.cz/znacka/aeg
   https://kodyspotrebicu.cz/mycky
   https://kodyspotrebicu.cz/electrolux/pracky/electrolux-pracka-e40
   https://kodyspotrebicu.cz/aeg/pracky/aeg-pracka-e11
   https://kodyspotrebicu.cz/symptom/buben-se-neotaci
   https://kodyspotrebicu.cz/symptom/susicka-se-prehriva
   https://kodyspotrebicu.cz/symptom/myÄka-zapÃ¡chÃ¡
   ```
   (poslední je legacy diakritika, zachycená v indexu před fixem — odstraň ručně)

> **Pozn.:** Removal je 6 měsíců dočasný. Mezitím 301 z middleware Google naučí, že non-www je redirect.

---

## 🟠 PRIORITY 2 — Force reindex top stránek

Po deployi nových title/meta a schema chceme co nejrychleji reindex.

### Akce 2.1 — URL Inspection + Request indexing

V property **www.kodyspotrebicu.cz**:
1. Nahoře v search baru zadej URL → Enter
2. Klikni **"Request indexing"** (vpravo nahoře)
3. Opakuj pro tyto URL (priorita podle dopadu):

```
# Pillar pages s novým title (nejvyšší ROI):
https://www.kodyspotrebicu.cz/pracky
https://www.kodyspotrebicu.cz/mycky
https://www.kodyspotrebicu.cz/susicky
https://www.kodyspotrebicu.cz/znacka/aeg
https://www.kodyspotrebicu.cz/znacka/bosch
https://www.kodyspotrebicu.cz/znacka/samsung

# Top zero-click stránky kde čekáme nový title:
https://www.kodyspotrebicu.cz/bosch/mycky/bosch-mycka-e24
https://www.kodyspotrebicu.cz/siemens/mycky/siemens-mycka-e22
https://www.kodyspotrebicu.cz/whirlpool/mycky/whirlpool-mycka-f3
https://www.kodyspotrebicu.cz/electrolux/pracky/electrolux-pracka-e40
https://www.kodyspotrebicu.cz/bosch/mycky/bosch-mycka-e25

# Nové pillar pages (musí Google najít):
https://www.kodyspotrebicu.cz/electrolux/pracky
https://www.kodyspotrebicu.cz/bosch/mycky
https://www.kodyspotrebicu.cz/whirlpool/mycky

# Nové symptom pages (po seedu DB):
https://www.kodyspotrebicu.cz/symptom/jak-vypustit-pracku
https://www.kodyspotrebicu.cz/symptom/voda-pri-napousteni-tece
https://www.kodyspotrebicu.cz/symptom/voda-zustava-v-pracce
```

> **Limit:** Max ~10–12 indexing requestů denně. Rozlož to na 2 dny.

---

## 🟡 PRIORITY 3 — Validace rich results (HowTo + Article schema)

Nové schema musíme ověřit, jinak Google ignoruje.

### Akce 3.1 — Rich Results Test

1. Otevři https://search.google.com/test/rich-results
2. Zadej URL: `https://www.kodyspotrebicu.cz/electrolux/pracky/electrolux-pracka-e40`
3. Měl by detekovat:
   - ✅ `Article` (TechArticle)
   - ✅ `BreadcrumbList`
   - ✅ `HowTo` (s estimatedCost)
   - ✅ `FAQPage`

4. Pokud je nějaká chyba (Warning / Error), **screenshot a pošli mi** — opravím.

5. Otestuj 3–5 random stránek — schema je generovaný stejně, ale data se liší.

---

## 🟢 PRIORITY 4 — Měření dopadu (za 7 a 30 dní)

V GSC nastav baseline ke dnešku, ať uvidíš změnu.

### Akce 4.1 — Export srovnávacích dat

V property www:
1. **Performance** → datum: posledních 7 dní (před deployem)
2. Klikni **Export → Excel**
3. Ulož jako `gsc-baseline-2026-05-11.xlsx`
4. Za 7 dní (2026-05-18) udělej stejný export jako `gsc-week1.xlsx`
5. Za 30 dní (2026-06-10) jako `gsc-month1.xlsx`

### Co sledovat (KPIs):

| Metrika | Baseline | Cíl týden 1 | Cíl měsíc 1 |
|---------|----------|-------------|-------------|
| **Total CTR** | 1.63 % | 2.0 % | 2.8 % |
| **Avg position** | 9.4 | 8.5 | 7.0 |
| **`/pracky` CTR** | 0.81 % | 1.5 % | 2.5 % |
| **`bosch-mycka-e24` clicks** | 0 | 1+ | 5+ |
| **Imp z pillar pages** | 0 | 50+ | 200+ |

---

## 🔵 PRIORITY 5 — Backlinks (dlouhodobě)

Bez backlinků se z pos 7-9 nepohneš. Cíl: **3-5 quality backlinků za měsíc**.

### Realisticky doporučená místa (DR 30+):

1. **Mimibazar fórum** (DR ~55) — sekce "Domácnost / Spotřebiče"
   - Hledej topic "Pračka chyba E40" / "Myčka nemyje"
   - Odpověz konkrétně + link na svou stránku ("Tady mám detailní návod...")

2. **Reddit /r/CzechRepublic** (DR ~90)
   - Když narazíš na otázku ohledně spotřebiče, odpověz hodnotně + link
   - Nikdy nespamuj — pošli max 1 link na 5 odpovědí

3. **Zive.cz / Idnes.cz Bydlení komentáře** (DR ~80)
   - Pod články o opravách spotřebičů
   - Buď konkrétní, ne "podívejte se sem"

4. **Heureka.cz recenze** (DR ~80) — nepřímé, ale drives traffic
   - Tvoje stránka jako "Jak řešit chybu E40" v recenzi konkrétního modelu

5. **Wikipedie.cz** — sekce "Pračka", "Myčka nádobí"
   - Externí odkaz jako "Databáze chybových kódů"
   - Pozor: bez jasné encyklopedické hodnoty editor smaže

> **Anti-pattern:** NIKDY nepoužívej linkbuilding služby z Marketplace. Google to detekuje a propadneš.

---

## 📅 Časový plán

| Den | Akce |
|-----|------|
| **Dnes (2026-05-11)** | Akce 1.1, 1.2, 1.3 (GSC property + sitemap + removal) + 2.1 (5–10 indexing requestů) + 3.1 (rich results test) |
| **Zítra (2026-05-12)** | 2.1 zbylých 5–10 indexing requestů + 4.1 baseline export |
| **Týden 1 (do 2026-05-18)** | Sleduj GSC denně, sbírej 1–2 backlinky |
| **Týden 2–4** | Backlink kampaň + monitoring KPI |

---

## ❓ Co když něco nefunguje

- **Pillar `/electrolux/pracky` → 404** — DB ještě neobsahuje brand+appliance kombinaci. Zkontroluj `prisma.errorCode.count` pro brand.
- **Nové meta se neukazují v SERP** — Google si je přečetl, ale ještě nezobrazil. Trvá 3–14 dní.
- **Symptom pages 404** — Vyžadují re-seed DB (`npx tsx prisma/seed.ts`). Zeptej se Clauda na deploy.
- **Rich result test = error** — Pošli mi screenshot, opravím schema.
