export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-40 bg-slate-700 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-5 h-28 animate-pulse" />
        ))}
      </div>
      <div className="bg-slate-800 rounded-xl p-6 h-64 animate-pulse" />
    </div>
  )
}
