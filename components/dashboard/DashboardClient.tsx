'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Translations } from '@/lib/i18n/ko'
import SessionModal from '@/components/sessions/SessionModal'

interface Session {
  id: string
  subject: string
  duration_minutes: number
  memo: string | null
  studied_at: string
}

interface Props {
  t: Translations
  todayMinutes: number
  weekMinutes: number
  streak: number
  recentSessions: Session[]
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
}

export default function DashboardClient({ t, todayMinutes, weekMinutes, streak, recentSessions }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(recentSessions)

  const stats = [
    { label: t.dashboard.todayStudy, value: formatMinutes(todayMinutes), icon: '📚', color: 'text-blue-400' },
    { label: t.dashboard.weekStudy, value: formatMinutes(weekMinutes), icon: '📅', color: 'text-purple-400' },
    { label: t.dashboard.streak, value: `${streak}${t.dashboard.streakDays}`, icon: '🔥', color: 'text-orange-400' },
    { label: t.dashboard.totalSessions, value: String(sessions.length), icon: '📝', color: 'text-green-400' },
  ]

  function handleSessionCreated(session: Session) {
    setSessions((prev) => [session, ...prev].slice(0, 5))
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{t.dashboard.title}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span>+</span>
          {t.dashboard.quickAdd}
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 최근 기록 */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">{t.dashboard.recentSessions}</h2>
          <Link href="/sessions" className="text-blue-400 hover:text-blue-300 text-sm">
            전체 보기 →
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-slate-400 text-sm">{t.dashboard.noSessions}</p>
            <p className="text-slate-500 text-xs mt-1">{t.dashboard.addFirst}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 bg-slate-900/60 rounded-lg px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-200">{session.subject}</span>
                  {session.memo && (
                    <p className="text-slate-500 text-xs truncate mt-0.5">{session.memo}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-slate-300 text-sm font-medium">
                    {formatMinutes(session.duration_minutes)}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(session.studied_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SessionModal
          t={t}
          onClose={() => setShowModal(false)}
          onSaved={handleSessionCreated}
        />
      )}
    </div>
  )
}
