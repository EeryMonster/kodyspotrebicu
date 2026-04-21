import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as fs from 'fs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const codes = await prisma.errorCode.findMany({
    orderBy: [{ brand: 'asc' }, { applianceType: 'asc' }, { code: 'asc' }]
  })
  fs.writeFileSync('scripts/all_codes.json', JSON.stringify(codes, null, 2))
  console.log(`Exported ${codes.length} codes`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
