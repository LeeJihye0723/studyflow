export default function StatisticsLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-24 bg-slate-700 rounded-lg animate-pulse mb-8" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl h-72 animate-pulse" />
        <div className="bg-slate-800 rounded-xl h-72 animate-pulse" />
      </div>
    </div>
  )
}
