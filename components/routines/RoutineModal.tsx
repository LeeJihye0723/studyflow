'use client'

import { useState } from 'react'
import type { Translations } from '@/lib/i18n/ko'

interface Routine {
  id: string
  name: string
  description: string | null
  target_minutes: number
  subjects: string[]
  days: string[]
  is_active: boolean
}

interface Props {
  t: Translations
  onClose: () => void
  onSaved: (routine: Routine) => void
  initial?: Routine
}

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export default function RoutineModal({ t, onClose, onSaved, initial }: Props) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [targetMinutes, setTargetMinutes] = useState(String(initial?.target_minutes || '60'))
  const [subjects, setSubjects] = useState(initial?.subjects?.join(', ') || '')
  const [days, setDays] = useState<string[]>(initial?.days || [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleDay(day: string) {
    setDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const isEdit = Boolean(initial)
    const url = isEdit ? `/api/routines/${initial!.id}` : '/api/routines'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || null,
        target_minutes: Number(targetMinutes),
        subjects: subjects.split(',').map((s) => s.trim()).filter(Boolean),
        days,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || t.common.error)
      setLoading(false)
      return
    }

    const routine = await res.json()
    onSaved(routine)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">
            {initial ? t.routines.editRoutine : t.routines.addRoutine}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.routines.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.routines.description}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.routines.targetMinutes}</label>
            <input
              type="number"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              min={1}
              required
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {t.routines.subjects} <span className="text-slate-500 font-normal">(쉼표로 구분)</span>
            </label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="수학, 영어, 과학"
              className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.routines.days}</label>
            <div className="flex gap-2">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
                    days.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {t.routines.daysLabel[day]}
                </button>
              ))}
            </div>
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
              className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
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
