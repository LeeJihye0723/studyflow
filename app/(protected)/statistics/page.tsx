import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import StatisticsClient from '@/components/statistics/StatisticsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '통계' }

export default async function StatisticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('subject, duration_minutes, studied_at')
    .eq('user_id', user!.id)
    .gte('studied_at', thirtyDaysAgo.toISOString())
    .order('studied_at', { ascending: true })

  return <StatisticsClient t={t} sessions={sessions || []} />
}
