import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '대시보드' }

function calcStreak(sessions: { studied_at: string }[]): number {
  if (!sessions.length) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = new Set(sessions.map((s) => new Date(s.studied_at).toDateString()))
  let streak = 0
  const check = new Date(today)
  while (days.has(check.toDateString())) {
    streak++
    check.setDate(check.getDate() - 1)
  }
  return streak
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations()

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 6)
  weekStart.setHours(0, 0, 0, 0)

  const [{ data: todaySessions }, { data: weekSessions }, { data: recentSessions }] = await Promise.all([
    supabase
      .from('study_sessions')
      .select('duration_minutes, studied_at')
      .eq('user_id', user!.id)
      .gte('studied_at', todayStart.toISOString()),
    supabase
      .from('study_sessions')
      .select('duration_minutes, studied_at')
      .eq('user_id', user!.id)
      .gte('studied_at', weekStart.toISOString()),
    supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user!.id)
      .order('studied_at', { ascending: false })
      .limit(5),
  ])

  const todayMinutes = (todaySessions || []).reduce((sum, s) => sum + s.duration_minutes, 0)
  const weekMinutes = (weekSessions || []).reduce((sum, s) => sum + s.duration_minutes, 0)
  const streak = calcStreak(weekSessions || [])

  return (
    <DashboardClient
      t={t}
      todayMinutes={todayMinutes}
      weekMinutes={weekMinutes}
      streak={streak}
      recentSessions={recentSessions || []}
    />
  )
}
