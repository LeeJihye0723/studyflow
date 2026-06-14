'use client'

import { useState } from 'react'
import type { Translations } from '@/lib/i18n/ko'
import RoutineModal from './RoutineModal'

interface Routine {
  id: string
  name: string
  description: string | null
  target_minutes: number
  subjects: string[]
  days: string[]
  is_active: boolean
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export default function RoutinesClient({ t, initialRoutines }: { t: Translations; initialRoutines: Routine[] }) {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Routine | undefined>()

  function handleSaved(routine: Routine) {
    setRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === routine.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = routine
        return next
      }
      return [routine, ...prev]
    })
    setShowModal(false)
    setEditTarget(undefined)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.routines.deleteConfirm)) return
    const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' })
    if (res.ok) setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  async function toggleActive(routine: Routine) {
    const res = await fetch(`/api/routines/${routine.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !routine.is_active }),
    })
    if (res.ok) {
      const updated = await res.json()
      setRoutines((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t.routines.title}</h1>
        <button
          onClick={() => { setEditTarget(undefined); setShowModal(true) }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span>+</span>
          {t.routines.add}
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-16 text-center">
          <div className="text-5xl mb-4">🔄</div>
          <p className="text-slate-300 font-medium">{t.routines.noRoutines}</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
          >
            {t.routines.add} →
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`bg-slate-800 border rounded-xl p-5 ${
                routine.is_active ? 'border-blue-500/30' : 'border-slate-700/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{routine.name}</h3>
                  {routine.description && (
                    <p className="text-slate-400 text-sm mt-0.5 truncate">{routine.description}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    routine.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {routine.is_active ? t.routines.active : t.routines.inactive}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
                <span>⏱ {routine.target_minutes}분</span>
                {routine.subjects.length > 0 && (
                  <span className="truncate">· {routine.subjects.join(', ')}</span>
                )}
              </div>

              <div className="flex gap-1 mb-4">
                {DAY_KEYS.map((day) => (
                  <span
                    key={day}
                    className={`w-7 h-7 rounded-full text-xs flex items-center justify-center ${
                      routine.days.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {t.routines.daysLabel[day]}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(routine)}
                  className="flex-1 text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 py-1.5 rounded-lg transition-colors"
                >
                  {routine.is_active ? t.routines.inactive + '로' : t.routines.active + '로'}
                </button>
                <button
                  onClick={() => { setEditTarget(routine); setShowModal(true) }}
                  className="text-xs text-slate-400 hover:text-blue-400 border border-slate-600 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t.common.edit}
                </button>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="text-xs text-slate-400 hover:text-red-400 border border-slate-600 hover:border-red-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <RoutineModal
          t={t}
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(undefined) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
