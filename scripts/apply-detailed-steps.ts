// Aplikuje "Detailní postup řešení" (pole `content`) do Neon DB.
// Vstup: scripts/detailed-steps.json — mapa slug -> pole content bloků.
//
// Spuštění:
//  - Lokálně:   npx ts-node --project tsconfig.seed.json scripts/apply-detailed-steps.ts
//  - Vercel:    automaticky přes `postbuild` hook v package.json
//
// Stejný vzor jako apply-miele-rewrites.ts: idempotentní, bez DATABASE_URL
// gracefully skipne, chyby loguje ale nekončí nenulovým exit codem, aby
// transient DB problém nezablokoval deploy.

import "dotenv/config"
import { PrismaClient, Prisma } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as fs from "fs"
import * as path from "path"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "" })
const prisma = new PrismaClient({ adapter })

// Bloky se do Prismy předávají jako Prisma.InputJsonValue[] — vlastní interface
// by neprošel typovou kontrolou (chybí index signature pro InputJsonObject).
// Tvar bloku: { type: "text"|"image", value?, tag?, src?, alt? }
type Block = Prisma.InputJsonValue

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  DATABASE_URL není nastavené — přeskakuji detailní postupy (build pokračuje).")
    return
  }

  const filePath = path.join(__dirname, "detailed-steps.json")
  const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, Block[]>
  const entries = Object.entries(data)

  console.log(`Aplikuji detailní postupy pro ${entries.length} kódů...\n`)

  let success = 0
  let failed = 0

  for (const [slug, content] of entries) {
    try {
      const updated = await prisma.errorCode.update({
        where: { slug },
        data: { content },
        select: { code: true, slug: true },
      })
      console.log(`✅ ${updated.code} (${updated.slug}) — ${content.length} bloků`)
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
  console.error("❌ Detailní postupy selhaly:", e instanceof Error ? e.message : e)
  await prisma.$disconnect().catch(() => {})
  process.exit(0)
})
