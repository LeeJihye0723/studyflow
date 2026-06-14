import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n'
import Sidebar from '@/components/ui/Sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const t = await getTranslations()
  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar t={t} userName={userName} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
