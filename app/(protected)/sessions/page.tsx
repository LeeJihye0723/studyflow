import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import SessionsClient from '@/components/sessions/SessionsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '공부 기록' }

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations()

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user!.id)
    .order('studied_at', { ascending: false })

  return <SessionsClient t={t} initialSessions={sessions || []} />
}
