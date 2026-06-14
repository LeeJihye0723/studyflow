export default function SessionsLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-36 bg-slate-700 rounded-lg animate-pulse mb-6" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl h-20 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
