'use client'

import { useState } from 'react'

export default function HelpfulRating({ errorCodeId }: { errorCodeId: number }) {
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)

  const handleVote = async (helpful: boolean) => {
    setVoted(helpful ? 'yes' : 'no')
    // Fire-and-forget – in future can POST to an API endpoint
    try {
      await fetch('/api/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorCodeId, helpful }),
      })
    } catch { /* ignore, non-critical */ }
  }

  if (voted) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{voted === 'yes' ? '😊' : '🙏'}</span>
        <span>{voted === 'yes' ? 'Díky za zpětnou vazbu!' : 'Díky! Budeme obsah zlepšovat.'}</span>
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
        👍 Ano
      </button>
      <button
        onClick={() => handleVote(false)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg px-3 py-1.5 transition-all bg-white hover:bg-red-50"
      >
        👎 Ne
      </button>
    </div>
  )
}
