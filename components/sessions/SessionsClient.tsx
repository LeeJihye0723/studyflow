'use client'

import { useState } from 'react'
import type { Translations } from '@/lib/i18n/ko'
import SessionModal from './SessionModal'

interface Session {
  id: string
  subject: string
  duration_minutes: number
  memo: string | null
  studied_at: string
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
}

export default function SessionsClient({ t, initialSessions }: { t: Translations; initialSessions: Session[] }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Session | undefined>()

  function handleSaved(session: Session) {
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = session
        return next
      }
      return [session, ...prev]
    })
    setShowModal(false)
    setEditTarget(undefined)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.sessions.deleteConfirm)) return
    const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
    if (res.ok) setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  function openEdit(session: Session) {
    setEditTarget(session)
    setShowModal(true)
  }

  function openAdd() {
    setEditTarget(undefined)
    setShowModal(true)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t.sessions.title}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span>+</span>
          {t.sessions.add}
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-16 text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-slate-300 font-medium">{t.sessions.noSessions}</p>
          <button
            onClick={openAdd}
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
          >
            {t.sessions.add} →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-800 border border-slate-700/50 rounded-xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{session.subject}</span>
                  <span className="text-blue-400 text-sm font-medium">
                    {formatMinutes(session.duration_minutes)}
                  </span>
                </div>
                {session.memo && (
                  <p className="text-slate-400 text-sm mt-0.5 truncate">{session.memo}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-slate-400 text-sm">
                  {new Date(session.studied_at).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex gap-2 mt-1 justify-end">
                  <button
                    onClick={() => openEdit(session)}
                    className="text-slate-500 hover:text-blue-400 text-xs transition-colors"
                  >
                    {t.common.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-slate-500 hover:text-red-400 text-xs transition-colors"
                  >
                    {t.common.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SessionModal
          t={t}
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(undefined) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
