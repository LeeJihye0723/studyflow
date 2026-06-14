export default function RoutinesLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-36 bg-slate-700 rounded-lg animate-pulse mb-6" />
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl h-40 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
