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
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {problems.slice(0, 12).map((p) => (
          <Link
            key={p.slug}
            href={`/symptom/${p.slug}`}
            className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="shrink-0 w-12 h-12 flex items-center justify-center">
              <Image src={p.img} alt={p.label} width={80} height={80} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-snug">{p.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Link href="/problemy" className="text-sm text-blue-600 hover:underline">
          Přejít na všechny problémy ({problems.length}) →
        </Link>
      </div>
    </>
  )
}
