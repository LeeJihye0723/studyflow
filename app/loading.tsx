export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm animate-pulse">
          S
        </div>
        <span className="text-slate-400 text-sm">로딩 중...</span>
      </div>
    </div>
  )
}
