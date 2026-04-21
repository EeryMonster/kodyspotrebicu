'use client'

import { useState } from 'react'

interface Props {
  errorCodeId: number
  initialYes?: number
  initialNo?: number
}

export default function HelpfulRating({ errorCodeId, initialYes = 0, initialNo = 0 }: Props) {
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)
  const [counts, setCounts] = useState({ yes: initialYes, no: initialNo })

  const handleVote = async (helpful: boolean) => {
    setVoted(helpful ? 'yes' : 'no')
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
    } catch { /* ignore */ }
  }

  if (voted) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{voted === 'yes' ? '😊' : '🙏'}</span>
        <span>{voted === 'yes' ? 'Díky za zpětnou vazbu!' : 'Díky! Budeme obsah zlepšovat.'}</span>
        <span className="text-xs text-gray-400">👍 {counts.yes} · 👎 {counts.no}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Pomohl vám tento článek?</span>
      <button
        onClick={() => handleVote(true)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 border border-gray-200 hover:border-green-300 rounded-lg px-3 py-1.5 transition-all bg-white hover:bg-green-50"
      >
        👍 Ano {initialYes > 0 && <span className="text-xs text-gray-400">({initialYes})</span>}
      </button>
      <button
        onClick={() => handleVote(false)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg px-3 py-1.5 transition-all bg-white hover:bg-red-50"
      >
        👎 Ne {initialNo > 0 && <span className="text-xs text-gray-400">({initialNo})</span>}
      </button>
    </div>
  )
}
