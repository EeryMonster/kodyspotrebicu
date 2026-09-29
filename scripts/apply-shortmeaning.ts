// Aplikuje opravené shortMeaning do Neon DB.
// Vstup: scripts/shortmeaning-fixes.json — mapa slug -> nový shortMeaning.
//
// Důvod vzniku: 15 kódů sušiček AEG a Electrolux mělo shortMeaning začínající
// 24slovnou větou "Kód platí pro starší generaci sušiček Electrolux Group…".
// shortMeaning se používá jako meta description, takže tahle předsádka
// ukrojila skoro celý popisek v SERP a skutečný význam kódu se do výsledku
// nevešel. Zároveň byla identická na všech 15 stránkách. Informace o platformě
// ENVo6 se přesunula do úvodu bloku "Detailní postup řešení".
//
// Spuštění:
//  - Lokálně:   npx ts-node --project tsconfig.seed.json scripts/apply-shortmeaning.ts
//  - Vercel:    automaticky přes `postbuild` hook v package.json
//
// Stejný vzor jako apply-detailed-steps.ts: idempotentní, bez DATABASE_URL
// gracefully skipne, chyby loguje ale nekončí nenulovým exit codem.

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as fs from "fs"
import * as path from "path"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "" })
const prisma = new PrismaClient({ adapter })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  DATABASE_URL není nastavené — přeskakuji opravy shortMeaning (build pokračuje).")
    return
  }

  const filePath = path.join(__dirname, "shortmeaning-fixes.json")
  const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, string>
  const entries = Object.entries(data)

  console.log(`Aplikuji ${entries.length} oprav shortMeaning...\n`)

  let success = 0
  let failed = 0

  for (const [slug, shortMeaning] of entries) {
    try {
      const updated = await prisma.errorCode.update({
        where: { slug },
        data: { shortMeaning },
        select: { code: true, slug: true },
      })
      console.log(`✅ ${updated.code} (${updated.slug})`)
      success++
    } catch (err) {
      console.error(`❌ ${slug}:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log(`\nHotovo: ${success} úspěšně, ${failed} selhalo.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error("❌ Opravy shortMeaning selhaly:", e instanceof Error ? e.message : e)
  await prisma.$disconnect().catch(() => {})
  process.exit(0)
})
