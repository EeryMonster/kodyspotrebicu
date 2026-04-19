export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
      <div className="flex gap-3 mb-4">
        <div className="h-9 bg-gray-200 rounded w-24" />
        <div className="h-9 bg-gray-200 rounded w-36" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-8" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-200 rounded-xl h-40" />
          <div className="bg-gray-200 rounded-xl h-28" />
          <div className="bg-gray-200 rounded-xl h-52" />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-xl h-36" />
          <div className="bg-gray-200 rounded-xl h-28" />
          <div className="bg-gray-200 rounded-xl h-20" />
        </div>
      </div>
    </div>
  )
}
