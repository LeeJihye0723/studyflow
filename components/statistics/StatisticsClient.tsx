'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import type { Translations } from '@/lib/i18n/ko'

interface Session {
  subject: string
  duration_minutes: number
  studied_at: string
}

interface Props {
  t: Translations
  sessions: Session[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316']

export default function StatisticsClient({ t, sessions }: Props) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
  const uniqueDays = new Set(sessions.map((s) => new Date(s.studied_at).toDateString())).size
  const avgPerDay = uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0

  // 최근 7일 일별 집계
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    const key = d.toDateString()
    const minutes = sessions
      .filter((s) => new Date(s.studied_at).toDateString() === key)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
    return {
      name: d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      minutes,
    }
  })

  // 과목별 집계
  const subjectMap: Record<string, number> = {}
  sessions.forEach((s) => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration_minutes
  })
  const subjectData = Object.entries(subjectMap)
    .map(([name, minutes]) => ({ name, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 7)

  const hasData = sessions.length > 0

  function fmtMin(m: number) {
    if (m < 60) return `${m}분`
    return `${Math.floor(m / 60)}시간 ${m % 60 > 0 ? `${m % 60}분` : ''}`
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">{t.statistics.title}</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-1">{t.statistics.totalTime}</div>
          <div className="text-2xl font-bold text-blue-400">{fmtMin(totalMinutes)}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-1">{t.statistics.avgPerDay}</div>
          <div className="text-2xl font-bold text-purple-400">{fmtMin(avgPerDay)}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-16 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-slate-400">{t.statistics.noData}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 주간 바 차트 */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6">
            <h2 className="font-semibold text-white mb-4">{t.statistics.weekly}</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(v: unknown) => [`${v}분`, '']}
                />
                <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 과목별 파이 차트 */}
          <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6">
            <h2 className="font-semibold text-white mb-4">{t.statistics.bySubject}</h2>
            {subjectData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
                {t.statistics.noData}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    dataKey="minutes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {subjectData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    formatter={(v: unknown) => [`${v}분`, '']}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
