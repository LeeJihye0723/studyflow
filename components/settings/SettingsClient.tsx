'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Translations } from '@/lib/i18n/ko'
import type { Locale } from '@/lib/i18n'

interface Props {
  t: Translations
  currentLocale: Locale
  userName: string
}

export default function SettingsClient({ t, currentLocale, userName }: Props) {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>(currentLocale)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    setSaved(false)
    await fetch('/api/settings/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    })
    setLoading(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">{t.settings.title}</h1>

      {/* 계정 정보 */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">{t.settings.account}</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-medium">{userName}</div>
            <div className="text-slate-400 text-sm">{t.settings.displayName}</div>
          </div>
        </div>
      </div>

      {/* 언어 설정 */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">{t.settings.language}</h2>
        <div className="flex gap-3">
          {(['ko', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                locale === l
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {l === 'ko' ? t.common.korean : t.common.english}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {saved ? `✓ ${t.settings.saved}` : loading ? t.common.loading : t.settings.saveChanges}
      </button>
    </div>
  )
}
