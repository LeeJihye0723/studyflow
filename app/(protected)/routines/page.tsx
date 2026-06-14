import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import RoutinesClient from '@/components/routines/RoutinesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '루틴 관리' }

export default async function RoutinesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations()

  const { data: routines } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return <RoutinesClient t={t} initialRoutines={routines || []} />
}
