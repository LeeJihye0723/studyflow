'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Translations } from '@/lib/i18n/ko'

const NAV_ITEMS = [
  { key: 'dashboard' as const, href: '/dashboard', icon: '🏠' },
  { key: 'sessions' as const, href: '/sessions', icon: '📖' },
  { key: 'routines' as const, href: '/routines', icon: '🔄' },
  { key: 'statistics' as const, href: '/statistics', icon: '📊' },
  { key: 'settings' as const, href: '/settings', icon: '⚙️' },
]

export default function Sidebar({ t, userName }: { t: Translations; userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* 로고 */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="font-bold text-white">{t.common.appName}</span>
        </Link>
      </div>

      {/* 사용자 정보 */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-300">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-slate-300 truncate">{userName}</span>
        </div>
      </div>

      {/* 내비게이션 */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{t.nav[item.key]}</span>
            </Link>
          )
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>🚪</span>
          <span>{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  )
}
