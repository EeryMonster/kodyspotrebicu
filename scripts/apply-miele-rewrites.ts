// Aplikuje přepsané verze Miele kódů do Neon DB.
// Vstup: scripts/miele-rewrites.json
//
// Spuštění:
//  - Lokálně:   npx ts-node --project tsconfig.seed.json scripts/apply-miele-rewrites.ts
//  - Vercel:    automaticky přes `postbuild` hook v package.json (build → apply)
//
// Skript je idempotentní — bezpečně přepisuje stejné texty na stejné hodnoty.
// Když DATABASE_URL chybí (lokální build bez .env), skript se ukončí bez chyby,
// aby build neselhal. Chyby při DB writu se logují, ale exit code = 0,
// aby transient DB problémy nezablokovaly Vercel deploy.

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as fs from "fs"
import * as path from "path"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
})
const prisma = new PrismaClient({ adapter })

interface Rewrite {
  slug: string
  shortMeaning: string
  likelyCauses: string[]
  canUserTrySafeChecks: boolean
  safeChecks: string[]
  whenToStopAndCallService: string[]
  sourceUrl: string | null
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  DATABASE_URL není nastavené — přeskakuji Miele rewrites (build pokračuje).")
    return
  }

  const filePath = path.join(__dirname, "miele-rewrites.json")
  const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    rewrittenSlugs: string[]
    rewrites: Rewrite[]
  }

  console.log(`Aplikuji ${data.rewrites.length} přepsání Miele kódů...\n`)

  let success = 0
  let failed = 0

  for (const r of data.rewrites) {
    try {
      const updated = await prisma.errorCode.update({
        where: { slug: r.slug },
        data: {
          shortMeaning: r.shortMeaning,
          likelyCauses: r.likelyCauses,
          canUserTrySafeChecks: r.canUserTrySafeChecks,
          safeChecks: r.safeChecks,
          whenToStopAndCallService: r.whenToStopAndCallService,
          sourceUrl: r.sourceUrl,
        },
        select: { code: true, slug: true },
      })
      console.log(`✅ ${updated.code} (${updated.slug})`)
      success++
    } catch (err) {
      console.error(`❌ ${r.slug}:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log(`\nHotovo: ${success} úspěšně, ${failed} selhalo.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error("❌ Miele rewrites selhaly:", e instanceof Error ? e.message : e)
  await prisma.$disconnect().catch(() => {})
  // Exit 0 aby transient DB chyby (cold start, síťový výpadek) nezablokovaly
  // Vercel deploy. Chyby jsou v build logu — user si všimne.
  process.exit(0)
})
