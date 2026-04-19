export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-32" />
        ))}
      </div>
    </div>
  )
}
