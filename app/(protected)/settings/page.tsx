import { createClient } from '@/lib/supabase/server'
import { getTranslations, getLocale } from '@/lib/i18n'
import SettingsClient from '@/components/settings/SettingsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '설정' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations()
  const locale = await getLocale()

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  return <SettingsClient t={t} currentLocale={locale} userName={userName} />
}
