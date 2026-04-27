'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface Props {
  errorCodeId: number
  initialYes?: number
  initialNo?: number
}

export default function HelpfulRating({ errorCodeId, initialYes = 0, initialNo = 0 }: Props) {
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)
  const [counts, setCounts] = useState({ yes: initialYes, no: initialNo })
  const [pending, setPending] = useState(false)

  const total = counts.yes + counts.no
  const helpfulPct = total > 0 ? Math.round((counts.yes / total) * 100) : null

  const handleVote = async (helpful: boolean) => {
    if (pending) return
    const next = helpful ? 'yes' : 'no'
    if (voted === next) return
    setPending(true)
    setVoted(next)
    try {
      const res = await fetch('/api/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorCodeId, helpful }),
      })
      const data = await res.json()
      if (data.success) {
        setCounts({ yes: data.helpfulYes, no: data.helpfulNo })
      }
    } catch { /* ignore */ } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-600">
        {voted
          ? 'Díky za zpětnou vazbu!'
          : helpfulPct !== null
            ? `Pomohl tento článek ${helpfulPct} % čtenářů. A vám?`
            : 'Pomohl vám tento článek?'}
      </span>

      <button
        type="button"
        onClick={() => handleVote(true)}
        aria-pressed={voted === 'yes'}
        disabled={pending}
        className={`btn-outline gap-2 disabled:opacity-60 ${
          voted === 'yes'
            ? 'border-green-400 bg-green-50 text-green-700'
            : 'hover:text-green-700 hover:border-green-300 hover:bg-green-50'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        Ano
        {counts.yes > 0 && <span className="text-xs text-gray-500">({counts.yes})</span>}
      </button>

      <button
        type="button"
        onClick={() => handleVote(false)}
        aria-pressed={voted === 'no'}
        disabled={pending}
        className={`btn-outline gap-2 disabled:opacity-60 ${
          voted === 'no'
            ? 'border-red-400 bg-red-50 text-red-700'
            : 'hover:text-red-700 hover:border-red-300 hover:bg-red-50'
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
        Ne
        {counts.no > 0 && <span className="text-xs text-gray-500">({counts.no})</span>}
      </button>
    </div>
  )
}
