// Aplikuje přepsané verze Miele kódů do Neon DB.
// Vstup: scripts/miele-rewrites.json
// Spuštění: npx ts-node --project tsconfig.seed.json scripts/apply-miele-rewrites.ts

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
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
