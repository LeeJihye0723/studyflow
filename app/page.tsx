import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const t = await getTranslations()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="StudyFlow 로고" width={32} height={32} priority />
          <span className="font-bold text-lg">{t.common.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t.nav.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white px-4 py-2 text-sm transition-colors"
              >
                {t.landing.login}
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t.landing.startFree}
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-4 py-1.5 text-sm mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          학습 트래커
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white whitespace-pre-line">
          {t.landing.hero}
        </h1>

        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
          {t.landing.heroSub}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            {t.landing.startFree}
          </Link>
          <Link
            href="/login"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors"
          >
            {t.landing.login}
          </Link>
        </div>
      </section>

      {/* 대시보드 미리보기 */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: '오늘 공부', value: '2h 30m', icon: '📚' },
              { label: '연속 공부', value: '7일', icon: '🔥' },
              { label: '이번 주', value: '14h 20m', icon: '📊' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/80 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { subject: '수학', time: '90분', color: 'bg-blue-500' },
              { subject: '영어', time: '60분', color: 'bg-purple-500' },
              { subject: '과학', time: '45분', color: 'bg-green-500' },
            ].map((item) => (
              <div key={item.subject} className="flex items-center gap-3 bg-slate-900/60 rounded-lg px-4 py-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-slate-200 font-medium flex-1">{item.subject}</span>
                <span className="text-slate-400 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '📖',
              title: t.landing.feature1Title,
              desc: t.landing.feature1Desc,
              color: 'border-blue-500/30 bg-blue-500/5',
            },
            {
              icon: '🔄',
              title: t.landing.feature2Title,
              desc: t.landing.feature2Desc,
              color: 'border-purple-500/30 bg-purple-500/5',
            },
            {
              icon: '📈',
              title: t.landing.feature3Title,
              desc: t.landing.feature3Desc,
              color: 'border-green-500/30 bg-green-500/5',
            },
          ].map((feature) => (
            <div key={feature.title} className={`border rounded-xl p-6 ${feature.color}`}>
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 StudyFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}
