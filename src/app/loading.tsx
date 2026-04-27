export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <section className="border-b border-brand-border bg-white">
        <div className="container-app py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="max-w-3xl">
              <div className="h-4 w-44 bg-gray-200 rounded mb-4" />
              <div className="h-9 w-5/6 bg-gray-200 rounded mb-3" />
              <div className="h-9 w-3/4 bg-gray-200 rounded mb-5" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-200 rounded mb-6" />
              <div className="h-12 w-full max-w-xl bg-gray-200 rounded-lg" />
            </div>
            <div className="h-48 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Brand grid */}
      <section className="container-app py-8">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-[74px] bg-gray-200 rounded-xl" />
          ))}
        </div>
      </section>

      {/* Category cards */}
      <section className="container-app pb-8">
        <div className="h-5 w-44 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-80 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  )
}
