import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: { code: string }
}

// /kod/[code] – universal redirect to canonical URL
export default async function KodPage({ params }: Props) {
  let entry: { brand: string; applianceType: string; slug: string } | null = null

  try {
    entry = await prisma.errorCode.findFirst({
      where: {
        OR: [
          { code: { equals: params.code, mode: 'insensitive' } },
          { altCodes: { has: params.code } },
        ],
      },
      select: { brand: true, applianceType: true, slug: true },
    })
  } catch { /* ignore */ }

  if (!entry) notFound()

  const appliancePath = { pracka: 'pracky', mycka: 'mycky', susicka: 'susicky' }[entry.applianceType] || entry.applianceType
  redirect(`/${entry.brand.toLowerCase()}/${appliancePath}/${entry.slug}`)
}
