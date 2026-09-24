const collections = [
  { title: 'History of Science', swatch: 'from-sky-400 to-blue-700' },
  { title: 'Quiet reading', swatch: 'from-emerald-300 to-teal-700' },
  { title: 'Research papers', swatch: 'from-amber-300 to-orange-700' },
  { title: 'Classic fiction', swatch: 'from-rose-300 to-red-800' },
  { title: 'Design', swatch: 'from-indigo-400 to-violet-800' },
]

function Collections() {
  return (
    <section className="mt-8 px-6" aria-label="Collections">
      <h2 className="mb-3 text-lg font-semibold">Collections</h2>
      <div className="grid grid-cols-5 gap-3">
        {collections.map((collection) => (
          <article key={collection.title} className="min-w-0">
            <div className={`h-16 rounded-md bg-linear-to-br ${collection.swatch}`} />
            <p className="mt-1.5 truncate text-xs text-muted">{collection.title}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Collections
