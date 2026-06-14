import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-800 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-slate-400 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
