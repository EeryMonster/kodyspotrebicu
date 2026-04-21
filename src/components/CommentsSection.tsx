'use client'

import { useState } from 'react'

interface Comment {
  id: number
  authorName: string
  content: string
  createdAt: Date | string
}

interface CommentsSectionProps {
  errorCodeId: number
  initialComments: Comment[]
}

export default function CommentsSection({ errorCodeId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, content, errorCodeId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        if (data.comment.isApproved) {
          setComments((prev) => [data.comment, ...prev])
          setMessage({ type: 'success', text: 'Komentář byl úspěšně přidán!' })
        } else {
          setMessage({ type: 'success', text: 'Komentář byl odeslán ke schválení administrátorem (obsahuje podezřelý obsah).' })
        }
        setAuthorName('')
        setContent('')
      } else {
        setMessage({ type: 'error', text: 'Něco se pokazilo. Zkuste to prosím znovu.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Chyba při odesílání.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Komentáře a zkušenosti uživatelů</h2>

      <details className="mb-8 group">
        <summary className="cursor-pointer list-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors select-none">
            <svg className="w-4 h-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Přidat vlastní zkušenost
          </div>
        </summary>

        <form onSubmit={handleSubmit} className="mt-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
          {message && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">Vaše jméno</label>
              <input
                id="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Jan Novák"
                required
                maxLength={50}
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Jak jste závadu vyřešili?</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none h-28 resize-y"
                placeholder="Měl jsem stejnou chybu a stačilo vyčistit filtr..."
                required
                maxLength={1000}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Odesílám...' : 'Odeslat komentář'}
            </button>
          </div>
        </form>
      </details>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Zatím tu nejsou žádné komentáře. Buďte první!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-semibold text-gray-900">{comment.authorName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
