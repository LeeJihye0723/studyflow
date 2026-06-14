'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">서버 오류</h1>
        <p className="text-slate-400 mb-8">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="border border-slate-600 text-slate-300 hover:text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
