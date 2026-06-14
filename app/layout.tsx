import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'StudyFlow — 공부 루틴 트래커',
    template: '%s | StudyFlow',
  },
  description: '공부 루틴과 학습 기록을 관리하는 개인 맞춤형 학습 트래커 웹 서비스',
  keywords: ['공부', '학습', '루틴', '스터디', '타이머', '트래커'],
  authors: [{ name: 'StudyFlow' }],
  openGraph: {
    title: 'StudyFlow — 공부 루틴 트래커',
    description: '공부 루틴과 학습 기록을 관리하는 개인 맞춤형 학습 트래커',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'StudyFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyFlow — 공부 루틴 트래커',
    description: '공부 루틴과 학습 기록을 관리하는 개인 맞춤형 학습 트래커',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
