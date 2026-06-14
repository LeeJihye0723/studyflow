'use client'

import { useState } from 'react'
import type { Translations } from '@/lib/i18n/ko'

interface Session {
  id: string
  subject: string
  duration_minutes: number
  memo: string | null
  studied_at: string
}

interface Props {
  t: Translations
  onClose: () => void
  onSaved: (session: Session) => void
  initial?: Session
}

export default function SessionModal({ t, onClose, onSaved, initial }: Props) {
  const [subject, setSubject] = useState(initial?.subject || '')
  const [duration, setDuration] = useState(String(initial?.duration_minutes || ''))
  const [memo, setMemo] = useState(initial?.memo || '')
  const [studiedAt, setStudiedAt] = useState(
    initial?.studied_at
      ? new Date(initial.studied_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const isEdit = Boolean(initial)
    const url = isEdit ? `/api/sessions/${initial!.id}` : '/api/sessions'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        duration_minutes: Number(duration),
        memo: memo || null,
        studied_at: new Date(studiedAt).toISOString(),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || t.common.error)
      setLoading(false)
      return
    }

    const session = await res.json()
    onSaved(session)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">
            {initial ? t.sessions.editSession : t.sessions.addSession}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {t.sessions.subject}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.sessions.subjectPlaceholder}
              required
              className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {t.sessions.duration}
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={1}
              max={1440}
              required
              className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {t.sessions.studiedAt}
            </label>
            <input
              type="date"
              value={studiedAt}
              onChange={(e) => setStudiedAt(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {t.sessions.memo}
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={t.sessions.memoPlaceholder}
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? t.common.loading : t.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
