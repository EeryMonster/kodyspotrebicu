'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Problem {
  slug: string
  img: string
  label: string
  desc: string
}

export default function ProblemsGrid({ problems }: { problems: Problem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {problems.slice(0, 8).map((p) => (
        <Link
          key={p.slug}
          href={`/symptom/${p.slug}`}
          className="flex min-h-[96px] items-start gap-3 rounded-xl border border-brand-border bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-surface">
            <Image src={p.img} alt="" width={72} height={72} className="h-10 w-10 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug text-gray-950">{p.label}</h3>
            <p className="mt-1 text-xs leading-snug text-gray-600">{p.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
