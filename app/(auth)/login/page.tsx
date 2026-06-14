import Link from 'next/link'
import { getTranslations } from '@/lib/i18n'
import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '로그인' }

export default async function LoginPage() {
  const t = await getTranslations()

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl text-white">{t.common.appName}</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{t.auth.loginTitle}</h1>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <LoginForm t={t} />
          <p className="text-center text-slate-400 text-sm mt-6">
            {t.auth.noAccount}{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              {t.auth.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
