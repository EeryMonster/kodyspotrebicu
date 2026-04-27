export default function Loading() {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-8 md:py-12 flex flex-col gap-10 animate-pulse">
      {/* Breadcrumbs */}
      <div className="h-4 w-72 bg-gray-200 rounded" />

      {/* Header: eyebrow + h1 + lead + meta + severity badge */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-2xl flex-1">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-9 w-5/6 bg-gray-200 rounded" />
            <div className="h-9 w-3/4 bg-gray-200 rounded" />
            <div className="h-5 w-full bg-gray-200 rounded" />
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-6 w-48 bg-gray-200 rounded mt-2" />
          </div>
          <div className="h-16 w-56 bg-gray-200 rounded-xl shrink-0" />
        </div>
      </header>

      {/* Bento: safe-checks + service warning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-xl h-56" />
        <div className="bg-gray-200 rounded-xl h-56" />
      </section>

      {/* Detail content */}
      <section className="bg-gray-200 rounded-xl h-72" />

      {/* Causes + parts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-xl h-44" />
        <div className="bg-gray-200 rounded-xl h-44" />
      </section>

      {/* Service CTA */}
      <section className="bg-gray-200 rounded-xl h-32" />

      {/* Related codes + symptoms */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-xl h-56" />
        <div className="bg-gray-200 rounded-xl h-56" />
      </section>
    </div>
  )
}
